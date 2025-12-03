package com.challengecup.service;

import com.challengecup.pojo.Shopping;

public interface ShoppingService {

    /**
     * 加入商品数据
     */
    void insert(Shopping shopping);

    /**
     * 修改商品数据
     * @param shopping
     * @return
     */
    void update(Shopping shopping);

    /**
     * 查看单个商品数据
     * @param shopping
     * @return
     */
    Shopping select(Shopping shopping);

    /**
     * 删除商品数据
     * @param shopping
     */
    void delete(Shopping shopping);
}
