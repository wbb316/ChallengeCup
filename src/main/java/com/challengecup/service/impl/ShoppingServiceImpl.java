package com.challengecup.service.impl;

import com.challengecup.mapper.ShoppingMapper;
import com.challengecup.pojo.Shopping;
import com.challengecup.service.ShoppingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ShoppingServiceImpl implements ShoppingService {

    @Autowired
    private ShoppingMapper shoppingMapper;

    /**
     * 加入商品数据
     */
    @Override
    public void insert(Shopping shopping) {
        shopping.setCreateTime(LocalDate.now());
        shopping.setUpdateTime(LocalDate.now());
        shoppingMapper.insert(shopping);
    }

    /**
     * 修改商品数据
     * @param shopping
     * @return
     */
    @Override
    public void update(Shopping shopping) {
        shopping.setUpdateTime(LocalDate.now());
        shoppingMapper.update(shopping);
    }

    /**
     * 查询商品数据
     * @param shopping
     * @return
     */
    @Override
    public Shopping select(Shopping shopping) {
        return shoppingMapper.select(shopping);
    }

    @Override
    public void delete(Shopping shopping) {
        shoppingMapper.delete(shopping);
    }

}
