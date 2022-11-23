package kr.uracle.smile.module.healthsnapshot;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface HealthSnapshotMapper {

    int addHealthSnapshot(HealthSnapshots.HealthSnapshot param);
    int addHealthSnapshotSummary(HealthSnapshots.HealthSnapshotSummary param);
    int addHealthSnapshotSummaryEpoch(HealthSnapshots.HealthSnapshotSummaryEpoch param);
}
