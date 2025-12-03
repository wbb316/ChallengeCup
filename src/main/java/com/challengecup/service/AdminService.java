package com.challengecup.service;

import com.challengecup.pojo.Announcements;
import com.challengecup.pojo.PropertyIssue;
import com.challengecup.pojo.Users;

import java.util.List;

public interface AdminService {
    /**
     * 修改状态
     * @param propertyIssue
     */
    void update(PropertyIssue propertyIssue);

    /**
     * 发布公告
     * @return
     */
    void addNotice(Announcements announcements);

    /**
     * 删除公告
     * @param announcements
     * @return
     */
    void deleteNotice(Announcements announcements);

    /**
     * 修改公告
     * @param announcements
     * @return
     */
    void updateNotice(Announcements announcements);

    /**
     * 查看全部公告
     * @return
     */
    List<Announcements> selectNotice();

    /**
     * 用户找回密码
     * @param user
     * @return
     */
    String getPassword(Users user);
}
