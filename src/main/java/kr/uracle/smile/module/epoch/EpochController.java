package kr.uracle.smile.module.epoch;

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
@RequestMapping("/epoch")
@Slf4j
public class EpochController extends Module {

    @Autowired
    private EpochService epochService;

    /**
     * 걸음수 등록
     */
    @PostMapping(value = "/")
    @ResponseBody
    public ResponseEntity<Response<?>> addEpoch(@RequestBody EpochRequest epochRequest) {
//        logger.info("epochs : {}", epochRequest.toString());
        epochService.addEpoch(epochRequest);

        // 헬스커넥트에 걸음수 데이터 전달(async)
        logger.info("addEpoch healthConnect data send start");
        epochService.hcEpochSendAPI();

        return ResponseEntity.ok(new Response<>(ResponseCode.Ok, getLocalizedString(LocalizedString.OK)));
    }
}
