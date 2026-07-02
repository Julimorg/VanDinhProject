# User Module N+1 Query Review

Scope:

- Feature module: `feature/user`
- User table/entity: `shared/persistence/src/main/java/com/example/persistence/entity/User.java`
- Related role table/entity: `shared/persistence/src/main/java/com/example/persistence/entity/Role.java`

## Main Finding

The user module currently has a real N+1 risk because service methods load `User` entities first, then MapStruct maps DTO fields that can touch lazy relationships.

Important current mappings:

- `User.roles` is `@ManyToMany(fetch = FetchType.LAZY)`.
- `Role.permissions` is `@ManyToMany(fetch = FetchType.LAZY)`.
- `User.orders` and `User.wishlists` are lazy collections.
- `User.cart` and `User.forgotPassword` are `@OneToOne` without `fetch = FetchType.LAZY`, so JPA treats them as eager by default.

Lazy by default is good, but it means every read endpoint needs a clear fetch plan. If the DTO needs a relation, the repository should fetch it intentionally.

## Where N+1 Can Happen

### 1. Admin user list loads users, then maps roles

Code path:

- `UserController.getUser(...)`
- `UserService.getUsersByAdmin(...)`
- `userRepository.findAll(spec, pageable).map(userMapper::toGetUser)`
- `GetUserRes.roles`

Why it can cause N+1:

1. The first query loads one page of users.
2. `UserMapper.toGetUser(...)` maps `GetUserRes.roles`.
3. Because `User.roles` is lazy, Hibernate may run one extra query per user to load roles.

Example query shape with page size 10:

```text
1 query  -> select 10 users
10 query -> select roles for each user
```

If `Role.permissions` is later added to the response, this can become worse:

```text
1 query  -> select users
N query  -> select roles for each user
M query  -> select permissions for each role
```

Impact:

- Admin user list becomes slower as page size grows.
- Database query count grows with number of rows returned.
- The problem is easy to miss because the service code only shows one repository call.

Recommended improvement:

- Do not use generic entity mapping for paged list rows if the DTO includes collections.
- Prefer a list-specific DTO projection for simple user fields.
- If roles must be shown in the list, use a two-step query:
  1. Fetch the page of users or user IDs.
  2. Fetch roles for all user IDs in that page with one query.
  3. Assemble the DTOs in memory.

Avoid collection fetch joins directly with pageable queries unless tested carefully, because collection fetching can duplicate rows and break pagination behavior.

### 2. User profile maps orders from the user entity

Code path:

- `UserController.getMyProfile(...)`
- `UserService.getMyProfile(...)`
- `findUserOrThrow(userId)`
- `userMapper.toGetProfileDetailRes(user)`
- `GetMyProfileDetailRes.orders`

Why it can cause query growth:

This endpoint loads one user, so it is not classic page-level N+1. However, the profile DTO includes `orders`, which is a lazy collection. Mapping it can trigger an extra query for orders.

The risk becomes serious if the order DTO later includes nested relations such as:

- `order.payment`
- `order.orderItems`
- `order.user`

Then mapping one user's orders can become:

```text
1 query -> select user
1 query -> select orders for user
N query -> select payment/orderItems for each order
```

Impact:

- Profile endpoint can become unexpectedly heavy for users with many orders.
- Adding fields to order DTOs can introduce new queries without changing service code.

Recommended improvement:

- Keep profile data and order history as separate endpoints unless the UI needs them together.
- If orders are required, query them from `OrderRepository` with a dedicated projection or fetch plan.
- For profile detail only, do not map `User.orders` from the generic `User` entity.

### 3. One-to-one relations are eager by default

Code location:

- `User.cart`
- `User.forgotPassword`

Problem:

`@OneToOne` defaults to eager loading when no fetch type is set. This means user queries can also load cart and forgot-password records even when the response does not need them.

Impact:

- Admin list and selection endpoints may do hidden extra work.
- Depending on Hibernate behavior and ownership side, this can appear as extra joins or extra select queries.

Recommended improvement:

```java
@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
private Cart cart;

@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
private ForgotPassword forgotPassword;
```

Notice:

- Lazy inverse `@OneToOne(mappedBy = ...)` can require bytecode enhancement to work perfectly in Hibernate.
- Even if Hibernate still needs extra checks, setting the intent explicitly is better than relying on eager defaults.

### 4. User selection loads full entities

Code path:

- `UserService.getUserSelection()`
- `userRepository.findAll().stream().map(userMapper::toGetUserSelection)`

Why this is risky:

The selection endpoint likely needs only a few fields, but it loads full `User` entities. With eager one-to-one defaults, this can also bring unrelated user relations into memory.

Impact:

- More memory usage.
- More columns loaded than needed.
- Future DTO changes can accidentally touch lazy relations.

Recommended improvement:

- Replace this with a projection query such as `GetUserSelectionRes` fields only.
- Add sorting and status filtering if the selection should exclude inactive users.

Example direction:

