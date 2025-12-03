package com.challengecup.service.impl;

import com.challengecup.mapper.AdminMapper;
import com.challengecup.pojo.Announcements;
import com.challengecup.pojo.PropertyIssue;
import com.challengecup.pojo.Users;
import com.challengecup.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class AdminServiceImpl implements AdminService {
    @Autowired
    private AdminMapper adminMapper;
//    @Autowired
//    private AdminService adminService;

    /**
     * 修改状态
     * @param propertyIssue
     */
    @Override
    public void update(PropertyIssue propertyIssue) {
        propertyIssue.setUpdateTime(LocalDateTime.now());
        adminMapper.update(propertyIssue);
    }

    /**
     * 发布公告
     * @return
     */
    @Override
    public void addNotice(Announcements announcements) {
       announcements.setCreateTime(LocalDateTime.now());
       announcements.setUpdateTime(LocalDateTime.now());
       adminMapper.addNotice(announcements);
    }

    /**
     * 删除公告
     * @param announcements
     * @return
     */
    @Override
    public void deleteNotice(Announcements announcements) {
        adminMapper.deleteNotice(announcements);
    }

    /**
     * 修改公告
     * @param announcements
     * @return
     */
    @Override
    public void updateNotice(Announcements announcements) {
        announcements.setUpdateTime(LocalDateTime.now());
        adminMapper.updateNotice(announcements);
    }

    /**
     * 查看全部公告
     * @return
     */
    @Override
    public List<Announcements> selectNotice() {
        return adminMapper.selectNotice();
    }

    /**
     * 用户找回密码
     * @param user
     * @return
     */
    @Override
    public String getPassword(Users user) {
        String password = adminMapper.getPassword(user);
        return password;
    }
}
