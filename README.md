# 发个东西
一个局域网文字/文件P2P传输工具
> 项目中仅在线用户列表和WebRTC信令迫不得已需要一个轻量化的服务，其他数据传输都采用了基于WebRTC的点对点传输，不经过中间服务器，所以局域网内互传一些文字/文件都比较快。

demo演示：https://fagedongxi.com

## 优点
无需安装任何软件，打开浏览器，无需登录直接传输。

## 缺点
接收大文件比较吃内存（单文件几百兆一般没问题）

## 场景：
比如新装的win系统需要从mac系统传一些需要🪜才能下载的软件或者搜到的一些东西

## 部署/启动
> 自`1.1.0`版本后，不再需要单独部署网页端了，仅启动一个服务端即可

参考视频：https://v.douyin.com/zp_dXkV1fys/

### 源码方式
1. 安装nodejs，node版本没有测试，我用的是 `16.20.2`
2. 下载源码
3. 进入 项目根目录，运行 `npm install`
4. 运行 `npm run start [port]` ，例如 `npm run start 8081`

### 二进制方式
* 下载对应平台的可执行文件，直接执行即可
* 默认监听 `8081` 端口，可通过参数指定端口，例如 `./internal-chat-linux 8082`
* 如果你用windows，可参考 https://v.douyin.com/CeiJahpLD/ 注册成服务

## 房间配置

支持两种方式创建/配置房间：

### 方式一：在线创建（推荐）
1. 打开应用后，点击工具栏中的 **+** 按钮
2. 输入房间号（2-32个字符）和密码
3. 确认密码后点击"创建"
4. 创建成功后会显示房间链接，可复制分享给其他人
5. 其他用户访问该链接并输入密码即可加入房间

> 在线创建的房间会自动保存到 `room_pwd.json` 文件中，服务重启后仍然有效。

### 方式二：手动配置文件
* 配置文件名：`room_pwd.json`
* 存放目录：应用同级目录
* 格式：参考样例 `.room_pwd.json`

## 常见问题：
在线列表看见对方，但一直处于断开的状态且无法发送消息：
* 原因一：浏览器不支持WebRTC（目前最新版已经在用户打开后自动检测并加入提示），旧版没有检测功能可以临时用这个进行测试：https://space.coze.cn/s/qDNpw1y7MJw/
* 原因二：网络环境不支持互相访问，详见：https://v.douyin.com/IPoHlTBzngg/
  > 解决方案：
  >  1. 私有部署「发个东西」+「TURN中转服务coturn」
  >  2. 配置房间增加TURN支持（ `.room_pwd.json` 样例文件中有TURN的配置格式）

### nginx代理配置样例
```
server
{
  server_name fagedongxi.com;
  index index.html;
  listen 80;

  location / {
    proxy_pass  http://127.0.0.1:8081/;
  }

  location /ws/ {
      proxy_pass http://127.0.0.1:8081/ws/;
      proxy_http_version 1.1;
      proxy_set_header Host $host;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

}
```
## 免责声明：
本项目仅用于学习交流，请勿用于非法用途，否则后果自负。