```java
@Query("""
    select new com.example.common.dto.user.response.GetUserSelectionRes(
        u.id,
        u.userName,
        u.email
    )
    from User u
    where u.status = com.example.persistence.enumTable.Status.ACTIVE
    order by u.userName
""")
List<GetUserSelectionRes> findActiveUserSelections();
```

Adjust constructor fields to match the actual DTO.

## What To Improve First

### Priority 1: Make user list fetch behavior explicit

Current:

```java
return userRepository.findAll(spec, pageable).map(userMapper::toGetUser);
```

Better options:

- If the admin list does not need roles, remove `roles` from `GetUserRes` or ignore it in the mapper.
- If the admin list needs role names, load roles for the page in one separate query.
- Add a test or SQL logging check that page size 10 does not produce 11+ queries.

### Priority 2: Do not map large collections from `User` automatically

Avoid mapping these fields from a generic `User` entity unless the endpoint is specifically a detail endpoint with a fetch plan:

- `roles`
- `orders`
- `wishlists`
- `cart`

Use separate endpoints or explicit repository queries for them.

### Priority 3: Set fetch type explicitly on all relationships

Current good examples:

- `User.roles` is lazy.
- `Role.permissions` is lazy.
- `User.orders` is lazy.
- `User.wishlists` is lazy.

Needs attention:

- `User.cart`
- `User.forgotPassword`
- Other related entities such as `Order.user`, `Order.payment`, `Cart.user`, and `Cart.cartItems` should also be reviewed because they can affect user profile/order DTOs.

### Priority 4: Add batching as a defensive improvement

Batch fetching does not replace proper fetch plans, but it reduces damage when a lazy relation is touched.

Possible Hibernate configuration:

```properties
spring.jpa.properties.hibernate.default_batch_fetch_size=50
```

Possible entity-level direction:

```java
@BatchSize(size = 50)
private Set<Role> roles;
```

This can turn many single-row lazy-load queries into fewer batched queries.

## What To Notice During Development

Before adding a field to any user DTO, ask:

1. Is this field a simple column on `User`, or does it come from a relationship?
2. If it comes from a relationship, does the repository fetch that relationship intentionally?
3. Is this a list endpoint or a detail endpoint?
4. If this is pageable, am I fetching a collection relation that can duplicate rows?
5. Will MapStruct access a lazy getter automatically?
6. Can this response be a projection instead of an entity-to-DTO mapping?

Warning signs:

- `findAll(...).map(mapper::toDto)` where the DTO contains a list, set, or nested DTO.
- DTO fields named `roles`, `orders`, `items`, `products`, `permissions`, `cart`, `wishlists`, or `payment`.
- Adding nested fields to a DTO without changing the repository query.
- Pageable queries combined with collection fetch joins.
- SQL logs showing repeated queries with only the ID parameter changing.

## How To Verify

Enable SQL and Hibernate statistics in local/dev:

```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.generate_statistics=true
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.orm.jdbc.bind=TRACE
logging.level.org.hibernate.stat=DEBUG
```

Then test these endpoints with realistic data:

- `GET /api/v1/users/get-user?page=0&size=10`
- `GET /api/v1/users/get-profile/{userId}`
- `GET /api/v1/users/view-profile/{userId}`

Expected check:

- Increasing page size from 10 to 20 should not double the number of SQL statements.
- Mapping one user profile should not run one query per order unless that is intentionally accepted.
- Admin list should not query roles one user at a time.

## Suggested Repository Methods

For single-user detail with roles:

```java
@EntityGraph(attributePaths = {"roles"})
Optional<User> findWithRolesById(String id);
```

For admin list with roles, prefer two-step loading:

```java
@Query("""
    select u
    from User u
    where u.id in :ids
""")
List<User> findAllByIdIn(List<String> ids);

@Query("""
    select u.id, r
    from User u
    join u.roles r
    where u.id in :userIds
""")
List<Object[]> findRolesByUserIds(List<String> userIds);
```

For selection lists, prefer projection instead of entity loading.

## Summary

The highest N+1 risk in the user module is the admin user list mapping `GetUserRes.roles` after loading a pageable `Page<User>`. The second risk is profile mapping that includes `orders`, because future nested order fields can create one query per order. The third issue is hidden eager loading from `@OneToOne` fields on `User`.

The main improvement is not simply changing lazy/eager annotations. The main improvement is to make each endpoint's fetch plan match its DTO: use projections for list rows, explicit fetch methods for detail screens, and avoid automatic mapping of collections from generic entity queries.

## Extra Non-N+1 Findings

These are not N+1 problems, but they were found in the same user-module review:

1. `UserController.getUserSelection()` has no `@GetMapping`, so it is not exposed as an HTTP endpoint.
2. `UserController.getUser(...)` calls `userService.getUsersByAdmin(status, role, keyword, pageable)`, but the service signature is `getUsersByAdmin(String keyword, String status, String role, Pageable pageable)`. This swaps the filters and can make keyword/status/role search behave incorrectly.
