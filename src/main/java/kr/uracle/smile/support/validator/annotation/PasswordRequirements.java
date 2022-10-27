package kr.uracle.smile.support.validator.annotation;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.ReportAsSingleViolation;
import java.lang.annotation.*;

@Documented
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@ReportAsSingleViolation
public @interface PasswordRequirements {
    String message() default "{kr.uracle.smile.support.validator.annotation.PasswordRequirements.message}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
