document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const rememberCheckbox = document.getElementById('remember');
    const languageSelect = document.getElementById('language');
    const registerBtn = document.querySelector('.register-btn');
    // 新增：获取找回密码链接
    const forgotPasswordLink = document.querySelector('.forgot-password');
    
    // 密码显示/隐藏切换（原有功能）
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
    
    // 检查是否有保存的账号（原有功能）
    if (localStorage.getItem('rememberedUsername')) {
        usernameInput.value = localStorage.getItem('rememberedUsername');
        rememberCheckbox.checked = true;
    }
    
    // 表单提交处理（原有功能）
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
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
        
        // 处理记住账号（原有功能）
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedUsername', username);
        } else {
            localStorage.removeItem('rememberedUsername');
        }
        
        console.log('登录信息:', {
            username: username,
            password: password,
            remember: rememberCheckbox.checked
        });
        
        alert('登录成功！');
    });
    
    // 注册按钮点击事件（原有功能）
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }
    
    // 新增：找回密码事件绑定
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认跳转
            // 跳转到之前创建的找回密码页面
            window.location.href = 'forget.html';
        });
    }
    
    // 语言选择处理（原有功能，同步更新找回密码文本）
    languageSelect.addEventListener('change', function() {
        const selectedLang = this.value;
        
        if (selectedLang === 'en') {
            document.querySelector('.login-title h1').textContent = 'Welcome to Login';
            document.querySelector('.login-title p').textContent = 'Empower enterprises with intelligent IoT';
            usernameInput.placeholder = 'Please enter your account';
            passwordInput.placeholder = 'Please enter your password';
            document.querySelector('.remember-me span').textContent = 'Remember account';
            // 同步更新找回密码文本
            document.querySelector('.forgot-password').textContent = 'Forgot password';
            document.querySelector('.login-btn').firstChild.textContent = 'Login ';
            if (registerBtn) registerBtn.textContent = 'Register Account';
        } else {
            document.querySelector('.login-title h1').textContent = '欢迎登录';
            document.querySelector('.login-title p').textContent = '让企业拥有智慧物联的力量';
            usernameInput.placeholder = '请输入登录账号';
            passwordInput.placeholder = '请输入密码';
            document.querySelector('.remember-me span').textContent = '记住账号';
            // 同步更新找回密码文本
            document.querySelector('.forgot-password').textContent = '忘记密码';
            document.querySelector('.login-btn').firstChild.textContent = '登录 ';
            if (registerBtn) registerBtn.textContent = '注册账号';
        }
    });
});