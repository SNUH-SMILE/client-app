package kr.uracle.smile.support.validator;

import kr.uracle.smile.support.validator.annotation.HavingValue;
import org.hibernate.validator.constraintvalidation.HibernateConstraintValidatorContext;
import org.springframework.util.CollectionUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.List;

public class HavingValueValidator implements ConstraintValidator<HavingValue, Object> {
    private List<String> values;
    private String allowedValues = "";

    @Override
    public void initialize(HavingValue parameters) {
        values = Arrays.asList(parameters.value());
        if(!CollectionUtils.isEmpty(values)) {
            allowedValues = String.format("'%s'", String.join("','", values));
        }
    }

    @Override
    public boolean isValid(Object o, ConstraintValidatorContext context) {
        if(o == null) {
            return false;
        }

        if (context instanceof HibernateConstraintValidatorContext) {
            context.unwrap(HibernateConstraintValidatorContext.class)
                    .addMessageParameter( "values", allowedValues);
        }

        if(o instanceof Number) {
            return values.stream().anyMatch(String.valueOf(o)::equals);
        } else if(o instanceof CharSequence) {
            return values.stream().anyMatch(o::equals);
        }

        return false;
    }
}
