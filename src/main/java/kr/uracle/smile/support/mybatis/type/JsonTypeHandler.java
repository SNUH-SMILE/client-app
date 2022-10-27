package kr.uracle.smile.support.mybatis.type;

import com.google.gson.Gson;
import kr.uracle.smile.support.ApplicationContextProvider;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.springframework.util.StringUtils;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class JsonTypeHandler<T> extends BaseTypeHandler<T> {

    private Class<T> type;

    public JsonTypeHandler(Class<T> type) {
        this.type = type;
    }

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException {
        Gson gson = ApplicationContextProvider.getBean(Gson.class);
        ps.setString(i, gson.toJson(parameter));
    }

    @Override
    public T getNullableResult(ResultSet rs, String columnName) throws SQLException {
        Gson gson = ApplicationContextProvider.getBean(Gson.class);
        String value = rs.getString(columnName);
        return StringUtils.hasText(value) ? gson.fromJson(value, type) : null;
    }

    @Override
    public T getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        Gson gson = ApplicationContextProvider.getBean(Gson.class);
        String value = rs.getString(columnIndex);
        return StringUtils.hasText(value) ? gson.fromJson(value, type) : null;
    }

    @Override
    public T getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        Gson gson = ApplicationContextProvider.getBean(Gson.class);
        String value = cs.getString(columnIndex);
        return StringUtils.hasText(value) ? gson.fromJson(value, type) : null;
    }
}
