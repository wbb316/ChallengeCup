package com.challengecup.interceptor;

import com.alibaba.fastjson2.JSONObject;
import com.challengecup.utils.Result;
import com.challengecup.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
@Component
public class LoginCheckInterceptor implements HandlerInterceptor {
    @Override//目标资源方法运行前运行，返回ture,放行，返回false，不放行
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        //1.获取URL
        String url = request.getRequestURL().toString();
        log.info("请求url:{}",url);

        //2.判断URL是否包含login,如果包含，说明是登陆操作，放行
        if(url.contains("login")){
            log.info("登录操作，放行");
            return true;
        }

        //3.获取请求头的令牌
        String jwt = request.getHeader("token");

        //4.判断令牌是否存在，不存在返回错误结果
        if(!StringUtils.hasLength(jwt)){
            log.info("token为空");
            Result error = Result.error("NOT_LOGIN");
            //手动转换 阿里巴巴fast.json
            String notLogin = JSONObject.toJSONString(error);
            response.getWriter().write(notLogin);
            return false;
        }

        //5.解析令牌，如果解析失败，返回错误结果
        try {
            JwtUtils.parseJWT(jwt);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("解释令牌失败");
            Result error = Result.error("NOT_LOGIN");
            String notLogin = JSONObject.toJSONString(error);
            response.getWriter().write(notLogin);
            return false;
        }

        //6.放行
        log.info("令牌合法，放行");
        return true;

    }

    @Override//目标资源方法运行后运行
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("postHandle");
    }

    @Override//视图渲染完毕后运行
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("afterCompletion");
    }
}
