package com.challengecup.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HelpRequests {
    private String posterName;
    private String volunteerName;
    private String title;
    private String description;
    private String type;
    private String status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private double price;
}
