const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const wsUrl = `${wsProtocol}://${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/ws`;

var users = [];
var me = new XChatUser();

// 添加当前传输用户的引用
let currentTransferUser = null;
let currentNickname = '';
let roomPassword = ''; // 存储房间密码
let signalingServer = null;

var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}


// 初始化页面
function initPage() {
  // 检测WebRTC支持
  if (!window.RTCPeerConnection && !window.webkitRTCPeerConnection) {
    addChatItem('system', '您的浏览器不支持WebRTC，请使用Chrome、Firefox、Safari等现代浏览器访问。');
    return;
  }

  const roomId = window.location.pathname.split('/')[1];
  const appContainer = document.querySelector('.app-container');
  const passwordModal = document.getElementById('passwordModal');

  if (roomId) {
    // 如果有roomId，显示密码输入框并隐藏主界面
    if (appContainer) appContainer.style.display = 'none';
    if (passwordModal) passwordModal.style.display = 'block';
    
    // 添加回车事件监听
    const passwordInput = document.getElementById('roomPasswordInput');
    if (passwordInput) {
      passwordInput.onkeydown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          submitRoomPassword();
        }
      };
      // 自动聚焦密码输入框 
      if (!navigator.userAgent.match(/Android/i) && !navigator.userAgent.match(/iPhone/i) && !navigator.userAgent.match(/iPad/i) && !navigator.userAgent.match(/iPod/i)) {
        setTimeout(() => passwordInput.focus(), 0);
      }
    }
  } else {
    // 没有roomId，显示主界面
    if (appContainer) appContainer.style.display = 'flex';
    if (passwordModal) passwordModal.style.display = 'none';
    // 连接WebSocket
    connectWebSocket();
  }
}

// 提交房间密码
function submitRoomPassword() {
  const passwordInput = document.getElementById('roomPasswordInput');
  roomPassword = passwordInput.value;
  
  if (!roomPassword) {
    alert('请输入密码');
    return;
  } else {
    roomPassword = MD5(roomPassword);
  }
  
  // 隐藏密码输入框，显示主界面
  const passwordModal = document.getElementById('passwordModal');
  if (passwordModal) passwordModal.style.display = 'none';
  const appContainer = document.querySelector('.app-container');
  if (appContainer) appContainer.style.display = 'flex';
  
  // 连接WebSocket
  connectWebSocket();
}

// 连接WebSocket
function connectWebSocket() {
  const roomId = window.location.pathname.split('/')[1];
  const wsUrlWithPassword = wsUrl.replace(/\/$/g, '') + '/' + roomId + (roomPassword ? '/' + roomPassword : '');
  signalingServer = new WebSocket(wsUrlWithPassword);
  
  signalingServer.onopen = () => {
    console.log('Connected to signaling server');
    
    // 读取保存的昵称
    const match = document.cookie.match(/nickname=([^;]+)/);
    if (match) {
      currentNickname = decodeURIComponent(match[1]);
    }
    
    setInterval(() => {
      signalingServer.send(JSON.stringify({type: '9999'}));
    }, 1000 * 10);
  }

  signalingServer.onmessage = ({ data: responseStr }) => {
    const response = JSON.parse(responseStr);
    const { type, data } = response;

    if (type === '1001') {
      me.id = data.id;
      me.roomId = data.roomId;
      if (roomId && me.roomId !== roomId) {
        addChatItem('system', '房间密码错误，已切换至内网频道');
        return;
      }
      if (me.roomId) {
        document.getElementById('roomTitle').textContent = `房间: ${me.roomId}`;
      } else {
        document.getElementById('roomTitle').textContent = '内网频道';
      }
      if (data.turns && data.turns.length > 0) {
        window.fgdx_configuration.iceServers.push(...data.turns)
      }
      // 如果有保存的昵称，发送给服务器
      if (currentNickname) {
        signalingServer.send(JSON.stringify({
          uid: me.id,
          targetId: me.id,
          type: '9004',
          data: { nickname: currentNickname }
        }));
      }
      return;
    }
    if (type === '1002') {
      refreshUsers(data);
      return;
    }
    if (type === '1003') {
      joinedRoom()
      return;
    }
    if (type === '1004') {
      addCandidate(data);
      return;
    }
    if (type === '1005') {
      joinConnection(data);
      return;
    }
    if (type === '1006') {
      joinedConnection(data);
      return;
    }
    if (type === '1007') {
      const user = users.find(u => u.id === data.id);
      if (user) {
        user.nickname = data.nickname;
        refreshUsersHTML();
      }
      return;
    }
    if (type === '1008') {
      handleCreateRoomResult(data);
      return;
    }
  }

  signalingServer.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (error.target.readyState === WebSocket.CLOSED) {
      alert('密码错误或连接失败');
      // 显示密码输入框，隐藏主界面
      const appContainer = document.querySelector('.app-container');
      if (appContainer) appContainer.style.display = 'none';
      const passwordModal = document.getElementById('passwordModal');
      if (passwordModal) {
        passwordModal.style.display = 'block';
        document.getElementById('roomPasswordInput').value = '';
        document.getElementById('roomPasswordInput').focus();
      }
    }
  };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);

