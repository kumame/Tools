角色设定生成器
=========================
Character Generator

[![](https://img.shields.io/badge/website-kumame.github.io/Tools/cgyellow.svg?style=for-the-badge&logo=appveyor)](https://kumame.github.io/Tools/cg)

运行版本下载：[Character-Generator.zip](https://github.com/kumame/Tools/archive/refs/heads/Character-Generator.zip)
> 本地运行需要`配置web环境`或是`允许浏览器访问本地文件`。

## 二次开发指南
理论上，可以接入AI自动生成程序，不过这个超过了我目前的知识范围。

如果希望改成图片式的生成器，可将json数据中的obj填充为图片路径，或是新建一个值。
> obj在数据中定义为部件名称，如果新建值：
```
{"obj":"八字眉","NEWvalue":"ab/cd.png"}
```
> 当然这里不建议在数据库中直接加入文件缀名，而是在`app.js`中进行组合。


**目录结构**
- index.html - 主要WEB页面
- config.js - 参数配置文件
- db - 数据库，json形式
- app
  - db.js - 处理数据库及程序加载
  - app.js - 主要运行程序
  - box.html - 坐标窗口文件
  - box.css - 坐标窗口样式文件
  - box.js - 坐标窗口程序
  - style.css -主要WEB页面样式文件


**基本运行逻辑**
1. 通过`db.js`生成数据库数据缓存至浏览器
2. 通过`app.js`生成随机数据
3. 使用iframe加载`box.html`用于坐标数据操作
4. 坐标生成：子页面坐标点击 -> 执行父页面函数 -> 获取子页面坐标 -> 使用坐标数值运行因子混合函数
5. 随机生成：生成随机数 -> 传输给子页面修改样式 -> 使用坐标数值运行因子混合函数
6. 筛选器`(函数)`会根据`Age,RF,Lo,La`坐标数据进行随机，具体可查看`app.js`中的注释


**JSON数据处理**

json数据通过`db.js`进行自动处理，生成一次localStorage缓存数据，该缓存可由`config.js`中的`DBversion`判断是否更新。

如果新增文件，则在db.js中添加文件路劲：
```
DBload.push($.get('文件路劲/文件名.json'));
```
接着在`json数据本地化处理`函数添加定义：
```
.then(function(DB1,DB2,DB3,新增定义)
例：新增定义= DB4
```
然后在`函数`中添加一个执行命令：
```
makeLS(你上一步新增的定义名);
例：makeLS(DB4)
```
:warning: 注意
生成的localStorage键名为json数据组名，可在使用中直接调用`localStorage.组名`。

因此，在json数据编写的时候规范组名会有利于后续操作。


**删减不需要数据**
查看`app.js`根据注释内容删除不需要的整个函数即可。

如果`输出`中含有被删除的函数程序，记得一并清理。