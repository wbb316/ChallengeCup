document.addEventListener('DOMContentLoaded', function() {
    const forgetForm = document.getElementById('forgetForm');
    const usernameInput = document.getElementById('username');
    const phoneInput = document.getElementById('phone');
    const languageSelect = document.getElementById('language');

    forgetForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const phone = phoneInput.value.trim();

        // 基本验证
        if (!username || !phone) {
            showAlert('请填写完整信息', 'error');
            return;
        }

        // 显示加载状态
        const resetBtn = document.querySelector('.login-btn');
        const originalText = resetBtn.innerHTML;
        resetBtn.innerHTML = '<span>验证中...</span>';
        resetBtn.disabled = true;

        try {
            console.log('开始POST请求，用户名:', username, '电话:', phone);

            // 使用 POST 请求发送 JSON 数据 - 修改URL为 /forget
            const result = await getPasswordBackend(username, phone);
            console.log('后端返回:', result);

            if (result.code === 1) {
                showAlert(`密码找回成功！您的密码是：${result.data}`, 'success');

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            } else {
                showAlert(result.msg || '验证失败，请检查用户名和电话是否正确', 'error');
            }
        } catch (error) {
            console.error('请求错误详情:', error);
            showAlert('网络错误: ' + error.message, 'error');
        } finally {
            resetBtn.innerHTML = originalText;
            resetBtn.disabled = false;
        }
    });

    // 使用 POST 请求发送 JSON 数据 - 关键修改：URL改为 /forget
    async function getPasswordBackend(username, phone) {
        const response = await fetch('http://localhost:8080/login/forget', {  // 修改这里
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                phone: phone
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }

        return await response.json();
    }

    function showAlert(message, type) {
        const existingAlert = document.querySelector('.alert-message');
        if (existingAlert) existingAlert.remove();

        const alertDiv = document.createElement('div');
        alertDiv.textContent = message;
        alertDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 12px 20px;
            border-radius: 4px; color: white; z-index: 1000; font-size: 14px;
            background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        `;

        document.body.appendChild(alertDiv);

        setTimeout(() => {
            if (alertDiv.parentNode) alertDiv.parentNode.removeChild(alertDiv);
        }, 3000);
    }

    // 语言选择处理
    languageSelect.addEventListener('change', function() {
        const selectedLang = this.value;

        if (selectedLang === 'en') {
            document.querySelector('.login-title h1').textContent = 'Recover Password';
            document.querySelector('.login-title p').textContent = 'Verify identity to retrieve password';
            usernameInput.placeholder = 'Please enter username';
            phoneInput.placeholder = 'Please enter phone number';
            document.querySelector('.form-info p').textContent = 'Enter username and phone for verification';
            document.querySelector('.login-btn').firstChild.textContent = 'Recover Password ';
            document.querySelector('.register-btn').textContent = 'Back to Login';
        } else {
            document.querySelector('.login-title h1').textContent = '找回密码';
            document.querySelector('.login-title p').textContent = '验证身份以找回密码';
            usernameInput.placeholder = '请输入用户名';
            phoneInput.placeholder = '请输入电话号码';
            document.querySelector('.form-info p').textContent = '输入用户名和电话进行验证';
            document.querySelector('.login-btn').firstChild.textContent = '找回密码 ';
            document.querySelector('.register-btn').textContent = '返回登录';
        }
    });
});