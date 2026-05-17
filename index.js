const WebSocket = require('ws');
const service = require('./data');
const path = require('path');

const http = require('http');
const fs = require('fs');

const originalLog = console.log;
console.log = function() {
  const date = new Date();
  const pad = (num) => String(num).padStart(2, '0');
  const ms = String(date.getMilliseconds()).padStart(3, '0');
  
  const timestamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${ms}`;
  
  originalLog.apply(console, [`[${timestamp}]`, ...arguments]);
};
const HTTP_PORT = process.env.PORT || process.argv[2] || 8081;
const HTTP_DIRECTORY = path.join(__dirname, 'www'); // 静态文件目录

function getLocalIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  const candidates = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        candidates.push({ name, address: iface.address });
      }
    }
  }
  
  const privatePrefix = ['192.168.', '10.', '172.16.', '172.17.', '172.18.', '172.19.', '172.20.', '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', '172.26.', '172.27.', '172.28.', '172.29.', '172.30.', '172.31.'];
  
  for (const prefix of privatePrefix) {
    const match = candidates.find(c => c.address.startsWith(prefix));
    if (match) return match.address;
  }
  
  return candidates.length > 0 ? candidates[0].address : '127.0.0.1';
}

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]); // 去掉查询参数
  
  if (urlPath === '/api/server-info') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify({ ip: getLocalIP(), port: HTTP_PORT }));
    return;
  }
  
  if (urlPath === '/') {
    urlPath = '/index.html'; // 默认访问 index.html
  }
  let filePath = path.join(HTTP_DIRECTORY, urlPath);
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 如果文件不存在，返回 index.html
      filePath = path.join(HTTP_DIRECTORY, 'index.html');
    }

    // 设置缓存头
    const ext = path.extname(filePath);
    if (ext === '.js' || ext === '.css') {
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30天缓存
    }

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(HTTP_PORT, () => {
  const localIP = getLocalIP();
  console.log(`server start on port ${HTTP_PORT}`);
  console.log(`Local:   http://localhost:${HTTP_PORT}`);
  console.log(`Network: http://${localIP}:${HTTP_PORT}`);
});


const wsServer = new WebSocket.Server({ server });


const SEND_TYPE_REG = '1001'; // 注册后发送用户id
const SEND_TYPE_ROOM_INFO = '1002'; // 发送房间信息
const SEND_TYPE_JOINED_ROOM = '1003'; // 加入房间后的通知，比如对于新进用户，Ta需要开始连接其他人
const SEND_TYPE_NEW_CANDIDATE = '1004'; // offer
const SEND_TYPE_NEW_CONNECTION = '1005'; // new connection
const SEND_TYPE_CONNECTED = '1006'; // new connection
const SEND_TYPE_NICKNAME_UPDATED = '1007'; // 昵称更新通知
const SEND_TYPE_CREATE_ROOM_RESULT = '1008'; // 创建房间结果

const RECEIVE_TYPE_NEW_CANDIDATE = '9001'; // offer
const RECEIVE_TYPE_NEW_CONNECTION = '9002'; // new connection
const RECEIVE_TYPE_CONNECTED = '9003'; // joined
const RECEIVE_TYPE_KEEPALIVE = '9999'; // keep-alive
const RECEIVE_TYPE_UPDATE_NICKNAME = '9004'; // 更新昵称请求
const RECEIVE_TYPE_CREATE_ROOM = '9005'; // 创建房间请求

// 从room_pwd.json中获取房间密码
let roomPwd = { };
try {
  // 获取可执行程序所在目录
  const exePath = process.pkg ? path.dirname(process.execPath) : __dirname;
  roomPwdConfig = require(path.join(exePath, 'room_pwd.json'));
  let roomIds = [];
  roomPwdConfig.forEach(item => {
    roomIds.push(item.roomId);
    roomPwd[item.roomId] = { "pwd": item.pwd, "turns": item.turns };
  });
  console.log(`加载房间数据: ${roomIds.join(',')}`);
} catch (e) {
  // 没有room_pwd.json文件无需报错，不加载即可
  // console.error('Failed to load room_pwd.json');
}

let roomPwdConfigPath = null;
try {
  const exePath = process.pkg ? path.dirname(process.execPath) : __dirname;
  roomPwdConfigPath = path.join(exePath, 'room_pwd.json');
  fs.accessSync(roomPwdConfigPath, fs.constants.R_OK | fs.constants.W_OK);
} catch (e) {
  roomPwdConfigPath = path.join(__dirname, 'room_pwd.json');
}

