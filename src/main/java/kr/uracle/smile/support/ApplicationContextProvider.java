package kr.uracle.smile.support;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class ApplicationContextProvider implements ApplicationContextAware {

    private static ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        ApplicationContextProvider.applicationContext = applicationContext;
    }

    public static boolean containsBean(String beanName) {
        return applicationContext.containsBean(beanName);
    }

    public static <T> T getBean(Class<T> type) {
        if(applicationContext == null) { // Application Context가 초기화 되기 전으로 별도의 Exception을 발생할지 검토
            return null;
        }

        return applicationContext.getBean(type);
    }
}
