package kr.uracle.smile.support.validator;

import io.swagger.annotations.ApiModelProperty;
import kr.uracle.smile.support.validator.annotation.Compare;
import org.hibernate.validator.constraintvalidation.HibernateConstraintValidatorContext;
import org.springframework.util.Assert;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CompareValidator implements ConstraintValidator<Compare, Object> {

    private boolean ignoreZero;
    private ComparisonMode mode;
    private String lhs;
    private String rhs;

    @Override
    public void initialize(Compare annotation) {
        this.mode = annotation.mode();
        this.ignoreZero = annotation.ignoreZero();

        String[] fields = annotation.value();
        Assert.isTrue(fields.length == 2, "Only 2 fields can be specified.");
        lhs = fields[0];
        rhs = fields[1];
    }

    @Override
    public boolean isValid(Object o, ConstraintValidatorContext context) {
        Field lhs = ReflectionUtils.findField(o.getClass(), this.lhs);
        Field rhs = ReflectionUtils.findField(o.getClass(), this.rhs);
        Assert.isTrue(lhs != null || rhs != null, "Field does not found.");
        ReflectionUtils.makeAccessible(lhs);
        ReflectionUtils.makeAccessible(rhs);
        Assert.isTrue(lhs.getType().equals(rhs.getType()), "Only same types can be compared.");

        if (context instanceof HibernateConstraintValidatorContext) {
            context.unwrap(HibernateConstraintValidatorContext.class)
                    .addMessageParameter( "field1", getFieldName(lhs));
            context.unwrap(HibernateConstraintValidatorContext.class)
                    .addMessageParameter( "field2", getFieldName(rhs));
        }

        if(Number.class.isAssignableFrom(lhs.getType()) || byte.class.isAssignableFrom(lhs.getType())
                || short.class.isAssignableFrom(lhs.getType()) || int.class.isAssignableFrom(lhs.getType())
                || long.class.isAssignableFrom(lhs.getType()) || float.class.isAssignableFrom(lhs.getType())
                || double.class.isAssignableFrom(lhs.getType())) {
            long val1 = ((Number) ReflectionUtils.getField(lhs, o)).longValue();
            long val2 = ((Number) ReflectionUtils.getField(rhs, o)).longValue();

            if(ignoreZero && (val1 == 0 || val2 == 0)) {
                return true;
            }

            switch (mode) {
                case EQUAL:
                    return val1 == val2;
                case NOT_EQUAL:
                    return val1 != val2;
                case GT:
                    return val1 > val2;
                case GTE:
                    return val1 >= val2;
                case LT:
                    return val1 < val2;
                case LTE:
                    return val1 <= val2;
            }
        } else if(CharSequence.class.isAssignableFrom(lhs.getType())) {
            Object val1 = ReflectionUtils.getField(lhs, o);
            Object val2 = ReflectionUtils.getField(rhs, o);
            if(val1 == null || val2 == null) {
                return false;
            }

            switch (mode) {
                case EQUAL:
                    return val1.equals(val2);
                case NOT_EQUAL:
                    return !val1.equals(val2);
                default:
                    return false;
            }
        } else if(LocalDate.class.isAssignableFrom(lhs.getType())) {
            LocalDate val1 = (LocalDate) ReflectionUtils.getField(lhs, o);
            LocalDate val2 = (LocalDate) ReflectionUtils.getField(rhs, o);

            switch (mode) {
                case EQUAL:
                    return val1.isEqual(val2);
                case NOT_EQUAL:
                    return !val1.isEqual(val2);
                case GTE:
                    return val1.isEqual(val2) || val1.isAfter(val2);
                case GT:
                    return val1.isAfter(val2);
                case LTE:
                    return val1.isEqual(val2) || val1.isBefore(val2);
                case LT:
                    return val1.isBefore(val2);
            }
        }  else if(LocalDateTime.class.isAssignableFrom(lhs.getType())) {
            LocalDateTime val1 = (LocalDateTime) ReflectionUtils.getField(lhs, o);
            LocalDateTime val2 = (LocalDateTime) ReflectionUtils.getField(rhs, o);

            switch (mode) {
                case EQUAL:
                    return val1.isEqual(val2);
                case NOT_EQUAL:
                    return !val1.isEqual(val2);
                case GTE:
                    return val1.isEqual(val2) || val1.isAfter(val2);
                case GT:
                    return val1.isAfter(val2);
                case LTE:
                    return val1.isEqual(val2) || val1.isBefore(val2);
                case LT:
                    return val1.isBefore(val2);
            }
        }

        return false;
    }

    private String getFieldName(Field field) {
        if(field.isAnnotationPresent(ApiModelProperty.class)) {
            ApiModelProperty property = field.getAnnotation(ApiModelProperty.class);
            if(StringUtils.hasText(property.value())) {
                return property.value();
            } else if(StringUtils.hasText(property.name())) {
                return property.name();
            } else if(StringUtils.hasText(property.notes())) {
                return property.notes();
            }
        }
        return field.getName();
    }

}
