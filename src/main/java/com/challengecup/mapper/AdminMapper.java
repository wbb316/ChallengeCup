package com.challengecup.mapper;

import com.challengecup.pojo.Announcements;
import com.challengecup.pojo.PropertyIssue;
import com.challengecup.pojo.Users;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AdminMapper {

    @Update("update property_issues set status=#{status}, update_time=#{updateTime} where user_name=#{userName}")
    void update(PropertyIssue propertyIssue);

    @Insert("insert into announcements (title, content, publish_time, publisher, create_time, update_time) VALUES " +
            "(#{title},#{content},#{publishTime},#{publisher},#{createTime},#{updateTime})")
    void addNotice(Announcements announcements);

    @Delete("delete from announcements where title=#{title}")
    void deleteNotice(Announcements announcements);

    /**
     * 修改公告
     * @param announcements
     * @return
     */
    void updateNotice(Announcements announcements);

    @Select("select * from announcements")
    List<Announcements> selectNotice();

    /**
     * 用户找回密码
     * @param user
     * @return
     */
    @Select("select password from users where username=#{username} and phone=#{phone}")
    String getPassword(Users user);
}
