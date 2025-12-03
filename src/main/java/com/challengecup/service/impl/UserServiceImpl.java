package com.challengecup.service.impl;

import com.challengecup.mapper.HospitalMapper;
import com.challengecup.mapper.UserMapper;
import com.challengecup.pojo.*;
import com.challengecup.service.UserService;
import com.challengecup.utils.BaseContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private HospitalMapper hospitalMapper;

    /**
     * 插入物业问题
     * @param propertyIssue
     */
    @Override
    public void insertWithIssue(PropertyIssue propertyIssue) {
        propertyIssue.setCreateTime(LocalDateTime.now());
        propertyIssue.setUpdateTime(LocalDateTime.now());
        userMapper.insertWithIssue(propertyIssue);
    }

    /**
     * 查询物业问题全部数据
     * @return
     */
    @Override
    public List<PropertyIssue> listIssue() {
        return userMapper.listIssue();
    }

    /**
     * 添加共享商品
     * @param shareGoods
     */
    @Override
    public void insertWithGoods(ShareGoods shareGoods) {
        shareGoods.setCreateTime(LocalDateTime.now());
        shareGoods.setUpdateTime(LocalDateTime.now());
        userMapper.insertWithGoods(shareGoods);
    }

    /**
     * 删除共享商品
     * @param shareGoods
     */
    @Override
    public void delete(ShareGoods shareGoods) {
        userMapper.delete(shareGoods);
    }

    /**
     * 业主登录
     * @param user
     * @return
     */
    @Override
    public Users login(Users user) {
        return userMapper.getByUserNameAndPassword(user);
    }

    /**
     * 员工注册
     * @param user
     * @return
     */
    @Override
    public void register(Users user) {
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        userMapper.register(user);
    }

    /**
     * 查询全部共享数据
     * @return
     */
    @Override
    public List<ShareGoods> listShareGoods() {
        return userMapper.listShareGoods();
    }

    /**
     * 查询全部商品
     * @return
     */
    @Override
    public List<Shopping> listShopping(String category) {
        return userMapper.listShopping(category);
    }
    /**
     * 业主申请帮助
     * @param helpRequests
     * @return
     */
    @Override
    public void insertWithRequest(HelpRequests helpRequests) {
        helpRequests.setCreateTime(LocalDateTime.now());
        helpRequests.setUpdateTime(LocalDateTime.now());
        userMapper.insertWithRequest(helpRequests);
    }

    /**
     * 查看全部帮助
     * @return
     */
    @Override
    public List<HelpRequests> listRequest() {
        return userMapper.listRequest();
    }

    /**
     * 修改帮助状态
     * @param helpRequests
     * @return
     */
    @Override
    public void update(HelpRequests helpRequests) {
        helpRequests.setUpdateTime(LocalDateTime.now());
        userMapper.update(helpRequests);
    }

    /**
     * 删除需求
     * @param helpRequests
     * @return
     */
    @Override
    public void deleteRequest(HelpRequests helpRequests) {
        userMapper.deleteRequest(helpRequests);
    }

    /**
     * 申请预约
     * @param hospital
     * @return
     */
    @Override
    public void insertWithHospital(Hospital hospital) {
        hospital.setCreateTime(LocalDateTime.now());
        hospital.setUpdateTime(LocalDateTime.now());
        userMapper.insertWithHospital(hospital);
    }

    /**
     * 删除预约申请
     * @param hospital
     * @return
     */
    @Override
    public void deleteHospital(Hospital hospital) {
        hospitalMapper.delete(hospital);
    }

    /**
     * 更改预约
     * @param hospital
     * @return
     */
    @Override
    public void updateHospital(Hospital hospital) {
        hospital.setUpdateTime(LocalDateTime.now());
        userMapper.updateHospital(hospital);
    }

    /**
     * 发布公告
     */
    @Override
    public void insertWithNotice(Owner owner) {
        owner.setCreateTime(LocalDateTime.now());
        owner.setUpdateTime(LocalDateTime.now());
        userMapper.insertWithNotice(owner);
    }

    /**
     * 修改公告
     * @param owner
     * @return
     */
    @Override
    public void updateNotice(Owner owner) {
        owner.setUpdateTime(LocalDateTime.now());
        userMapper.updateNotice(owner);
    }

    /**
     * 删除公告
     * @param owner
     * @return
     */
    @Override
    public void deleteNotice(Owner owner) {
        userMapper.deleteNotice(owner);
    }

    /**
     * 查看公告
     * @return
     */
    @Override
    public List<Owner> list() {
        return userMapper.list();
    }

    /**
     * 用户向物业发送紧急情况
     * @param sos
     */
    @Override
    public void insertWithSOS(SOS sos) {
        sos.setCreateTime(LocalDateTime.now());
        sos.setUpdateTime(LocalDateTime.now());
        sos.setUsername("张三");
        userMapper.insertWithSOS(sos);
    }
}
