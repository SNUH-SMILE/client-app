package kr.uracle.smile.module.respiration;

import kr.uracle.smile.module.Module;
import kr.uracle.smile.protocol.Response;
import kr.uracle.smile.protocol.ResponseCode;
import kr.uracle.smile.support.LocalizedString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/respiration")
@Slf4j
public class RespirationController extends Module {

    @Autowired
    private RespirationService respirationService;

    /**
     * 호흡수 등록
     */
    @PostMapping(value = "/")
    @ResponseBody
    public ResponseEntity<Response<?>> addRespiration(@RequestBody RespirationRequest respirationRequest) {
        logger.info("Respiration : {} ", respirationRequest);
        respirationService.addRespiration(respirationRequest);

        // 헬스커넥트에 호흡수 데이터 전달(async)
        logger.info("addRespiration healthConnect data send start");
        respirationService.hcRespirationSendAPI();

        return ResponseEntity.ok(new Response<>(ResponseCode.Ok, getLocalizedString(LocalizedString.OK)));
    }

}
