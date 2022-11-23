package kr.uracle.smile.module.pulseox;

import kr.uracle.smile.module.common.HCSendAPIStatusCode;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PulseOxMapper {

    int addPulseOx(PulseOxRequest.PulseOxs param);

    int addPulseOxTimeOffsetValue(PulseOxRequest.PulseOxTimeOffsetSpo2Values param);

    int editPulseOxSendCode(HCSendAPIStatusCode param);

    int editPulseOxSendCodeFlag();

    List<PulseOx> getHCPulseOx();

    List<PulseOxTimeOffsetSpo2Values> getHCPulseOxTimeOffsetSpo2Values(int id);

}
