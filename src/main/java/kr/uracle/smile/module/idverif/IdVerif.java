package kr.uracle.smile.module.idverif;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;

@ApiModel(value = "본인인증 요청 인자값")
@Getter
public class IdVerif {
    @ApiModelProperty(value = "회원사ID (cpid)", position = 0, readOnly = true)
    private String cpid;

    @ApiModelProperty(value = "요청정보 암호화 값 (req_info)", position = 1, readOnly = true)
    private String encryptedRequestInfo;

    @ApiModelProperty(value = "암호화 된 본인인증 결과값")
    private String priinfo;

    public IdVerif() {
    }

    public IdVerif(String cpid, String encryptedRequestInfo) {
        this.cpid = cpid;
        this.encryptedRequestInfo = encryptedRequestInfo;
    }
}
