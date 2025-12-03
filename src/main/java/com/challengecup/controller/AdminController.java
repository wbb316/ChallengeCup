package com.challengecup.controller;

import com.challengecup.pojo.*;
import com.challengecup.service.AdminService;
import com.challengecup.service.ShoppingService;
import com.challengecup.service.UserService;
import com.challengecup.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@Slf4j
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private ShoppingService shoppingService;


    /**
     * 查询所有问题数据
     * @return
     */
    @GetMapping("/issue")
    public Result list(){
        log.info("查询全部数据");
        List<PropertyIssue> list=userService.listIssue();
        return Result.success(list);
    }

    /**
     * 修改问题状态
     * @param propertyIssue
     * @return
     */
    @PutMapping
    public Result updatePropertyStatus(@RequestBody PropertyIssue propertyIssue){
        log.info("修改问题状态为：{}",propertyIssue.getStatus());
        adminService.update(propertyIssue);
        return Result.success(propertyIssue);
    }

    /**
     * 删除共享商品
     * @param shareGoods
     * @return
     */
    @DeleteMapping("/shareGoods")
    public Result deleteShareGoods(@RequestBody ShareGoods shareGoods) {
        log.info("删除商品：{}",shareGoods);
        userService.delete(shareGoods);
        return Result.success();
    }

    /**
     * 删除单个商品数据
     * @param shopping
     * @return
     */
    @DeleteMapping("/shopping")
    public Result delete(@RequestBody Shopping shopping){
        shoppingService.delete(shopping);
        return Result.success();
    }

    /**
     * 查询全部商品
     * @return
     */
    @GetMapping("/product/{category}")
    public Result listShopping(@PathVariable String category) {
        log.info("查询全部商品");
        List<Shopping> list=userService.listShopping(category);
        return Result.success(list);
    }

    /**
     * 修改帮助状态
     * @param helpRequests
     * @return
     */
    @PutMapping("/update")
    public Result updateRequest(@RequestBody HelpRequests helpRequests) {
        log.info("修改状态，帮助或者更改需求：{}",helpRequests);
        userService.update(helpRequests);
        return Result.success();
    }

    /**
     * 删除需求
     * @param helpRequests
     * @return
     */
    @DeleteMapping("/delete")
    public Result deleteRequest(@RequestBody HelpRequests helpRequests) {
        log.info("删除需求：{}",helpRequests);
        userService.deleteRequest(helpRequests);
        return  Result.success();
    }

    /**
     * 查看全部帮助
     * @return
     */
    @GetMapping("/request")
    public Result listRequests() {
        log.info("查看帮助请求");
        List<HelpRequests> list=userService.listRequest();
        return Result.success(list);
    }

    /**
     * 发布公告
     * @return
     */
    @PostMapping("/notice")
    public Result addNotice(@RequestBody Announcements  announcements) {
        adminService.addNotice(announcements);
        return Result.success();
    }

    /**
     * 删除公告
     * @param announcements
     * @return
     */
    @DeleteMapping
    public Result deleteNotice(@RequestBody Announcements  announcements) {
        adminService.deleteNotice(announcements);
        return Result.success();
    }

    /**
     * 修改公告
     * @param announcements
     * @return
     */
    @PutMapping("/notice")
    public Result updateNotice(@RequestBody Announcements announcements) {
        adminService.updateNotice(announcements);
        return Result.success();
    }

    /**
     * 查看全部公告
     * @return
     */
    @GetMapping("/notice")
    public Result selectNotice() {
        List<Announcements>list = adminService.selectNotice();
        return Result.success(list);
    }
}
