package kr.uracle.smile.module.idverif;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@ApiModel(description = "휴대폰 본인인증 처리 결과")
@Getter
@Setter
public class IdVerifResult {
    public enum SEX { M, F }
    public enum NATION { C, F }

    @ApiModelProperty(value = "결과 코드 (00: 성공, 16: 시도 횟수 초과, 80: 인증시간 초과)", position = 0)
    private String code;
    @ApiModelProperty(value = "오류 메시지", position = 1)
    private String message = "";
    @ApiModelProperty(value = "통신사로부터 응답받은 CI 정보", position = 2)
    private String ci;
    @ApiModelProperty(value = "통신사로부터 응답받은 DI 정보", position = 3)
    private String di;
    @ApiModelProperty(value = "휴대폰 번호", position = 4)
    private String phone;
    @ApiModelProperty(value = "통신사", position = 5)
    private String provider;
    @ApiModelProperty(value = "생년월일", position = 6)
    private String birth;
    @ApiModelProperty(value = "성별 (M: 남자, F: 여자)", position = 7)
    private SEX sex;
    @ApiModelProperty(value = "내외국인 (C: 내국인, F: 외국인)", position = 8)
    private NATION nation;
    @ApiModelProperty(value = "성명", position = 9)
    private String name;
    @ApiModelProperty(value = "요청번호", position = 10)
    private String requestNum;
    @ApiModelProperty(value = "요청일시", position = 11)
    private String datetime;

    public IdVerifResult() {
    }
}
