document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const rememberCheckbox = document.getElementById('remember');
    const languageSelect = document.getElementById('language');
    const registerBtn = document.querySelector('.register-btn');
    const forgotPasswordLink = document.querySelector('.forgot-password');

    // 密码显示/隐藏切换
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });

    // 检查是否有保存的账号
    if (localStorage.getItem('rememberedUsername')) {
        usernameInput.value = localStorage.getItem('rememberedUsername');
        rememberCheckbox.checked = true;
    }

    // 表单提交处理
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('表单提交事件触发');

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        console.log('用户名:', username);

        if (!username) {
            alert('请输入登录账号');
            usernameInput.focus();
            return;
        }

        if (!password) {
            alert('请输入密码');
            passwordInput.focus();
            return;
        }

        // 显示加载状态
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<span>登录中...</span>';
        loginBtn.disabled = true;

        try {
            // 调用Java后端登录API
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('后端返回结果:', result);

            // 关键修改：使用后端实际的字段判断
            if (result.code === 1) {
                console.log('登录成功，准备跳转');
                alert('登录成功！');

                // 处理记住账号
                if (rememberCheckbox.checked) {
                    localStorage.setItem('rememberedUsername', username);
                } else {
                    localStorage.removeItem('rememberedUsername');
                }

                // 保存token和用户信息
                localStorage.setItem('authToken', result.data);
                localStorage.setItem('username', username);

                // 立即跳转
                window.location.href = 'index.html';
            } else {
                console.log('登录失败:', result.msg);
                alert(result.msg || '登录失败');
            }
        } catch (error) {
            console.error('登录错误:', error);
            alert('网络错误，请稍后重试');
        } finally {
            // 恢复按钮状态
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    });

    // 注册按钮点击事件
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }

    // 找回密码事件
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'forget.html';
        });
    }
});