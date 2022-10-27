package kr.uracle.smile.support.mybatis;

import org.apache.ibatis.cache.CacheKey;
import org.apache.ibatis.cursor.Cursor;
import org.apache.ibatis.executor.BatchResult;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.transaction.Transaction;

import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * MyBatis Pagination Executor
 * @author Minki,Cho
 */
public class PageExecutor implements Executor {

    private Executor executor;

    public PageExecutor(Executor executor) {
        this.executor = executor;
    }

    @Override
    public int update(MappedStatement mappedStatement, Object o) throws SQLException {
        return executor.update(mappedStatement, o);
    }

    @Override
    public <E> List<E> query(MappedStatement mstmt, Object param, RowBounds rowBounds, ResultHandler resultHandler, CacheKey cacheKey, BoundSql boundSql) throws SQLException {
        List<E> rows = executor.query(mstmt, param, rowBounds, resultHandler, cacheKey, boundSql);

        if(param instanceof PageRequest) {
            if(mstmt.getConfiguration().hasStatement(mstmt.getId() + "Count")) {
                MappedStatement cmstmt = mstmt.getConfiguration().getMappedStatement(mstmt.getId() + "Count");
                int count = (int) executor.query(cmstmt, param, rowBounds, resultHandler).get(0);

                Page<E> result = new Page<E>(rows, ((PageRequest) param).getPage(), ((PageRequest) param).getSize(),
                        ((PageRequest) param).getPaginationSize(), count);
                result.createPagination();
                return result;
            }
        }

        if(param instanceof Map) {
            Iterator<Object> params = ((Map) param).values().iterator();
            while(params.hasNext()) {
                Object p = params.next();
                if(p instanceof PageRequest) {
                    if(mstmt.getConfiguration().hasStatement(mstmt.getId() + "Count")) {
                        MappedStatement cmstmt = mstmt.getConfiguration().getMappedStatement(mstmt.getId() + "Count");
                        int count = (int) executor.query(cmstmt, param, rowBounds, resultHandler).get(0);
                        Page<E> result = new Page<E>(rows, ((PageRequest) p).getPage(), ((PageRequest) p).getSize(),
                                ((PageRequest) p).getPaginationSize(), count);
                        result.createPagination();
                        return result;
                    }
                }
            }
        }
        return rows;
    }

    @Override
    public <E> List<E> query(MappedStatement mappedStatement, Object param, RowBounds rowBounds, ResultHandler resultHandler) throws SQLException {
        BoundSql boundSql = mappedStatement.getBoundSql(param);
        return query(mappedStatement, param, rowBounds, resultHandler,
                executor.createCacheKey(mappedStatement, param, rowBounds, boundSql), boundSql);
    }

    @Override
    public <E> Cursor<E> queryCursor(MappedStatement mappedStatement, Object o, RowBounds rowBounds) throws SQLException {
        return executor.queryCursor(mappedStatement, o, rowBounds);
    }

    @Override
    public List<BatchResult> flushStatements() throws SQLException {
        return executor.flushStatements();
    }

    @Override
    public void commit(boolean b) throws SQLException {
        executor.commit(b);
    }

    @Override
    public void rollback(boolean b) throws SQLException {
        executor.rollback(b);
    }

    @Override
    public CacheKey createCacheKey(MappedStatement mappedStatement, Object o, RowBounds rowBounds, BoundSql boundSql) {
        return executor.createCacheKey(mappedStatement, o, rowBounds, boundSql);
    }

    @Override
    public boolean isCached(MappedStatement mappedStatement, CacheKey cacheKey) {
        return executor.isCached(mappedStatement, cacheKey);
    }

    @Override
    public void clearLocalCache() {
        executor.clearLocalCache();
    }

    @Override
    public void deferLoad(MappedStatement mappedStatement, MetaObject metaObject, String s, CacheKey cacheKey, Class<?> aClass) {
        executor.deferLoad(mappedStatement, metaObject, s, cacheKey, aClass);
    }

    @Override
    public Transaction getTransaction() {
        return executor.getTransaction();
    }

    @Override
    public void close(boolean b) {
        executor.close(b);
    }

    @Override
    public boolean isClosed() {
        return executor.isClosed();
    }

    @Override
    public void setExecutorWrapper(Executor executor) {
        executor.setExecutorWrapper(executor);
    }
}
