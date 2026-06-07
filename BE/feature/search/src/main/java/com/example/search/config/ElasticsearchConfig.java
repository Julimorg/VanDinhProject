// package com.example.search.config;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.data.elasticsearch.client.ClientConfiguration;
// import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
// import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

// @Configuration
// //@EnableElasticsearchRepositories(basePackages = "com.example.search.repository")
// public class ElasticsearchConfig extends ElasticsearchConfiguration {

//     @Value("${register.elasticsearch.username}")
//     private String userName;

//     @Value("${register.elasticsearch.password}")
//     private String password;

//     @Override
//     public ClientConfiguration clientConfiguration() {
//         return ClientConfiguration.builder()
//                 .connectedTo("localhost:9200")
//                 .withBasicAuth(userName, password)
//                 .build();
//     }
// }