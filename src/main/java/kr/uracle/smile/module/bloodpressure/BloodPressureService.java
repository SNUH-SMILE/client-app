package kr.uracle.smile.module.bloodpressure;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BloodPressureService {

    @Autowired
    private BloodPressureMapper bloodPressureMapper;

    @Transactional
    public void addBloodPressure(BloodPressures bloodPressures) {
        for (BloodPressures.BloodPressure bloodPressure : bloodPressures.getBloodPressures()) {
            bloodPressureMapper.addBloodPressure(bloodPressure);
        }
    }
}
