package kr.uracle.smile.support.validator.annotation;

import kr.uracle.smile.support.validator.SafeHtmlType;
import kr.uracle.smile.support.validator.SafeHtmlValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.ReportAsSingleViolation;
import java.lang.annotation.*;

@Documented
@Constraint(
        validatedBy = { SafeHtmlValidator.class }
)
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@ReportAsSingleViolation
public @interface SafeHtml {
    SafeHtmlType value() default SafeHtmlType.SIMPLE_TEXT;
    String message() default "{kr.uracle.ums.support.validator.annotation.SafeHtml.message}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
