# 缘起
一开始只是在学习《JavaScript设计模式与开发实践》而已。

在享元模式和状态模式中，作者反复用微云文件上传的场景作为例子，其中提到了可以暂停上传文件。

于是乎上网找了下相关的资料，受到如下文章的启发，决定自己写一个支持分片，断点续传的文件上传DEMO，并
实践一下上述两种设计模式。

[XMLHttpRequest实现HTTP协议下文件上传断点续传](http://www.zhangxinxu.com/wordpress/?p=3754)
[扒一扒Nodejs formidable的onPart](http://www.qdfuns.com/notes/18061/ff09aab53e4e51801c025e9a9deceb81.html)
[利用HTML5分片上传超大文件](http://www.linuxidc.com/Linux/2014-09/106816.htm)

# 实现分片上传

