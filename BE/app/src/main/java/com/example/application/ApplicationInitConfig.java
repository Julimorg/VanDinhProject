package com.example.application;

import com.example.persistence.entity.Role;
import com.example.persistence.entity.User;
import com.example.persistence.enumTable.Status;
import com.example.persistence.enumTable.UserRole;
import com.example.user.repository.RoleRepository;
import com.example.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

import java.security.SecureRandom;
import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitConfig {

    private static final String PASSWORD_CHARS =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    // Khong hardcode default password. Neu khong set bien moi truong nay,
    // he thong se tu sinh 1 password ngau nhien, du manh, va CHI log ra 1 lan duy nhat
    // luc khoi tao lan dau de admin dang nhap va doi ngay.
    @Value("${ADMIN_DEFAULT_PASSWORD:}")
    private String configuredAdminPassword;

    private static String generateRandomPassword() {
        StringBuilder sb = new StringBuilder(20);
        for (int i = 0; i < 20; i++) {
            sb.append(PASSWORD_CHARS.charAt(SECURE_RANDOM.nextInt(PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            log.info("Application starting");
            if (userRepository.findByUserName("admin").isEmpty()) {
                log.info("Admin does not exist, creating admin user");

                //? Check xem DB có role chưa
                //? Có thì lấy từ DB Ra
                //? Ko thì tự động tạo

                roleRepository.findByName(String.valueOf(UserRole.USER))
                        .orElseGet(() -> {
                            Role newRole = Role.builder()
                                    .name(String.valueOf(UserRole.USER))
                                    .description("Default Role role")
                                    .build();
                            return roleRepository.save(newRole);
                        });

                roleRepository.findByName(String.valueOf(UserRole.STAFF))
                        .orElseGet(() -> {
                            Role newRole = Role.builder()
                                    .name(String.valueOf(UserRole.STAFF))
                                    .description("Default Staff role")
                                    .build();
                            return roleRepository.save(newRole);
                        });

                Role adminRole = roleRepository.findByName(String.valueOf(UserRole.ADMIN))
                        .orElseGet(() -> {
                            Role newRole = Role.builder()
                                    .name(String.valueOf(UserRole.ADMIN))
                                    .description("Administrator role")
                                    .build();
                            Role savedRole = roleRepository.save(newRole);
                            return savedRole;
                        });

                Set<Role> roles = new HashSet<>();
                boolean added = roles.add(adminRole);
                log.info("Adding role ADMIN to user: success={}", added);

                boolean usingConfiguredPassword = StringUtils.hasText(configuredAdminPassword);
                String rawPassword = usingConfiguredPassword
                        ? configuredAdminPassword
                        : generateRandomPassword();

                User user = User.builder()
                        .userName("admin")
                        .password(passwordEncoder.encode(rawPassword))
                        .status(Status.ACTIVE)
                        .email("admin@gmail.com")
                        .roles(roles)
                        .build();

                User savedUser = userRepository.save(user);

                if (usingConfiguredPassword) {
                    log.info("Admin user created using ADMIN_DEFAULT_PASSWORD from environment. Roles: {}", savedUser.getRoles());
                } else {
                    // Log 1 lan duy nhat luc khoi tao lan dau. Khong co gia tri co dinh nao (nhu 123456)
                    // de ai cung doan duoc - admin phai dang nhap va doi mat khau ngay.
                    log.warn("ADMIN_DEFAULT_PASSWORD chua duoc cau hinh. Da tao user 'admin' voi password " +
                            "ngau nhien mot-lan: {}. HAY DANG NHAP VA DOI MAT KHAU NAY NGAY. Roles: {}",
                            rawPassword, savedUser.getRoles());
                }
            } else {
                log.info("Admin user already exists");
            }
        };
    }

}
