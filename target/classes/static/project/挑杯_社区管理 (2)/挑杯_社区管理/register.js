document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const phoneInput = document.getElementById('phone'); // 新增：获取手机号输入框
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const userRoleSelect = document.getElementById('userRole');
    const addressInput = document.getElementById('address');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const togglePassword1 = document.getElementById('togglePassword1');
    const togglePassword2 = document.getElementById('togglePassword2');
    const languageSelect = document.getElementById('language');
    const successMessage = document.getElementById('successMessage');
    const overlay = document.getElementById('overlay');

    // 密码显示/隐藏切换
    togglePassword1.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, this);
    });

    togglePassword2.addEventListener('click', function() {
        togglePasswordVisibility(confirmPasswordInput, this);
    });

    // 密码显示切换函数
    function togglePasswordVisibility(input, button) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        button.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    }

    // 表单提交处理 - 修改为调用后端API
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 获取表单值 - 添加手机号
        const username = usernameInput.value.trim();
        const phone = phoneInput.value.trim(); // 新增：获取手机号
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const userRole = userRoleSelect.value;
        const address = addressInput.value.trim();

        // 验证用户名
        if (!username) {
            showAlert('请输入用户名', 'error');
            usernameInput.focus();
            return;
        }

        // 验证手机号 - 新增验证
        if (!phone) {
            showAlert('请输入手机号', 'error');
            phoneInput.focus();
            return;
        }

        // 手机号格式验证
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            showAlert('请输入正确的手机号码', 'error');
            phoneInput.focus();
            return;
        }

        // 验证地址
        if (!address) {
            showAlert('请输入地址', 'error');
            addressInput.focus();
            return;
        }

        // 验证密码
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
        if (!passwordRegex.test(password)) {
            showAlert('密码必须为8-16位，且包含数字、大写字母和小写字母', 'error');
            passwordInput.focus();
            return;
        }

        // 验证密码一致性
        if (password !== confirmPassword) {
            showAlert('两次输入的密码不一致', 'error');
            confirmPasswordInput.focus();
            return;
        }

        // 验证用户角色
        if (!userRole) {
            showAlert('请选择用户角色', 'error');
            userRoleSelect.focus();
            return;
        }

        // 验证协议同意
        if (!agreeTermsCheckbox.checked) {
            showAlert('请阅读并同意用户服务条款和隐私政策', 'error');
            return;
        }

        // 显示加载状态
        const registerBtn = document.querySelector('.register-btn');
        const originalText = registerBtn.innerHTML;
        registerBtn.innerHTML = '<span>注册中...</span>';
        registerBtn.disabled = true;

        try {
            // 调用后端注册API - 添加手机号参数
            const result = await registerToBackend(username, phone, password, userRole, address);

            if (result.code === 1) {
                // 注册成功
                showSuccessMessage();
            } else {
                showAlert(result.msg || '注册失败，请稍后重试', 'error');
            }
        } catch (error) {
            console.error('注册错误:', error);
            showAlert('网络错误，请稍后重试', 'error');
        } finally {
            // 恢复按钮状态
            registerBtn.innerHTML = originalText;
            registerBtn.disabled = false;
        }
    });

    // 注册API调用函数 - 修改为包含手机号
    async function registerToBackend(username, phone, password, userRole, address) {
        const response = await fetch('http://localhost:8080/login/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                phone: phone,  // 关键：添加手机号字段
                password: password,
                role: userRole,
                address: address
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }

        return await response.json();
    }

    // 显示提示信息
    function showAlert(message, type) {
        // 移除现有的提示框
        const existingAlert = document.querySelector('.alert-message');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-message ${type}`;
        alertDiv.textContent = message;
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            z-index: 1000;
            font-size: 14px;
            background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        `;

        document.body.appendChild(alertDiv);

        // 3秒后自动消失
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 3000);
    }

    // 显示注册成功提示
    function showSuccessMessage() {
        overlay.style.display = 'block';
        successMessage.style.display = 'block';

        // 3秒后隐藏提示并跳转到登录页
        setTimeout(() => {
            overlay.style.display = 'none';
            successMessage.style.display = 'none';
            window.location.href = 'login.html';
        }, 3000);
    }

    // 语言切换处理
    languageSelect.addEventListener('change', function() {
        const selectedLang = this.value;

        if (selectedLang === 'en') {
            document.querySelector('.login-title h1').textContent = 'User Registration';
            document.querySelector('.login-title p').textContent = 'Create an account to start your smart IoT experience';
            document.querySelector('.form-section-title').textContent = 'Account Information';
            usernameInput.placeholder = 'Please enter username';
            phoneInput.placeholder = 'Please enter phone number'; // 新增手机号翻译
            passwordInput.placeholder = 'Please enter password';
            confirmPasswordInput.placeholder = 'Please re-enter password';
            document.querySelector('.password-hint').textContent = '8-16 characters, must include numbers, uppercase and lowercase letters';
            document.querySelectorAll('.form-section-title')[1].textContent = 'User Information';
            addressInput.placeholder = 'Please enter address';
            userRoleSelect.options[0].textContent = 'Please select user role';
            userRoleSelect.options[1].textContent = 'Resident';
            userRoleSelect.options[2].textContent = 'Property Staff';
            userRoleSelect.options[3].textContent = 'Volunteer';
            document.querySelector('.agreement label').innerHTML =
                'I have read and agree to the <a href="#">User Service Terms</a> and <a href="#">Privacy Policy</a>';
            document.querySelector('.register-btn').textContent = 'Register Account';
            document.querySelector('.login-link').innerHTML =
                'Already have an account? <a href="login.html">Login directly</a>';
        } else {
            document.querySelector('.login-title h1').textContent = '用户注册';
            document.querySelector('.login-title p').textContent = '创建账号，开启智慧物联体验';
            document.querySelector('.form-section-title').textContent = '账号信息';
            usernameInput.placeholder = '请输入用户名';
            phoneInput.placeholder = '请输入手机号'; // 新增手机号翻译
            passwordInput.placeholder = '请输入密码';
            confirmPasswordInput.placeholder = '请再次输入密码';
            document.querySelector('.password-hint').textContent = '8-16位密码，必须包含数字与大小写字母';
            document.querySelectorAll('.form-section-title')[1].textContent = '用户信息';
            addressInput.placeholder = '请输入地址';
            userRoleSelect.options[0].textContent = '请选择用户角色';
            userRoleSelect.options[1].textContent = '居民';
            userRoleSelect.options[2].textContent = '物业工作人员';
            userRoleSelect.options[3].textContent = '志愿者';
            document.querySelector('.agreement label').innerHTML =
                '我已阅读并同意<a href="#">《用户服务条款》</a>和<a href="#">《隐私政策》</a>';
            document.querySelector('.register-btn').textContent = '注册账号';
            document.querySelector('.login-link').innerHTML =
                '已有账号？<a href="login.html">直接登录</a>';
        }
    });
});