package kr.uracle.smile.module.epoch;

import kr.uracle.smile.module.common.HCSendAPIStatusCode;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface EpochMapper {

    int addEpoch(EpochRequest.Epochs param);

    int editEpochSendCode(HCSendAPIStatusCode param);

    int editEpochSendCodeFlag();

    List<Epoch> getHCEpoch();
}
