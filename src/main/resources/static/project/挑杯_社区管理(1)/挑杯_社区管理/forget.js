document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const forgetForm = document.getElementById('forgetForm');
    const usernameInput = document.getElementById('username');
    const fullnameInput = document.getElementById('fullname');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const languageSelect = document.getElementById('language');
    
    // 密码显示/隐藏切换
    toggleNewPassword.addEventListener('click', function() {
        togglePasswordVisibility(newPasswordInput, this);
    });
    
    toggleConfirmPassword.addEventListener('click', function() {
        togglePasswordVisibility(confirmPasswordInput, this);
    });
    
    // 密码可见性切换函数
    function togglePasswordVisibility(input, button) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        button.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    }
    
    // 密码验证
    newPasswordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    
    // 验证密码强度
    function validatePassword() {
        const password = newPasswordInput.value;
        const passwordGroup = newPasswordInput.closest('.form-group');
        const errorElement = passwordGroup.querySelector('.error-message') || createMessageElement(passwordGroup, 'error');
        
        // 清除之前的状态
        passwordGroup.classList.remove('error', 'success');
        
        if (password.length === 0) {
            errorElement.textContent = '';
            return false;
        }
        
        // 密码规则：至少8个字符，包含字母和数字
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        
        if (!passwordRegex.test(password)) {
            errorElement.textContent = '密码需包含至少8个字符，包括字母和数字';
            passwordGroup.classList.add('error');
            return false;
        }
        
        passwordGroup.classList.add('success');
        errorElement.textContent = '';
        return true;
    }
    
    // 验证确认密码
    function validateConfirmPassword() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const confirmGroup = confirmPasswordInput.closest('.form-group');
        const errorElement = confirmGroup.querySelector('.error-message') || createMessageElement(confirmGroup, 'error');
        
        // 清除之前的状态
        confirmGroup.classList.remove('error', 'success');
        
        if (confirmPassword.length === 0) {
            errorElement.textContent = '';
            return false;
        }
        
        if (password !== confirmPassword) {
            errorElement.textContent = '两次输入的密码不一致';
            confirmGroup.classList.add('error');
            return false;
        }
        
        confirmGroup.classList.add('success');
        errorElement.textContent = '';
        return true;
    }
    
    // 创建消息元素
    function createMessageElement(parent, type) {
        const element = document.createElement('div');
        element.className = `${type}-message`;
        parent.appendChild(element);
        return element;
    }
    
    // 表单提交处理
    forgetForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交
        
        const username = usernameInput.value.trim();
        const fullname = fullnameInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        
        // 验证所有字段
        let isValid = true;
        
        // 验证用户名
        const userGroup = usernameInput.closest('.form-group');
        const userError = userGroup.querySelector('.error-message') || createMessageElement(userGroup, 'error');
        userGroup.classList.remove('error');
        if (!username) {
            userError.textContent = '请输入登录账号';
            userGroup.classList.add('error');
            isValid = false;
        } else {
            userError.textContent = '';
        }
        
        // 验证姓名
        const nameGroup = fullnameInput.closest('.form-group');
        const nameError = nameGroup.querySelector('.error-message') || createMessageElement(nameGroup, 'error');
        nameGroup.classList.remove('error');
        if (!fullname) {
            nameError.textContent = '请输入姓名';
            nameGroup.classList.add('error');
            isValid = false;
        } else {
            nameError.textContent = '';
        }
        
        // 验证密码
        if (!validatePassword() || !validateConfirmPassword()) {
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // 模拟验证过程（实际应用中这里应该调用后端API验证用户信息）
        console.log('找回密码信息:', {
            username: username,
            fullname: fullname,
            newPassword: newPassword
        });
        
        // 模拟验证成功
        alert('密码重置成功，请使用新密码登录');
        window.location.href = 'login.html';
    });
    
    // 语言选择处理
    languageSelect.addEventListener('change', function() {
        const selectedLang = this.value;
        console.log('选择的语言:', selectedLang);
        
        if (selectedLang === 'en') {
            document.querySelector('.login-title h1').textContent = 'Recover Password';
            document.querySelector('.login-title p').textContent = 'Please enter information to verify identity and reset password';
            usernameInput.placeholder = 'Please enter your account';
            fullnameInput.placeholder = 'Please enter your full name';
            newPasswordInput.placeholder = 'Please enter new password';
            confirmPasswordInput.placeholder = 'Please confirm new password';
            document.querySelector('#passwordInfo p').textContent = 'Password must contain at least 8 characters, including letters and numbers';
            document.querySelector('.login-btn').firstChild.textContent = 'Reset Password ';
            document.querySelector('.register-btn').textContent = 'Back to Login';
        } else {
            document.querySelector('.login-title h1').textContent = '找回密码';
            document.querySelector('.login-title p').textContent = '请输入信息完成身份验证并重置密码';
            usernameInput.placeholder = '请输入登录账号';
            fullnameInput.placeholder = '请输入姓名';
            newPasswordInput.placeholder = '请输入新密码';
            confirmPasswordInput.placeholder = '请确认新密码';
            document.querySelector('#passwordInfo p').textContent = '密码需包含至少8个字符，包括字母和数字';
            document.querySelector('.login-btn').firstChild.textContent = '重置密码 ';
            document.querySelector('.register-btn').textContent = '返回登录';
        }
    });
});