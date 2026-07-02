# Shared Persistence Table Review

Date: 2026-06-25

Scope: `shared/persistence/src/main/java/com/example/persistence`.

This review only covers the table/entity setup in the shared persistence module. It does not change code. The goal is to point out whether the current table design is good enough, what should be improved, and what risks can become slow or painful later.

## Short Answer

The current setup is a good start for a Spring/JPA application. The domain is split into clear tables, most large child tables have foreign-key indexes, many enum fields use `EnumType.STRING`, and the inventory module already has an example of using `@EntityGraph` for purchase order detail loading.

The main upgrades needed before the data grows are:

1. Make fetch behavior explicit, especially for `@ManyToOne`, `@OneToOne`, and `@ManyToMany`.
2. Add missing uniqueness constraints for real one-to-one relationships.
3. Add compound indexes that match real query patterns, not only single-column indexes.
4. Avoid mapping large collections from list endpoints without an explicit fetch plan.
5. Fix audit/soft-delete fields that currently look misleading.
6. Add optimistic locking or conditional updates around stock/order/product quantity changes.
7. Move from Hibernate auto-DDL to migrations before production.

## Priority Improvements

### 1. High: Eager Many-To-Many Can Make User Queries Slow

Current risk:

- `User.roles` is `@ManyToMany(fetch = FetchType.EAGER)`.
- `Role.permissions` is also `@ManyToMany(fetch = FetchType.EAGER)`.

Why this matters:

- Every user query can load roles even when the screen does not need them.
- Loading roles can then load permissions.
- Pageable user lists can become slow because many-to-many joins may duplicate rows internally and increase SQL work.

Recommended change:

- Make both relationships lazy by default.
- Add explicit fetch methods only for login, authorization, and user detail screens.
- Use `@EntityGraph(attributePaths = {"roles", "roles.permissions"})` only where those fields are actually needed.

Example direction:

```java
@ManyToMany(fetch = FetchType.LAZY)
private Set<Role> roles;
```

### 2. High: Default Eager To-One Relations Create Hidden Query Cost

Current risk:

JPA defaults `@ManyToOne` and `@OneToOne` to eager loading unless `fetch = FetchType.LAZY` is set. These relationships currently rely on default eager behavior:

- `Product.category`
- `Order.user`
- `Order.payment`
- `OrderItem.order`
- `Cart.user`
- `CartItem.cart`
- `CartItem.product`
- `Payment.order`
- `ForgotPassword.user`
- `UserDiary.user`

Why this matters:

- List queries load more data than the endpoint needs.
- If mappers touch nested fields, Hibernate may issue many extra selects.
- It becomes hard to predict query count from repository code.

Recommended change:

- Set all to-one relationships to `fetch = FetchType.LAZY` by default.
- Fetch needed relations explicitly per use case with `@EntityGraph`, join fetch, or DTO projection.

This is one of the most important changes for avoiding future N+1 issues.

### 3. High: Missing Unique Constraints On One-To-One Join Columns

Current risk:

Some mappings model one-to-one relationships but the database does not clearly enforce one row per parent:

- `Cart.user`
- `Payment.order`
- `ForgotPassword.user`

Why this matters:

- JPA says one-to-one, but the database may still allow duplicate rows with the same `user_id` or `order_id`.
- Duplicate cart/payment/password rows can create broken business behavior and confusing query results.

Recommended change:

- Add `unique = true` and `nullable = false` where business rules require exactly one owner.

Example direction:

```java
@OneToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id", nullable = false, unique = true)
private User user;
```

### 4. High: Cart Detail Is A Classic N+1 Query Candidate

Current shape:

- `Cart` has many `CartItem`.
- Each `CartItem` points to `Product`.
- Product responses often need category/supplier/image fields.

Risk:

- Loading one cart can become:
  - 1 query for cart
  - 1 query for items
  - N queries for products
  - more queries for category/supplier if mapper touches those fields

Recommended change:

- Add a cart-detail repository method with an explicit fetch graph:

```java
@EntityGraph(attributePaths = {
    "cartItems",
    "cartItems.product",
    "cartItems.product.category",
    "cartItems.product.supplier"
})
Optional<Cart> findWithItemsByUserId(String userId);
```

- Use normal lightweight queries for cart existence or updates.
- Use the fetch graph only when returning cart detail to the client.