function setRemote() {
  me.setRemoteSdp(remoteSDP.value);
}

async function copy(e, msg) {
  const currentTarget = e.currentTarget
  function copySuccess() {
    currentTarget.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `
    const timer = setTimeout(() => {
      currentTarget.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `
      clearTimeout(timer)
    }, 1000);
  }
  function fallbackCopy() {
    const textarea = document.createElement('textarea');
    textarea.value = msg;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    copySuccess()
  }
  try {
    await navigator.clipboard.writeText(msg);
    copySuccess()
  } catch (error) {
    fallbackCopy()
  }
}

function addLinkItem(uid, file) {
  const chatBox = document.querySelector('.chat-wrapper');
  const chatItem = document.createElement('div');
  const isMe = uid === me.id;
  chatItem.className = `chat-item ${isMe ? 'me' : ''}`;
  
  const user = users.find(u => u.id === uid);
  const displayName = user?.nickname || uid;
  
  // 检查是否是图片文件
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
  
  let contentHtml = '';
  if (isImage) {
    contentHtml = `
      <div class="image-preview">
        <img src="${file.url}" alt="${file.name}" />
      </div>
      <button class="copy-btn" onclick="this.parentElement.querySelector('a').click()">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </button>
      <a href="${file.url}" download="${file.name}" style="display: none;"></a>
    `;
  } else {
    contentHtml = `
      <a class="file" href="${file.url}" download="${file.name}">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
        <span>${file.name}</span>
      </a>`;
  }
  
  chatItem.innerHTML = `
    <div class="chat-item_user">${isMe ? '（我）': ''}${displayName}</div>
    <div class="chat-item_content">${contentHtml}</div>
  `;
  
  // 如果是图片，添加点击事件和加载完成后的滚动
  if (isImage) {
    const img = chatItem.querySelector('img');
    img.onclick = function() {
      // 创建一个新的图片元素来预览
      const previewImg = new Image();
      previewImg.src = this.src;
      
      // 等待图片加载完成
      previewImg.onload = function() {
        // 创建一个新的窗口
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
          // 设置预览窗口的内容
          previewWindow.document.write(`
            <html>
              <head>
                <title>${file.name}</title>
                <style>
                  body {
                    margin: 0;
                    padding: 20px;
                    background: #1a1a1a;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                  }
                  img {
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                  }
                </style>
              </head>
              <body>
                <img src="${previewImg.src}" alt="${file.name}" />
              </body>
            </html>
          `);
          previewWindow.document.close();
        }
      };
    };

    // 等待图片加载完成后再滚动
    img.onload = function() {
      chatBox.scrollTop = chatBox.scrollHeight;
    };
  }
  
  chatBox.appendChild(chatItem);
  
  // 如果不是图片，立即滚动
  if (!isImage) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

