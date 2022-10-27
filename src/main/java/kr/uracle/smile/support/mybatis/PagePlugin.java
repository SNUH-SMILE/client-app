package kr.uracle.smile.support.mybatis;

import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.*;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Component;

import java.util.Properties;

/**
 * MyBatis Pagination Plug-in
 * @author Minki,Cho
 */
@Component
@Intercepts({
        @Signature(type = Executor.class, method = "query", args = { MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class })
})
public class PagePlugin implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Throwable {

        return invocation.proceed();
    }

    @Override
    public Object plugin(Object executor) {
        if(executor instanceof Executor)
            return Plugin.wrap(new PageExecutor((Executor)executor), this);
        else
            return Plugin.wrap(executor, this);
    }

    @Override
    public void setProperties(Properties properties) {

    }
}
