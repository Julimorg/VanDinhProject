# Backend Risk Review

Date: 2026-06-25

Scope: active Gradle multi-module backend under `app/`, `feature/`, and `shared/`.

This document points out areas that need attention before the project grows or goes to production. It focuses on query performance, N+1 risks, transaction boundaries, security/configuration, module boundaries, and operational risks.

## Executive Summary

Highest priority risks:

1. Pageable/list endpoints often fetch entities and then MapStruct touches lazy relations during DTO mapping. This can create N+1 queries on products, orders, carts, users, diaries, and inventory.
2. `spring.jpa.hibernate.ddl-auto=update`, SQL debug logging, and disabled Flyway are risky for production data management.
3. A default admin user is created with password `123456` if missing.
4. Some module boundaries are already violated, especially `feature:auth` depending on `feature:user`.
5. Several state-changing flows have race condition risks around stock/cart/order updates.
6. Some modules/files appear stale or not wired into the active app, which increases confusion and maintenance cost.

## Architecture Notes

The active application starts from:

- `app/src/main/java/com/example/VanDinhMainApplication.java`
- `settings.gradle`
- `app/build.gradle`

The intended architecture is:

- `app`: Spring Boot entry point only.
- `feature/*`: bounded business modules.
- `shared/*`: common DTOs, persistence, security, messaging, API docs.

Notice:

- `feature/search` is included in `settings.gradle`, but commented out in `app/build.gradle`.
- `feature/for-public` exists on disk but is not included in `settings.gradle` or `app/build.gradle`.
- `src/main/java/com/example/managementapi` looks like an older monolith tree. Do not treat it as active unless intentionally migrated back.

Recommended action: keep one source of truth. Either delete/archive stale modules after confirming, or document that they are legacy.

## N+1 Query Risks

### Product List And Selection

Location:

- `feature/product/src/main/java/com/example/service/ProductService.java`
- `feature/product/src/main/java/com/example/mapper/ProductMapper.java`
- `shared/persistence/src/main/java/com/example/persistence/entity/Product.java`

Risk:

- `ProductService.getProducts()` calls `productRepository.findAll(specification, pageable).map(productMapper::toGetProductsResponses)`.
- `ProductMapper.toGetProductsResponses()` maps `supplier.supplierName` and `category.categoryName`.
- `Product.supplier` is `LAZY`, while `Product.category` is default eager because `@ManyToOne` has no `fetch = FetchType.LAZY`.

Impact:

- For a page of 20 products, Hibernate can execute 1 query for products plus extra queries for each supplier/category access.
- Product selection without pagination uses `findAll(specification)` and can load many rows into memory.

Recommended action:

- Make all `@ManyToOne` relations explicitly `fetch = FetchType.LAZY`.
- Add repository methods with `@EntityGraph(attributePaths = {"supplier", "category"})` for list responses.
- For high-traffic list endpoints, prefer DTO projection queries that select only fields needed by the response.
- Do not use unbounded `findAll(specification)` for UI selectors unless the table is guaranteed small.

### Order List And Detail

Location:

- `feature/order/src/main/java/com/example/service/OrderService.java`
- `feature/order/src/main/java/com/example/mapper/OrderMapper.java`
- `shared/persistence/src/main/java/com/example/persistence/entity/Order.java`

Risk:

- `getUserOrderHistory()` maps `payment.paymentMethod`.
- `getAllOrders()` maps `user.*` and `payment.paymentMethod`.
- `getUserOrderDetails()` maps `user`, `payment`, and `orderItems`.
- `Order.user` and `Order.payment` use default fetch behavior. `Order.orderItems` is lazy.

Impact:

- Order list pages can trigger extra queries per row for user/payment.
- Order detail can trigger additional lazy loading for items.
- Export/report flows can become very slow when mapping many orders.

Recommended action:

- Add dedicated repository methods:
  - list view: fetch `user` and `payment`, but not `orderItems`.
  - detail view: fetch `user`, `payment`, and `orderItems`.
- Avoid join-fetching collection relationships directly with pageable queries because it can break pagination or duplicate rows.
- Use DTO projection for admin order table rows.

Example direction:

```java
@EntityGraph(attributePaths = {"user", "payment"})
Page<Order> findAll(Specification<Order> spec, Pageable pageable);
```

