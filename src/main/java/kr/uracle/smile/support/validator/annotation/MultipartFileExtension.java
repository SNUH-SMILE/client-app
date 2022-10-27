package kr.uracle.smile.support.validator.annotation;

import kr.uracle.smile.support.validator.MultipartFileExtensionValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.ReportAsSingleViolation;
import java.lang.annotation.*;

@Documented
@Constraint(
        validatedBy = { MultipartFileExtensionValidator.class }
)
@Target({ElementType.TYPE_USE, ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@ReportAsSingleViolation
public @interface MultipartFileExtension {
    String[] value() default {};
    String message() default "{kr.uracle.ums.support.validator.annotation.MultipartFileExtension.message}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
