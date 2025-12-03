package com.challengecup.service;

import com.challengecup.pojo.Hospital;

import java.util.List;

public interface HospitalService {
    /**
     * 查看医院所有预约人
     * @return
     */
    List<Hospital> list();

    /**
     * 派且医生上门
     * @param hospital
     * @return
     */
    void update(Hospital hospital);
}
