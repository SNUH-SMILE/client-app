package kr.uracle.smile.module.bloodpressure;

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
@RequestMapping("/bloodPressure")
@Slf4j
public class BloodPressureController extends Module {

    @Autowired
    private BloodPressureService bloodPressureService;

    /**
     * 혈압 등록
     */
    @PostMapping(value = "/")
    @ResponseBody
    public ResponseEntity<Response<?>> addBloodPressure(@RequestBody BloodPressures bloodPressures) {
        logger.info("bloodPressures : {}", bloodPressures.toString());
        bloodPressureService.addBloodPressure(bloodPressures);
        return ResponseEntity.ok(new Response<>(ResponseCode.Ok, getLocalizedString(LocalizedString.OK)));
    }
}
