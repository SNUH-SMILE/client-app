package kr.uracle.smile;

import kr.uracle.smile.config.SMILEProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@EnableConfigurationProperties(SMILEProperties.class)
@SpringBootApplication()
public class SMILEApplication extends SpringBootServletInitializer {
    public SMILEApplication() {
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        builder.sources(SMILEApplication.class);
        return builder;
    }

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(SMILEApplication.class);
        application.run();
    }
}