function addChatItem(uid, message, isBubble = false) {
  // 如果是系统控制消息（以##开头），不显示在聊天记录中
  try {
    if (typeof message === 'string' && message.startsWith('##')) {
      return;
    }
    const parsed = JSON.parse(message);
    if (parsed.type && parsed.type.startsWith('##')) {
      return;
    }
  } catch {
    // 不是JSON消息，继续正常处理
  }

  const chatBox = document.querySelector('.chat-wrapper');
  const chatItem = document.createElement('div');
  const isMe = uid === me.id;
  const isSystem = uid === 'system';
  chatItem.className = `chat-item ${isMe ? 'me' : ''}`;
  
  const copyText = message;
  let msg = message;
  
  // 只有非系统消息才进行 HTML 转义和 URL 自动链接
  if (!isSystem) {
    msg = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // 判断是否url，兼容端口号和带参数的网址
    if (/(http|https):\/\/[^\s<>"']+/g.test(msg)) {
      msg = msg.replace(/(http|https):\/\/[^\s<>"']+/g, (url) => {
        return `<a href="${url}" target="_blank">${url}</a>`;
      });
    }
  }

  const user = users.find(u => u.id === uid);
  const displayName = isSystem ? '系统' : (user?.nickname || uid);

  const copyButton = document.createElement('button')
  copyButton.className = 'copy-btn'
  copyButton.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>`
  copyButton.onclick = function () {
    copy(event,copyText)
  }

  if (isSystem && !isBubble) {
    chatItem.innerHTML = `<div class="chat-item_user system">${msg}</div>`;
  } else {
    chatItem.innerHTML = `
      <div class="chat-item_user">${isMe ? '（我）': ''}${displayName}</div>
      <div class="chat-item_content">
        <pre>${msg}</pre>
      </div>
    `;
    chatItem.querySelector('.chat-item_content').appendChild(copyButton);
  }
  
  chatBox.appendChild(chatItem);
  chatBox.scrollTop = chatBox.scrollHeight;
}
function sendMessage(msg) {
  const messageInput = document.getElementById('messageInput');
  const message = msg ?? messageInput?.value;
  if (!message) return;
  
  addChatItem(me.id, message);
  users.forEach(u => {
    if (u.isMe) {
      return;
    }
    u.sendMessage(message);
  });
  if (messageInput) {
    messageInput.value = '';
    messageInput.style.height = '36px';
    messageInput.style.overflowY = 'hidden';
  }
}

async function sendFile(file) {
  pendingFile = file;
  
  const otherUsers = users.filter(u => !u.isMe);
  
  if (otherUsers.length === 1) {
    const modal = document.getElementById('userSelectModal');
    const progressContainer = modal.querySelector('.progress-container');
    const progressBar = modal.querySelector('.progress-bar-inner');
    const progressText = modal.querySelector('.progress-text');
    
    try {
      const user = otherUsers[0];
      currentTransferUser = user;
      const fileInfo = { name: file.name, size: file.size };
      
      // 显示进度条
      modal.style.display = 'block';
      document.getElementById('userSelectList').style.display = 'none';
      modal.querySelector('.modal-footer').style.display = 'block';
      modal.querySelector('.modal-footer button:last-child').style.display = 'none';
      progressContainer.style.display = 'block';
      
      // 创建进度回调
      const onProgress = (sent, total) => {
        const progress = (sent / total) * 100;
        progressBar.style.width = progress + '%';
        // 计算传输速度
        const speed = sent / (Date.now() - startTime) * 1000; // 字节/秒
        const speedText = speed > 1024 * 1024 
          ? `${(speed / (1024 * 1024)).toFixed(2)} MB/s`
          : `${(speed / 1024).toFixed(2)} KB/s`;
        const displayName = user.nickname || user.id;
        progressText.textContent = `正在发送给 ${displayName}... ${speedText}`;
      };
      
      const startTime = Date.now();
      await user.sendFile(fileInfo, file, onProgress);
      const displayName = user.nickname || user.id;
      addChatItem(me.id, `[文件] ${fileInfo.name} (发送给: ${displayName})`);
    } catch (error) {
      console.error('发送文件失败:', error);
      alert('发送文件失败，请重试');
    } finally {
      currentTransferUser = null;
      // 恢复界面状态
      modal.style.display = 'none';
      document.getElementById('userSelectList').style.display = 'block';
      modal.querySelector('.modal-footer').style.display = 'block';
      modal.querySelector('.modal-footer button:last-child').style.display = 'inline-block';
      progressContainer.style.display = 'none';
      progressBar.style.width = '0%';
    }
    
    pendingFile = null;
    return;
  }
  
  showUserSelectModal();
}
function registCandidate() {
  for (const ca of JSON.parse(candidate.value)) {
    me.addIceCandidate(ca);
  }
}


function connectAllOther() {
  if (users.length <= 1) {
    return;
  }
  const targets = users.filter(u => u.id !== me.id);
  for (const target of targets) {
    target.onicecandidate = (candidate) => {
      // console.log('candidate', candidate);
      signalingServer.send(JSON.stringify({uid: me.id, targetId: target.id, type: '9001', data: { candidate }}));
    }
    target.createConnection().then(() => {
      // console.log('targetAddr', target.connAddressMe);
      signalingServer.send(JSON.stringify({uid: me.id, targetId: target.id, type: '9002', data: { targetAddr: target.connAddressMe }}));
    })
  }
}


function refreshUsers(data) {
  resUsers = data.map(
    u => {
      let uOld = users.find(uOld => uOld.id === u.id)
      if (uOld) {
        // 保持原有昵称
        u.nickname = u.nickname || uOld.nickname;
        return uOld;
      }
      let xchatUser = new XChatUser();
      xchatUser.id = u.id;
      xchatUser.isMe = u.id === me.id;
      xchatUser.nickname = u.nickname; // 设置昵称
      
      xchatUser.onConnectionStateChange = (state) => {
        console.log(`User ${xchatUser.id} connection state: ${state}`);
        refreshUsersHTML();
      };
      
      return xchatUser;
    }
  );

  // 找出删除的用户
  const delUsers = users.filter(u => !resUsers.find(u2 => u2.id === u.id));
  delUsers.forEach(u => {
    u.closeConnection();
  });

  users = resUsers;
  for (const u of users) {
    u.onmessage = (msg) => {
      addChatItem(u.id, msg);
    }
    u.onReviceFile = (file) => {
      addLinkItem(u.id, file);
    }
  }
  refreshUsersHTML();
}

function joinedRoom() {
  connectAllOther();
}

function addCandidate(data) {
  users.find(u => u.id === data.targetId).addIceCandidate(data.candidate);
}
async function joinConnection(data) {
  const user = users.find(u => u.id === data.targetId)
  if (!user) {
    return;
  }
  user.onicecandidate = (candidate) => {
    // console.log('candidate', candidate);
    signalingServer.send(JSON.stringify({uid: me.id, targetId: user.id, type: '9001', data: { candidate }}));
  }
  await user.connectTarget(data.offer.sdp)
  signalingServer.send(JSON.stringify({uid: me.id, targetId: user.id, type: '9003', data: { targetAddr: user.connAddressMe }}));
}

async function joinedConnection(data) {
  const target = users.find(u => u.id === data.targetId)
  if (!target) {
    return;
  }
  await target.setRemoteSdp(data.answer.sdp);
  refreshUsersHTML();
}

function refreshUsersHTML() {
  document.querySelector('#users').innerHTML = users.map(u => {
    const isConnected = u.isMe || u.isConnected();
    const displayName = u.nickname || u.id;
    const initial = displayName.charAt(0).toUpperCase();
    
    return `
      <li class="user-item">
        <div class="user-avatar" style="background-color: ${isConnected ? 'var(--primary)' : 'var(--text-muted)'}">
          ${initial}
        </div>
        <div class="user-info">
          <div class="user-name">${displayName}${u.isMe ? '（我）' : ''}</div>
          <div class="user-status" style="font-size: 0.7rem; color: var(--text-muted)">
            ${isConnected ? '在线' : '离线'}
          </div>
        </div>
      </li>
    `;
  }).join('');
}

function enterTxt(event) {
  if (event.ctrlKey || event.shiftKey) {
    return;
  }
  if (event.keyCode === 13) {
    sendMessage();
    event.preventDefault();
  }
}

function showUserSelectModal() {
  const modal = document.getElementById('userSelectModal');
  const userList = document.getElementById('userSelectList');
  if (!modal || !userList) return;
  
  // 清空之前的列表
  userList.innerHTML = '';
  
  // 添加用户选项
  users.forEach(user => {
    if (!user.isMe) {
      const item = document.createElement('div');
      item.className = 'user-select-item';
      const displayName = user.nickname || user.id;
      const initial = displayName.charAt(0).toUpperCase();
      const isConnected = user.isConnected();
      
      item.innerHTML = `
        <label>
          <input type="checkbox" value="${user.id}">
          <div class="user-avatar" style="background-color: ${isConnected ? 'var(--primary)' : 'var(--text-muted)'}">
            ${initial}
          </div>
          <span>${displayName}</span>
        </label>
      `;
      
      // 点击整行时切换复选框状态
      item.addEventListener('click', (e) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (e.target === checkbox) return;
        checkbox.checked = !checkbox.checked;
        item.classList.toggle('selected', checkbox.checked);
        e.preventDefault();
      });

      // 监听复选框状态变化以切换选中样式
      const checkbox = item.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => {
        item.classList.toggle('selected', checkbox.checked);
      });
      
      userList.appendChild(item);
    }
  });
  
  modal.style.display = 'block';
}

function cancelSendFile() {
  if (currentTransferUser) {
    currentTransferUser.cancelTransfer();
  }
  const modal = document.getElementById('userSelectModal');
  modal.style.display = 'none';
  pendingFile = null;
  currentTransferUser = null;
}

async function confirmSendFile() {
  const modal = document.getElementById('userSelectModal');
  if (!modal) return;
  const sendButton = modal.querySelector('.modal-footer button:last-child');
  const progressContainer = modal.querySelector('.progress-container');
  const progressBar = modal.querySelector('.progress-bar-inner');
  const progressText = modal.querySelector('.progress-text');
  const userList = document.getElementById('userSelectList');
  if (!sendButton || !progressContainer || !progressBar || !progressText || !userList) return;

  const selectedUsers = Array.from(document.querySelectorAll('#userSelectList input[type="checkbox"]:checked'))
    .map(checkbox => users.find(u => u.id === checkbox.value));
  
  if (selectedUsers.length > 0 && pendingFile) {
    sendButton.disabled = true;
    sendButton.textContent = '发送中...';
    userList.style.display = 'none';
    progressContainer.style.display = 'block';
    
    try {
      const fileInfo = { name: pendingFile.name, size: pendingFile.size };
      const totalUsers = selectedUsers.length;
      const startTime = Date.now();
      
      for (let i = 0; i < selectedUsers.length; i++) {
        const user = selectedUsers[i];
        const displayName = user.nickname || user.id;
        progressText.textContent = `正在发送给 ${displayName}... (${i + 1}/${totalUsers})`;
        
        const onProgress = (sent, total) => {
          const userProgress = (sent / total) * 100;
          const totalProgress = ((i * 100) + userProgress) / totalUsers;
          progressBar.style.width = totalProgress + '%';
          // 计算传输速度
          const speed = sent / (Date.now() - startTime) * 1000; // 字节/秒
          const speedText = speed > 1024 * 1024 
            ? `${(speed / (1024 * 1024)).toFixed(2)} MB/s`
            : `${(speed / 1024).toFixed(2)} KB/s`;
          progressText.textContent = `正在发送给 ${displayName}... (${i + 1}/${totalUsers}) ${speedText}`;
        };
        
        await user.sendFile(fileInfo, pendingFile, onProgress);
      }
      
      // 使用昵称显示在聊天记录中
      const displayNames = selectedUsers.map(u => u.nickname || u.id).join(', ');
      addChatItem(me.id, `[文件] ${fileInfo.name} (发送给: ${displayNames})`);
    } catch (error) {
      console.error('发送文件失败:', error);
      alert('发送文件失败，请重试');
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = '发送';
      userList.style.display = 'block';
      progressContainer.style.display = 'none';
      progressBar.style.width = '0%';
    }
  }
  
  modal.style.display = 'none';
  pendingFile = null;
}


let droptarget = document.body;
    
async function handleEvent(event) {
  event.preventDefault();
  if (event.type === 'drop') {
    droptarget.classList.remove('dragover');
    if (event.dataTransfer.files.length > 0) {
      await sendFile(event.dataTransfer.files[0]);
    }
  } else if (event.type === 'dragleave') {
    droptarget.classList.remove('dragover');
  } else {
    droptarget.classList.add('dragover');
  }
}

droptarget.addEventListener("dragenter", handleEvent);
droptarget.addEventListener("dragover", handleEvent);
droptarget.addEventListener("drop", handleEvent);
droptarget.addEventListener("dragleave", handleEvent);

function showNicknameModal() {
  const modal = document.getElementById('nicknameModal');
  const input = document.getElementById('nicknameInput');
  input.value = currentNickname.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  modal.style.display = 'block';
  
  // 自动获取焦点
  setTimeout(() => input.focus(), 0);
  
  // 添加回车事件监听
  input.onkeydown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // 阻止默认的回车行为
      saveNickname();
    }
  };
}

function closeNicknameModal() {
  const modal = document.getElementById('nicknameModal');
  const input = document.getElementById('nicknameInput');
  modal.style.display = 'none';
  
  // 清除回车事件监听
  input.onkeydown = null;
}

function saveNickname() {
  const input = document.getElementById('nicknameInput');
  let nickname = input.value.trim();
  
  if (nickname) {
    nickname = nickname.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    currentNickname = nickname;
    document.cookie = `nickname=${encodeURIComponent(nickname)}; path=/; max-age=31536000`; // 保存一年
    
    // 更新本地显示
    const user = users.find(u => u.id === me.id);
    if (user) {
      user.nickname = nickname;
      refreshUsersHTML();
    }
    
    // 发送到服务器
    signalingServer.send(JSON.stringify({
      uid: me.id,
      targetId: me.id,
      type: '9004',
      data: { nickname }
    }));
  }
  
  closeNicknameModal();
}

// Add event listener for toggle button and overlay
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  const closeSidebar = document.getElementById('closeSidebar');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobileOverlay');
  
  function toggleSidebar() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  }
  
  menuBtn?.addEventListener('click', toggleSidebar);
  closeSidebar?.addEventListener('click', toggleSidebar);
  overlay?.addEventListener('click', toggleSidebar);

  // Hide users list by default on mobile
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  }

  // 其他按钮事件
  document.querySelector('.file-btn')?.addEventListener('click', async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e) => {
      if (e.target.files.length > 0) {
        await sendFile(e.target.files[0]);
      }
    };
    input.click();
  });

  document.querySelector('.send-btn')?.addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    if (messageInput && messageInput.value.trim()) {
      sendMessage();
    }
  });

  const messageInput = document.getElementById('messageInput');
  if (messageInput) {
    messageInput.addEventListener('input', function() {
      this.style.height = '36px';
      const newHeight = Math.min(this.scrollHeight, 150);
      this.style.height = newHeight + 'px';
      this.style.overflowY = this.scrollHeight > 150 ? 'auto' : 'hidden';
    });
  }

  document.querySelector('.nickname-btn')?.addEventListener('click', showNicknameModal);
  document.querySelector('.create-room-btn')?.addEventListener('click', showCreateRoomModal);
  document.getElementById('qrcodeBtn')?.addEventListener('click', showQrcodeModal);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const isDark = current === 'dark' || (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      const icon = next === 'dark' ? './favicon.ico' : './favicon1.ico';
      document.querySelector('link[rel="icon"]').href = icon;
      const logoImg = document.getElementById('logoImg');
      if (logoImg) logoImg.src = icon;
    });
  }

  // 添加粘贴事件监听
  document.addEventListener('paste', async (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          // 创建一个新的 File 对象，确保有正确的文件名
          const imageFile = new File([file], `pasted-image-${Date.now()}.png`, {
            type: 'image/png'
          });
          await sendFile(imageFile);
        }
        break;
      }
    }
  });
});

function showCreateRoomModal() {
  const modal = document.getElementById('createRoomModal');
  const result = document.getElementById('createRoomResult');
  if (!modal || !result) return;
  result.style.display = 'none';
  const roomIdInput = document.getElementById('newRoomIdInput');
  if (roomIdInput) roomIdInput.value = '';
  const pwdInput = document.getElementById('newRoomPwdInput');
  if (pwdInput) pwdInput.value = '';
  const pwdConfirmInput = document.getElementById('newRoomPwdConfirmInput');
  if (pwdConfirmInput) pwdConfirmInput.value = '';
  modal.style.display = 'block';
  if (roomIdInput) setTimeout(() => roomIdInput.focus(), 0);
}

function closeCreateRoomModal() {
  document.getElementById('createRoomModal').style.display = 'none';
}

function submitCreateRoom() {
  const roomId = document.getElementById('newRoomIdInput').value.trim();
  const pwd = document.getElementById('newRoomPwdInput').value;
  const pwdConfirm = document.getElementById('newRoomPwdConfirmInput').value;

  if (!roomId || roomId.length < 2 || roomId.length > 32) {
    alert('房间号长度需在2-32个字符之间');
    return;
  }
  if (!pwd) {
    alert('请输入密码');
    return;
  }
  if (pwd !== pwdConfirm) {
    alert('两次输入的密码不一致');
    return;
  }

  signalingServer.send(JSON.stringify({
    uid: me.id,
    targetId: me.id,
    type: '9005',
    data: { roomId, pwd: MD5(pwd) }
  }));
}

function handleCreateRoomResult(data) {
  if (data.success) {
    const roomUrl = `${window.location.origin}/${data.roomId}`;
    // 创建成功后关闭弹窗
    closeCreateRoomModal();
    addChatItem('system', `系统消息：房间创建成功 <a href="${roomUrl}" target="_blank">${roomUrl}</a>`, true);
  } else {
    // 失败时继续显示弹窗并提示
    const result = document.getElementById('createRoomResult');
    if (result) {
      result.querySelector('.result-label').textContent = data.message || '创建失败';
      result.querySelector('.result-label').style.color = '#ef4444';
      result.style.background = 'rgba(239, 68, 68, 0.1)';
      result.style.borderColor = 'rgba(239, 68, 68, 0.2)';
      result.style.display = 'block';
    } else {
      alert(data.message || '创建失败');
    }
  }
}

function copyRoomUrl() {
  const url = document.querySelector('#createRoomResult .result-url').textContent;
  const btn = document.querySelector('.copy-url-btn');
  
  function copySuccess() {
    btn.classList.add('success');
    const originalIcon = btn.innerHTML;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    setTimeout(() => {
      btn.classList.remove('success');
      btn.innerHTML = originalIcon;
    }, 2000);
  }

  try {
    navigator.clipboard.writeText(url).then(copySuccess);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    copySuccess();
  }
}

let qrcodeInstance = null;
let serverPublicUrl = '';

async function getServerUrl() {
  const hostname = window.location.hostname;
  
  if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  try {
    const res = await fetch('/api/server-info');
    const data = await res.json();
    const protocol = window.location.protocol;
    return `${protocol}//${data.ip}:${data.port}`;
  } catch {
    return `${window.location.protocol}//${window.location.host}`;
  }
}

