// 完整JavaScript代码（已修复API响应格式问题）
const API_BASE_URL = 'http://localhost:8080';

// 医院数据
const hospitals = [
    {
        id: 1,
        name: "第一社区医院",
        address: "XX市XX区XX路XX号",
        phone: "000-00000000",
        rating: 4.2,
        color: "#a0d2e9"
    },
    {
        id: 2,
        name: "第二社区医院",
        address: "XX市XX区XX路XX号",
        phone: "000-00000000",
        rating: 4.7,
        color: "#c8e6c9"
    },
    {
        id: 3,
        name: "第三社区医院",
        address: "XX市XX区XX路XX号",
        phone: "000-00000000",
        rating: 4.4,
        color: "#ffcdd2"
    }
];

// AI回复逻辑
const aiResponses = {
    "头痛": {
        response: "头痛可能由多种原因引起：\n\n🔹 常见原因：\n• 紧张性头痛\n• 偏头痛\n• 鼻窦炎\n• 颈椎问题\n\n💡 建议措施：\n• 找个安静环境休息\n• 适当补充水分\n• 避免强光和噪音\n• 可尝试温和按摩太阳穴\n\n⚠️ 需要立即就医的情况：\n• 头痛剧烈、突然发作\n• 伴有发烧、视力模糊\n• 头痛持续加重",
        severity: "中等",
        suggestion: "神经内科",
        followUp: "请问头痛是持续性的还是阵发性的？"
    },
    "发烧": {
        response: "发烧是身体对抗感染的正常反应：\n\n🌡️ 体温参考：\n• 37.3-38℃：低热\n• 38.1-39℃：中度发热\n• 39.1-41℃：高热\n\n💡 居家护理：\n• 多喝水，保持水分充足\n• 适当休息，避免劳累\n• 可用温水擦浴物理降温\n• 穿着宽松透气的衣物\n\n⚠️ 需要立即就医的情况：\n• 体温超过39℃\n• 持续发热3天以上\n• 伴有皮疹、呼吸困难",
        severity: "中等",
        suggestion: "发热门诊",
        followUp: "请问您测量体温是多少度？"
    },
    "咳嗽": {
        response: "咳嗽可能的原因：\n\n🔹 咳嗽类型：\n• 干咳：常见于感冒初期\n• 湿咳：伴有痰液\n• 持续性咳嗽：需警惕慢性问题\n\n💡 缓解建议：\n• 多喝温水，保持喉咙湿润\n• 避免吸烟和刺激性气体\n• 使用加湿器保持空气湿润\n• 蜂蜜柠檬水可能有助于缓解\n\n⚠️ 需要就医的情况：\n• 咳嗽持续2周以上\n• 咳血或黄绿色浓痰\n• 伴有胸痛、呼吸困难",
        severity: "轻度",
        suggestion: "呼吸内科",
        followUp: "请问是干咳还是有痰的咳嗽？"
    },
    "胃痛": {
        response: "胃痛可能的原因：\n\n🔹 常见病因：\n• 胃炎\n• 消化不良\n• 胃溃疡\n• 饮食不当\n\n💡 缓解措施：\n• 暂时禁食2-3小时观察\n• 饮食清淡，避免辛辣油腻\n• 少量多餐，细嚼慢咽\n• 可尝试温敷腹部缓解\n\n⚠️ 紧急情况：\n• 疼痛剧烈、持续不退\n• 呕血或黑便\n• 伴有发烧、黄疸",
        severity: "中等",
        suggestion: "消化内科",
        followUp: "请问疼痛在饭前还是饭后更明显？"
    },
    "腹泻": {
        response: "腹泻的处理建议：\n\n💧 预防脱水：\n• 少量多次补充水分\n• 可饮用口服补液盐\n• 避免乳制品和油腻食物\n\n🍚 饮食建议：\n• 清淡易消化的食物\n• 香蕉、米饭、苹果酱、吐司\n• 避免生冷、辛辣食物\n\n⚠️ 需要就医的情况：\n• 腹泻严重，无法进食\n• 持续超过2天\n• 伴有高烧或脱水症状",
        severity: "中等",
        suggestion: "消化内科",
        followUp: "请问一天腹泻几次？"
    },
    "喉咙痛": {
        response: "喉咙痛的处理：\n\n🔹 可能原因：\n• 感冒或流感\n• 扁桃体炎\n• 咽喉炎\n\n💡 缓解方法：\n• 多喝温水，可用温盐水漱口\n• 避免辛辣刺激性食物\n• 少说话，让喉咙休息\n• 使用含片缓解不适\n\n⚠️ 需要就医的情况：\n• 吞咽困难\n• 呼吸不畅\n• 高烧不退",
        severity: "轻度",
        suggestion: "耳鼻喉科",
        followUp: "请问喉咙痛几天了？"
    }
};

