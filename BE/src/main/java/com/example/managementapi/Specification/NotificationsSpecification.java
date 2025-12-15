//package com.example.managementapi.Specification;
//
//import com.example.managementapi.Entity.Category;
//import com.example.managementapi.Entity.Notifications;
//import com.example.managementapi.Entity.UserNotifications;
//import org.springframework.data.jpa.domain.Specification;
//
//public class NotificationsSpecification {
//    public static Specification<UserNotifications> filter(
//            String userId,
//            Boolean isRead
//    ) {
//        return (root, query, cb) -> {
//
//            List<Predicate> predicates = new ArrayList<>();
//
//            // filter theo userId
//            if (userId != null && !userId.isBlank()) {
//                predicates.add(
//                        cb.equal(
//                                root.get("user").get("userId"),
//                                userId
//                        )
//                );
//            }
//
//            // filter theo isRead
//            if (isRead != null) {
//                predicates.add(
//                        cb.equal(root.get("isRead"), isRead)
//                );
//            }
//
//            query.distinct(true);
//
//            return cb.and(predicates.toArray(new Predicate[0]));
//        };
//    }
//
//}