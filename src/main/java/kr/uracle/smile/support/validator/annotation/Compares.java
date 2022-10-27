package kr.uracle.smile.support.validator.annotation;

import java.lang.annotation.*;

@Documented
@Target({ElementType.TYPE, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Compares {
    Compare[] value() default {};
}
