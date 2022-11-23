package kr.uracle.smile.module.bloodpressure;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BloodPressureMapper {

    int addBloodPressure(BloodPressures.BloodPressure param);
}
