document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
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
    
    // 表单提交处理
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单值
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const userRole = userRoleSelect.value;
        const address = addressInput.value.trim();
        
        // 验证用户名
        if (!username) {
            alert('请输入用户名');
            usernameInput.focus();
            return;
        }
        
        // 验证地址
        if (!address) {
            alert('请输入地址');
            addressInput.focus();
            return;
        }
        
        // 验证密码
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
        if (!passwordRegex.test(password)) {
            alert('密码必须为8-16位，且包含数字、大写字母和小写字母');
            passwordInput.focus();
            return;
        }
        
        // 验证密码一致性
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            confirmPasswordInput.focus();
            return;
        }
        
        // 验证用户角色
        if (!userRole) {
            alert('请选择用户角色');
            userRoleSelect.focus();
            return;
        }
        
        // 验证协议同意
        if (!agreeTermsCheckbox.checked) {
            alert('请阅读并同意用户服务条款和隐私政策');
            return;
        }
        
        // 模拟注册成功
        console.log('注册信息:', {
            username: username,
            password: password,
            userRole: userRole,
            address: address
        });
        
        // 显示成功提示
        showSuccessMessage();
    });
    
    // 显示注册成功提示
    function showSuccessMessage() {
        overlay.style.display = 'block';
        successMessage.style.display = 'block';
        
        // 3秒后隐藏提示并跳转到登录页
        setTimeout(function() {
            overlay.style.display = 'none';
            successMessage.style.display = 'none';
            window.location.href = 'login.html'; // 跳转到登录页
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