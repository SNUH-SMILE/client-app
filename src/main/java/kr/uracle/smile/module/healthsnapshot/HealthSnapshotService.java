package kr.uracle.smile.module.healthsnapshot;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class HealthSnapshotService {

    @Autowired
    private HealthSnapshotMapper healthSnapshotMapper;

    @Transactional
    public void addHealthSnapshot(HealthSnapshots healthSnapshots) {
        for (HealthSnapshots.HealthSnapshot snapshot : healthSnapshots.getHealthSnapshots()) {
            healthSnapshotMapper.addHealthSnapshot(snapshot);

            int snapshotId = snapshot.getId();
            addHealthSnapshotSummary(snapshotId, snapshot.getSummaries());
        }
    }

    public void addHealthSnapshotSummary(int snapshotId, List<HealthSnapshots.HealthSnapshotSummary> summaries) {
        for ( HealthSnapshots.HealthSnapshotSummary snapshotSummary : summaries ) {
            snapshotSummary.setSnapshotId(snapshotId);

            healthSnapshotMapper.addHealthSnapshotSummary(snapshotSummary);
            for (String key : snapshotSummary.getEpochSummaries().keySet()) {
                HealthSnapshots.HealthSnapshotSummaryEpoch summaryEpoch = new HealthSnapshots.HealthSnapshotSummaryEpoch();
                summaryEpoch.setId(snapshotSummary.getId());
                summaryEpoch.setEpochSummariesKey(key);
                summaryEpoch.setEpochSummariesValue(snapshotSummary.getEpochSummaries().get(key));

                healthSnapshotMapper.addHealthSnapshotSummaryEpoch(summaryEpoch);
            }
        }
    }
}
