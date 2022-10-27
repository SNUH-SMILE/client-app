package kr.uracle.smile.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurerSupport;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.task.DelegatingSecurityContextAsyncTaskExecutor;

import java.util.concurrent.Executor;

@Configuration(proxyBeanMethods = false)
@EnableAsync
public class AsyncConfiguration extends AsyncConfigurerSupport {

    private final SMILEProperties.ThreadPoolProperties properties;

    public AsyncConfiguration(SMILEProperties properties) {
        this.properties = properties.getThreadPool();
    }

    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setThreadNamePrefix("SMILE-");
        executor.setCorePoolSize(properties.getCorePoolSize());
        executor.setMaxPoolSize(properties.getMaxPoolSize());
        executor.setQueueCapacity(properties.getQueueCapacity());
        executor.initialize();

        return new DelegatingSecurityContextAsyncTaskExecutor(executor);
    }

}
