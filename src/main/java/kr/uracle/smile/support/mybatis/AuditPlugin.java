package kr.uracle.smile.support.mybatis;

import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.SqlCommandType;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Signature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * MyBatis AuditingEntity Plug-in
 * @author Minki,Cho
 */
@Slf4j
@Component
@Intercepts({
        @Signature(type = Executor.class, method = "update", args = { MappedStatement.class, Object.class })
})
public class AuditPlugin implements Interceptor {

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        MappedStatement stmt = null;
        for(Object arg : invocation.getArgs()) {
            if(Objects.isNull(arg)) {
                continue;
            }
            if(stmt == null) {
                stmt = (MappedStatement) arg;
                if(SqlCommandType.DELETE.equals(stmt.getSqlCommandType())) {
                    break;
                }
                continue;
            }
            process(stmt, arg);
        }

        return invocation.proceed();
    }

    private void process(MappedStatement stmt, Object arg) {
        if(arg instanceof AbstractAuditEntity) {
            set(stmt, (AbstractAuditEntity) arg);
        } else if(arg instanceof Map) {
            for (Object o : ((Map<?, ?>) arg).values()) {
                process(stmt, o);
            }
        } else if(arg instanceof List) {
            for (Object o : (List<?>)arg) {
                if(o instanceof AbstractAuditEntity) {
                    set(stmt, (AbstractAuditEntity) o);
                }
            }
        } else if(arg.getClass().isArray() && !arg.getClass().isPrimitive()) {
            for (Object o : (Object[])arg) {
                if(o instanceof AbstractAuditEntity) {
                    set(stmt, (AbstractAuditEntity) o);
                }
            }
        }
    }

    private void set(MappedStatement stmt, AbstractAuditEntity entity) {
        if(stmt == null) return;

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated()) {
            return;
        }

        if(SqlCommandType.INSERT.equals(stmt.getSqlCommandType())) {
            entity.setRegId(authentication.getName());
            entity.setRegDate(LocalDateTime.now());
        } else if(SqlCommandType.UPDATE.equals(stmt.getSqlCommandType())) {
            entity.setModId(authentication.getName());
            entity.setModDate(LocalDateTime.now());
        }
    }

    @Override
    public Object plugin(Object executor) {
        return Interceptor.super.plugin(executor);
    }
}
