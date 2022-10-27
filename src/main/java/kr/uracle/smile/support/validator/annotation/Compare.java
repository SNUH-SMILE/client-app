package kr.uracle.smile.support.validator.annotation;

import kr.uracle.smile.support.validator.CompareValidator;
import kr.uracle.smile.support.validator.ComparisonMode;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.ReportAsSingleViolation;
import java.lang.annotation.*;

@Documented
@Constraint(
        validatedBy = { CompareValidator.class }
)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@ReportAsSingleViolation
public @interface Compare {
    String[] value() default {};
    ComparisonMode mode() default ComparisonMode.EQUAL;
    boolean ignoreZero() default false;
    String message() default "{kr.uracle.ums.support.validator.annotation.Compare.message}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
