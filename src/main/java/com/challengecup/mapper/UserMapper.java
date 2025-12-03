package com.challengecup.mapper;

import com.challengecup.pojo.*;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {
    /**
     * 业主登录
     * @param user
     * @return
     */
    @Select("select * from users where username=#{username} and password=#{password}")
     Users getByUserNameAndPassword(Users user);

    /**
     * 插入物业问题
     * @param propertyIssue
     */
    void insertWithIssue(PropertyIssue propertyIssue);

    /**
     * 查询全部数据
     * @return
     */
    @Select("select * from property_issues")
    List<PropertyIssue> listIssue();

    /**
     * 添加共享商品
     */
    void insertWithGoods(ShareGoods shareGoods);

    @Delete("delete from share_goods where user_name=#{userName} and title=#{title} and description=#{description}")
    void delete(ShareGoods shareGoods);


    void register(Users user);

    /**
     * 查询全部共享数据
     * @return
     */
    @Select("select * from share_goods")
    List<ShareGoods> listShareGoods();

    @Select("select * from products where category=#{category}")
    List<Shopping> listShopping(String category);

    /**
     * 业主申请帮助
     * @param helpRequests
     * @return
     */
    void insertWithRequest(HelpRequests helpRequests);

    @Select("select * from help_requests")
    List<HelpRequests> listRequest();

    /**
     * 修改帮助状态
     * @param helpRequests
     * @return
     */
    void update(HelpRequests helpRequests);

    @Delete("delete from help_requests where poster_name=#{posterName} and title=#{title}")
    void deleteRequest(HelpRequests helpRequests);

    /**
     * 申请预约
     * @param hospital
     * @return
     */
    void insertWithHospital(Hospital hospital);

    /**
     * 更改预约
     * @param hospital
     * @return
     */
    void updateHospital(Hospital hospital);

    @Insert("insert into owner (title, content, publish_time, publisher, phone, create_time, update_time) VALUES " +
            "(#{title},#{content},#{publishTime},#{publisher},#{phone},#{createTime},#{updateTime})")
    void insertWithNotice(Owner owner);

    /**
     * 修改公告
     * @param owner
     * @return
     */
    void updateNotice(Owner owner);

    @Delete("delete from owner where publisher=#{publihser} and title=#{title}")
    void deleteNotice(Owner owner);

    @Select("select * from owner")
    List<Owner> list();

    @Insert("insert into sos (username, create_time, update_time) VALUES (#{username},#{createTime},#{updateTime})")
    void insertWithSOS(SOS sos);
}
