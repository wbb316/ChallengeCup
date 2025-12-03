package com.challengecup.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShareGoods {
    private String userName;
    private String title;
    private String description;
    private double price;
    private String category;
    private String status;
    private String contactWay;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