If Spring Data cannot combine the exact signature cleanly, define explicit `@Query` methods or use projections.

### Cart Loading

Location:

- `feature/cart/src/main/java/com/example/service/CartService.java`
- `feature/cart/src/main/java/com/example/mapper/CartMapper.java`
- `feature/cart/src/main/java/com/example/repository/CartRepository.java`
- `shared/persistence/src/main/java/com/example/persistence/entity/Cart.java`

Risk:

- `CartService.getCart()` calls `findOrCreateCart(userId)`.
- `CartRepository.findByUserId(userId)` does not fetch `cartItems` or each item's `product`.
- `CartMapper.toGetCartRes()` maps `cartItems`.
- `CartMapper.toProductForCartItem()` maps `product.*` and `product.category.categoryName`.

Impact:

- A cart with N items can trigger queries for cart items, then N product queries, then N category queries.

Recommended action:

- Add a repository method for cart detail:

```java
@EntityGraph(attributePaths = {"cartItems", "cartItems.product", "cartItems.product.category"})
Optional<Cart> findWithItemsByUserId(String userId);
```

- Use this method for read responses and cart recalculation.

### User List And Roles

Location:

- `shared/persistence/src/main/java/com/example/persistence/entity/User.java`
- `feature/user/src/main/java/com/example/user/service/UserService.java`

Risk:

- `User.roles` is `@ManyToMany(fetch = FetchType.EAGER)`.
- Admin user pages call `userRepository.findAll(spec, pageable)`.

Impact:

- Every user query loads roles even when the endpoint does not need them.
- Eager many-to-many can cause large joins, duplicate rows, and slow pagination as data grows.

Recommended action:

- Change roles to lazy by default.
- Add explicit fetch methods only where roles are needed, such as login/token generation and admin user detail.
- Use projections for user list rows.

### Diary And Inventory Detail

Location:

- `feature/diary/src/main/java/com/example/diary/service/DiaryServiceImpl.java`
- `feature/Inventory/src/main/java/com/example/service/InventoryService.java`
- `shared/persistence/src/main/java/com/example/persistence/entity/PurchaseOrder.java`

Risk:

- Diary recalculation repeatedly calls `findByDiaryId()` after item changes.
- Purchase order recalculation loops over `purchaseOrder.getItems()`.
- Inventory detail has a good pattern via `findWithItemsByPurchaseOrderId()`, but list endpoints should not accidentally map item collections.

Impact:

- These are not always N+1, but they are query-heavy and can grow expensive with large diaries/purchase orders.

Recommended action:

- Keep list DTOs separate from detail DTOs.
- Use aggregate SQL queries for recalculation where the item count can become large.
- Keep using fetch methods for detail endpoints.

## Query Design Checklist

Use this checklist before adding or changing any endpoint:

1. Does the response DTO access relation fields such as `user.email`, `payment.paymentMethod`, `product.category.categoryName`, or `cartItems.product`?
2. If yes, does the repository fetch those relations in the same query?
3. Is the endpoint pageable? If yes, avoid fetch-joining large collections.
4. Is the endpoint returning a selector/dropdown list? If yes, avoid unbounded entity `findAll`; use projection and a sane limit.
5. Does the mapper touch a lazy relation indirectly through MapStruct? Check generated mapper code when unsure.
6. Does the flow loop over rows and call another service/repository inside the loop? Consider bulk fetching.

Useful verification:

- Use datasource-proxy, p6spy, or Hibernate statistics in tests to count SQL statements.
- Add integration tests for hot endpoints and assert max query count.
- Watch logs for repeated `select ... where id = ?` patterns.

## Transaction And Consistency Risks

### Stock Update Race Conditions

Location:

- `feature/order/src/main/java/com/example/service/OrderService.java`

Risk:

- `createOrderFromCart()` checks stock from product quantity.
- `approveOrder()` loops through order items, fetches each product, subtracts quantity, then saves.
- Concurrent approvals/orders can read the same stock and oversell.

Recommended action:

- Add optimistic locking with `@Version` on `Product`.
- For strict stock correctness, use a conditional update query:

```sql
update product
set product_quantity = product_quantity - :qty
where product_id = :id and product_quantity >= :qty
```

- Fail the order if affected rows are `0`.

### Product Lookup In Loops

Location:

