package kr.uracle.smile.support.validator;

import kr.uracle.smile.support.validator.annotation.MultipartFileExtension;
import org.hibernate.validator.constraintvalidation.HibernateConstraintValidatorContext;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 업로드 파일에 대한 확장자 검사
 */
public class MultipartFileExtensionValidator implements ConstraintValidator<MultipartFileExtension, MultipartFile> {
    private List<String> allowedExtensions;

    @Override
    public void initialize(MultipartFileExtension annotation) {
        allowedExtensions = Arrays.stream(annotation.value()).map(String::toLowerCase).collect(Collectors.toList());
    }

    @Override
    public boolean isValid(MultipartFile o, ConstraintValidatorContext context) {
        if(o == null) {
            return true;
        }

        context.unwrap(HibernateConstraintValidatorContext.class)
                .addMessageParameter("extensions", String.join(", ", allowedExtensions));

        String extension = StringUtils.getFilenameExtension(StringUtils.cleanPath(o.getOriginalFilename()));
        return extension != null && allowedExtensions.contains(extension.toLowerCase());
    }
}
