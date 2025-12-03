package com.challengecup.controller;

import com.challengecup.pojo.Hospital;
import com.challengecup.service.HospitalService;
import com.challengecup.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hospital")
@Slf4j
public class HospitalController {

    @Autowired
    HospitalService hospitalService;

    /**
     * 查看医院所有预约人
     * @return
     */
    @GetMapping
    public Result getAllHospitals() {
        List<Hospital> list= hospitalService.list();
        return Result.success(list);
    }

    /**
     * 派且医生上门
     * @param hospital
     * @return
     */
    @PutMapping
    public Result updateHospital(@RequestBody Hospital hospital) {
        hospitalService.update(hospital);
        return Result.success();
    }
}