- `OrderService.approveOrder()`
- `OrderService.createOrderByAdmin()`

Risk:

- Each order item calls `productInternalService.getProductById(...)`.

Impact:

- This is a classic loop-query pattern. It becomes slow for large orders and makes transactional consistency harder.

Recommended action:

- Bulk fetch products by IDs.
- Validate all stock in memory.
- Persist changes in batch or through conditional update queries.

### External Calls Inside Transactions

Location:

- product image upload flows
- mail calls in order flows
- search events after product changes

Risk:

- File upload/email/search publication can happen inside or near database transactions.
- If the DB rolls back after an external action succeeds, state becomes inconsistent.

Recommended action:

- Publish domain events after commit using `@TransactionalEventListener(phase = AFTER_COMMIT)`.
- Keep DB transactions short.
- Store outbound work in an outbox table for important integrations.

## Security And Configuration Risks

### Default Admin Password

Location:

- `app/src/main/java/com/example/application/ApplicationInitConfig.java`

Risk:

- If no `admin` user exists, the app creates one with password `123456`.

Impact:

- Critical production security issue if deployed with an empty database.

Recommended action:

- Read initial admin username/password from environment variables.
- Disable auto-admin creation in production.
- Force password change on first login.
- Never log the default password.

### Production Schema Management

Location:

- `app/src/main/resources/application.properties`

Risk:

- `spring.jpa.hibernate.ddl-auto=update`
- `spring.flyway.enabled=false`

Impact:

- Hibernate can silently mutate schemas.
- Real migrations are not auditable or repeatable.
- Production schema drift becomes likely.

Recommended action:

- Use Flyway or Liquibase.
- Set production `ddl-auto=validate`.
- Keep `ddl-auto=update` only for local development profiles.

### SQL And Trace Logging

Location:

- `app/src/main/resources/application.properties`

Risk:

- `spring.jpa.show-sql=true`
- Hibernate SQL logging enabled.
- WebSocket trace logging enabled.

Impact:

- High log volume.
- Potential leakage of sensitive data.
- Slower production performance.

Recommended action:

- Move debug logging to `application-dev.properties`.
- Keep production logging at `INFO` or `WARN`.

### CORS And Public Endpoints

Location:

- `shared/security/src/main/java/com/example/security/config/SecurityConfiguration.java`

Risks:

- CORS allows credentials and many local/prod origins.
- `addAllowedMethod("*")` and `addAllowedHeader("*")` are broad.
- Public endpoint strings have missing leading slashes and a typo: `catgories`.
- `/api/v1/reset-pass/change-password/**` is public. Verify that OTP verification cannot be bypassed.

Recommended action:

- Move CORS origins to environment config.
- Separate local and production CORS profiles.
- Fix public endpoint patterns and add security tests.
- Make password reset stateful: changing password should require a short-lived reset token produced only after OTP verification.

## Module Boundary Risks

### Feature-To-Feature Dependency

Location:

- `feature/auth/build.gradle`

Risk:

- `feature:auth` depends directly on `feature:user`.
- The README states features should depend on `shared`, not on each other.

Recommended action:

- Define a `UserInternalService` or auth-specific user port in `shared:common`.
- Implement it in `feature:user`.
- Inject the port into `feature:auth`.

### Shared Module Weight

Location:

- `shared/common/build.gradle`
- `shared/persistence/build.gradle`

Risk:

- `shared:common` exposes many heavy APIs: web, security, mail, Cloudinary, OpenCSV, ZXing, PDF libraries, JPA.
- This makes all modules transitively depend on infrastructure they may not need.

Impact:

- Slower builds.
- More accidental coupling.
- Harder module reasoning.

Recommended action:

- Split `shared:common` into smaller APIs:
  - `shared:common-core` for DTOs, exceptions, enums.
  - `shared:ports` for interfaces.
  - keep infrastructure libraries in dedicated modules.

## API And Authorization Risks

### User ID In Path

Location examples:

- `/api/v1/users/view-profile/{userId}`
- `/api/v1/cart/get-cart/{userId}`
- `/api/v1/order/list-orders/{userId}`
- `/api/v1/diaries/{userId}/...`

Risk:

- Many endpoints accept `userId` from the path and rely on role checks, but do not always verify the current token subject matches that user ID.

Impact:

