package com.challengecup.controller;

import com.challengecup.pojo.*;
import com.challengecup.service.UserService;
import com.challengecup.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {
    @Autowired
    private UserService userService;

    /**
     * 加入物业问题
     * @param propertyIssue
     * @return
     */
    @PostMapping("/issue")
    public Result insert(@RequestBody PropertyIssue propertyIssue ) {
        log.info("业主传进来的问题：{}",propertyIssue);
        userService.insertWithIssue(propertyIssue);
        return Result.success();
    }

    /**
     * 查询所有问题数据
     * @return
     */
    @GetMapping("/issue")
    public Result list(){
        log.info("查询全部问题数据");
        List<PropertyIssue> list=userService.listIssue();
        return Result.success(list);
    }


    /**
     * 添加分享商品
     * @param shareGoods
     * @return
     */
    @PostMapping("/sharegoods")
    public Result insertShareGoods(@RequestBody ShareGoods shareGoods) {
        log.info("添加共享商品:{}",shareGoods);
        userService.insertWithGoods(shareGoods);
        return Result.success();
    }

    /**
     * 删除共享商品
     * @param shareGoods
     * @return
     */
    @DeleteMapping
    public Result deleteShareGoods(@RequestBody ShareGoods shareGoods) {
        log.info("删除商品：{}",shareGoods);
        userService.delete(shareGoods);
        return Result.success();
    }

    /**
     * 查询全部共享数据
     * @return
     */
    @GetMapping("/sharegoods")
    public Result listShareGoods() {
        log.info("查询全部共享商品数据");
        List<ShareGoods> list=userService.listShareGoods();
        return Result.success(list);
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
     * 业主申请帮助
     * @param helpRequests
     * @return
     */
    @PostMapping("/request")
    public Result request(@RequestBody HelpRequests  helpRequests) {
        log.info("业主发布帮助：{}",helpRequests);
        userService.insertWithRequest(helpRequests);
        return Result.success();
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
     * 申请预约
     * @param hospital
     * @return
     */
    @PostMapping("/hospital")
    public Result insertHospital(@RequestBody Hospital hospital) {
        userService.insertWithHospital(hospital);
        return Result.success();
    }

    /**
     * 删除预约申请
     * @param hospital
     * @return
     */
    @DeleteMapping("/delete_hospital")
    public Result deleteHospital(@RequestBody Hospital hospital) {
        userService.deleteHospital(hospital);
        return Result.success();
    }

    /**
     * 更改预约
     * @param hospital
     * @return
     */
    @PutMapping("update_hospital")
    public Result updateHospital(@RequestBody Hospital hospital) {
        userService.updateHospital(hospital);
        return Result.success();
    }

    /**
     * 发布公告
     */
    @PostMapping("/notice")
    public Result insertNotice(@RequestBody Owner owner) {
        userService.insertWithNotice(owner);
        return Result.success();
    }

    /**
     * 修改公告
     * @param owner
     * @return
     */
    @PutMapping("/notice")
    public Result updateNotice(@RequestBody Owner owner) {
        userService.updateNotice(owner);
        return  Result.success();
    }

    /**
     * 删除公告
     * @param owner
     * @return
     */
    @DeleteMapping("/notice")
    public Result deleteNotice(@RequestBody Owner owner) {
        userService.deleteNotice(owner);
        return  Result.success();
    }

    /**
     * 查看公告
     * @return
     */
    @GetMapping("/notice")
    public Result listNotice() {
        List<Owner>list=userService.list();
        return Result.success(list);
    }

    /**
     * SOS按钮
     * @param sos
     * @return
     */
    @PostMapping("/sos")
    public Result sos(@RequestBody SOS sos) {
        userService.insertWithSOS(sos);
        return Result.success();
    }
}
