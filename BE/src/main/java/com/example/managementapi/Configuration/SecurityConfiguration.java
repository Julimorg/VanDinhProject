package com.example.managementapi.Configuration;


import com.example.managementapi.Component.UserStatusFilter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;


import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final String[] PUBLIC_POST_ENDPOINTS = {
            "/api/v1/auth/**",
            "/api/v1/reset-pass/**"
    };
    private final String[] PUBLIC_SWAGGER = {"/swagger-ui/**","/v3/api-docs/**", "/webjars/**"};
    private final String[] PUBLIC_VNPAY = {
            "/api/v1/vn-pay/**"
    };

    @NonFinal
    @Value("${signer.key}")
    protected String SIGNER_KEY;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://van-dinh-project.vercel.app"
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

    //? Config filter chain của Spring Security
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity, UserStatusFilter userStatusFilter) throws Exception {

        httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        //** Config ra các endpoint nào cần secure và endpoint nào không cần secure
        //? Config ra những enpoint ko cần secure với httpSecurity.authorizeHttpRequests()
        httpSecurity.authorizeHttpRequests(request ->
                request.requestMatchers(HttpMethod.POST, PUBLIC_POST_ENDPOINTS).permitAll()
                        .requestMatchers(PUBLIC_SWAGGER).permitAll()
                        .requestMatchers(HttpMethod.GET,PUBLIC_VNPAY).permitAll()
                        .anyRequest().authenticated());

        httpSecurity.exceptionHandling(ex -> ex
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    throw accessDeniedException;
                })
        );

        //? Config OAuth2 với Oauth2ResourceServer
        httpSecurity.oauth2ResourceServer(oauth2
                -> oauth2.jwt(jwtConfigurer
                -> jwtConfigurer.decoder(jwtDecoder())
                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
        );

        httpSecurity.addFilterAfter(userStatusFilter, BearerTokenAuthenticationFilter.class);
        httpSecurity.csrf(AbstractHttpConfigurer::disable);


        return httpSecurity.build();
    }


        @Bean
    public JwtDecoder jwtDecoder(){

        SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");

        return NimbusJwtDecoder
                .withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }


    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter(){
        JwtGrantedAuthoritiesConverter jwtAuthenticationConverter = new JwtGrantedAuthoritiesConverter();
        jwtAuthenticationConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwtAuthenticationConverter);
        return converter;
    }

}