- A normal user may access or mutate another user's resource if method-level authorization is not strict enough.

Recommended action:

- For user self-service endpoints, derive user ID from JWT, not request path.
- If path ID remains, add checks like `@PreAuthorize("#userId == authentication.token.claims['aud'][0] or hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")`.
- Add authorization integration tests for cross-user access.

### Method Security Role Naming

Risk:

- Code uses expressions like `hasAnyRole('ROLE_ADMIN')`.
- Spring `hasRole()` usually prepends `ROLE_`, while your JWT converter removes authority prefix.

Impact:

- Depending on actual authorities in the JWT, rules can be unexpectedly too strict or inconsistent.

Recommended action:

- Standardize on either:
  - `hasRole('ADMIN')` with authorities named `ROLE_ADMIN`, or
  - `hasAuthority('ROLE_ADMIN')`.
- Add tests for admin/staff/user access to representative endpoints.

## Data Model Risks

### Default Fetch Types

Risk:

- Some relations rely on JPA defaults:
  - `@ManyToOne` defaults to eager.
  - `@OneToOne` defaults to eager.

Impact:

- Hidden query behavior and accidental large joins.

Recommended action:

- Explicitly set fetch type on every relationship.
- Prefer lazy by default.
- Fetch intentionally per query.

### Cascades And Deletes

Location examples:

- `User.cart`, `User.orders`, `User.wishlists`
- `Category.products`
- `Order.orderItems`

Risk:

- `CascadeType.ALL` and `orphanRemoval = true` on aggregate boundaries can delete large related data when deleting a parent.

Impact:

- Deleting a category can delete products.
- Deleting a user can delete historical orders, carts, wishlist data.

Recommended action:

- Review ownership rules.
- Prefer soft delete for users, products, orders.
- Avoid cascading deletes across business-critical records unless explicitly intended.

## Operational Risks

### Docker Compose Only Runs App

Location:

- `compose.yaml`

Risk:

- Compose expects external network `app-network`.
- It does not define PostgreSQL, Elasticsearch, or observability services.

Recommended action:

- Provide a local development compose file with DB and dependencies.
- Keep production compose/deployment separate.

### Search Module Is Half-Enabled

Risk:

- Search module exists and product events are published, but `feature:search` is commented out in `app/build.gradle`.
- Elasticsearch config is commented in properties.

Impact:

- Search events may do nothing, and future developers may assume search is active.

Recommended action:

- Decide whether search is enabled.
- If disabled, remove event publication or document it.
- If enabled, include the module and add health checks/failure handling.

## Recommended Remediation Order

1. Fix production configuration: disable default admin password, move SQL/debug logs to dev, enable migrations, set prod `ddl-auto=validate`.
2. Add query-count tests for the hottest endpoints: product list, order list, order detail, cart detail, user list.
3. Add explicit fetch plans or DTO projections for those endpoints.
4. Fix stock consistency with optimistic locking or conditional updates.
5. Clean module boundaries, especially `feature:auth -> feature:user`.
6. Clean stale modules/legacy source tree or document migration status.
7. Standardize authorization rules and remove user ID trust from self-service paths.

## Quick Patterns To Use

Prefer DTO projections for list pages:

```java
public interface ProductListView {
    String getProductId();
    String getProductName();
    BigDecimal getProductPrice();
    String getSupplierName();
    String getCategoryName();
}
```

Use entity graphs for detail reads:

```java
@EntityGraph(attributePaths = {"orderItems", "payment", "user"})
Optional<Order> findDetailByOrderId(String orderId);
```

Use bulk fetch before loops:

```java
List<Product> products = productRepository.findAllById(productIds);
```

Use after-commit events for integrations:

```java
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void handle(ProductChangedEvent event) {
    // update search index, send email, etc.
}
```

## Definition Of Done For Future Backend Changes

Before merging backend work:

1. Endpoint has authorization tests for at least success, unauthorized, forbidden, and cross-user access where relevant.
2. Hot list/detail endpoints have query-count checks or manual SQL review.
3. No unbounded `findAll()` for user-facing lists unless explicitly justified.
4. DTO mapping does not accidentally touch lazy relations without a fetch plan.
5. Transactions do not wrap slow external calls unless unavoidable.
6. Schema changes are expressed as migrations.
7. New modules follow the feature-to-shared dependency rule.
