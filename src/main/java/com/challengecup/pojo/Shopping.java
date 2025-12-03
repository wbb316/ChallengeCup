package com.challengecup.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Shopping {
    private String name;
    private String description;
    private double currentPrice;
    private double originalPrice;
    private String category;
    private LocalDate createTime;
    private LocalDate updateTime;
    private String image;
}
