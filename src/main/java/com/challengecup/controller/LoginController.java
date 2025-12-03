package com.challengecup.controller;

import com.challengecup.pojo.Users;
import com.challengecup.service.AdminService;
import com.challengecup.service.UserService;
import com.challengecup.utils.JwtUtils;
import com.challengecup.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/login")
public class LoginController {

    @Autowired
    UserService userService;
    @Autowired
    private AdminService adminService;

    /**
     * 员工登录
     * @param user
     * @return
     */
    @PostMapping
    public Result login(@RequestBody Users user){
        log.info("业主登录：{}",user);
        Users u= userService.login(user);
        if(u!=null){
            Map<String, Object> claims = new HashMap<>();
            claims.put("name", u.getUsername());
            String jwt = JwtUtils.generateJwt(claims);//包含当前登录员工信息
            return Result.success(jwt);
        }
        return Result.error("用户名或密码错误");
    }

    /**
     * 员工注册
     * @param user
     * @return
     */
    @PostMapping("/insert")
    public Result register(@RequestBody Users user){
        log.info("员工注册：{}",user);
        userService.register(user);
        return Result.success();
    }

    /**
     * 用户找回密码
     * @param user
     * @return
     */
    @PostMapping("/forget")
    public Result getPassword(@RequestBody Users user){
        log.info("用户找回密码：{}",user);
        String password = adminService.getPassword(user);
        return Result.success(password);
    }
}
