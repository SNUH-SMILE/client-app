package kr.uracle.smile.support.validator.annotation;

import kr.uracle.smile.support.validator.HavingValueValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.ReportAsSingleViolation;
import java.lang.annotation.*;

@Documented
@Constraint(
        validatedBy = { HavingValueValidator.class }
)
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@ReportAsSingleViolation
public @interface HavingValue {
    String[] value() default {};
    String message() default "{kr.uracle.ums.support.validator.annotation.HavingValue.message}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
