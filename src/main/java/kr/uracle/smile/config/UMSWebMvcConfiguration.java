package kr.uracle.smile.config;

import kr.uracle.smile.support.mybatis.PageRequestMethodArgumentResolver;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration(proxyBeanMethods = false)
public class UMSWebMvcConfiguration implements WebMvcConfigurer, BeanFactoryAware {

    private BeanFactory beanFactory;

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        this.beanFactory = beanFactory;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(beanFactory.getBean(PageRequestMethodArgumentResolver.class));
    }
}
