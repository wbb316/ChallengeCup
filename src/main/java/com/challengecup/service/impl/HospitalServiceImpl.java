package com.challengecup.service.impl;

import com.challengecup.mapper.HospitalMapper;
import com.challengecup.pojo.Hospital;
import com.challengecup.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HospitalServiceImpl implements HospitalService {

    @Autowired
    HospitalMapper hospitalMapper;

    /**
     * 查看医院所有预约人
     * @return
     */
    @Override
    public List<Hospital> list() {
        return hospitalMapper.list();
    }

    /**
     * 派且医生上门
     * @param hospital
     * @return
     */
    @Override
    public void update(Hospital hospital) {
        hospital.setUpdateTime(LocalDateTime.now());
        hospitalMapper.update(hospital);
    }
}
