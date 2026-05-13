package com.example.managementapi.Configuration;

import org.apache.http.conn.ssl.TrustAllStrategy;
import org.apache.http.ssl.SSLContextBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;

import javax.net.ssl.SSLContext;

@Configuration
public class ElasticsearchConfig extends ElasticsearchConfiguration {

    @Value("${register.elasticsearch.username}")
    private String userName;

    @Value("${register.elasticsearch.password}")
    private String password;

    @Override
    public ClientConfiguration clientConfiguration(){
        return ClientConfiguration.builder()
                .connectedTo("localhost:9200")
                //.usingSsl()
                .withBasicAuth(userName, password)
                .build();
    }

    private static SSLContext buildSSLContext(){
        try{
            return new SSLContextBuilder()
                    .loadTrustMaterial(null, TrustAllStrategy.INSTANCE).build();
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }



}
