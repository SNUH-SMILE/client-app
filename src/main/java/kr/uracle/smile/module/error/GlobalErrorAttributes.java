package kr.uracle.smile.module.error;

import com.google.gson.JsonSyntaxException;
import com.google.gson.stream.MalformedJsonException;
import io.swagger.annotations.ApiModelProperty;
import kr.uracle.smile.module.exception.*;
import kr.uracle.smile.support.LocalizedString;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.ClassUtils;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceAware;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Exception 공통 처리
 *
 * @author Minki, Cho
 */
@Slf4j
@Component
public class GlobalErrorAttributes implements MessageSourceAware, ErrorAttributes, HandlerExceptionResolver, Ordered {

    private final static String ERROR_ATTRIBUTE = GlobalErrorAttributes.class.getName() + ".ERROR";

    private MessageSource messageSource;


    @Override
    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        storeErrorAttributes(request, ex);
        return null;
    }

    private void storeErrorAttributes(HttpServletRequest request, Exception ex) {
        request.setAttribute(ERROR_ATTRIBUTE, ex);
    }

    @Override
    public Map<String, Object> getErrorAttributes(WebRequest webRequest, ErrorAttributeOptions options) {
        Map<String, Object> errorAttributes = new LinkedHashMap<>();
        errorAttributes.put("timestamp", LocalDateTime.now());
        addStatus(errorAttributes, webRequest);
        addErrorDetails(errorAttributes, webRequest);

        if (!options.isIncluded(ErrorAttributeOptions.Include.EXCEPTION)) {
            errorAttributes.remove("exception");
        }
        if (!options.isIncluded(ErrorAttributeOptions.Include.MESSAGE) && errorAttributes.get("i18n") != null) {
            errorAttributes.remove("i18n");
        }
        if (!options.isIncluded(ErrorAttributeOptions.Include.BINDING_ERRORS)) {
            errorAttributes.remove("errors");
        }

        return errorAttributes;
    }

    private void addStatus(Map<String, Object> errorAttributes, RequestAttributes requestAttributes) {
        Integer status = getAttribute(requestAttributes, RequestDispatcher.ERROR_STATUS_CODE);
        if (status == null) {
            errorAttributes.put("status", 999);
            errorAttributes.put("error", "None");
            return;
        }
        errorAttributes.put("status", status);
        try {
            errorAttributes.put("error", HttpStatus.valueOf(status).getReasonPhrase());
        } catch (Exception ex) {
            // Unable to obtain a reason
            errorAttributes.put("error", "Http Status " + status);
        }
    }

    private void addErrorDetails(Map<String, Object> errorAttributes, WebRequest webRequest) {
        Throwable error = getError(webRequest);
        if (error != null) {
            while (error instanceof ServletException && error.getCause() != null) {
                error = error.getCause();
            }
            errorAttributes.put("exception", error.getClass().getName());
        }
        addErrorMessage(errorAttributes, webRequest, error);
    }

    private void addErrorMessage(Map<String, Object> errorAttributes, WebRequest webRequest, Throwable error) {
        if (error instanceof AuthenticationCredentialsNotFoundException) { // 로그인 정보를 찾을 수 없는 경우
            errorAttributes.put("status", 401);
            errorAttributes.put("error",
                    messageSource.getMessage(LocalizedString.UNAUTHORIZED, null, LocaleContextHolder.getLocale()));
        } else if (error instanceof AccessDeniedException) { // 요청에 대한 권한이 불충분한 경우
            errorAttributes.put("error",
                    messageSource.getMessage(LocalizedString.ACCESS_DENIED, null, LocaleContextHolder.getLocale()));
        } else if (error instanceof BindException) { // 입력값 검증에 실패한 경우
            errorAttributes.put("error",
                    messageSource.getMessage(LocalizedString.BAD_REQUEST, null, LocaleContextHolder.getLocale()));
            extractBindingResult(errorAttributes, (BindException) error);
        } else if (error instanceof HttpMessageNotReadableException) { // 요청 메시지가 잘못된 경우
            if (error.getCause() != null
                    && (error.getCause() instanceof JsonSyntaxException
                    || error.getCause() instanceof MalformedJsonException)) {
                errorAttributes.put("error",
                        messageSource.getMessage(LocalizedString.MALFORMED_JSON, null, LocaleContextHolder.getLocale()));
            }
        } else if (error instanceof BadRequestException) { // 잘못된 요청 오류
            errorAttributes.put("status", 400);
            errorAttributes.put("error", error.getMessage());
        } else if (error instanceof UnprocessableRequestException) { // 처리할 수 없는 요청
            errorAttributes.put("status", 422);
            if (StringUtils.hasText(error.getMessage())) {
                errorAttributes.put("error", error.getMessage());
            } else {
                errorAttributes.put("error", messageSource.getMessage(
                        LocalizedString.UNPROCESSABLE_REQUEST, null, LocaleContextHolder.getLocale()));
            }
        } else if (error instanceof BlankContainParameterException) { // 공백이 포함된 파라미터값 입력 오류
            errorAttributes.put("status", 400);
            errorAttributes.put("error", messageSource.getMessage(
                    LocalizedString.REQUEST_PARAMETER_BLANK_CONTAIN_FAILED, null, LocaleContextHolder.getLocale()));
            errorAttributes.put("field", error.getMessage());
        } else if (error instanceof AlreadyExistsException) { // 데이터 존재
            errorAttributes.put("status", 422);
            errorAttributes.put("error", error.getMessage());
        } else if (error instanceof NoSuchElementException) { // 요청 데이터 미존재
            errorAttributes.put("status", 423);
            errorAttributes.put("error", error.getMessage());
        } else if (error instanceof Exception) { // 분류되지 않은 모든 오류에 대한 처리
            errorAttributes.put("status", 500);
            errorAttributes.put("error", messageSource.getMessage(
                    LocalizedString.SERVER_ERROR, null, LocaleContextHolder.getLocale()));
        }

        // Exception Message 항목 추가
        addExceptionErrorMessage(errorAttributes, webRequest, error);
    }

    /**
     * 에러 메시지 처리
     *
     * @param errorAttributes 에러 응답 객체
     * @param webRequest      요청 정보
     * @param error           에러 객체
     */
    private void addExceptionErrorMessage(Map<String, Object> errorAttributes, WebRequest webRequest, Throwable error) {
        errorAttributes.put("message", getMessage(webRequest, error));
    }

    protected String getMessage(WebRequest webRequest, Throwable error) {
        Object message = getAttribute(webRequest, RequestDispatcher.ERROR_MESSAGE);
        if (!ObjectUtils.isEmpty(message)) {
            return message.toString();
        }
        if (error != null && StringUtils.hasLength(error.getMessage())) {
            return error.getMessage();
        }
        return "No message available";
    }

    /**
     * 입력 값 검증에 실패했을 경우 발생하는 오류에 대한 처리
     *
     * @param error 입력 값 검증 오류 에러 객체
     * @return
     */
    private void extractBindingResult(Map<String, Object> errorAttributes, BindException error) {
        List<ObjectError> errors = error.getBindingResult().getAllErrors();
        List<ArgumentNotValidError> argumentNotValidErrors = new ArrayList<>();

        Class<?> parameterClass = Objects.requireNonNull(error.getTarget()).getClass();
        String prefix = parameterClass.getSimpleName()
                .replaceAll("Controller|Request", "")
                .replaceAll("([A-Z]+)", "\\.$1")
                .replaceAll("^\\.", "")
                .replaceAll("([^\\.]{1})$", "$1\\.")
                .toLowerCase();

        errors.stream().forEach(err -> {
            if (err instanceof FieldError) {

                String fieldCode = this.getFieldCode(((FieldError) err).getField());
                String messageCode = this.getMessageCode(((FieldError) err).getField());

                String fieldName = messageSource.getMessage(prefix + messageCode,
                        null, "", LocaleContextHolder.getLocale());
                if (!StringUtils.hasText(fieldName)) {
                    fieldName = messageSource.getMessage(messageCode,
                            null, "", LocaleContextHolder.getLocale());
                }

                // MessageSource에 정의된 필드명이 없는 경우 Swagger Annotation의 설명 조회
                if (!StringUtils.hasText(fieldName)) {
                    try {
                        List<String> fields = getFields(((FieldError) err).getField(), true);
                        Field field = null;
                        messageCode = "";
                        Pattern pattern = Pattern.compile("([^\\[]+)(\\[([^\\]]+)\\])?");
                        for (String f : fields) {
                            Matcher m = pattern.matcher(f);
                            if(m.find()) {
                                if (field != null) {
                                    if (List.class.isAssignableFrom(field.getType())
                                            && field.getGenericType() instanceof ParameterizedType) {
                                        Class<?> clazz = ClassUtils.getClass(((ParameterizedType) field.getGenericType())
                                                .getActualTypeArguments()[0].getTypeName());
                                        messageCode += clazz.getSimpleName().toLowerCase();
                                        field = ReflectionUtils.findField(clazz, m.group(1));
                                        messageCode += "." + field.getName();
                                    } else {
                                        field = ReflectionUtils.findField(field.getType(), m.group(1));
                                        messageCode += "." + field.getName();
                                    }
                                } else {
                                    field = ReflectionUtils.findField(parameterClass, m.group(1));
                                }

                                if(StringUtils.hasText(messageCode) && StringUtils.hasText(m.group(3))) {
                                    messageCode += "." + m.group(3).replaceAll("\\$", "");
                                }
                            }
                        }

                        fieldName = messageSource.getMessage(messageCode,
                                null, "", LocaleContextHolder.getLocale());

                        if (!StringUtils.hasText(fieldName)
                                && field != null && field.isAnnotationPresent(ApiModelProperty.class)) {
                            ApiModelProperty annotation = field.getAnnotation(ApiModelProperty.class);
                            if (StringUtils.hasText(annotation.value())) {
                                fieldName = annotation.value();
                            } else if (StringUtils.hasText(annotation.name())) {
                                fieldName = annotation.name();
                            } else if (StringUtils.hasText(annotation.notes())) {
                                fieldName = annotation.value();
                            }
                        }

                        if(!StringUtils.hasText(fieldName)) {
                            fieldName = fieldCode;
                        }
                    } catch (Exception e) {
                        fieldName = fieldCode;
                    }
                }
                String message = String.format("%s은(는) " + err.getDefaultMessage(), fieldName);

                // 한글의 경우 메시지에 격조사가 포함되어 있는 경우 알맞은 글자로 치환
                if (LocaleContextHolder.getLocale().equals(Locale.KOREAN)) {
                    Pattern pattern = Pattern.compile("([가-힣]{1})\\(([가-힣]{1})\\)");
                    Matcher m = pattern.matcher(message);
                    if (m.find()) {
                        message = m.replaceFirst(getPostposition(message.substring(0, m.start()), m.group(1), m.group(2)));
                    }
                }

                argumentNotValidErrors.add(new ArgumentNotValidError(fieldCode, fieldName, message));
            } else {
                argumentNotValidErrors.add(new ArgumentNotValidError(null, null, err.getDefaultMessage()));
            }
        });

        errorAttributes.put("fields", argumentNotValidErrors);
    }

    @Override
    public Throwable getError(WebRequest webRequest) {
        Throwable exception = getAttribute(webRequest, ERROR_ATTRIBUTE);
        if (exception == null) {
            exception = getAttribute(webRequest, RequestDispatcher.ERROR_EXCEPTION);
        }

        webRequest.setAttribute(ErrorAttributes.ERROR_ATTRIBUTE, exception, WebRequest.SCOPE_REQUEST);
        return exception;
    }

    @SuppressWarnings("unchecked")
    private <T> T getAttribute(RequestAttributes requestAttributes, String name) {
        return (T) requestAttributes.getAttribute(name, RequestAttributes.SCOPE_REQUEST);
    }

    private final Pattern fieldPattern = Pattern.compile("([^\\[]+)(\\[(([0-9]+)|([^\\$]+)?(\\$[^\\]]+)?)\\]\\.?(.+)?)?");

    private List<String> getFields(String field, boolean hasPrefix) {
        Matcher m = fieldPattern.matcher(field);
        List<String> result = new ArrayList<>();
        if(m.find()) {
            String[] vars = m.group(1).split("\\.");
            if (StringUtils.hasText(m.group(2)) && !StringUtils.hasText(m.group(4))) {
                String prefix = StringUtils.trimTrailingCharacter(m.group(5), '.');
                String key = StringUtils.trimLeadingCharacter(m.group(6), '$');

                if(hasPrefix && StringUtils.hasText(key)) {
                    prefix += "." + key;
                }

                for (int i = 0; i < vars.length; i++) {
                    if (i == (vars.length - 1)) {
                        if(hasPrefix) {
                            result.add(vars[i] + "[" + prefix + "]");
                        } else {
                            result.add(vars[i] + "[" + (StringUtils.hasText(key) ? key : prefix) + "]");
                        }
                    } else {
                        result.add(vars[i]);
                    }
                }
            } else if(StringUtils.hasText(m.group(2)) && StringUtils.hasText(m.group(4))) {
                for (int i = 0; i < vars.length; i++) {
                    if (i == (vars.length - 1)) {
                        result.add(vars[i] + "[" + m.group(4) + "]");
                    } else {
                        result.add(vars[i]);
                    }
                }
            } else {
                result.addAll(Arrays.asList(m.group(1).split("\\.")));
            }
            if (StringUtils.hasText(m.group(7))) { // postfix
                result.addAll(getFields(m.group(7), hasPrefix));
            }
        }
        return result;
    }

    private String getFieldCode(String field) {
        return String.join(".", getFields(field, false));
    }

    private String getMessageCode(String field) {
        return getFields(field, true).stream().map(f -> f.replaceAll("\\[[0-9]+\\]", ""))
                .map(f -> f.replaceAll("\\[", ".").replaceAll("\\]", ""))
                .collect(Collectors.joining("."));
    }

    /**
     * 단어에 따른 격조사 선택 처리
     *
     * @param word    대상 단어
     * @param caseOne 조사 1
     * @param caseTwo 조사 2
     * @return 조사
     */
    private String getPostposition(String word, String caseOne, String caseTwo) {
        char lastChar = word.charAt(word.length() - 1);
        if (lastChar < 0xAC00 || lastChar > 0xD7A3) {
            return String.format("%s(%s)", caseOne, caseTwo);
        }

        return (((lastChar - 0xAC00) % 28) > 0 ? caseOne : caseTwo);
    }

    /**
     * 입력값 오류에 대한 결과 리턴
     */
    public class ArgumentNotValidError {
        private final String field;
        private final String fieldName;
        private final String message;

        public ArgumentNotValidError(String field, String fieldName, String message) {
            this.field = field;
            this.fieldName = fieldName;
            this.message = message;
        }

        public String getField() {
            return field;
        }

        public String getFieldName() {
            return fieldName;
        }

        public String getMessage() {
            return message;
        }

        @Override
        public String toString() {
            return "ArgumentNotValidError{" +
                    "field='" + field + '\'' +
                    ", fieldName='" + fieldName + '\'' +
                    ", message='" + message + '\'' +
                    '}';
        }
    }
}
