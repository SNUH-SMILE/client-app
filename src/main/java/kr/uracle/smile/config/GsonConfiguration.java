package kr.uracle.smile.config;

import com.google.gson.GsonBuilder;
import kr.morpheus.framework.support.gson.SerializationExclusionStrategy;
import kr.uracle.smile.support.gson.*;
import kr.uracle.smile.support.mybatis.Page;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.gson.GsonBuilderCustomizer;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Gson 설정
 */
@Slf4j
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(value = "spring.mvc.converters.preferred-json-mapper", havingValue = "gson")
public class GsonConfiguration {

    public GsonConfiguration() {
    }

    @Bean
    public GsonCustomizer gsonCustomizer() {
        return new GsonCustomizer();
    }


    static final class GsonCustomizer implements GsonBuilderCustomizer {
        @Autowired
        private WebMvcProperties properties;

        @Override
        public void customize(GsonBuilder gsonBuilder) {
            String datePattern = StringUtils.hasText(properties.getFormat().getDate())
                    ? properties.getFormat().getDate() : "yyyy-MM-dd";
            String timePattern = StringUtils.hasText(properties.getFormat().getTime())
                    ? properties.getFormat().getTime() : "HH:mm:ss";
            String datetimePattern = StringUtils.hasText(properties.getFormat().getDateTime())
                    ? properties.getFormat().getDateTime() : "yyyy-MM-dd HH:mm:ss";

            logger.trace("Date format pattern :[{}]", datePattern);
            logger.trace("Time format pattern :[{}]", timePattern);
            logger.trace("DateTime format pattern :[{}]", datetimePattern);

            gsonBuilder.registerTypeAdapter(LocalDate.class, new LocalDateSerializer(datePattern))
                    .registerTypeAdapter(LocalTime.class, new LocalTimeSerializer(timePattern))
                    .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeSerializer(datetimePattern))
                    .registerTypeAdapter(Page.class, new PageJsonSerializer());

            gsonBuilder.addSerializationExclusionStrategy(new SerializationExclusionStrategy());
        }
    }
}
