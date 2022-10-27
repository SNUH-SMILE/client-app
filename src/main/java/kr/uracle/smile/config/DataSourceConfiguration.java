package kr.uracle.smile.config;

import kr.morpheus.framework.annotation.MSP;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jndi.JndiObjectFactoryBean;

import javax.naming.NamingException;
import javax.sql.DataSource;
import javax.sql.XADataSource;

/**
 * DataSource 설정
 * JNDI DataSource 설정을 우선하며, 존재하지 않는 경우 Pooled DataSource 사용
 */
@Slf4j
@Configuration(proxyBeanMethods = false)
public class DataSourceConfiguration {

    /**
     * DataSource 설정 정보
     * @return DataSourceProperties
     */
    @MSP
    @Bean
    @ConfigurationProperties("smile.datasource")
    public DataSourceProperties dataSourceProperties() {
        return new DataSourceProperties();
    }

    /**
     * Jndi DataSource 설정
     */
    @Configuration(proxyBeanMethods = false)
    @AutoConfigureBefore(PooledDataSourceConfiguration.class)
    @ConditionalOnProperty(prefix = "smile.datasource", name = "jndi-name")
    @ConditionalOnMissingBean(value = { DataSource.class, XADataSource.class }, annotation = MSP.class)
    @Order(Ordered.HIGHEST_PRECEDENCE)
    class JndiDataSourceConfiguration {

        @MSP
        @Bean
        public DataSource dataSource(@MSP DataSourceProperties properties) throws NamingException {
            DataSourceConfiguration.this.logger.info("JNDI DataSource: [{}]", properties.getJndiName());

            JndiObjectFactoryBean bean = new JndiObjectFactoryBean();
            bean.setJndiName(properties.getJndiName());
            bean.setResourceRef(true);
            bean.setProxyInterface(DataSource.class);
            bean.setLookupOnStartup(false);
            bean.afterPropertiesSet();

            return (DataSource) bean.getObject();
        }

    }

    /**
     * Pooled DataSource 설정
     */
    @Configuration(proxyBeanMethods = false)
    @ConditionalOnMissingBean(value = { DataSource.class, XADataSource.class }, annotation = MSP.class)
    @Order(Ordered.HIGHEST_PRECEDENCE+10)
    class PooledDataSourceConfiguration {

        @MSP
        @Bean
        @ConfigurationProperties(prefix = "ums.datasource.dbcp")
        BasicDataSource dataSource(@MSP DataSourceProperties properties) {
            DataSourceConfiguration.this.logger.info("DBCP2 DataSource: [{}]", properties.determineDriverClassName());

            return properties.initializeDataSourceBuilder().type(BasicDataSource.class).build();
        }
    }

}
