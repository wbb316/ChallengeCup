package com.challengecup.controller;

import com.challengecup.pojo.Shopping;
import com.challengecup.service.ShoppingService;
import com.challengecup.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@Slf4j
public class UploadController {

    @Autowired
    private ShoppingService shoppingService;
    @PostMapping("/upload")
    public Result upload(MultipartFile image,String name) throws IOException {
        log.info("图片上传：{}",image);

        //原始文件名
        String originalFilename = image.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFileName = UUID.randomUUID()+extension;


        //文件存储D:image
        image.transferTo(new File("D:\\image\\"+newFileName));


        //将图片路径放入数据库
        String path = "D:\\image\\"+newFileName;
        Shopping shopping = new Shopping();
        shopping.setImage(path);
        shopping.setName(name);
        shoppingService.update(shopping);

        return Result.success();
    }
}
