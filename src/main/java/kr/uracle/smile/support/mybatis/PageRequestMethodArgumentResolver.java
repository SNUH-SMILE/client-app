package kr.uracle.smile.support.mybatis;

import kr.uracle.smile.config.SMILEProperties;
import kr.uracle.smile.config.SMILEProperties.PaginationProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.ServletRequestParameterPropertyValues;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import javax.servlet.http.HttpServletRequest;
import java.util.Objects;

/**
 * 페이징 요청에 대한 HandlerMethodArgumentResolver
 *
 * @author Minki,Cho
 */
@Slf4j
@Component
public class PageRequestMethodArgumentResolver implements HandlerMethodArgumentResolver {

    // 페이지 설정 적용
    private final PaginationProperties properties;


    /**
     * 생성자
     * @param properties UMS 설정
     */
    public PageRequestMethodArgumentResolver(SMILEProperties properties) {
        this.properties = properties.getPagination();
    }

    /**
     * 파라메터 유형이 PageRequest 인 경우만 지원
     *
     * @param parameter 파라메터
     * @return PageRequest 형식인 경우 true, 그 외 false
     */
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return PageRequest.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest request, WebDataBinderFactory binderFactory) throws Exception {
        PageRequest pageRequest = (PageRequest) parameter.getParameterType().newInstance();
        MutablePropertyValues pvs = new ServletRequestParameterPropertyValues(
                Objects.requireNonNull(request.getNativeRequest(HttpServletRequest.class)));

        // HttpServletRequest를 통해 전달받은 파라메터 값을 객체에 바인딩
        WebDataBinder binder = binderFactory.createBinder(request, pageRequest, parameter.getParameterName());
        binder.bind(pvs);

        // 목록 및 페이지 크기가 별도로 설정되지 않은 경우 설정값 적용
        if(!pvs.contains("size")) {
            pageRequest.setSize(properties.getList());
        }
        pageRequest.setPaginationSize(properties.getPage());

        return pageRequest;
    }
}