### 5. High: Product List Mapping Can Trigger Extra Selects

Current shape:

- `Product.supplier` is lazy.
- `Product.category` is default eager.
- Product list DTOs commonly need `supplierName` and `categoryName`.

Risk:

- A product page can run the main product query plus one or more extra queries per row.

Recommended change:

- Make `Product.category` lazy.
- For product list/detail responses, use a fetch graph:

```java
@EntityGraph(attributePaths = {"supplier", "category"})
Page<Product> findAll(Specification<Product> spec, Pageable pageable);
```

If Spring Data cannot combine the exact method signature cleanly, use a dedicated query/projection for list rows.

### 6. High: Order List And Detail Need Separate Fetch Plans

Current shape:

- Order list often needs user and payment data.
- Order detail needs user, payment, and items.
- `Order.orderItems` is lazy, which is good for list queries.

Risk:

- If one repository method is reused for both list and detail, it will either under-fetch and cause N+1, or over-fetch and make list pages heavy.

Recommended change:

- Keep separate repository methods:
  - Order list: fetch `user` and `payment`, do not fetch `orderItems`.
  - Order detail: fetch `user`, `payment`, and `orderItems`.

Important:

- Avoid collection join-fetch with pageable queries. It can duplicate rows and break pagination performance.
- For admin order tables, DTO projection is usually better than returning full entities.

### 7. High: Stock/Product Quantity Needs Concurrency Protection

Current table risk:

- `Product.productQuantity` is a mutable stock value.
- There is no `@Version` field on `Product`.

Why this matters:

- Two requests can read the same quantity and both pass validation.
- This can create overselling or incorrect stock after order approval.

Recommended change:

- Add optimistic locking:

```java
@Version
private Long version;
```

- For stricter stock control, use conditional SQL updates:

```sql
update product
set product_quantity = product_quantity - :quantity
where product_id = :productId
  and product_quantity >= :quantity
```

Then fail the operation when affected rows are `0`.

## Index Review

### Good Existing Indexes

These are good and match likely access patterns:

- `Product.category_id`
- `Product.supplier_id`
- `Order.user_id`
- `Order.orderStatus`
- `Order.user_id, orderStatus`
- `OrderItem.order_id`
- `CartItem.cart_id`
- `CartItem.product_id`
- `WishList.user_id`
- `WishList.product_id`
- `UserNotifications.userId, isRead`
- `PurchaseOrder.status, orderDate`
- `PurchaseOrderItem.purchase_order_id`
- `StockReturn.purchase_order_item_id`
- `InvalidatedToken.expiryDate`

### Indexes To Add Or Reconsider

#### `Cart`

Add:

- unique index on `user_id`

Reason:

- `CartRepository.findByUserId(...)` should be fast and should only ever return one cart.

#### `Payment`

Add:

- unique index on `order_id`
- normal index on `transactionId` if payment gateway callbacks search by transaction ID
- index on `paymentStatus, createAt` if admin pages filter payment history by status/date

Reason:

- Payment lookups and callbacks can become high-traffic and need predictable lookup time.

#### `ForgotPassword`

Add:

- unique index on `user_id`
- index on `expirationTime` if expired OTP rows are cleaned by scheduler

Reason:

- One active forgot-password row per user is easier to reason about.
- Cleanup queries should not scan the whole table.

#### `Product`

Add:

- unique constraint or unique index on `productCode`
- possibly compound index on `productStatusType, productType`
- possibly compound index on `category_id, product_type`
- index on `createAt` if "new arrival" queries are common

Reason:

- Repository already checks `existsByProductCode`, but the database should enforce uniqueness.
- Product browsing usually filters by category/type/status and sorts by date.

#### `Order`

Add:

- unique constraint or unique index on `orderCode`
- compound index on `user_id, create_at`
- compound index on `orderStatus, create_at`

Reason:

- User order history and admin filtering commonly sort/filter by date.
- `user_id, orderStatus` is good, but it does not fully cover date-range history queries.

#### `UserDiary`

Current indexes:

- `start_date`
- `end_date`
- `diary_name`
- `created_by`

Add:

- index on `user_id`
- compound index on `user_id, start_date`
- possibly compound index on `diary_status, start_date`

Reason:

- Repository uses `findByUserId`.
- Diary screens often filter user plus date range.

#### `UserDiaryItem`

Current indexes:

- `diary_id`
- `product_id`

Add:

- compound index on `diary_id, item_date`

Reason:

- Repository uses `findByDiaryIdOrderByItemDateAsc`.
- The compound index helps both filtering and ordering.

#### `Notifications`

Add:

- index on `createdAt`
- possibly index on `type, createdAt`

Reason:

- Notification lists usually sort newest first and may filter by type.

#### `UserDevice`

Current shape:

- Indexed by `userId`.
- Unique index on `deviceToken`.

Consider:

- index on `socketId` if websocket disconnect/update queries search by socket ID.
- compound index on `userId, deviceType` if devices are listed or replaced by user/device type.

## Constraints And Data Integrity

### Add Database Constraints For Business Rules

Recommended unique constraints:

- `User.userName`
- `User.email`
- `Supplier.supplierPhone`
- `Supplier.supplierEmail`
- `Color.colorCode`
- `Color.hexCode`
- `Product.productCode`
- `Order.orderCode`
- `PurchaseOrder.poCode`
- `Cart.user_id`
- `Payment.order_id`
- `ForgotPassword.user_id`
- `WishList.user_id, product_id`

Some of these already exist. The important missing ones appear to be product code, order code, cart user, payment order, and forgot-password user.

### Add `nullable = false` Where The Data Is Required

Many important columns do not declare nullability. Examples:

- Product name/code/price/quantity/type/status
- Order code/status/amount
- Cart user
- Payment order/status/method
- Category name
- Supplier name/phone/email
- Color name/code

Why this matters:

- Validation annotations protect application input, but database constraints protect all writers, migrations, scripts, and future services.

### Add Numeric Checks In Migrations

JPA annotations are limited for database check constraints. When using migrations, add checks like:

- `product_quantity >= 0`
- `discount >= 0 and discount <= 100`
- `order_amount >= 0`
- `quantity > 0`
- `total_quantity >= 0`
- `amount >= 0`

This prevents impossible business data.

## Relationship And Cascade Review

### Cascading From Parent Tables

Current pattern:

- `User` cascades to cart, orders, forgot password, wishlist.
- `Supplier` cascades to products and colors.
- `Category` cascades to products.
- `Order` cascades to order items and payment.
- `PurchaseOrder` cascades to purchase order items.

Risk:

- Deleting a supplier/category/user can delete a large amount of business history.
- Cascade delete from `User` to `Order` is especially risky because orders are financial records.
- Cascade delete from `Category` or `Supplier` to `Product` can remove product data unexpectedly.

Recommended change:

- Keep cascade for true owned child records like order items under an order.
- Be careful with cascade remove on business master data.
- Prefer soft-disable status for users, suppliers, categories, and products.
- Preserve orders, payments, purchase orders, and stock return records for audit/history.

### Large Collections On Entities

Current pattern:

- `User.orders`
- `User.wishlists`
- `Supplier.products`
- `Supplier.colors`
- `Category.products`
- `Order.orderItems`
- `Cart.cartItems`
- `PurchaseOrder.items`
- `Color.paintDetails`

Risk:

- Accidentally serializing or mapping these collections can load many rows.
- Large collections make memory usage unpredictable.

Recommended change:

- Keep collections lazy.
- Avoid exposing entities directly from controllers.
- For list screens, query child tables directly with pagination.
- For detail screens, fetch only the collection needed by that endpoint.

## ElementCollection Review

Current usage:

- `Product.productImage`
- `OrderItem.productImage`

Risk:

- `@ElementCollection` creates a separate table.
- Loading images can add extra selects.
- Filtering/searching/sorting by image is not practical.
- If order item images are just a snapshot, this is acceptable but can make order detail loading heavier.

Recommended change:

- Keep this only if product images are simple and small.
- Add `@CollectionTable` and explicit column names so generated table/column names are stable.
- For product images that need ordering, alt text, primary image, or metadata, create a real `ProductImage` entity.

## JSON Column Review

Current usage:

- `ToolDetail.extraSpecs`
- `PaintDetail.extraSpecs`
- `ChemicalDetail.extraSpecs`

Risk:

- `MapToJsonConverter` silently returns `{}` when serialization/deserialization fails.
- Silent fallback can hide data corruption or bad JSON.
- `columnDefinition = "JSON"` may not be the best type for PostgreSQL. PostgreSQL usually prefers `jsonb`.
- Querying inside JSON needs specialized indexes and is harder than normal columns.

