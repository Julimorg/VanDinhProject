package com.example.managementapi;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ActiveProfiles;

import javax.sql.DataSource;

@SpringBootTest
@ActiveProfiles("test")
class ManagementApiApplicationTests {

    @Configuration
    static class TestConfig {
        @Bean
        public DataSource dataSource() {
            // Trả về DataSource giả bằng Mockito
            return Mockito.mock(DataSource.class);
        }
    }
    @Test
    void contextLoads() {
    }

}
