// SOS紧急求助功能 - 向后端发送请求
document.addEventListener('DOMContentLoaded', function() {
    const sosButton = document.getElementById('sosBtn');

    if (sosButton) {
        sosButton.addEventListener('click', function() {
            const confirmSOS = confirm('确定要发送紧急求助信号吗？\n系统将通知社区管理人员和紧急联系人。');

            if (confirmSOS) {
                sendSOSRequest();
            }
        });
    }

    const silverModeBtn = document.querySelector('.silver-mode-btn');
    let isSilverMode = false;

    if (silverModeBtn) {
        const savedMode = localStorage.getItem('silverMode');
        if (savedMode === 'enabled') {
            enableSilverMode();
            silverModeBtn.textContent = '退出银发';
            silverModeBtn.style.backgroundColor = '#4CAF50';
            isSilverMode = true;
        }

        silverModeBtn.addEventListener('click', function() {
            isSilverMode = !isSilverMode;

            if (isSilverMode) {
                enableSilverMode();
                silverModeBtn.textContent = '退出银发';
                silverModeBtn.style.backgroundColor = '#4CAF50';
                localStorage.setItem('silverMode', 'enabled');
            } else {
                disableSilverMode();
                silverModeBtn.textContent = '银发模式';
                silverModeBtn.style.backgroundColor = '#ff0000';
                localStorage.setItem('silverMode', 'disabled');
            }
        });
    }
});

function enableSilverMode() {
    // 基础字体放大
    document.documentElement.style.fontSize = '20px';

    // 放大关键元素字体
    const elementsToEnlarge = document.querySelectorAll('h1, h2, h3, p, a, button, span, li');
    elementsToEnlarge.forEach(el => {
        const currentSize = window.getComputedStyle(el).fontSize;
        const sizeValue = parseFloat(currentSize);
        const sizeUnit = currentSize.replace(sizeValue, '');

        if (sizeValue < 26) { // 进一步放大字体
            el.style.fontSize = (sizeValue * 1.6) + sizeUnit;
        }
    });

    // 增加行高提高可读性
    document.body.style.lineHeight = '2.0';

    // 增加元素间距
    const spacingElements = document.querySelectorAll('p, li, .feature-card, .navbar');
    spacingElements.forEach(el => {
        el.style.marginBottom = '1.8rem';
    });

    // 增大交互元素点击区域
    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
        el.style.padding = '15px 25px';
        el.style.minHeight = '60px';
        el.style.minWidth = '60px';
    });

    // 优化四个模块样式 - 高对比度突出显示
    const modules = document.querySelectorAll('.feature-card');
    const moduleColors = [
        '#1a73e8', // 蓝色
        '#ea4335', // 红色
        '#34a853', // 绿色
        '#fbbc05'  // 黄色
    ]; // 四个模块使用不同高对比度颜色

    modules.forEach((module, index) => {
        // 保存原始样式
        module.dataset.originalBg = module.style.backgroundColor || getComputedStyle(module).backgroundColor;
        module.dataset.originalColor = module.style.color || getComputedStyle(module).color;
        module.dataset.originalBorder = module.style.borderColor || getComputedStyle(module).borderColor;
        module.dataset.originalShadow = module.style.boxShadow || getComputedStyle(module).boxShadow;
        module.dataset.originalFontWeight = module.style.fontWeight || getComputedStyle(module).fontWeight;

        // 应用高对比度样式
        const colorIndex = index % moduleColors.length;
        module.style.backgroundColor = moduleColors[colorIndex]; // 鲜艳背景色
        module.style.color = '#ffffff'; // 纯白色文字
        module.style.border = '3px solid #ffffff'; // 白色边框增强轮廓
        module.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)'; // 强阴影增强立体感
        module.style.fontWeight = 'bold'; // 加粗字体
        module.style.borderRadius = '12px'; // 稍大圆角更柔和
        module.style.padding = '40px 30px'; // 增加内边距
    });
}

function disableSilverMode() {
    // 恢复默认字体大小
    document.documentElement.style.fontSize = '';

    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
        el.style.fontSize = '';
    });

    // 恢复行高和间距
    document.body.style.lineHeight = '';

    const spacingElements = document.querySelectorAll('p, li, .feature-card, .navbar');
    spacingElements.forEach(el => {
        el.style.marginBottom = '';
    });

    // 恢复交互元素样式
    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
        el.style.padding = '';
        el.style.minHeight = '';
        el.style.minWidth = '';
    });

    // 恢复模块原始样式
    const modules = document.querySelectorAll('.feature-card');
    modules.forEach(module => {
        module.style.backgroundColor = module.dataset.originalBg || '';
        module.style.color = module.dataset.originalColor || '';
        module.style.borderColor = module.dataset.originalBorder || '';
        module.style.boxShadow = module.dataset.originalShadow || '';
        module.style.fontWeight = module.dataset.originalFontWeight || '';
        module.style.borderRadius = '';
        module.style.padding = '';
    });
}

function sendSOSRequest() {
    const sosData = {
        timestamp: new Date().toISOString(),
        type: "SOS",
    };

    fetch('http://localhost:8080/user/sos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sosData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
        .then(data => {
            console.log('SOS请求发送成功:', data);
            alert('紧急求助信号已发送！工作人员将尽快联系您。');

            const sosButton = document.getElementById('sosBtn');
            if (sosButton) {
                sosButton.textContent = '求助已发送';
                sosButton.style.backgroundColor = '#ff6666';
                sosButton.disabled = true;

                setTimeout(() => {
                    sosButton.textContent = 'SOS';
                    sosButton.style.backgroundColor = '#ff0000';
                    sosButton.disabled = false;
                }, 3000);
            }
        })
        .catch(error => {
            console.error('SOS请求发送失败:', error);
            alert('求助信号发送失败，请检查网络连接或直接拨打紧急电话！');
        });
}