function saveRoomPwd() {
  const config = Object.keys(roomPwd).map(roomId => ({
    roomId,
    pwd: roomPwd[roomId].pwd,
    turns: roomPwd[roomId].turns || [],
    remark: roomPwd[roomId].remark || ''
  }));
  try {
    fs.writeFileSync(roomPwdConfigPath, JSON.stringify(config, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save room_pwd.json:', e.message);
  }
}

wsServer.on('connection', (socket, request) => {
  const ip = request.headers['x-forwarded-for'] ?? request.headers['x-real-ip'] ?? socket._socket.remoteAddress.split("::ffff:").join("");
  const urlWithPath = request.url.replace(/^\//g, '').split('/')
  let roomId = null;
  let pwd = null;
  if (urlWithPath.length > 1 && urlWithPath[1].length > 0 && urlWithPath[1].length <= 32) {
    roomId = urlWithPath[1].trim();
  }
  if (urlWithPath.length > 2 && urlWithPath[2].length > 0 && urlWithPath[2].length <= 32) {
    pwd = urlWithPath[2].trim();
  }
  if (roomId === 'ws') {  // 兼容旧版本
    roomId = null;
  }
  if (roomId === '') {
    roomId = null;
  }
  let turns = null;
  if (roomId) {
    if (!pwd || !roomPwd[roomId] || roomPwd[roomId].pwd.toLowerCase() !== pwd.toLowerCase()) {
      roomId = null;
    } else {
      turns = roomPwd[roomId].turns;
    }
  }
  const currentId = service.registerUser(ip, roomId, socket);
  // 向客户端发送自己的id
  socketSend_UserId(socket, currentId, roomId, turns);
  
  console.log(`${currentId}@${ip}${roomId ? '/' + roomId : ''} connected`);
  
  service.getUserList(ip, roomId).forEach(user => {
    socketSend_RoomInfo(user.socket, ip, roomId);
  });

  socketSend_JoinedRoom(socket, currentId);
  

  socket.on('message', (msg, isBinary) => {
    const msgStr = msg.toString();
    if (!msgStr || msgStr.length > 1024 * 10) {
      return;
    }
    let message = null;
    try {
      message = JSON.parse(msgStr);
    } catch (e) {
      console.error('Invalid JSON', msgStr);
      message = null;
    }

    const { uid, targetId, type, data } = message;
    if (!type || !uid || !targetId) {
      return null;
    }
    const me = service.getUser(ip, roomId, uid)
    const target = service.getUser(ip, roomId, targetId)
    if (!me || !target) {
      return;
    }

    if (type === RECEIVE_TYPE_NEW_CANDIDATE) {
      socketSend_Candidate(target.socket, { targetId: uid, candidate: data.candidate });
      return;
    }
    if (type === RECEIVE_TYPE_NEW_CONNECTION) {
      socketSend_ConnectInvite(target.socket, { targetId: uid, offer: data.targetAddr });
      return;
    }
    if (type === RECEIVE_TYPE_CONNECTED) {
      socketSend_Connected(target.socket, { targetId: uid, answer: data.targetAddr });
      return;
    }
    if (type === RECEIVE_TYPE_KEEPALIVE) {
      return;
    }
    if (type === RECEIVE_TYPE_UPDATE_NICKNAME) {
      const success = service.updateNickname(ip, roomId, uid, data.nickname);
      if (success) {
        // 通知所有用户昵称更新
        service.getUserList(ip, roomId).forEach(user => {
          socketSend_NicknameUpdated(user.socket, { id: uid, nickname: data.nickname });
        });
      }
      return;
    }
    if (type === RECEIVE_TYPE_CREATE_ROOM) {
      const { roomId: newRoomId, pwd: newPwd } = data;
      if (!newRoomId || newRoomId.length < 2 || newRoomId.length > 32) {
        socketSend_CreateRoomResult(socket, { success: false, message: '房间号长度需在2-32个字符之间' });
        return;
      }
      if (!newPwd || newPwd.length !== 32) {
        socketSend_CreateRoomResult(socket, { success: false, message: '密码格式错误' });
        return;
      }
      if (roomPwd[newRoomId]) {
        socketSend_CreateRoomResult(socket, { success: false, message: '房间号已存在' });
        return;
      }
      roomPwd[newRoomId] = { pwd: newPwd.toLowerCase(), turns: [], remark: '' };
      saveRoomPwd();
      console.log(`房间已创建: ${newRoomId} by ${uid}@${ip}`);
      socketSend_CreateRoomResult(socket, { success: true, roomId: newRoomId });
      return;
    }
    
  });

  socket.on('close', () => {
    service.unregisterUser(ip, roomId, currentId);
    service.getUserList(ip, roomId).forEach(user => {
      socketSend_RoomInfo(user.socket, ip, roomId);
    });
    console.log(`${currentId}@${ip}${roomId ? '/' + roomId : ''} disconnected`);
  });

  socket.on('error', () => {
    service.unregisterUser(ip, roomId, currentId);
    service.getUserList(ip, roomId).forEach(user => {
      socketSend_RoomInfo(user.socket, ip, roomId);
    });
    console.log(`${currentId}@${ip}${roomId ? '/' + roomId : ''} disconnected`);
  });
});




function send(socket, type, data) {
  socket.send(JSON.stringify({ type, data }));
}

function socketSend_UserId(socket, id, roomId, turns) {
  send(socket, SEND_TYPE_REG, { id, roomId, turns });
}
function socketSend_RoomInfo(socket, ip, roomId) {
  const result = service.getUserList(ip, roomId).map(user => ({ 
    id: user.id,
    nickname: user.nickname 
  }));
  send(socket, SEND_TYPE_ROOM_INFO, result);
}
function socketSend_JoinedRoom(socket, id) {
  send(socket, SEND_TYPE_JOINED_ROOM, { id });
}

function socketSend_Candidate(socket, data) {
  send(socket, SEND_TYPE_NEW_CANDIDATE, data);
}

function socketSend_ConnectInvite(socket, data) {
  send(socket, SEND_TYPE_NEW_CONNECTION, data);
}

function socketSend_Connected(socket, data) {
  send(socket, SEND_TYPE_CONNECTED, data);
}

function socketSend_NicknameUpdated(socket, data) {
  send(socket, SEND_TYPE_NICKNAME_UPDATED, data);
}

function socketSend_CreateRoomResult(socket, data) {
  send(socket, SEND_TYPE_CREATE_ROOM_RESULT, data);
}
