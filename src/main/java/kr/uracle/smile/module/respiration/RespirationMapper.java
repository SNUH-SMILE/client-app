package kr.uracle.smile.module.respiration;

import kr.uracle.smile.module.common.HCSendAPIStatusCode;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface RespirationMapper {

    int addRespiration(RespirationRequest.Respirations param);

    int addTimeOffsetEpochToBreaths(RespirationRequest.TimeOffsetEpochToBreaths param);

    int editRespirationSendCode(HCSendAPIStatusCode param);

    int editRespirationSendCodeFlag();

    List<Respiration> getHCRespiration();

    List<RespirationBreaths> getHCRespirationBreaths(int id);

}
