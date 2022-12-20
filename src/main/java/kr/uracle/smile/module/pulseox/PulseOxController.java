package kr.uracle.smile.module.pulseox;

import kr.uracle.smile.module.Module;
import kr.uracle.smile.protocol.Response;
import kr.uracle.smile.protocol.ResponseCode;
import kr.uracle.smile.support.LocalizedString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/pulseOx")
@Slf4j
public class PulseOxController extends Module {

    @Autowired
    private PulseOxService pulseOxService;

    /**
     * 산소포화도 등록
     */
    @PostMapping(value = "/")
    @ResponseBody
    public ResponseEntity<Response<?>> addPulseOx(@RequestBody PulseOxRequest pulseOxRequest) {
//        logger.info("pulseOxs : {}", pulseOxRequest.toString());
        pulseOxService.addPulseOx(pulseOxRequest);

        // 헬스커넥트에 산소포화도 데이터 전달(async)
        logger.info("addPulseOx healthConnect data send start");
        pulseOxService.hcPulseOxSendAPI();

        return ResponseEntity.ok(new Response<>(ResponseCode.Ok, getLocalizedString(LocalizedString.OK)));
    }
}
