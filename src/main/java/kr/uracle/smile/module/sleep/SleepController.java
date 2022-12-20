package kr.uracle.smile.module.sleep;

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
@RequestMapping("/sleep")
@Slf4j
public class SleepController extends Module {

    @Autowired
    private SleepService sleepService;

    /**
     * 수면 상태 등록
     */
    @PostMapping(value = "/")
    @ResponseBody
    public ResponseEntity<Response<?>> addSleep(@RequestBody SleepRequest sleepRequest) {
//        logger.info("Sleep : {}", sleepRequest.toString());
        sleepService.addSleep(sleepRequest);

        // 헬스커넥트에 수면 데이터 전달(async)
        logger.info("addSleep healthConnect data send start");
        sleepService.hcSleepSendAPI();

        return ResponseEntity.ok(new Response<>(ResponseCode.Ok, getLocalizedString(LocalizedString.OK)));
    }
}
