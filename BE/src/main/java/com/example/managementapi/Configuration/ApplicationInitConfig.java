
package com.example.managementapi.Configuration;

import com.example.managementapi.Entity.Role;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Enum.Status;
import com.example.managementapi.Repository.RoleRepository;
import com.example.managementapi.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitConfig {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            log.info("Application starting");
            if (userRepository.findByUserName("admin").isEmpty()) {
                log.info("Admin does not exist, creating admin user");

                //? Check xem DB có role ADMIN chưa
                //? Có thì lấy từ DB Ra
                //? Ko thì tự động tạo
                Role adminRole = roleRepository.findByName("ADMIN")
                        .orElseGet(() -> {
                            Role newRole = Role.builder()
                                    .name("ADMIN")
                                    .description("Administrator role")
                                    .build();
                            Role savedRole = roleRepository.save(newRole);
                            log.info("Created role: {}", savedRole);
                            return savedRole;
                        });

                Set<Role> roles = new HashSet<>();
                boolean added = roles.add(adminRole);
                log.info("Adding role ADMIN to user: success={}", added);

                User user = User.builder()
                        .userName("admin")
                        .password(passwordEncoder.encode("123456"))
                        .status(Status.ACTIVE)
                        .email("admin@gmail.com")
                        .roles(roles)
                        .build();

                User savedUser = userRepository.save(user);
                log.warn("ADMIN HAS BEEN CREATED WITH DEFAULT PASSWORD: 123456, ROLES: {}", savedUser.getRoles());
            } else {
                log.info("Admin user already exists");
            }
        };
    }
}
