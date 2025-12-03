package com.challengecup.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Users {
    private String username;
    private String phone;
    private String password;
    private String role;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private String address;
}
