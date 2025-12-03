// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 模拟管理员权限判断（实际项目中应根据登录状态判断）
    const isAdmin = false; // 改为true可显示管理员功能
    if (isAdmin) {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'block';
        });
    }

    // 居民交流区发送消息
    const residentChat = document.getElementById('residentChat');
    const residentMessage = document.getElementById('residentMessage');
    const sendResidentMsg = document.getElementById('sendResidentMsg');

    sendResidentMsg.addEventListener('click', function() {
        sendMessage(residentMessage, residentChat, true);
    });

    residentMessage.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(residentMessage, residentChat, true);
        }
    });

    // 对物业说区域发送消息
    const propertyChat = document.getElementById('propertyChat');
    const propertyMessage = document.getElementById('propertyMessage');
    const sendPropertyMsg = document.getElementById('sendPropertyMsg');

    sendPropertyMsg.addEventListener('click', function() {
        sendMessage(propertyMessage, propertyChat, true);
        
        // 模拟物业回复（2秒后自动回复）
        if (propertyMessage.value.trim()) {
            setTimeout(() => {
                const replyText = "您好，您的反馈已收到，我们会尽快处理并回复您。";
                sendMessage(null, propertyChat, false, '物业管理员', replyText);
            }, 2000);
        }
    });

    propertyMessage.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendPropertyMsg.click();
        }
    });

    // 发布新公告按钮事件
    const addAnnouncement = document.getElementById('addAnnouncement');
    if (addAnnouncement) {
        addAnnouncement.addEventListener('click', function() {
            const title = prompt('请输入公告标题：');
            if (!title) return;
            
            const content = prompt('请输入公告内容：');
            if (!content) return;
            
            // 创建新公告项
            const announcementList = document.getElementById('announcementList');
            const date = new Date();
            const dateStr = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            
            const newAnnouncement = document.createElement('div');
            newAnnouncement.className = 'announcement-item';
            newAnnouncement.innerHTML = `
                <div class="announcement-title">
                    <span>${title}</span>
                    <span class="announcement-date">${dateStr}</span>
                </div>
                <div class="announcement-content">${content}</div>
                <div class="admin-actions admin-only">
                    <button class="btn btn-edit">编辑</button>
                    <button class="btn btn-delete">删除</button>
                </div>
            `;
            
            // 添加到列表顶部
            announcementList.insertBefore(newAnnouncement, announcementList.firstChild);
            
            // 绑定编辑和删除事件
            bindAnnouncementActions(newAnnouncement);
        });
    }

    // 绑定已有公告的编辑和删除事件
    document.querySelectorAll('.announcement-item').forEach(item => {
        bindAnnouncementActions(item);
    });

    // 消息发送通用函数
    function sendMessage(inputElement, chatArea, isOwn, sender = '我', messageText = null) {
        const text = messageText || (inputElement ? inputElement.value.trim() : '');
        if (!text) return;
        
        // 创建消息元素
        const messageItem = document.createElement('div');
        messageItem.className = `message-item ${isOwn ? 'own' : ''}`;
        
        messageItem.innerHTML = `
            <div class="message-sender">${sender}</div>
            <div class="message-bubble">${text}</div>
        `;
        
        // 添加到聊天区域
        chatArea.appendChild(messageItem);
        // 滚动到底部
        chatArea.scrollTop = chatArea.scrollHeight;
        
        // 清空输入框
        if (inputElement) {
            inputElement.value = '';
        }
    }

    // 公告编辑和删除事件绑定
    function bindAnnouncementActions(announcementItem) {
        const editBtn = announcementItem.querySelector('.btn-edit');
        const deleteBtn = announcementItem.querySelector('.btn-delete');
        
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                const titleElement = announcementItem.querySelector('.announcement-title span:first-child');
                const contentElement = announcementItem.querySelector('.announcement-content');
                
                const newTitle = prompt('编辑公告标题：', titleElement.textContent);
                if (newTitle) {
                    titleElement.textContent = newTitle;
                }
                
                const newContent = prompt('编辑公告内容：', contentElement.textContent);
                if (newContent) {
                    contentElement.textContent = newContent;
                }
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                if (confirm('确定要删除这条公告吗？')) {
                    announcementItem.remove();
                }
            });
        }
    }
});