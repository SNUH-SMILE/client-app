package kr.uracle.smile.module.daily;

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
@RequestMapping("/daily")
@Slf4j
public class DailyController extends Module {

    @Autowired
    private DailyService dailyService;

    /**
     * 심박수 등록
     */
    @PostMapping(value = "/")
    @ResponseBody
    public ResponseEntity<Response<?>> addDaily(@RequestBody DailyRequest dailyRequest) {
//        logger.info("Daily : {} ", dailyRequest);
        dailyService.addDaily(dailyRequest);

        // 헬스커넥트에 산소포화도 데이터 전달(async)
        logger.info("addDaily healthConnect data send start");
        dailyService.hcDailySendAPI();

        return ResponseEntity.ok(new Response<>(ResponseCode.Ok, getLocalizedString(LocalizedString.OK)));
    }
}
