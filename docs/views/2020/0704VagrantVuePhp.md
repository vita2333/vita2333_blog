---
title: Vagrant+Vue+Php配置整理
date: 2020-07-04
isComment: true
tags:
 - note
categories: 
 - todo
---

### vue触发vagrant中php的xdebug
思路：
- nginx代理php入口，如网址`test.com`
- axios的`baseUrl`配置为`test.ocm`
- nginx中配置`options`方法的跨域
```
    location / {
        if ($request_method = 'OPTIONS') {
                add_header Access-Control-Allow-Origin '$http_origin';
                add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS, PUT, DELETE, HEAD';
                add_header Access-Control-Max-Age '1728000';
                add_header Access-Control-Allow-Credentials 'true';
                add_header Access-Control-Allow-Headers 'Origin,Content-Type,Accept,Authorization';
                add_header Content-Type 'text/plain; charset=UTF-8';
                add_header Content-Length '0';
                return 204;
        }

        try_files $uri $uri/ /index.php?$query_string;
    }
```
- 配置webstorm server

<img src="/blog/docimg/配置webstormserver.png"></img>
