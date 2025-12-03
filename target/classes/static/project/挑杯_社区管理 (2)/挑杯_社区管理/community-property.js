// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 模拟管理员权限判断（实际项目中应根据登录状态判断）
    const isAdmin = false; // 改为true可显示管理员功能
    if (isAdmin) {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'block';
        });
    }

    // 修复功能模块跳转问题
    fixFeatureLinks();

    // 加载公告数据
    loadAnnouncements();

    // 居民交流区发送消息
    const residentChat = document.getElementById('residentChat');
    const residentMessage = document.getElementById('residentMessage');
    const sendResidentMsg = document.getElementById('sendResidentMsg');

    if (sendResidentMsg) {
        sendResidentMsg.addEventListener('click', function() {
            sendMessage(residentMessage, residentChat, true);
        });
    }

    if (residentMessage) {
        residentMessage.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(residentMessage, residentChat, true);
            }
        });
    }

    // 对物业说区域发送消息
    const propertyChat = document.getElementById('propertyChat');
    const propertyMessage = document.getElementById('propertyMessage');
    const sendPropertyMsg = document.getElementById('sendPropertyMsg');

    if (sendPropertyMsg) {
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
    }

    if (propertyMessage) {
        propertyMessage.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (sendPropertyMsg) sendPropertyMsg.click();
            }
        });
    }

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

    // 修复功能模块链接跳转的函数
    function fixFeatureLinks() {
        const featureLinks = document.querySelectorAll('.features-grid .more-link');

        featureLinks.forEach(link => {
            // 移除所有现有的事件监听器
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);

            // 重新添加点击事件，确保可以跳转
            newLink.addEventListener('click', function(e) {
                // 检查链接是否有效
                const href = this.getAttribute('href');
                if (!href || href === '#' || href === 'javascript:void(0)') {
                    e.preventDefault();
                    console.warn('无效的链接:', href);
                    return;
                }

                // 允许正常跳转，不阻止默认行为
                console.log('跳转到:', href);
                // 默认行为会自动跳转，不需要额外处理
            });
        });

        // 移除可能存在的全局事件监听器
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('more-link')) {
                const href = e.target.getAttribute('href');
                if (href && href !== '#' && href !== 'javascript:void(0)') {
                    // 如果是有效的功能模块链接，不阻止默认行为
                    return;
                }
            }
        }, true);
    }

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
        if (chatArea) {
            chatArea.appendChild(messageItem);
            // 滚动到底部
            chatArea.scrollTop = chatArea.scrollHeight;
        }

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

    // 从后端加载公告数据
    function loadAnnouncements() {
        fetch('http://localhost:8080/user/notice')
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                return response.json();
            })
            .then(data => {
                console.log('后端返回的数据:', data);

                if (data.code === 1 && data.data) {
                    displayAnnouncements(data.data);
                } else {
                    console.error('获取公告数据失败:', data);
                    displayDefaultAnnouncements();
                }
            })
            .catch(error => {
                console.error('获取公告数据时出错:', error);
                displayDefaultAnnouncements();
            });
    }

    // 显示公告数据
    function displayAnnouncements(announcements) {
        const announcementList = document.getElementById('announcementList');
        if (!announcementList) return;

        announcementList.innerHTML = '';

        if (!announcements || announcements.length === 0) {
            announcementList.innerHTML = '<div class="no-announcement">暂无公告</div>';
            return;
        }

        announcements.forEach(announcement => {
            const announcementItem = document.createElement('div');
            announcementItem.className = 'announcement-item';

            const publishDate = announcement.publishTime || new Date().toISOString().split('T')[0];

            announcementItem.innerHTML = `
                <div class="announcement-title">
                    <span>${announcement.title || '无标题'}</span>
                    <span class="announcement-date">${publishDate}</span>
                </div>
                <div class="announcement-content">${announcement.content || '无内容'}</div>
                <div class="admin-actions admin-only">
                    <button class="btn btn-edit">编辑</button>
                    <button class="btn btn-delete">删除</button>
                </div>
            `;

            announcementList.appendChild(announcementItem);
            bindAnnouncementActions(announcementItem);
        });
    }

    // 显示默认示例公告
    function displayDefaultAnnouncements() {
        const announcementList = document.getElementById('announcementList');
        if (!announcementList) return;

        announcementList.innerHTML = `
            <div class="announcement-item">
                <div class="announcement-title">
                    <span>关于小区绿化改造的通知</span>
                    <span class="announcement-date">2025-11-01</span>
                </div>
                <div class="announcement-content">
                    为提升小区环境质量，将于11月10日起进行绿化改造工程，工期预计7天，期间可能会有噪音影响，敬请谅解。
                </div>
                <div class="admin-actions admin-only">
                    <button class="btn btn-edit">编辑</button>
                    <button class="btn btn-delete">删除</button>
                </div>
            </div>
            <div class="announcement-item">
                <div class="announcement-title">
                    <span>11月份物业费缴纳通知</span>
                    <span class="announcement-date">2025-10-28</span>
                </div>
                <div class="announcement-content">
                    11月份物业费缴纳通道已开启，可通过本平台"物业缴费"模块进行在线支付，缴费截止日期为11月15日。
                </div>
                <div class="admin-actions admin-only">
                    <button class="btn btn-edit">编辑</button>
                    <button class="btn btn-delete">删除</button>
                </div>
            </div>
        `;

        document.querySelectorAll('.announcement-item').forEach(item => {
            bindAnnouncementActions(item);
        });
    }
});