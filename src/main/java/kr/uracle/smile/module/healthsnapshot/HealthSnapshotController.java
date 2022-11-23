package kr.uracle.smile.module.healthsnapshot;

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
@RequestMapping("/healthSnapshot")
@Slf4j
public class HealthSnapshotController extends Module {

    @Autowired
    private HealthSnapshotService healthSnapshotService;

    /**
     * 심박수 등록
     */
    @PostMapping(value = "/")
    @ResponseBody
    private ResponseEntity<Response<?>> addHealthSnapshot(@RequestBody HealthSnapshots healthSnapshots) {
        logger.info("HealthSnapshots : {}", healthSnapshots.toString());
        healthSnapshotService.addHealthSnapshot(healthSnapshots);
        return ResponseEntity.ok(new Response<>(ResponseCode.Ok, getLocalizedString(LocalizedString.OK)));
    }
}
