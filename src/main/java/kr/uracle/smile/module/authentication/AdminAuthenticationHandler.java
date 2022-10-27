package kr.uracle.smile.module.authentication;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import kr.morpheus.framework.security.AbstractAuthenticationHandler;
import kr.morpheus.framework.support.gson.CaseInsensitiveEnumTypeAdapter;
import kr.morpheus.framework.support.gson.SerializationExclusionStrategy;
import kr.uracle.smile.config.SMILEProperties;
import kr.uracle.smile.SMILEAttributes;
import kr.uracle.smile.config.SMILEProperties;
import kr.uracle.smile.module.authentication.Admin;
import kr.uracle.smile.module.authentication.AdminService;

import kr.uracle.smile.protocol.Response;
import kr.uracle.smile.protocol.ResponseCode;
import kr.uracle.smile.support.LocalizedString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

/**
 * 로그인, 로그아웃 및 인증 성공/실패 후 처리 핸들러
 */
@Slf4j
@Component
public class AdminAuthenticationHandler extends AbstractAuthenticationHandler {

    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Autowired(required = true)
    private MessageSource messageSource;

    @Autowired
    private AdminService adminService;


    private SMILEProperties properties;

    // 사용자 IP 조회 시 사용되는 헤더 목록
    private List<String> headers = Arrays.asList("X-Forwarded-For", "Proxy-Client-IP", "WL-Proxy-Client-IP",
            "HTTP_X_FORWARDED_FOR", "HTTP_X_FORWARDED", "HTTP_X_CLUSTER_CLIENT_IP", "HTTP_CLIENT_IP",
            "HTTP_FORWARDED_FOR", "HTTP_FORWARDED", "HTTP_VIA", "REMOTE_ADDR");

    /**
     * 기본 생성자
     */
    public AdminAuthenticationHandler(SMILEProperties smileProperties) {
        this.properties = smileProperties;

        if (StringUtils.hasText(smileProperties.getAdmin().getRemoteIpHeader())) {
            headers.clear();
            headers.add(smileProperties.getAdmin().getRemoteIpHeader());
        }
    }

    /**
     * 로그인 성공 시 처리
     *
     * @param request
     * @param response
     * @param authentication
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void onAuthenticationSuccessPostProcess(HttpServletRequest request, HttpServletResponse response,
                                                   Authentication authentication) throws IOException, ServletException {
        Response<AdminAuthenication> body;
        HttpSession session = request.getSession(true);
        Admin admin = (Admin) authentication.getPrincipal();
        logger.debug("로그인에 성공 하였습니다. ADMIN : [{}]", admin.toString());

        body = new Response<>(ResponseCode.Ok, messageSource.getMessage(LocalizedString.OK, null, request.getLocale()));
        body.setResult( new AdminAuthenication(admin.getUsername(), admin.getName(), admin.getAuthorities()) );
        responseToJson( response, body );
    }

    /**
     * 인증 실패 시 처리
     *
     * @param request
     * @param response
     * @param e
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void onAuthenticationFailurePostProcess(HttpServletRequest request, HttpServletResponse response,
                                                   AuthenticationException e) throws IOException, ServletException {
        if (e instanceof CredentialsExpiredException) { // 비밀번호 만료
            redirectStrategy.sendRedirect(request, response, "/pwchange?username="+request.getParameter("username"));
        } else if (e instanceof DisabledException) { // 비활성 사용자 (USE_YN = N)
            logger.debug("비활성화 된 계정");
        } else if (e instanceof BadCredentialsException) {
            logger.debug("비밀번호 불일치");
        } else {
            logger.debug("Sign-in Exception: [{}]", e.getClass().getSimpleName());
            throw e;
        }
    }

    /**
     * 로그아웃 성공 시 처리
     *
     * @param request
     * @param response
     * @param authentication
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void onLogoutSuccessPostProcess(HttpServletRequest request, HttpServletResponse response,
                                           Authentication authentication) throws IOException, ServletException {

        logger.info("로그아웃 완료");
    }

    private Gson gson = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd HH:mm:ss")
            .enableComplexMapKeySerialization()
            .registerTypeAdapterFactory(new CaseInsensitiveEnumTypeAdapter())
            .addSerializationExclusionStrategy(new SerializationExclusionStrategy())
            .create();

    private void responseToJson(HttpServletResponse response, Response<?> body) throws IOException{
        String jsonString = gson.toJson(body);

        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);

        PrintWriter out = response.getWriter();
        out.print(jsonString);
        out.flush();
    }

}
