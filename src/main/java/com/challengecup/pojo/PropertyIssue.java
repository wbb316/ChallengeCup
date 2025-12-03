package com.challengecup.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyIssue {
    private String userName;
    private String title;
    private String description;
    private String category;
    private String status;
    private String adminResponse;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private LocalDateTime respondedTime;
}
