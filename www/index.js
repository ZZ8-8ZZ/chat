var users = [];
var me = new XChatUser();

function setRemote() {
  me.setRemoteSdp(remoteSDP.value);
}
function addLinkItem(uid, file) {
  const chatBox = document.querySelector('.chat-wrapper');
  const chatItem = document.createElement('div');
  chatItem.className = `chat-item${uid === me.id ? ' me' : ''}`;
  const avatar = getUserAvatar(uid);
  const time = formatTime(new Date());
  
  // 判断文件类型
  const fileType = getFileType(file.name);
  let contentHtml = '';
  
  // 创建 blob URL
  const fileUrl = file.url || URL.createObjectURL(file);
  
  if (fileType === 'image') {
    contentHtml = `
      <div class="media-content">
        <img src="${fileUrl}" alt="${file.name}" onclick="showMediaPreview('${fileUrl}', 'image')">
      </div>
      <a class="file" href="${fileUrl}" download="${file.name}">[图片] ${file.name}</a>
    `;
  } else if (fileType === 'video') {
    contentHtml = `
      <div class="media-content">
        <video src="${fileUrl}" controls></video>
      </div>
      <a class="file" href="${fileUrl}" download="${file.name}">[视频] ${file.name}</a>
    `;
  } else {
    contentHtml = `<a class="file" href="${fileUrl}" download="${file.name}">[文件] ${file.name}</a>`;
  }

  chatItem.innerHTML = `
    <div class="chat-item_user">
      <div class="user-avatar" style="background-color: ${avatar.color}">${avatar.text}</div>
      ${uid === me.id ? '（我）': ''}${uid}
    </div>
    <div class="chat-item_content">
      ${contentHtml}
      <div class="message-time">${time}</div>
    </div>
  `;
  chatBox.appendChild(chatItem);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addChatItem(uid, message) {
  const chatBox = document.querySelector('.chat-wrapper');
  const chatItem = document.createElement('div');
  chatItem.className = `chat-item${uid === me.id ? ' me' : ''}`;
  let msg = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  if (/(http|https):\/\/[a-zA-Z0-9\.\-\/\?=\:_]+/g.test(msg)) {
    msg = msg.replace(/(http|https):\/\/[a-zA-Z0-9\.\-\/\?=\:_]+/g, (url) => {
      return `<a href="${url}" target="_blank">${url}</a>`;
    });
  }

  const avatar = getUserAvatar(uid);
  const time = formatTime(new Date());
  chatItem.innerHTML = `
    <div class="chat-item_user">
      <div class="user-avatar" style="background-color: ${avatar.color}">${avatar.text}</div>
      ${uid === me.id ? '（我）': ''}${uid}
    </div>
    <div class="chat-item_content">
      <pre>${msg}</pre>
      <div class="message-time">${time}</div>
    </div>
  `;
  chatBox.appendChild(chatItem);
  chatBox.scrollTop = chatBox.scrollHeight;
}
function sendMessage(msg) {
  const message = msg ?? messageInput.value;
  addChatItem(me.id, message);
  users.forEach(u => {
    if (u.isMe) {
      return;
    }
    u.sendMessage(message);
  });
  messageInput.value = '';
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
      const fileInfo = { name: file.name, size: file.size };
      
      // 显示进度条
      modal.style.display = 'block';
      document.getElementById('userSelectList').style.display = 'none';
      modal.querySelector('.modal-footer').style.display = 'none';
      progressContainer.style.display = 'block';
      progressText.textContent = `正在发送给 ${user.id}...`;
      
      // 创建进度回调
      const onProgress = (sent, total) => {
        const progress = (sent / total) * 100;
        progressBar.style.width = progress + '%';
      };
      
      await user.sendFile(fileInfo, file, onProgress);
      addChatItem(me.id, `[文件] ${fileInfo.name} (发送给: ${user.id})`);
    } catch (error) {
      console.error('发送文件失败:', error);
      alert('发送文件失败，请重试');
    } finally {
      // 恢复界面状态
      modal.style.display = 'none';
      document.getElementById('userSelectList').style.display = 'block';
      modal.querySelector('.modal-footer').style.display = 'block';
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
  // 找出新加入的用户
  const newUsers = data.filter(u => !users.find(uOld => uOld.id === u.id));
  
  // 找出退出的用户
  const delUsers = users.filter(u => !data.find(u2 => u2.id === u.id));
  
  resUsers = data.map(
    u => {
      let uOld = users.find(uOld => uOld.id === u.id)
      if (uOld) {
        return uOld;
      }
      let xchatUser = new XChatUser();
      xchatUser.id = u.id;
      xchatUser.isMe = u.id === me.id;
      return xchatUser;
    }
  );

  // 处理退出的用户
  delUsers.forEach(u => {
    u.closeConnection();
    // 显示用户
    addSystemMessage(`${u.id} 退出了聊天室`);
  });

  // 处理新加入的用户
  newUsers.forEach(u => {
    // 显示用户加入消息
    if (me.id) { // 确保自己已经获得ID后再显示其他人的加入消息
      addSystemMessage(`${u.id} 加入了聊天室`);
    }
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
}

function refreshUsersHTML() {
  const userCount = users.length;
  document.querySelector('#users').innerHTML = users.map(u => {
    const avatar = getUserAvatar(u.id);
    return `
      <li>
        <div class="user-avatar" style="background-color: ${avatar.color}">${avatar.text}</div>
        <span>${u.id}</span>
        ${u.isMe ? '<span class="current-user">（我）</span>' : ''}
      </li>
    `;
  }).join('');
  // 更新所有用户数量显示
  document.querySelectorAll('.count').forEach(el => {
    el.textContent = userCount;
  });
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

// 连接信令服务器
const signalingServer = new WebSocket('wss://neiwang.1024bugs.com/ws');

signalingServer.onopen = () => {
  console.log('Connected to signaling server');
  setInterval(() => {
    signalingServer.send(JSON.stringify({type: '9999'}));
  }, 1000 * 10);
}
signalingServer.onmessage = ({ data: responseStr }) => {
  const response = JSON.parse(responseStr);
  const { type, data } = response;


  if (type === '1001') {
    me.id = data.id;
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
}

function showUserSelectModal() {
  const modal = document.getElementById('userSelectModal');
  const userList = document.getElementById('userSelectList');
  
  // 清空之前的列表
  userList.innerHTML = '';
  
  // 获取除自己外的用户列表
  const otherUsers = users.filter(user => !user.isMe);
  
  // 添加用户选项
  otherUsers.forEach(user => {
    const item = document.createElement('div');
    item.className = 'user-select-item';
    
    item.innerHTML = `
      <label>
        <input type="checkbox" value="${user.id}" class="user-checkbox" ${otherUsers.length > 1 ? 'checked' : ''}>
        <span>${user.id}</span>
      </label>
    `;
    
    // 点击整行时切换复选框状态
    item.addEventListener('click', (e) => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (e.target === checkbox) return;
      
      checkbox.checked = !checkbox.checked;
      e.preventDefault();
    });
    
    userList.appendChild(item);
  });
  
  modal.style.display = 'block';
}

function cancelSendFile() {
  const modal = document.getElementById('userSelectModal');
  modal.style.display = 'none';
  pendingFile = null;
}

async function confirmSendFile() {
  const modal = document.getElementById('userSelectModal');
  const sendButton = modal.querySelector('.modal-footer button:last-child');
  const progressContainer = modal.querySelector('.progress-container');
  const progressBar = modal.querySelector('.progress-bar-inner');
  const progressText = modal.querySelector('.progress-text');
  const userList = document.getElementById('userSelectList');
  
  // 获取选的用户，如果没有选中任何用户且有多个用户，则选择所有用户
  let selectedUsers = Array.from(document.querySelectorAll('#userSelectList input[type="checkbox"]:checked'))
    .map(checkbox => users.find(u => u.id === checkbox.value));
  
  if (selectedUsers.length === 0) {
    selectedUsers = users.filter(u => !u.isMe);
  }
  
  if (selectedUsers.length > 0 && pendingFile) {
    // 禁用发送按钮并显示进度条
    sendButton.disabled = true;
    sendButton.textContent = '发送中...';
    userList.style.display = 'none';
    progressContainer.style.display = 'block';
    
    try {
      const fileInfo = { name: pendingFile.name, size: pendingFile.size };
      const totalUsers = selectedUsers.length;
      
      for (let i = 0; i < selectedUsers.length; i++) {
        const user = selectedUsers[i];
        progressText.textContent = `正在发送给 ${user.id}... (${i + 1}/${totalUsers})`;
        
        const onProgress = (sent, total) => {
          const userProgress = (sent / total) * 100;
          const totalProgress = ((i * 100) + userProgress) / totalUsers;
          progressBar.style.width = totalProgress + '%';
        };
        
        await user.sendFile(fileInfo, pendingFile, onProgress);
      }
      
      addChatItem(me.id, `[文件] ${fileInfo.name} (发送给: ${selectedUsers.map(u => u.id).join(', ')})`);
    } catch (error) {
      console.error('发送文件失败:', error);
      alert('发送文件失败，请重试');
    } finally {
      // 恢复界面状态
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

function initMobileMenu() {
  const onlineUsersBtn = document.querySelector('.online-users');
  const rightPanel = document.querySelector('.right');
  const overlay = document.querySelector('.overlay');
  
  onlineUsersBtn.addEventListener('click', () => {
    rightPanel.classList.toggle('show');
    overlay.classList.toggle('show');
  });

  // 点击遮罩层时关闭菜单
  overlay.addEventListener('click', () => {
    rightPanel.classList.remove('show');
    overlay.classList.remove('show');
  });

  // 点击用户列表中的用户时也关闭菜单
  document.querySelector('#users').addEventListener('click', () => {
    rightPanel.classList.remove('show');
    overlay.classList.remove('show');
  });
}

// 确保在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
});

// 添加获取用户头像的函数
function getUserAvatar(userId) {
  return {
    text: userId.slice(0, 2).toUpperCase(), // 获取前两个字符
    color: getAvatarColor(userId)
  };
}

// 添加生成头像颜色的函数
function getAvatarColor(userId) {
  // 使用用户ID生成一个固定的颜色
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // 生成HSL颜色，保持固定的饱和度和亮度，只改变色相
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 65%)`; // 使用HSL以确保颜色不会太暗或太亮
}

// 添加系统消息的函数
function addSystemMessage(message) {
  const chatBox = document.querySelector('.chat-wrapper');
  const chatItem = document.createElement('div');
  chatItem.className = 'chat-item system';
  chatItem.innerHTML = `
    <div class="chat-item_user">
      <div class="user-avatar system-avatar">系统</div>
      系统消息
    </div>
    <div class="chat-item_content"><pre class="system-message">${message}</pre></div>
  `;
  chatBox.appendChild(chatItem);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 添加格式化时间的辅助函数
function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    sendFile(file);
    // 清空文件输入框，这样同一个文件可以重复选择
    event.target.value = '';
  }
}

// 添加文件类型判断函数
function getFileType(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const videoExts = ['mp4', 'webm', 'ogg'];
  
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  return 'other';
}

// 添加媒体预览函数
function showMediaPreview(url, type) {
  const modal = document.createElement('div');
  modal.className = 'media-preview-modal';
  
  const content = type === 'image' 
    ? `<img src="${url}" alt="预览图片">`
    : `<video src="${url}" controls autoplay></video>`;
    
  modal.innerHTML = `
    <div class="media-preview-content">
      ${content}
    </div>
  `;
  
  // 点击关闭预览
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  document.body.appendChild(modal);
}
