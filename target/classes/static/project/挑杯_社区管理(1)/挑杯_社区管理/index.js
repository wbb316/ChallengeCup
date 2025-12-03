// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
    });

    // 功能模块点击事件（实现跳转）
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 获取模块名称
            const moduleName = this.querySelector('h3').textContent;
            
            // 阻止链接默认跳转
            if (e.target.classList.contains('more-link')) {
                e.preventDefault();
                
                // 根据模块名称实现对应跳转
                switch(moduleName) {
                    case '社区物业':
                        window.location.href = 'community-property.html';
                        break;
                    case '社区互助':
                        window.location.href = 'community-help.html';
                        break;
                    case '商超配送':
                        alert(`即将打开「${moduleName}」功能模块，敬请期待！`);
                        break;
                    case '在线问诊':
                        alert(`即将打开「${moduleName}」功能模块，敬请期待！`);
                        break;
                    default:
                        alert(`模块「${moduleName}」暂未开放`);
                }
            }
        });
    });
});