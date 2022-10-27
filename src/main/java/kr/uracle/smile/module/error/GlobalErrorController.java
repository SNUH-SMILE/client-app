package kr.uracle.smile.module.error;

import io.swagger.annotations.Api;
import kr.uracle.smile.protocol.Response;
import kr.uracle.smile.protocol.ResponseCode;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.web.ErrorProperties;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.autoconfigure.web.servlet.error.AbstractErrorController;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.stream.Collectors;

@Api(description = "전역 오류 핸들러", tags = "Error Handler")
@RequestMapping("${server.error.path:${error.path:/error}}")
@Controller
public class GlobalErrorController extends AbstractErrorController {
    private final ErrorProperties errorProperties;


    public GlobalErrorController(ErrorAttributes errorAttributes, ServerProperties serverProperties,
                                 ObjectProvider<ErrorViewResolver> errorViewResolvers) {
        super(errorAttributes, errorViewResolvers.orderedStream().collect(Collectors.toList()));
        this.errorProperties = serverProperties.getError();
    }

    @RequestMapping(produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {
        HttpStatus status = getStatus(request);
        response.setStatus(status.value());
        Map<String, Object> model = getErrorAttributes(request, getErrorAttributeOptions(request));
        model.put("reason", status.getReasonPhrase());
        response.setStatus(status.value());
        ModelAndView modelAndView = resolveErrorView(request, response, status, model);
        return (modelAndView != null) ? modelAndView : new ModelAndView("error", model);
    }

    @RequestMapping
    public ResponseEntity<Response<Map<String, Object>>> error(HttpServletRequest request) {
        Map<String, Object> model = getErrorAttributes(request, getErrorAttributeOptions(request));

        Response<Map<String, Object>> response = new Response<>(ResponseCode.of((Integer) model.get("status")),
                (String) model.get("error"));

        model.remove("status");
        model.remove("error");

        response.setResult(model);
        return ResponseEntity.ok().body(response);
    }

    @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
    public ResponseEntity<String> mediaTypeNotAcceptable(HttpServletRequest request) {
        HttpStatus status = getStatus(request);
        return ResponseEntity.status(status).build();
    }

    protected ErrorAttributeOptions getErrorAttributeOptions(HttpServletRequest request) {
        ErrorAttributeOptions options = ErrorAttributeOptions.defaults();
        if (this.errorProperties.isIncludeException()) {
            options = options.including(ErrorAttributeOptions.Include.EXCEPTION);
        }
        if (isIncludeMessage(request)) {
            options = options.including(ErrorAttributeOptions.Include.MESSAGE);
        }
        return options;
    }


    /**
     * 오류 응답에 오류 메시지 항목 추가 여부
     * @param request HttpServletRequest
     * @return 오류 메시지 포함 여부
     */
    protected boolean isIncludeMessage(HttpServletRequest request) {
        switch (getErrorProperties().getIncludeMessage()) {
            case ALWAYS:
                return true;
            case ON_PARAM:
                return getMessageParameter(request);
            default:
                return false;
        }
    }

    /**
     * Provide access to the error properties.
     * @return the error properties
     */
    protected ErrorProperties getErrorProperties() {
        return this.errorProperties;
    }
}
