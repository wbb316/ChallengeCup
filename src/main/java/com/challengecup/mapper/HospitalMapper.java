package com.challengecup.mapper;

import com.challengecup.pojo.Hospital;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface HospitalMapper {


    /**
     * 查看医院所有预约人
     * @return
     */
    @Select("select * from appointments order by appointment_datetime")
    public List<Hospital> list();

    /**
     * 派且医生上门
     * @param hospital
     * @return
     */
    @Update("update appointments set doctor=#{doctor},update_time=#{updateTime} where name=#{name}")
    void update(Hospital hospital);

    /**
     * 删除预约申请
     * @param hospital
     * @return
     */
    @Delete("delete from appointments where name=#{name}")
    void delete(Hospital hospital);
}
