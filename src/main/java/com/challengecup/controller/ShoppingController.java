package com.challengecup.controller;

import com.challengecup.pojo.Shopping;
import com.challengecup.service.ShoppingService;
import com.challengecup.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shopping")
@Slf4j
public class ShoppingController {

    @Autowired
    private ShoppingService shoppingService;

    /**
     * 加入商品数据
     */
    @PostMapping("/insert")
    public Result insert(@RequestBody Shopping  shopping){
        shoppingService.insert(shopping);
        return Result.success();
    }

    /**
     * 修改商品数据
     * @param shopping
     * @return
     */
    @PostMapping("/update")
    public Result update(@RequestBody Shopping shopping){
        shoppingService.update(shopping);
        return Result.success();
    }

    /**
     * 查看单个商品数据
     * @param shopping
     * @return
     */
    @GetMapping("/select")
    public Result selectByName(@RequestBody Shopping shopping){
        Shopping shop = shoppingService.select(shopping);
        return Result.success(shop);
    }

    /**
     * 删除单个商品数据
     * @param shopping
     * @return
     */
    @DeleteMapping
    public Result delete(@RequestBody Shopping shopping){
        shoppingService.delete(shopping);
        return Result.success();
    }
}
