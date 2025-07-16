package egovframework.divas.com;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StartupConfig {

    @Value("${server.port}")
    private int port;

    @Bean
    public ApplicationRunner applicationRunner() {
        return args -> {
            System.out.println("Server is running on port: " + port);
        };
    }
}