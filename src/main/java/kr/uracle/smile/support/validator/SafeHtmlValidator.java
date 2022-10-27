package kr.uracle.smile.support.validator;

import kr.uracle.smile.support.validator.annotation.SafeHtml;
import org.hibernate.validator.constraintvalidation.HibernateConstraintValidatorContext;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class SafeHtmlValidator implements ConstraintValidator<SafeHtml, String> {
    private SafeHtmlType type;

    @Override
    public void initialize(SafeHtml annotation) {
        this.type = annotation.value();
    }

    @Override
    public boolean isValid(String o, ConstraintValidatorContext context) {
        if(o == null) {
            return true;
        }

        if (context instanceof HibernateConstraintValidatorContext) {
            context.unwrap(HibernateConstraintValidatorContext.class)
                    .addExpressionVariable("none", false);
        }

        Safelist safelist;
        switch (type) {
            case SIMPLE_TEXT:
                safelist = Safelist.simpleText();
                break;
            case BASIC:
                safelist = Safelist.basic();
                break;
            case BASIC_WITH_IMAGE:
                safelist = Safelist.basicWithImages();
                break;
            case NONE:
            default:
                if (context instanceof HibernateConstraintValidatorContext) {
                    context.unwrap(HibernateConstraintValidatorContext.class)
                            .addExpressionVariable("none", true);
                }
                safelist = Safelist.none();
        }

        return Jsoup.isValid(o, safelist);
    }
}
