package kr.uracle.smile.module.test;

import io.swagger.annotations.Api;
import kr.uracle.smile.module.Module;
import kr.uracle.smile.module.authority.Authority;
import kr.uracle.smile.protocol.Response;
import kr.uracle.smile.protocol.ResponseCode;
import kr.uracle.smile.support.LocalizedString;
import lombok.extern.slf4j.Slf4j;
import lombok.extern.slf4j.XSlf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@Slf4j
@Api(description = "테스트", tags = "Test API")
@Controller
public class TestController extends Module {

    @Secured({Authority.ROLE_ADMIN})
    @PostMapping("/test/list")
    public ResponseEntity<Response<String>> getTestList( @RequestBody Map<String, Object> params){

        logger.info("[TestController] getTestList() CALL ============= params : {}", params.toString());

        Response<String> response = new Response<>(ResponseCode.Ok, getLocalizedString(LocalizedString.OK));
        response.setResult("SUCCESS");

        return ResponseEntity.ok(response);
    }

}



