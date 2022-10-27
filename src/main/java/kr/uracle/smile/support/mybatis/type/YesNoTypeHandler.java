package kr.uracle.smile.support.mybatis.type;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;
import org.springframework.stereotype.Component;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Boolean Type을 Y, N으로 사용하기 위한 TypeHandler
 */
@Component
@MappedTypes({Boolean.class, boolean.class})
public class YesNoTypeHandler extends BaseTypeHandler<Boolean> {
    public YesNoTypeHandler() {
    }

    @Override
    public void setNonNullParameter(PreparedStatement pstmt, int idx, Boolean param, JdbcType jdbcType) throws SQLException {
        if(param == null) {
            pstmt.setString(idx, null);
            return;
        }
        pstmt.setString(idx, convert(param));
    }

    @Override
    public Boolean getNullableResult(ResultSet rs, String column) throws SQLException {
        return convert(rs.getString(column));
    }

    @Override
    public Boolean getNullableResult(ResultSet rs, int idx) throws SQLException {
        return convert(rs.getString(idx));
    }

    @Override
    public Boolean getNullableResult(CallableStatement stmt, int idx) throws SQLException {
        return convert(stmt.getString(idx));
    }

    private String convert(Boolean value) {
        return value ? "Y" : "N";
    }

    private Boolean convert(String value) {
        return value == null ? null : value.equalsIgnoreCase("y");
    }
}
