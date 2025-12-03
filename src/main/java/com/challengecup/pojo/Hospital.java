package com.challengecup.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Hospital {
    private String name;
    private String detail;
    private LocalDateTime appointmentDatetime;
    private String address;
    private String doctor;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
