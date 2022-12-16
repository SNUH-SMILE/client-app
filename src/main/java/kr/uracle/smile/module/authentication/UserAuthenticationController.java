package kr.uracle.smile.module.authentication;

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
@RequestMapping("/user")
@Slf4j
public class UserAuthenticationController extends Module {

    @Autowired
    private UserAuthenticationService userService;

    @PostMapping(value = "/delete")
    @ResponseBody
    public ResponseEntity<Response<?>> deleteUser(@RequestBody UserRequest.Delete request) {

        userService.deleteUser(request);
        return ResponseEntity.ok(new Response<>(ResponseCode.Ok, getLocalizedString(LocalizedString.OK)));
    }

    @PostMapping(value = "/seers/add")
    @ResponseBody
    public ResponseEntity<Response<?>> addSeers(@RequestBody UserRequest.addSeers request) {

        userService.addSeers(request);
        return ResponseEntity.ok(new Response<>(ResponseCode.Ok, getLocalizedString(LocalizedString.OK)));
    }
}
