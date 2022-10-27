package kr.uracle.smile.support.mybatis.type;

import kr.uracle.smile.support.mybatis.EnumType;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;

/**
 * 열거형에 대한 타입 핸들러
 * @param <E> 열거형 타입
 */
@MappedTypes(Enum.class)
public class EnumTypeHandler<E extends Enum<E>> extends BaseTypeHandler<E> {

    private final Class<E> type;
    private final E[] enums;

    public EnumTypeHandler(Class<E> type) {
        if(type == null) {
            throw new IllegalArgumentException("Type argument cannot be null");
        }
        this.type = type;
        enums = type.getEnumConstants();
        if(this.enums == null) {
            throw new IllegalArgumentException(type.getSimpleName() + " does not represent an enum type.");
        }
    }

    @Override
    public void setNonNullParameter(PreparedStatement pstmt, int i, E parameter, JdbcType jdbcType) throws SQLException {
        if(parameter instanceof EnumType) {
            if(jdbcType == null) {
                pstmt.setObject(i, ((EnumType) parameter).value());
            } else {
                pstmt.setObject(i, ((EnumType) parameter).value(), jdbcType.TYPE_CODE);
            }
        } else {
            if(jdbcType == null) {
                pstmt.setObject(i, parameter.name());
            } else {
                pstmt.setObject(i, parameter.name(), jdbcType.TYPE_CODE);
            }
        }
    }

    @Override
    public E getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return value == null ? null : findEnumConstant(value);
    }

    @Override
    public E getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return value == null ? null : findEnumConstant(value);
    }

    @Override
    public E getNullableResult(CallableStatement cstmt, int columnIndex) throws SQLException {
        String value = cstmt.getString(columnIndex);
        return value == null ? null : findEnumConstant(value);
    }

    /**
     * value로 열거형을 검색한다.
     * @param value 값
     * @return 열거형 타입
     */
    private E findEnumConstant(String value) {
        if(Arrays.stream(type.getInterfaces()).anyMatch(EnumType.class::equals)) {
            try {
                return Arrays.stream(type.getEnumConstants()).filter(c -> {
                    if (((EnumType) c).value() instanceof Number && String.valueOf(((EnumType) c).value()).equals(value)) {
                        return true;
                    } else if (((EnumType) c).value() instanceof CharSequence && ((EnumType) c).value().equals(value)) {
                        return true;
                    }
                    return false;
                }).findFirst().orElseGet(null);
            } catch (NullPointerException e) {
                return null;
            }
        }
        return Enum.valueOf(type, value);
    }
}
