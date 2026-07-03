package com.example.security.config;

import com.example.security.jwt.CustomJwtDecoder;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

//    private final JwtAuthFilter  jwtAuthFilter;

    private final CustomJwtDecoder customJwtDecoder;

    // ---- Public endpoints ----
    private static final String[] PUBLIC_POST_ENDPOINTS = {
            "/api/v1/auth/**",
            "/api/v1/reset-pass/**",
            "/api/v1/vn-pay/**",
            "/ws/**"
    };
    private static final String[] PUBLIC_SWAGGER = {
            "/swagger-ui/**", "/v3/api-docs/**", "/webjars/**"
    };
    private static final String[] PUBLIC_GET_VNPAY = { "/api/v1/vn-pay/**" };
    private static final String[] PUBLIC_ENDPOINT = {
            "api/v1/for-public/**"
    };

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring().requestMatchers(
                "/ws/**", "/**.html", "/**.js", "/**.css", "/favicon.ico"
        );
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(List.of(
                "http://localhost:8080",
                "http://localhost:63342",
                "http://localhost:5175",
                "http://localhost:5174",
                "http://localhost:5173",
                "http://127.0.0.1:5500",
                "http://13.250.65.227:8080",
                "https://van-dinh-project.vercel.app",
                "https://van-dinh.net/"
        ));
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        httpSecurity.authorizeHttpRequests(request -> request
                .requestMatchers(HttpMethod.POST, PUBLIC_POST_ENDPOINTS).permitAll()
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/api/v1/reset-pass/change-password/**").permitAll()
                .requestMatchers(PUBLIC_SWAGGER).permitAll()
                .requestMatchers(HttpMethod.GET, PUBLIC_GET_VNPAY).permitAll()
                .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINT).permitAll()
                .anyRequest().authenticated()
        );

        httpSecurity.exceptionHandling(ex -> ex
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    throw accessDeniedException;
                })
        );

        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwtConfigurer -> jwtConfigurer
                        .decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
        );

//         httpSecurity.addFilterAfter(jwtAuthFilter, BearerTokenAuthenticationFilter.class);

        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        return converter;
    }

}