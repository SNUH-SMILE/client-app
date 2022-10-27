package kr.uracle.smile.module;

import kr.uracle.smile.module.storage.StorageService;
import kr.uracle.smile.config.SMILEProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceAware;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.SmartValidator;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

/**
 * 모듈 개발 시 공통 구현을 위한 기초 클래스
 * @author Minki,Cho
 */
public abstract class Module implements MessageSourceAware {
    @Qualifier("defaultValidator")
    @Autowired
    private SmartValidator validator;

    @Autowired
    private SMILEProperties properties;

    private MessageSource messageSource;

    @Autowired
    private StorageService storageService;


    public Module() {
    }

    @Override
    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * 스토리지 서비스 반환
     * @return 스토리지 리졸버
     */
    public StorageService getStorageService() {
        return storageService;
    }

    /**
     * 지정된 리소스 위치에 대한 리소스 핸들을 반환
     * @param location 리소스 경로
     * @return Resource
     */
    public Resource getResource(String location) {
        return storageService.getResource(location);
    }

    /**
     * 지정된 리소스 위치에 대한 임시 폴더 리소스 핸들을 반환
     * @param location 리소스 경로
     * @return Resource
     */
    public Resource getResourceFromTemp(String location) {
        return storageService.getResourceFromTemp(location);
    }

    /**
     * MessageSource에 정의 된 메시지를 반환
     * @param code 메시지 코드
     * @return 메시지 문자열
     */
    public String getLocalizedString(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    /**
     * MessageSource에 정의 된 메시지를 반환
     * @param code 메시지 코드
     * @param defaultString 기본 메시지 문자열
     * @return 메시지 문자열
     */
    public String getLocalizedString(String code, String defaultString) {
        return getLocalizedString(code, null, defaultString);
    }

    /**
     * MessageSource에 정의 된 메시지를 반환
     * @param code 메시지 코드
     * @param args 메시지 인자 값
     * @return 메시지 문자열
     */
    public String getLocalizedString(String code, Object...args) {
        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }

    /**
     * MessageSource에 정의 된 메시지를 반환
     * @param code 메시지 코드
     * @param args 메시지 인자 값
     * @param defaultString 기본 메시지 문자열
     * @return 메시지 문자열
     */
    public String getLocalizedString(String code, Object[] args, String defaultString) {
        return messageSource.getMessage(code, args, defaultString, LocaleContextHolder.getLocale());
    }

    /**
     * List 형식의 파라메터를 검증
     * @param target 검증 대상
     * @param hint 검증 그룹 힌트
     * @throws MethodArgumentNotValidException
     */
    public void validate(List<?> target, Object ...hint) throws MethodArgumentNotValidException {
        for(Object param: target) {
            BindingResult errors = new BeanPropertyBindingResult(param, target.getClass().getName());

            validator.validate(param, errors, hint);
            if(errors.hasErrors()) {
                throw new MethodArgumentNotValidException(
                        new MethodParameter(new Object(){}.getClass().getEnclosingMethod(), 0),
                        errors);
            }
        }
    }

    public static String getUrl() {
        return null;
    }
}
