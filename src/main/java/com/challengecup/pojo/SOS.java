package com.challengecup.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SOS {
    private String username;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