const severityLevels = {
    "轻度": {
        color: "#28a745",
        advice: "建议居家观察，注意休息"
    },
    "中等": {
        color: "#ffc107",
        advice: "建议尽快就医检查"
    },
    "严重": {
        color: "#dc3545",
        advice: "建议立即就医或拨打急救电话"
    }
};

// 用户会话状态
let userSession = {
    currentSymptom: null,
    symptomDetails: {},
    conversationHistory: []
};

// 用户状态
let currentUser = null;
let userRole = null;
let jwtToken = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');

    // 检查本地存储的token
    const savedToken = localStorage.getItem('jwtToken');
    if (savedToken) {
        jwtToken = savedToken;
        currentUser = localStorage.getItem('currentUser');
        userRole = localStorage.getItem('userRole');
        updateUserUI();
        updateContentByRole();
    }

    // 创建必要的模态框
    createModals();

    initHospitals();
    bindEventListeners();
    showWelcomeMessage();
});

// 创建必要的模态框
function createModals() {
    // 登录模态框
    if (!document.getElementById('login-modal')) {
        const loginModal = document.createElement('div');
        loginModal.id = 'login-modal';
        loginModal.className = 'modal';
        loginModal.style.display = 'none';
        loginModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>用户登录</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="username">用户名</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">密码</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div class="form-group">
                        <label for="role">身份</label>
                        <select id="role" name="role" required>
                            <option value="user">普通用户</option>
                            <option value="admin">医院管理者</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">登录</button>
                </form>
            </div>
        `;
        document.body.appendChild(loginModal);
    }

    // 预约模态框
    if (!document.getElementById('appointment-modal')) {
        const appointmentModal = document.createElement('div');
        appointmentModal.id = 'appointment-modal';
        appointmentModal.className = 'modal';
        appointmentModal.style.display = 'none';
        appointmentModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>医院预约</h2>
                <form id="appointment-form">
                    <div class="form-group">
                        <label for="patient-name">姓名 *</label>
                        <input type="text" id="patient-name" name="name" required placeholder="请输入您的姓名">
                    </div>
                    <div class="form-group">
                        <label for="illness-detail">病情描述 *</label>
                        <textarea id="illness-detail" name="detail" rows="4" required placeholder="请详细描述您的症状和病情"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="appointment-time">预约时间 *</label>
                        <input type="datetime-local" id="appointment-time" name="appointmentDatetime" required>
                    </div>
                    <div class="form-group">
                        <label for="patient-address">地址 *</label>
                        <input type="text" id="patient-address" name="address" required placeholder="请输入您的详细地址">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" id="cancel-appointment">取消</button>
                        <button type="submit" class="btn btn-primary">提交预约</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(appointmentModal);
    }
}

// API请求函数 - 已修复：适配后端返回格式
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (jwtToken) {
        defaultOptions.headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, finalOptions);

        if (!response.ok) {
            if (response.status === 401) {
                handleLogout();
                throw new Error('登录已过期，请重新登录');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const result = await response.json();

            // 修复：适配后端返回格式 (code: 1 表示成功，0 表示失败)
            if (result.code === 1) {
                return result;
            } else {
                throw new Error(result.msg || '操作失败');
            }
        } else {
            const text = await response.text();
            return { code: 1, data: text, msg: 'Success' };
        }
    } catch (error) {
        console.error('API请求失败:', error);
        throw error;
    }
}

// 绑定事件监听器
function bindEventListeners() {
    // 登录
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', openLoginModal);
    }

    // 注册
    const registerBtn = document.querySelector('.register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            alert('注册功能即将上线！');
        });
    }

    // 关闭按钮
    const closeBtns = document.querySelectorAll('.close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // 登录表单
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 预约表单
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }

    // 取消预约按钮
    const cancelAppointmentBtn = document.getElementById('cancel-appointment');
    if (cancelAppointmentBtn) {
        cancelAppointmentBtn.addEventListener('click', closeAppointmentModal);
    }

    // 立即预约按钮
    const onlineBookingBtn = document.getElementById('online-booking-btn');
    if (onlineBookingBtn) {
        onlineBookingBtn.addEventListener('click', openAppointmentModal);
    }

    // AI聊天按钮
    const aiChatBtn = document.getElementById('ai-chat-btn');
    if (aiChatBtn) {
        aiChatBtn.addEventListener('click', openAIChat);
    }

    // 发送消息按钮
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // 聊天输入框回车发送
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // 立即咨询按钮
    const consultBtn = document.getElementById('consult-btn');
    if (consultBtn) {
        consultBtn.addEventListener('click', openAIChat);
    }

    // 健康评估按钮
    const healthAssessmentBtn = document.getElementById('health-assessment-btn');
    if (healthAssessmentBtn) {
        healthAssessmentBtn.addEventListener('click', function() {
            alert('健康评估功能即将上线，敬请期待！');
        });
    }
}

// 打开登录模态框
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// 关闭登录模态框
function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 打开预约模态框
function openAppointmentModal() {
    const modal = document.getElementById('appointment-modal');
    if (modal) {
        modal.style.display = 'block';

        // 设置默认预约时间为明天上午9点
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);

        const datetimeString = tomorrow.toISOString().slice(0, 16);
        document.getElementById('appointment-time').value = datetimeString;
    }
}

// 关闭预约模态框
function closeAppointmentModal() {
    const modal = document.getElementById('appointment-modal');
    if (modal) {
        modal.style.display = 'none';
        // 重置表单
        document.getElementById('appointment-form').reset();
    }
}

// 处理登录 - 已修复：适配后端返回格式
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const result = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        // 修复：适配后端返回格式 (code: 1 表示成功)
        if (result.code === 1) {
            jwtToken = result.data;
            localStorage.setItem('jwtToken', jwtToken);

            currentUser = username;
            userRole = role;
            localStorage.setItem('currentUser', currentUser);
            localStorage.setItem('userRole', userRole);

            updateUserUI();
            updateContentByRole();
            closeLoginModal();

            alert(`登录成功！欢迎${username}（${role === 'user' ? '普通用户' : '医院管理者'}）`);
        } else {
            alert(result.msg || '登录失败！');
        }
    } catch (error) {
        console.error('登录错误:', error);
        alert('登录失败，请检查网络连接！');
    }
}

// 处理预约提交 - 已修复：适配后端返回格式
async function handleAppointmentSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const appointmentData = {
        name: formData.get('name'),
        detail: formData.get('detail'),
        appointmentDatetime: formData.get('appointmentDatetime'),
        address: formData.get('address')
    };

    // 验证数据
    if (!validateAppointmentData(appointmentData)) {
        return;
    }

    try {
        // 显示加载状态
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '提交中...';
        submitBtn.disabled = true;

        // 发送POST请求
        const response = await fetch('http://localhost:8080/user/hospital', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // 修复：适配后端返回格式 (code: 1 表示成功)
        if (result.code === 1) {
            alert('预约提交成功！我们会尽快处理您的预约。');
            closeAppointmentModal();
        } else {
            alert(`预约失败：${result.msg || '请稍后重试'}`);
        }

    } catch (error) {
        console.error('预约提交错误:', error);
        alert('预约提交失败，请检查网络连接或稍后重试！');
    } finally {
        // 恢复按钮状态
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = '提交预约';
        submitBtn.disabled = false;
    }
}

// 验证预约数据
function validateAppointmentData(data) {
    if (!data.name.trim()) {
        alert('请输入姓名');
        return false;
    }

    if (!data.detail.trim()) {
        alert('请输入病情描述');
        return false;
    }

    if (!data.appointmentDatetime) {
        alert('请选择预约时间');
        return false;
    }

    // 检查预约时间是否在未来
    const selectedTime = new Date(data.appointmentDatetime);
    const now = new Date();
    if (selectedTime <= now) {
        alert('请选择未来的预约时间');
        return false;
    }

    if (!data.address.trim()) {
        alert('请输入地址');
        return false;
    }

    return true;
}

// 更新用户界面
function updateUserUI() {
    const userActions = document.querySelector('.user-actions');
    if (userActions && currentUser) {
        userActions.innerHTML = `
            <div class="user-info">
                <span>欢迎，${currentUser}</span>
                <button class="btn btn-outline" id="logout-btn">退出</button>
            </div>
        `;

        // 绑定退出按钮事件
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    } else if (userActions && !currentUser) {
        // 用户未登录时的界面
        userActions.innerHTML = `
            <button class="login-btn">登录</button>
            <button class="register-btn">注册</button>
        `;

        // 重新绑定事件
        const loginBtn = userActions.querySelector('.login-btn');
        const registerBtn = userActions.querySelector('.register-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', openLoginModal);
        }
        if (registerBtn) {
            registerBtn.addEventListener('click', function() {
                alert('注册功能即将上线！');
            });
        }
    }
}

// 处理退出
function handleLogout() {
    currentUser = null;
    userRole = null;
    jwtToken = null;
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');

    // 重置用户界面
    updateUserUI();

    alert('已成功退出！');
}

// 根据角色更新内容
function updateContentByRole() {
    // 这里可以根据不同角色显示不同内容
    console.log(`当前用户角色: ${userRole}`);
}

// 初始化医院卡片
function initHospitals() {
    const hospitalsGrid = document.querySelector('.hospitals-grid');
    if (!hospitalsGrid) return;

    hospitalsGrid.innerHTML = '';

    hospitals.forEach(hospital => {
        const hospitalCard = createHospitalCard(hospital);
        hospitalsGrid.appendChild(hospitalCard);
    });
}

// 创建医院卡片
function createHospitalCard(hospital) {
    const card = document.createElement('div');
    card.className = 'hospital-card';

    const stars = generateStars(hospital.rating);

    card.innerHTML = `
        <div class="hospital-image" style="background-color: ${hospital.color};"></div>
        <div class="hospital-info">
            <h3>${hospital.name}</h3>
            <p>地址：${hospital.address}</p>
            <p>电话：${hospital.phone}</p>
            <div class="hospital-rating">
                <div class="stars">${stars}</div>
                <span>${hospital.rating}分</span>
            </div>
            <button class="btn btn-primary appointment-btn" data-hospital-id="${hospital.id}">立即预约</button>
        </div>
    `;

    // 绑定按钮事件
    const appointmentBtn = card.querySelector('.appointment-btn');
    if (appointmentBtn) {
        appointmentBtn.addEventListener('click', function() {
            openAppointmentModal();
        });
    }

    return card;
}

// 生成星级评分
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '★';
    if (halfStar) stars += '☆';
    for (let i = 0; i < emptyStars; i++) stars += '☆';

    return stars;
}

// AI聊天功能
function openAIChat() {
    const aiChat = document.getElementById('ai-chat');
    const aiConsultation = document.getElementById('ai-consultation');
    if (aiChat && aiConsultation) {
        aiChat.style.display = 'block';
        aiConsultation.scrollIntoView({behavior: 'smooth'});
        const chatInput = document.getElementById('chat-input');
        if (chatInput) chatInput.focus();
    }
    // 重置会话状态
    resetSession();
}

// 重置会话状态
function resetSession() {
    userSession = {
        currentSymptom: null,
        symptomDetails: {},
        conversationHistory: []
    };
}

// 发送消息
function sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;

    const message = input.value.trim();
    if (message === '') return;

    // 添加用户消息
    addMessage(message, 'user');
    input.value = '';

    // 记录对话历史
    userSession.conversationHistory.push({
        type: 'user',
        content: message,
        timestamp: new Date()
    });

    // 显示"正在输入"指示器
    showTypingIndicator();

    // 模拟AI回复
    setTimeout(() => {
        removeTypingIndicator();
        const response = getAIResponse(message);
        addMessage(response, 'ai');

        // 记录AI回复
        userSession.conversationHistory.push({
            type: 'ai',
            content: response,
            timestamp: new Date()
        });
    }, 1500);
}

// 显示"正在输入"指示器
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message ai-message typing';
    typingDiv.innerHTML = 'AI健康助手正在思考...';

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 移除"正在输入"指示器
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// 获取AI回复
function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();

    // 检查是否为问候语
    if (isGreeting(lowerMessage)) {
        return "您好！我是AI健康助手，可以为您提供初步的医疗咨询。请详细描述您的症状，包括：\n• 具体症状\n• 持续时间\n• 严重程度\n• 其他相关情况";
    }

    // 检查是否为结束对话
    if (isEndingConversation(lowerMessage)) {
        resetSession();
        return "感谢您的咨询！如果症状持续或加重，请及时就医。祝您早日康复！";
    }

    // 检查症状关键词
    for (const [keyword, responseData] of Object.entries(aiResponses)) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
            userSession.currentSymptom = keyword;
            return formatSymptomResponse(responseData);
        }
    }

    // 如果是追问的回复
    if (userSession.currentSymptom && aiResponses[userSession.currentSymptom]) {
        userSession.symptomDetails[userSession.currentSymptom] = message;
        return getFollowUpResponse(userSession.currentSymptom, message);
    }

    // 默认回复
    return "感谢您的描述。为了更好地帮助您，请告诉我：\n• 您具体有什么不舒服？\n• 症状持续多久了？\n• 严重程度如何？";
}

// 检查问候语
function isGreeting(message) {
    const greetings = ['你好', '您好', 'hello', 'hi', '嗨', '在吗', '有人吗'];
    return greetings.some(greeting => message.includes(greeting));
}

// 检查结束对话
function isEndingConversation(message) {
    const endings = ['谢谢', '感谢', '再见', '拜拜', '结束', '好了', '没问题了'];
    return endings.some(ending => message.includes(ending));
}

// 格式化症状回复
function formatSymptomResponse(responseData) {
    const severityInfo = severityLevels[responseData.severity];
    let response = `${responseData.response}\n\n`;

    response += `📊 <strong>严重程度：<span style="color: ${severityInfo.color}">${responseData.severity}</span></strong>\n`;
    response += `💡 ${severityInfo.advice}\n\n`;
    response += `🏥 <strong>建议科室：${responseData.suggestion}</strong>\n\n`;

    if (responseData.followUp) {
        response += `❓ ${responseData.followUp}`;
    }

    response += `\n\n<em>💊 重要提示：以上建议仅供参考，不能替代专业医疗诊断。如果症状持续或加重，请及时就医。</em>`;

    return response;
}

// 获取追问回复
function getFollowUpResponse(symptom, userAnswer) {
    const responseData = aiResponses[symptom];
    let response = `感谢您提供的信息。基于您的情况：\n\n`;

    // 根据不同的症状提供不同的建议
    switch(symptom) {
        case "头痛":
            if (userAnswer.includes("持续性") || userAnswer.includes("一直")) {
                response += "持续性头痛需要特别关注，建议您尽快就医进行详细检查。";
            } else {
                response += "阵发性头痛可能与多种因素有关，建议继续观察症状变化。";
            }
            break;
        case "发烧":
            if (userAnswer.match(/\d{2}/)) {
                const temp = parseInt(userAnswer.match(/\d{2}/)[0]);
                if (temp >= 39) {
                    response += `体温${temp}℃属于高热，建议立即就医。`;
                } else if (temp >= 38) {
                    response += `体温${temp}℃属于中度发热，建议密切观察并及时就医。`;
                } else {
                    response += `体温${temp}℃属于低热，建议多休息、多喝水观察。`;
                }
            }
            break;
        case "咳嗽":
            if (userAnswer.includes("痰") || userAnswer.includes("湿")) {
                response += "有痰的咳嗽可能提示感染，建议注意痰液颜色和性质的变化。";
            } else {
                response += "干咳可能与过敏或刺激有关，建议避免接触刺激性物质。";
            }
            break;
        default:
            response += "您的描述有助于更好地理解您的情况。";
    }

    response += `\n\n💡 下一步建议：\n• 继续观察症状变化\n• 记录症状发作的时间和特点\n• 如有需要，可前往${responseData.suggestion}进一步检查\n\n`;
    response += `<em>请记住，我的建议不能替代医生的专业诊断。</em>`;

    return response;
}

// 添加消息到聊天界面
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    // 处理换行和格式化
    const formattedText = text.replace(/\n/g, '<br>');
    messageDiv.innerHTML = formattedText;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 显示欢迎消息
function showWelcomeMessage() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';

    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message ai-message';
    welcomeMessage.innerHTML = `
        <strong>👋 欢迎使用AI健康助手！</strong><br><br>
        我可以为您提供：<br>
        • 常见症状的初步分析<br>
        • 基本的健康建议<br>
        • 就医指导<br><br>
        <em>💡 温馨提示：请详细描述您的症状，包括持续时间、严重程度等，这样我能给您更准确的建议。</em><br><br>
        请描述您的症状或健康问题。
    `;

    messagesContainer.appendChild(welcomeMessage);
}

console.log('AI问诊系统加载完成');