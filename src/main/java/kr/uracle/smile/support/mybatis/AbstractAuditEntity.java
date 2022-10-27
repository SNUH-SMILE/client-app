package kr.uracle.smile.support.mybatis;

import io.swagger.annotations.ApiModelProperty;

import java.time.LocalDateTime;

public abstract class AbstractAuditEntity {
    @ApiModelProperty(notes = "등록자 아이디", readOnly = true, position = 90)
    protected String regId;

    @ApiModelProperty(notes = "등록자 이름", readOnly = true, position = 91)
    protected String regName;

    @ApiModelProperty(notes = "등록일", readOnly = true, position = 92)
    protected LocalDateTime regDate;

    @ApiModelProperty(notes = "수정자 아이디", readOnly = true, position = 93)
    protected String modId;

    @ApiModelProperty(notes = "수정자 이름", readOnly = true, position = 94)
    protected String modName;

    @ApiModelProperty(notes = "수정일", readOnly = true, position = 95)
    protected LocalDateTime modDate;


    public String getRegId() {
        return regId;
    }

    public void setRegId(String regId) {
        this.regId = regId;
    }

    public String getRegName() {
        return regName;
    }

    public void setRegName(String regName) {
        this.regName = regName;
    }

    public LocalDateTime getRegDate() {
        return regDate;
    }

    public void setRegDate(LocalDateTime regDate) {
        this.regDate = regDate;
    }

    public String getModId() {
        return modId;
    }

    public void setModId(String modId) {
        this.modId = modId;
    }

    public String getModName() {
        return modName;
    }

    public void setModName(String modName) {
        this.modName = modName;
    }

    public LocalDateTime getModDate() {
        return modDate;
    }

    public void setModDate(LocalDateTime modDate) {
        this.modDate = modDate;
    }
}
