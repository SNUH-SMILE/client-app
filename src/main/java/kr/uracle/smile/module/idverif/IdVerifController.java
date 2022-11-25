package kr.uracle.smile.module.idverif;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import kr.uracle.smile.module.Module;
import kr.uracle.smile.protocol.Response;
import kr.uracle.smile.protocol.ResponseCode;
import kr.uracle.smile.support.LocalizedString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

@Api(description = "휴대폰 본인 인증", tags = "Identity Verification")
@RequestMapping("/idverif")
@RestController
@Slf4j
public class IdVerifController extends Module {

    @Value("${identity.verification.cpid}")
    private String cpid;

    @Autowired
    private IdVerifService service;

    public IdVerifController() {
        super();
    }

    @ApiOperation(value = "휴대폰 본인 인증 요청을 위한 인자값 조회")
    @PostMapping("/init")
    public ResponseEntity<Response<IdVerif>> init() throws UnsupportedEncodingException {
        String encReqInfo = service.getEncryptedRequestInfo();
        IdVerif body = new IdVerif(cpid, encReqInfo);

        Response<IdVerif> response = new Response<>(ResponseCode.Ok, getLocalizedString(LocalizedString.OK));
        response.setResult(body);

        logger.info("본인인증 init : {} ", body.toString());
        return ResponseEntity.ok(response);
    }

    @ApiOperation(value = "휴대폰 본인 인증 결과 복호화")
    @PostMapping("/decrypt")
    public ResponseEntity<Response<IdVerifResult>> decrypt(@RequestBody IdVerif param) throws UnsupportedEncodingException {
        IdVerifResult body = service.getDecryptedResult(param.getPriinfo());

        // 화면에 CI/DI를 불필요하게 노출 할 필요가 없을 것으로 생각됨.
        body.setCi(null);
        body.setDi(null);

        Response<IdVerifResult> response = new Response<>(ResponseCode.Ok, getLocalizedString(LocalizedString.OK));
        response.setResult(body);

        logger.info("본인인증 decrypt : {} {}", body.getCode(), param.getPriinfo());
        return ResponseEntity.ok(response);
    }
}