Recommended change:

- Do not swallow JSON conversion errors silently. Throw an exception or log clearly.
- Use `jsonb` for PostgreSQL migrations if fields must be queried.
- Keep frequently filtered fields as normal columns, not only inside `extraSpecs`.
- Standardize one JSON mapping style. `ChemicalDetail` mixes `@JdbcTypeCode(SqlTypes.JSON)` with `@Convert`, while the others only use the converter.

## Soft Delete And Audit Review

### `deletedAt` On `Order`

Current issue:

- `Order.deletedAt` has `@UpdateTimestamp`.

Risk:

- Every update can set `deletedAt`, even when the order was not deleted.
- This makes the column unusable for soft-delete semantics.

Recommended change:

- Remove `@UpdateTimestamp` from `deletedAt`.
- Set it only when a delete/cancel/archive action actually happens.
- Consider adding `deletedBy` and query filters if soft delete is required.

### `deletedAt` On `OrderItem`

Current issue:

- `OrderItem.deletedAt` exists but there is no clear soft-delete behavior.

Recommended change:

- Either implement soft delete consistently or remove the field.

### Audit Field Naming

Current issue:

- Some entities use `createAt`, others use `createdAt`, `created_at`, `updateAt`, or `update_at`.
- `UserDiary` uses Spring Data auditing, while many others use Hibernate timestamps.

Risk:

- Inconsistent column names make queries, reporting, and migrations harder.

Recommended change:

- Standardize on `created_at` and `updated_at` column names in migrations.
- Pick one auditing strategy unless there is a specific reason to mix.

## Table Naming Review

Current issue:

- Table names mix uppercase and snake case:
  - `Users`, `Product`, `OrderItem`, `UserNotifications`
  - `purchase_order`, `purchase_order_item`, `stock_return`, `paint_detail`

Risk:

- PostgreSQL lowercases unquoted identifiers.
- Case-sensitive names can become confusing across Hibernate, SQL scripts, and migrations.

Recommended change:

- Standardize on lowercase snake_case:
  - `users`
  - `products`
  - `order_items`
  - `user_notifications`

This does not have to be changed immediately if data already exists, but new tables should follow one naming convention.

## Migration Risk

Current module:

- Flyway dependencies are commented out in `shared/persistence/build.gradle`.

Risk:

- If the app uses `ddl-auto=update`, schema changes can be uncontrolled.
- Indexes, constraints, column renames, and check constraints are safer with migrations.

Recommended change:

- Enable Flyway or Liquibase before production.
- Create migrations for all important indexes and constraints.
- Avoid relying on Hibernate auto-update for production schema evolution.

## N+1 Prevention Rules For This Project

Use these rules when adding endpoints:

1. Default entity relationships to lazy.
2. Never assume mapper code is cheap. If a mapper accesses nested fields, plan the fetch.
3. Use one repository method per response shape.
4. For pageable list endpoints, fetch to-one relationships or use DTO projection; avoid collection fetch joins.
5. For detail endpoints, fetch the exact collections needed.
6. For bulk processing, fetch related data in one query using `where id in (...)`.
7. Add query-count tests for high-traffic endpoints.
8. Watch logs for repeated `select ... where id = ?` patterns.

## Suggested Upgrade Order

1. Add/confirm database migrations.
2. Add unique constraints for `Cart.user_id`, `Payment.order_id`, `ForgotPassword.user_id`, `Product.productCode`, and `Order.orderCode`.
3. Change eager/default to-one and many-to-many relationships to lazy.
4. Add entity graphs or projections for cart detail, product list, order list/detail, wishlist list, diary detail, and inventory detail.
5. Add compound indexes for user/date/status query patterns.
6. Add optimistic locking or conditional updates for stock changes.
7. Clean up soft-delete and audit fields.
8. Standardize table/column naming for new migrations.

## Final Assessment

The table setup is usable now, but it is not yet production-hard. The biggest future performance issue will be hidden extra queries from relationship loading, especially in cart, product, order, wishlist, user role, and diary screens. The biggest data integrity issue is that some one-to-one relationships and business identifiers are modeled in Java but not fully enforced by database constraints.

Fixing fetch plans, constraints, and indexes before the dataset grows will prevent most N+1 and slow-query problems later.