async function showQrcodeModal() {
  const modal = document.getElementById('qrcodeModal');
  const qrcodeDiv = document.getElementById('qrcode');
  const qrcodeUrl = document.getElementById('qrcodeUrl');
  if (!modal || !qrcodeDiv || !qrcodeUrl) return;
  
  const serverBase = await getServerUrl();
  const roomPath = window.location.pathname;
  serverPublicUrl = `${serverBase}${roomPath}`;
  
  qrcodeUrl.textContent = serverPublicUrl;
  
  qrcodeDiv.innerHTML = '';
  
  qrcodeInstance = new QRCode(qrcodeDiv, {
    text: serverPublicUrl,
    width: 200,
    height: 200,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
  
  modal.style.display = 'block';
  
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeQrcodeModal();
    }
  };
}

function closeQrcodeModal() {
  const modal = document.getElementById('qrcodeModal');
  if (modal) modal.style.display = 'none';
}

function copyQrcodeUrl() {
  const url = serverPublicUrl || window.location.href;
  const btn = document.querySelector('.qrcode-copy-btn');
  
  function copySuccess() {
    if (!btn) return;
    btn.classList.add('success');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>已复制</span>
    `;
    setTimeout(() => {
      btn.classList.remove('success');
      btn.innerHTML = originalHTML;
    }, 2000);
  }

  try {
    navigator.clipboard.writeText(url).then(copySuccess);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    copySuccess();
  }
}