package kr.uracle.smile.module.temperature;

import kr.uracle.smile.module.common.HCSendAPIStatusCode;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TemperatureMapper {
    int addTemperature(Temperature param);

    int editTempSendCodeFlag();

    int editTempSendCode(HCSendAPIStatusCode param);

    List<Temperature> getHCTemp();
}
