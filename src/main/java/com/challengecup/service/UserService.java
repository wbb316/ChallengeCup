package com.challengecup.service;

import com.challengecup.pojo.*;

import java.util.List;

public interface UserService {
    /**
     * 插入物业问题
     * @param propertyIssue
     */
    void insertWithIssue(PropertyIssue propertyIssue);

    /**
     * 查询全部数据
     * @return
     */
    List<PropertyIssue> listIssue();

    /**
     * 添加共享商品
     * @param shareGoods
     */
    void insertWithGoods(ShareGoods shareGoods);

    /**
     * 删除共享商品
     * @param shareGoods
     */
    void delete(ShareGoods shareGoods);

    /**
     * 业主登录
     * @param user
     * @return
     */
    Users login(Users user);

    /**
     * 员工注册
     * @param user
     * @return
     */
    void register(Users user);

    /**
     * 查询全部共享数据
     * @return
     */
    List<ShareGoods> listShareGoods();

    /**
     * 查询全部商品
     * @return
     */
    List<Shopping> listShopping(String category);

    /**
     * 业主申请帮助
     * @param helpRequests
     * @return
     */
    void insertWithRequest(HelpRequests helpRequests);

    /**
     * 查看全部帮助
     * @return
     */
    List<HelpRequests> listRequest();

    /**
     * 修改帮助状态
     * @param helpRequests
     * @return
     */
    void update(HelpRequests helpRequests);

    /**
     * 删除需求
     * @param helpRequests
     * @return
     */
    void deleteRequest(HelpRequests helpRequests);

    /**
     * 申请预约
     * @param hospital
     * @return
     */
    void insertWithHospital(Hospital hospital);

    /**
     * 删除预约申请
     * @param hospital
     * @return
     */
    void deleteHospital(Hospital hospital);

    /**
     * 更改预约
     * @param hospital
     * @return
     */
    void updateHospital(Hospital hospital);

    /**
     * 发布公告
     */
    void insertWithNotice(Owner owner);

    /**
     * 修改公告
     * @param owner
     * @return
     */
    void updateNotice(Owner owner);

    /**
     * 删除公告
     * @param owner
     * @return
     */
    void deleteNotice(Owner owner);

    /**
     * 查看公告
     * @return
     */
    List<Owner> list();

    /**
     * 用户向物业发送紧急情况
     * @param sos
     */
    void insertWithSOS(SOS sos);
}
