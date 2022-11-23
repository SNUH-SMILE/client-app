package kr.uracle.smile.module.backfill;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Api(description = "backfill", tags = "backfill")
@Controller
@RequestMapping("/backfill")
@Slf4j
public class BackfillController {

    @Value("${health.url.epoch}")
    private String epochBackfillURL;

    @Value("${health.url.pulseOx}")
    private String pulseOxBackfillURL;

    @Value("${health.url.daily}")
    private String dailyBackfillURL;

    @Value("${health.url.sleep}")
    private String sleepBackfillURL;

    @Value("${health.url.respiration}")
    private String respirationBackfillURL;
    @Autowired
    private BackfillService backfillService;

    @ApiOperation(value = "심박수")
    @PostMapping(value = "/daily")
    @ResponseBody
    public ResponseEntity<String> getDailyBackfill(@RequestBody Backfill backfill) {
        logger.info("getDailyBackfill : {}", backfill.toString());
        return backfillService.getBackfill(this.dailyBackfillURL, backfill);
    }

    @ApiOperation(value = "산소포화도")
    @PostMapping(value = "/pulseOx")
    @ResponseBody
    public ResponseEntity<String> getPulseOxBackfill(@RequestBody Backfill backfill) {
        logger.info("getPulseOxBackfill : {}", backfill.toString());
        return backfillService.getBackfill(this.pulseOxBackfillURL, backfill);
    }

    @ApiOperation(value = "수면")
    @PostMapping(value = "/sleep")
    @ResponseBody
    public ResponseEntity<String> getSleepBackfill(@RequestBody Backfill backfill) {
        logger.info("getSleepBackfill : {}", backfill.toString());
        return backfillService.getBackfill(this.sleepBackfillURL, backfill);
    }

    @ApiOperation(value = "걸음수")
    @PostMapping(value = "/epoch")
    @ResponseBody
    public ResponseEntity<String> getEpochBackfill(@RequestBody Backfill backfill) {
        logger.info("getEpochBackfill : {}", backfill.toString());
        return backfillService.getBackfill(this.epochBackfillURL, backfill);
    }

    @ApiOperation(value = "호흡수")
    @PostMapping(value = "/respiration")
    @ResponseBody
    public ResponseEntity<String> getRespirationBackfill(@RequestBody Backfill backfill) {
        logger.info("getRespirationBackfill : {}", backfill.toString());
        return backfillService.getBackfill(this.respirationBackfillURL, backfill);
    }

}
