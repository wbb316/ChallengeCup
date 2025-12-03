// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 标签切换功能
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有标签的active类
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 给当前点击的标签添加active类
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 购物车功能
    let cart = [];
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    // 更新购物车显示
    function updateCart() {
        cartCount.textContent = cart.length;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">购物车为空</p>';
            return;
        }
        
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span>${item.name}</span>
                <button class="cart-item-remove" data-index="${index}">移除</button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // 绑定移除按钮事件
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    // 加入购物车按钮事件
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            const itemCard = this.closest('.item-card');
            const itemName = itemCard.querySelector('h4').textContent;
            
            // 检查是否已在购物车中
            const isInCart = cart.some(item => item.id === itemId);
            if (isInCart) {
                alert('该物品已在购物车中');
                return;
            }
            
            // 添加到购物车
            cart.push({
                id: itemId,
                name: itemName
            });
            
            updateCart();
            alert(`已将「${itemName}」加入购物车`);
        });
    });

    // 发布闲置物品按钮事件
    document.getElementById('addSecondHand').addEventListener('click', function() {
        const itemName = prompt('请输入闲置物品名称：');
        if (!itemName) return;
        
        const itemDesc = prompt('请输入物品描述：');
        if (!itemDesc) return;
        
        // 创建新物品卡片
        const itemsList = document.getElementById('secondHandList');
        const newItem = document.createElement('div');
        newItem.className = 'item-card';
        
        // 随机选择一个图标
        const icons = ['📱', '💻', '📚', '🧸', '👕', '🍳', '🧹', '🛠️'];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        
        newItem.innerHTML = `
            <div class="item-image">${randomIcon}</div>
            <div class="item-info">
                <h4>${itemName}</h4>
                <p>${itemDesc}</p>
                <div class="item-meta">
                    <span class="item-owner">我 (当前用户)</span>
                    <span class="item-status">可售</span>
                </div>
            </div>
            <div class="item-action">
                <button class="btn add-to-cart" data-id="new-${Date.now()}">加入购物车</button>
            </div>
        `;
        
        // 添加到列表顶部
        itemsList.insertBefore(newItem, itemsList.firstChild);
        
        // 为新添加的按钮绑定事件
        const newAddBtn = newItem.querySelector('.add-to-cart');
        newAddBtn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            const itemName = newItem.querySelector('h4').textContent;
            
            cart.push({
                id: itemId,
                name: itemName
            });
            
            updateCart();
            alert(`已将「${itemName}」加入购物车`);
        });
        
        alert('闲置物品发布成功！');
    });

    // 发布交换物品按钮事件
    document.getElementById('addExchangeItem').addEventListener('click', function() {
        const itemName = prompt('请输入您要交换的物品：');
        if (!itemName) return;
        
        const itemDesc = prompt('请输入物品描述：');
        if (!itemDesc) return;
        
        const wantItem = prompt('请输入您期望交换的物品：');
        if (!wantItem) return;
        
        // 创建新交换卡片
        const exchangeList = document.getElementById('exchangeList');
        const newExchange = document.createElement('div');
        newExchange.className = 'exchange-card';
        
        // 随机选择一个图标
        const icons = ['📱', '💻', '📚', '🧸', '👕', '🍳'];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        
        newExchange.innerHTML = `
            <div class="exchange-item">
                <div class="item-image">${randomIcon}</div>
                <div class="item-info">
                    <h4>${itemName}</h4>
                    <p>${itemDesc}</p>
                    <span class="item-owner">我 (当前用户)</span>
                </div>
            </div>
            
            <div class="exchange-icon">↔️</div>
            
            <div class="exchange-want">
                <h5>期望交换：</h5>
                <p>${wantItem}</p>
            </div>
            
            <div class="exchange-action">
                <button class="btn btn-primary" data-id="ex-${Date.now()}">联系交换</button>
            </div>
        `;
        
        // 添加到列表顶部
        exchangeList.insertBefore(newExchange, exchangeList.firstChild);
        
        // 为新添加的按钮绑定事件
        newExchange.querySelector('.exchange-action .btn').addEventListener('click', function() {
            alert('已发送交换请求，请等待对方回复');
        });
        
        alert('交换物品发布成功！');
    });

    // 联系交换按钮事件
    document.querySelectorAll('.exchange-action .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            const exchangeCard = this.closest('.exchange-card');
            const itemName = exchangeCard.querySelector('h4').textContent;
            const owner = exchangeCard.querySelector('.item-owner').textContent;
            
            alert(`已向${owner}发送交换请求，希望用您的物品交换「${itemName}」`);
        });
    });

    // 发布帮扶请求按钮事件
    document.getElementById('addHelpRequest').addEventListener('click', function() {
        const requestTitle = prompt('请输入请求标题：');
        if (!requestTitle) return;
        
        const requestContent = prompt('请输入请求详情：');
        if (!requestContent) return;
        
        const tipAmount = prompt('请输入小费金额：');
        if (!tipAmount || isNaN(tipAmount) || tipAmount <= 0) {
            alert('请输入有效的小费金额');
            return;
        }
        
        // 创建新请求卡片
        const requestsList = document.getElementById('requestsList');
        const newRequest = document.createElement('div');
        newRequest.className = 'request-card';
        
        newRequest.innerHTML = `
            <div class="request-header">
                <h4>${requestTitle}</h4>
                <span class="request-status pending">待接单</span>
            </div>
            <div class="request-content">
                <p>${requestContent}</p>
                <div class="request-meta">
                    <span class="request-owner">我 (当前用户)</span>
                    <span class="request-tip">小费：${tipAmount}元</span>
                    <span class="request-time">刚刚</span>
                </div>
            </div>
            <div class="request-action">
                <button class="btn take-order" data-id="req-${Date.now()}">接单帮助</button>
            </div>
        `;
        
        // 添加到列表顶部
        requestsList.insertBefore(newRequest, requestsList.firstChild);
        
        // 为新添加的按钮绑定事件
        newRequest.querySelector('.take-order').addEventListener('click', function() {
            this.textContent = '已有人接单';
            this.className = 'btn disabled';
            this.disabled = true;
            
            newRequest.querySelector('.request-status').className = 'request-status taken';
            newRequest.querySelector('.request-status').textContent = '已接单';
            
            const requestContent = newRequest.querySelector('.request-content');
            requestContent.innerHTML += `
                <div class="request-taker">
                    <span>接单者：我 (当前用户)</span>
                </div>
            `;
            
            alert('您已成功接单，帮助请求者解决问题');
        });
        
        alert('帮扶请求发布成功！');
    });

    // 接单帮助按钮事件
    document.querySelectorAll('.take-order').forEach(btn => {
        btn.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            const requestCard = this.closest('.request-card');
            const requestTitle = requestCard.querySelector('h4').textContent;
            
            // 更新按钮状态
            this.textContent = '已有人接单';
            this.className = 'btn disabled';
            this.disabled = true;
            
            // 更新请求状态
            requestCard.querySelector('.request-status').className = 'request-status taken';
            requestCard.querySelector('.request-status').textContent = '已接单';
            
            // 添加接单者信息
            const requestContent = requestCard.querySelector('.request-content');
            requestContent.innerHTML += `
                <div class="request-taker">
                    <span>接单者：我 (当前用户)</span>
                </div>
            `;
            
            alert(`您已成功接单「${requestTitle}」，请尽快联系请求者解决问题`);
        });
    });

    // 搜索功能
    document.getElementById('searchSecondHand').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchItems();
        }
    });
    
    document.querySelector('.search-btn').addEventListener('click', searchItems);
    
    function searchItems() {
        const searchTerm = document.getElementById('searchSecondHand').value.toLowerCase();
        const items = document.querySelectorAll('#secondHandList .item-card');
        
        items.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const desc = item.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // 初始化购物车
    updateCart();
});