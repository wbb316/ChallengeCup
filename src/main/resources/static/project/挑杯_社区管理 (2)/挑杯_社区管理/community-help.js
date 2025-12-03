// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 全局变量
    let shareGoodsList = [];
    let helpRequestsList = [];
    let cart = [];
    let currentUser = null;

    // 获取DOM元素
    const tabBtns = document.querySelectorAll('.tab-btn');
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const searchInput = document.getElementById('searchSecondHand');
    const searchBtn = document.querySelector('.search-btn');
    const addSecondHandBtn = document.getElementById('addSecondHand');
    const addHelpRequestBtn = document.getElementById('addHelpRequest');
    const secondHandList = document.getElementById('secondHandList');
    const requestsList = document.getElementById('requestsList');

    // 检查登录状态
    function checkLoginStatus() {
        const token = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');

        if (!token || !username) {
            showAlert('请先登录', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return false;
        }

        currentUser = {
            token: token,
            username: username
        };

        return true;
    }

    // 获取认证头
    function getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
        };
    }

    // 初始化页面
    async function initializePage() {
        // 检查登录状态
        if (!checkLoginStatus()) {
            return;
        }

        try {
            console.log('开始初始化页面...');

            // 使用Promise.all确保两边同时查询数据库
            await Promise.all([
                loadShareGoods(),
                loadHelpRequests()
            ]);

            // 初始化购物车
            updateCart();

            // 绑定事件
            bindEvents();

            console.log('页面初始化完成');
        } catch (error) {
            console.error('页面初始化错误:', error);
            showAlert('页面加载失败，请刷新重试', 'error');
        }
    }

    // 绑定所有事件
    function bindEvents() {
        // 标签切换
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // 搜索功能
        searchBtn.addEventListener('click', searchItems);
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchItems();
            }
        });

        // 发布闲置物品
        addSecondHandBtn.addEventListener('click', addSecondHandItem);

        // 发布帮扶请求
        addHelpRequestBtn.addEventListener('click', addHelpRequest);
    }

    // 从后端获取共享商品列表
    async function loadShareGoods() {
        if (!checkLoginStatus()) return;

        try {
            console.log('开始查询左边闲置商品数据...');

            const response = await fetch('http://localhost:8080/user/sharegoods', {
                method: 'GET',
                headers: getAuthHeaders()
            });

            console.log('左边API响应状态:', response.status);

            if (response.status === 401) {
                showAlert('登录已过期，请重新登录', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }

            const result = await response.json();
            console.log('左边API返回数据:', result);

            if (result.code === 1) {
                shareGoodsList = result.data || [];
                console.log('左边数据加载成功，商品数量:', shareGoodsList.length);
                renderShareGoodsList(shareGoodsList);
            } else {
                if (result.msg && result.msg.includes('空')) {
                    shareGoodsList = [];
                    renderShareGoodsList([]);
                    showAlert('暂无共享商品', 'info');
                } else {
                    showAlert('获取商品列表失败: ' + result.msg, 'error');
                }
            }
        } catch (error) {
            console.error('获取左边共享商品错误:', error);
            showExampleShareGoods();
            if (error.message.includes('401')) {
                showAlert('请重新登录', 'error');
            } else {
                showAlert('网络错误，显示示例数据', 'warning');
            }
        }
    }

    // 渲染共享商品列表 - 使用正确的字段名
    function renderShareGoodsList(goodsList) {
        if (!secondHandList) {
            console.error('找不到左边商品列表容器');
            return;
        }

        secondHandList.innerHTML = '';

        if (!goodsList || goodsList.length === 0) {
            secondHandList.innerHTML = '<p class="empty-message">暂无共享商品</p>';
            return;
        }

        goodsList.forEach((goods, index) => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';

            // 使用正确的字段名 - 根据ShareGoods实体类
            const id = goods.id || index;
            const title = goods.title || '未命名商品';
            const description = goods.description || '暂无描述';
            const userName = goods.userName || '未知用户'; // 使用userName字段
            const contactWay = goods.contactWay || '暂无联系方式'; // 使用contactWay字段
            const status = goods.status || '可交易';
            const category = goods.category || 'other';
            const price = goods.price || 0; // 使用price字段

            const icon = getGoodsIcon(category);
            const statusText = getGoodsStatusText(status);
            const buttonText = getGoodsButtonText(status);
            const isDisabled = status !== '可交易';

            itemCard.innerHTML = `
                <div class="item-image">${icon}</div>
                <div class="item-info">
                    <h4>${escapeHtml(title)}</h4>
                    <p>${escapeHtml(description)}</p>
                    <div class="item-meta">
                        <span class="item-owner">发布者：${escapeHtml(userName)}</span>
                        <span class="item-contact">联系方式：${escapeHtml(contactWay)}</span>
                        ${price > 0 ? `<span class="item-price">价格：¥${price}</span>` : ''}
                        <span class="item-status">${statusText}</span>
                    </div>
                </div>
                <div class="item-action">
                    <button class="btn add-to-cart" 
                            data-id="${id}" 
                            data-title="${escapeHtml(title)}"
                            ${isDisabled ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                </div>
            `;

            secondHandList.appendChild(itemCard);
        });

        // 重新绑定加入购物车事件
        bindAddToCartEvents();
    }

    // 显示示例数据 - 使用正确的字段名
    function showExampleShareGoods() {
        console.log('左边数据加载失败，显示示例数据');
        const exampleGoods = [
            {
                id: 1,
                title: "一只大猴子",
                description: "童年玩具",
                userName: "张三",
                contactWay: "19118117921",
                status: "可交易",
                category: "toy",
                price: 0.00
            },
            {
                id: 2,
                title: "一只小猴子",
                description: "童年玩具",
                userName: "李四",
                contactWay: "13800138000",
                status: "可交易",
                category: "toy",
                price: 0.00
            },
            {
                id: 3,
                title: "儿童玩具",
                description: "一只小猴子",
                userName: "王五",
                contactWay: "13900139000",
                status: "可交易",
                category: "toy",
                price: 0.00
            }
        ];

        renderShareGoodsList(exampleGoods);
    }

    // 从后端获取帮扶请求列表 - 保持不变
    async function loadHelpRequests() {
        if (!checkLoginStatus()) return;

        try {
            console.log('开始查询右边帮扶请求数据...');

            const response = await fetch('http://localhost:8080/user/request', {
                method: 'GET',
                headers: getAuthHeaders()
            });

            console.log('右边API响应状态:', response.status);

            if (response.status === 401) {
                showAlert('登录已过期，请重新登录', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }

            const result = await response.json();
            console.log('右边API返回数据:', result);

            if (result.code === 1) {
                helpRequestsList = result.data || [];
                console.log('右边数据加载成功，请求数量:', helpRequestsList.length);
                renderHelpRequestsList(helpRequestsList);
            } else {
                showAlert('获取帮扶请求列表失败: ' + result.msg, 'error');
            }
        } catch (error) {
            console.error('获取右边帮扶请求错误:', error);
            if (error.message.includes('401')) {
                showAlert('请重新登录', 'error');
            } else {
                showAlert('网络错误，无法获取请求列表', 'error');
            }
        }
    }

    // 渲染帮扶请求列表 - 保持不变
    function renderHelpRequestsList(requestsList) {
        const requestsContainer = document.getElementById('requestsList');

        if (!requestsContainer) {
            console.error('找不到右边请求列表容器');
            return;
        }

        requestsContainer.innerHTML = '';

        if (requestsList.length === 0) {
            requestsContainer.innerHTML = '<p class="empty-message">暂无帮扶请求</p>';
            return;
        }

        requestsList.forEach((request, index) => {
            const requestCard = document.createElement('div');
            requestCard.className = 'request-card';

            const status = request.status || 'pending';
            const statusText = getRequestStatusText(status);
            const buttonText = getRequestButtonText(status);
            const isDisabled = status !== 'pending' && status !== '待处理';

            requestCard.innerHTML = `
                <div class="request-header">
                    <h4>${request.title || '无标题'}</h4>
                    <span class="request-status ${status}">${statusText}</span>
                </div>
                <div class="request-content">
                    <p>${request.description || '无描述'}</p>
                    <div class="request-meta">
                        <span class="request-owner">${request.posterName || '未知用户'}</span>
                        <span class="request-tip">小费：${request.price || 0}元</span>
                        <span class="request-time">${formatRequestTime(request.createTime)}</span>
                    </div>
                    ${request.volunteerName ? `
                    <div class="request-taker">
                        <span>接单者：${request.volunteerName}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="request-action">
                    <button class="btn take-order" 
                            data-id="${request.id || index}" 
                            data-status="${status}"
                            ${isDisabled ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                </div>
            `;

            requestsContainer.appendChild(requestCard);
        });

        // 重新绑定接单按钮事件
        bindTakeOrderEvents();
    }

    // 发布闲置物品 - 使用正确的字段名
    async function addSecondHandItem() {
        if (!checkLoginStatus()) return;

        const title = prompt('请输入闲置物品名称：');
        if (!title) return;

        const description = prompt('请输入物品描述：');
        if (!description) return;

        const category = prompt('请输入物品分类（book/electronic/toy/clothing/furniture/other）：') || 'other';

        const priceInput = prompt('请输入价格（输入0表示免费）：');
        if (priceInput === null) return;

        const price = parseFloat(priceInput) || 0;
        if (price < 0) {
            alert('价格不能为负数');
            return;
        }

        const contactWay = prompt('请输入联系方式（手机号/微信号）：');
        if (!contactWay) {
            alert('请输入有效的联系方式');
            return;
        }

        try {
            const result = await addShareGoodsToBackend(title, description, category, price, contactWay);

            if (result.code === 1) {
                showAlert('闲置物品发布成功！', 'success');
                await loadShareGoods();
            } else {
                showAlert('发布失败: ' + result.msg, 'error');
            }
        } catch (error) {
            console.error('发布闲置物品错误:', error);
            showAlert('网络错误，发布失败', 'error');
        }
    }

    // 调用后端API添加共享商品 - 使用正确的字段名
    async function addShareGoodsToBackend(title, description, category, price, contactWay) {
        const response = await fetch('http://localhost:8080/user/sharegoods', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                title: title,
                description: description,
                category: category,
                price: price,
                contactWay: contactWay,
                status: '可交易',
                userName: currentUser.username // 使用userName字段
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }

        return await response.json();
    }

    // 发布帮扶请求 - 保持不变
    async function addHelpRequest() {
        if (!checkLoginStatus()) return;

        const title = prompt('请输入请求标题：');
        if (!title) return;

        const description = prompt('请输入请求详情：');
        if (!description) return;

        const type = prompt('请输入请求类型（维修/照顾/搬运/其他）：') || '其他';
        const priceInput = prompt('请输入小费金额：');

        if (!priceInput || isNaN(priceInput) || priceInput <= 0) {
            alert('请输入有效的小费金额');
            return;
        }

        const price = parseFloat(priceInput);

        try {
            const result = await addHelpRequestToBackend(title, description, type, price);

            if (result.code === 1) {
                showAlert('帮扶请求发布成功！', 'success');
                await loadHelpRequests();
            } else {
                showAlert('发布失败: ' + result.msg, 'error');
            }
        } catch (error) {
            console.error('发布帮扶请求错误:', error);
            showAlert('网络错误，发布失败', 'error');
        }
    }

    // 调用后端API添加帮扶请求 - 保持不变
    async function addHelpRequestToBackend(title, description, type, price) {
        const response = await fetch('http://localhost:8080/user/request', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                title: title,
                description: description,
                type: type,
                price: price,
                status: 'pending',
                posterName: currentUser.username
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }

        return await response.json();
    }

    // 接单功能 - 保持不变
    async function takeHelpRequest(requestId) {
        if (!checkLoginStatus()) return;

        try {
            const result = await updateHelpRequestStatus(requestId, 'taken');

            if (result.code === 1) {
                showAlert('接单成功！', 'success');
                await loadHelpRequests();
            } else {
                showAlert('接单失败: ' + result.msg, 'error');
            }
        } catch (error) {
            console.error('接单错误:', error);
            showAlert('网络错误，接单失败', 'error');
        }
    }

    // 更新帮扶请求状态 - 保持不变
    async function updateHelpRequestStatus(requestId, status) {
        const response = await fetch('http://localhost:8080/user/update', {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                id: requestId,
                status: status,
                volunteerName: currentUser.username
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }

        return await response.json();
    }

    // 绑定加入购物车事件 - 保持不变
    function bindAddToCartEvents() {
        const newAddToCartBtns = document.querySelectorAll('.add-to-cart');
        newAddToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.disabled) return;

                const itemId = this.getAttribute('data-id');
                const itemTitle = this.getAttribute('data-title') || '未知商品';

                const isInCart = cart.some(item => item.id === itemId);
                if (isInCart) {
                    showAlert('该物品已在购物车中', 'warning');
                    return;
                }

                cart.push({
                    id: itemId,
                    title: itemTitle
                });

                updateCart();
                showAlert(`已将「${itemTitle}」加入购物车`, 'success');
            });
        });
    }

    // 绑定接单按钮事件 - 保持不变
    function bindTakeOrderEvents() {
        const takeOrderBtns = document.querySelectorAll('.take-order');
        takeOrderBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.disabled) return;

                const requestId = this.getAttribute('data-id');
                const requestStatus = this.getAttribute('data-status');
                const requestCard = this.closest('.request-card');
                const requestTitle = requestCard.querySelector('h4').textContent;

                if (requestStatus !== 'pending' && requestStatus !== '待处理') {
                    showAlert('该请求当前不可接单', 'warning');
                    return;
                }

                if (confirm(`您确定要接单「${requestTitle}」吗？`)) {
                    takeHelpRequest(requestId);
                }
            });
        });
    }

    // 搜索功能 - 使用正确的字段名
    function searchItems() {
        const searchTerm = searchInput.value.toLowerCase();

        if (!searchTerm) {
            renderShareGoodsList(shareGoodsList);
            return;
        }

        const filteredGoods = shareGoodsList.filter(goods => {
            const title = goods.title ? goods.title.toLowerCase() : '';
            const description = goods.description ? goods.description.toLowerCase() : '';
            return title.includes(searchTerm) || description.includes(searchTerm);
        });

        renderShareGoodsList(filteredGoods);
    }

    // 更新购物车显示 - 保持不变
    function updateCart() {
        if (!cartCount) return;

        cartCount.textContent = cart.length;

        if (!cartItems) return;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">购物车为空</p>';
            return;
        }

        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span>${item.title}</span>
                <button class="cart-item-remove" data-index="${index}">移除</button>
            `;
            cartItems.appendChild(cartItem);
        });

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    // ========== 辅助函数 ==========
    // ... 辅助函数保持不变 ...
    // HTML转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 获取商品图标
    function getGoodsIcon(category) {
        const icons = {
            'book': '📚',
            'electronic': '💻',
            'toy': '🧸',
            'clothing': '👕',
            'furniture': '🛋️',
            'other': '📦'
        };
        return icons[category] || icons['other'];
    }

    // 获取商品状态文本
    function getGoodsStatusText(status) {
        const statusMap = {
            'available': '可交易',
            '可交易': '可交易',
            'sold': '已售',
            'reserved': '已预订',
            'exchanged': '已交换',
            '已售': '已售',
            '已预订': '已预订'
        };
        return statusMap[status] || status || '未知状态';
    }

    // 获取商品按钮文本
    function getGoodsButtonText(status) {
        const buttonTextMap = {
            'available': '可交易',
            '可交易': '可交易',
            'sold': '已售出',
            'reserved': '已预订',
            '已售': '已售出',
            '已预订': '已预订'
        };
        return buttonTextMap[status] || '不可操作';
    }

    // 获取请求状态显示文本
    function getRequestStatusText(status) {
        const statusMap = {
            'pending': '待处理',
            'taken': '处理中',
            'completed': '已完成',
            'cancelled': '已取消',
            '待处理': '待处理',
            '处理中': '处理中',
            '已完成': '已完成',
            '已取消': '已取消'
        };
        return statusMap[status] || status || '未知状态';
    }

    // 获取请求按钮文本
    function getRequestButtonText(status) {
        const buttonTextMap = {
            'pending': '接单帮助',
            '待处理': '接单帮助',
            'taken': '处理中',
            '处理中': '处理中',
            'completed': '已完成',
            '已完成': '已完成',
            'cancelled': '已取消',
            '已取消': '已取消'
        };
        return buttonTextMap[status] || status || '不可操作';
    }

    // 格式化请求时间
    function formatRequestTime(timeString) {
        if (!timeString) return '时间未知';

        try {
            const time = new Date(timeString);
            const now = new Date();
            const diff = now - time;

            const minutes = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            if (minutes < 1) return '刚刚';
            if (minutes < 60) return `${minutes}分钟前`;
            if (hours < 24) return `${hours}小时前`;
            if (days < 7) return `${days}天前`;

            return time.toLocaleDateString();
        } catch (error) {
            return '时间未知';
        }
    }

    // 显示提示信息
    function showAlert(message, type) {
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
            background-color: ${getAlertColor(type)};
        `;

        document.body.appendChild(alertDiv);

        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 3000);
    }

    // 获取提示框颜色
    function getAlertColor(type) {
        const colors = {
            'success': '#4CAF50',
            'error': '#f44336',
            'warning': '#ff9800',
            'info': '#2196F3'
        };
        return colors[type] || '#2196F3';
    }

    // 初始化页面
    initializePage();
});