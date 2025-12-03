package com.challengecup.mapper;

import com.challengecup.pojo.Shopping;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ShoppingMapper {

    void insert(Shopping shopping);

    void update(Shopping shopping);

    @Select("select * from products where category=#{category} and name=#{name}")
    Shopping select(Shopping shopping);

    @Delete("delete from products where name=#{name} and category=#{category}")
    void delete(Shopping shopping);
}
