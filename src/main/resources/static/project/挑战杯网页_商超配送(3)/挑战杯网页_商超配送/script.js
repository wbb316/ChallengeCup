// 全局变量
let currentUser = null;
let currentRole = null;
let products = [];
let cartItems = [];
let currentNavPage = 'shopping'; // 默认显示商超配送

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 首先隐藏所有页面
    hideAllPages();
    hideAllFooters();
    
    // 检查是否已登录
    checkLoginStatus();
    
    // 绑定事件监听器
    bindEvents();
    
    // 初始化商品数据
    initializeProducts();
    
    // 初始化轮播图
    initBanner();
    
    // 初始化主导航
    initMainNav();
});

// 初始化主导航
function initMainNav() {
    // 绑定主导航点击事件
    const navItems = document.querySelectorAll('.main-nav a');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navigateToMainNav(targetPage);
        });
    });
    
    // 绑定顶部导航栏的登录/注册按钮
    document.getElementById('login-btn-nav').addEventListener('click', function() {
        showLoginPage();
    });
    
    document.getElementById('register-btn-nav').addEventListener('click', function() {
        alert('注册功能即将上线！');
    });
    
    document.getElementById('logout-btn-nav').addEventListener('click', handleLogout);
}

// 在 navigateToMainNav 函数中添加商家入驻的处理
function navigateToMainNav(page) {
    // 未登录时，点击任何主导航都显示登录页面
    if (!currentUser) {
        showLoginPage();
        return;
    }

    // 已登录用户的正常导航逻辑
    const navItems = document.querySelectorAll('.main-nav a');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        }
    });

    currentNavPage = page;

    // 根据当前导航页面显示相应内容
    switch(page) {
        case 'home':
            showMainNavHome();
            break;
        case 'help':
            showCommunityHelp();
            break;
        case 'property':
            showCommunityProperty();
            break;
        case 'shopping':
            showShoppingSystem();
            break;
        case 'medical':
            showOnlineMedical();
            break;
        case 'merchant-register':
            showMerchantRegister();
            break;
    }
}

// 商家入驻页面显示函数
function showMerchantRegister() {
    // 直接跳转到商家入驻页面
    window.location.href = 'merchant-register.html';
}
// 显示主导航首页
function showMainNavHome() {
    // 这里可以添加社区首页的内容
    window.location.href = '../../挑杯_社区管理%20(2)/挑杯_社区管理/index.html';
    // 实际项目中这里会加载社区首页的HTML内容
}

// 显示社区帮扶页面
function showCommunityHelp() {
    window.location.href = '../../挑杯_社区管理%20(2)/挑杯_社区管理/community-property.html';
    // 实际项目中这里会加载社区帮扶的HTML内容
}

// 显示社区物业页面
function showCommunityProperty() {
    window.location.href = '../../挑杯_社区管理%20(2)/挑杯_社区管理/community-help.html';

    // 实际项目中这里会加载社区物业的HTML内容
}

// 显示商超配送系统
function showShoppingSystem() {
    // 显示当前的商超配送系统
    // 这里不需要做特殊处理，因为登录后默认显示的就是商超系统
    if (currentRole) {
        showRolePage();
    }
}

// 显示在线问诊页面
function showOnlineMedical() {
    window.location.href = '../../挑战杯网页_在线问诊(2)/挑战杯网页_在线问诊/index.html';

    // 实际项目中这里会加载在线问诊的HTML内容
}

// 检查登录状态
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('currentRole');
    
    if (savedUser && savedRole) {
        currentUser = savedUser;
        currentRole = savedRole;
        updateNavBar();
        showRolePage();
    } else {
        // 未登录时强制显示登录页面
        showLoginPage();
    }
}

// 更新导航栏显示
function updateNavBar() {
    const loginBtn = document.getElementById('login-btn-nav');
    const registerBtn = document.getElementById('register-btn-nav');
    const userInfo = document.querySelector('.user-actions .user-info');
    const navUserInfo = document.getElementById('nav-user-info');
    
    if (currentUser) {
        // 已登录状态
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        navUserInfo.textContent = currentUser;
    } else {
        // 未登录状态
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        userInfo.style.display = 'none';
    }
}

// 显示登录页面
function showLoginPage() {
    hideAllPages();
    hideAllFooters();
    document.getElementById('login-page').classList.add('active');
    
    // 确保主导航的商超配送保持激活状态
    const shoppingNav = document.querySelector('.main-nav a[data-page="shopping"]');
    if (shoppingNav) {
        const navItems = document.querySelectorAll('.main-nav a');
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        shoppingNav.classList.add('active');
    }
}

// 显示角色对应页面
function showRolePage() {
    hideAllPages();
    
    // 更新所有页面上的用户信息
    updateUserInfo();
    
    // 根据角色显示对应页面和底部导航栏
    if (currentRole === 'customer') {
        document.getElementById('customer-home-page').classList.add('active');
        document.getElementById('customer-footer').style.display = 'flex';
        loadCustomerProducts();
        updateFooterActive('customer-home-page');
    } else if (currentRole === 'merchant') {
        document.getElementById('merchant-home-page').classList.add('active');
        document.getElementById('merchant-footer').style.display = 'flex';
        loadMerchantProducts();
        updateFooterActive('merchant-home-page');
    } else if (currentRole === 'admin') {
        document.getElementById('admin-home-page').classList.add('active');
        document.getElementById('admin-footer').style.display = 'flex';
        loadAdminProducts();
        updateFooterActive('admin-home-page');
    }
}

// 隐藏所有页面
function hideAllPages() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
}

// 隐藏所有底部导航栏
function hideAllFooters() {
    document.getElementById('customer-footer').style.display = 'none';
    document.getElementById('merchant-footer').style.display = 'none';
    document.getElementById('admin-footer').style.display = 'none';
}

// 更新用户信息
function updateUserInfo() {
    const userElements = document.querySelectorAll('#current-user, #current-user-cart, #current-user-profile, #current-merchant, #current-merchant-add, #current-admin');
    
    userElements.forEach(element => {
        element.textContent = currentUser;
    });
}


// 绑定事件监听器
function bindEvents() {
    // 登录按钮
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    
    // 退出按钮
    document.querySelectorAll('#logout-btn, #logout-btn-cart, #logout-btn-profile, #logout-btn-merchant, #logout-btn-merchant-add, #logout-btn-admin').forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });
    
    
    document.getElementById('community-button').addEventListener('click', function() {
        // 跳转到社区页面
        window.location.href = 'supermarket-delivery.html'; 
    });
    
    
    
    // 底部导航栏 - 使用事件委托
    document.addEventListener('click', function(e) {
        if (e.target.closest('.footer-item')) {
            const footerItem = e.target.closest('.footer-item');
            const pageId = footerItem.getAttribute('data-page');
            navigateToPage(pageId);
        }
    });
    
    // 分类导航
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // 更新活动分类
            categoryItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 根据分类筛选商品
            const category = this.getAttribute('data-category');
            filterProductsByCategory(category);
        });
    });
    
    // 商家功能按钮
    document.getElementById('add-product-btn').addEventListener('click', function() {
        navigateToPage('merchant-add-product-page');
    });
    
    document.getElementById('manage-products-btn').addEventListener('click', function() {
        loadMerchantProducts();
    });
    
    // 管理员功能按钮
    document.getElementById('manage-all-products-btn').addEventListener('click', function() {
        loadAdminProducts();
    });
    
    // 添加商品表单提交
    document.getElementById('submit-product-btn').addEventListener('click', handleAddProduct);
    
    // 我的页面菜单点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.menu-item')) {
            const menuItem = e.target.closest('.menu-item');
            const label = menuItem.querySelector('.menu-label').textContent;
            alert(`跳转到${label}页面`);
        }
    });
    
    // 我的页面订单点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.order-item')) {
            const orderItem = e.target.closest('.order-item');
            const label = orderItem.querySelector('.order-label').textContent;
            alert(`跳转到${label}页面`);
        }
    });
}

// 初始化轮播图
function initBanner() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.banner-slide');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;
    
    function showSlide(index) {
        // 隐藏所有轮播项
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // 更新指示器
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // 显示当前轮播项
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }
    
    // 自动轮播
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    // 初始化轮播
    let slideInterval = setInterval(nextSlide, 3000);
    
    // 鼠标悬停时暂停轮播
    const banner = document.querySelector('.banner');
    if (banner) {
        banner.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        banner.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 3000);
        });
    }
    
    // 点击指示器切换轮播
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
}

// 处理登录
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }
    
    // 模拟登录API调用
    simulateLogin(username, password, role)
        .then(success => {
            if (success) {
                currentUser = username;
                currentRole = role;
                
                // 保存登录状态
                localStorage.setItem('currentUser', currentUser);
                localStorage.setItem('currentRole', currentRole);
                
                // 更新导航栏和显示角色对应页面
                updateNavBar();
                showRolePage();
                
                // 清空登录表单
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
            } else {
                alert('登录失败，请检查用户名和密码');
            }
        });
}
    


// 模拟登录
function simulateLogin(username, password, role) {
    return new Promise(resolve => {
        // 模拟网络延迟
        setTimeout(() => {
            // 在实际项目中，这里应该调用真实的登录API
            // 这里简单模拟登录成功
            resolve(true);
        }, 500);
    });
}

// 处理退出
function handleLogout() {
    currentUser = null;
    currentRole = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
    
    updateNavBar();
    showLoginPage();
}

// 页面导航
// 页面导航
function navigateToPage(pageId) {
    // 未登录时，只能显示登录页面
    if (!currentUser && pageId !== 'login-page') {
        showLoginPage();
        return;
    }
    
    hideAllPages();
    document.getElementById(pageId).classList.add('active');
    
    // 更新底部导航栏激活状态
    updateFooterActive(pageId);
    
    // 根据页面加载相应数据
    if (pageId === 'customer-home-page') {
        loadCustomerProducts();
    } else if (pageId === 'customer-cart-page') {
        loadCartItems();
    } else if (pageId === 'merchant-home-page') {
        loadMerchantProducts();
    } else if (pageId === 'admin-home-page') {
        loadAdminProducts();
    }
}

// 更新底部导航栏激活状态
function updateFooterActive(pageId) {
    // 根据当前角色获取对应的底部导航栏
    let footer;
    if (currentRole === 'customer') {
        footer = document.getElementById('customer-footer');
    } else if (currentRole === 'merchant') {
        footer = document.getElementById('merchant-footer');
    } else if (currentRole === 'admin') {
        footer = document.getElementById('admin-footer');
    }
    
    if (footer) {
        const footerItems = footer.querySelectorAll('.footer-item');
        footerItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('active');
            }
        });
    }
}


// 初始化商品数据
function initializeProducts() {
    products = [
        {
            id: 1,
            name: '新鲜红富士苹果 5斤装',
            description: '新鲜采摘的红富士苹果，甜脆多汁',
            category: 'fresh',
            currentPrice: 29.9,
            originalPrice: 39.9,
            image: 'images/product1.jpg',
            merchant: '商家A'
        },
        {
            id: 2,
            name: '进口香蕉 2.5kg',
            description: '菲律宾进口香蕉，香甜软糯',
            category: 'fresh',
            currentPrice: 19.9,
            originalPrice: 25.9,
            image: 'images/2.jpg',
            merchant: '商家A'
        },
        {
            id: 3,
            name: '赣南脐橙 3kg',
            description: '赣南特产脐橙，果肉饱满多汁',
            category: 'fresh',
            currentPrice: 35.9,
            originalPrice: 45.9,
            image: 'images/3.jpg',
            merchant: '商家B'
        },
        {
            id: 4,
            name: '海南芒果 2kg',
            description: '海南特级芒果，香甜浓郁',
            category: 'fresh',
            currentPrice: 42.9,
            originalPrice: 52.9,
            image: 'images/4.jpg',
            merchant: '商家B'
        },
        {
            id: 5,
            name: '新疆葡萄 1.5kg',
            description: '新疆吐鲁番无籽葡萄',
            category: 'fresh',
            currentPrice: 28.9,
            originalPrice: 35.9,
            image: 'images/5.jpg',
            merchant: '商家C'
        },
        {
            id: 6,
            name: '泰国山竹 1kg',
            description: '泰国进口山竹，果肉洁白',
            category: 'fresh',
            currentPrice: 45.9,
            originalPrice: 55.9,
            image: 'images/6.jpg',
            merchant: '商家C'
        },
        // 乳饮酒水分类 (drink) - 5个商品
        {
            id: 7,
            name: '蒙牛纯牛奶 250ml24盒',
            description: '优质奶源，营养丰富',
            category: 'drink',
            currentPrice: 59.9,
            originalPrice: 69.9,
            image: 'images/product2.jpg',
            merchant: '商家B'
        },
        {
            id: 8,
            name: '安慕希酸奶 205g*12盒',
            description: '希腊风味酸奶，口感浓郁',
            category: 'drink',
            currentPrice: 45.9,
            originalPrice: 55.9,
            image: 'images/8.jpg',
            merchant: '商家B'
        },
        {
            id: 9,
            name: '可口可乐 330ml*24罐',
            description: '经典可口可乐，畅爽口感',
            category: 'drink',
            currentPrice: 39.9,
            originalPrice: 49.9,
            image: 'images/9.jpg',
            merchant: '商家C'
        },
        {
            id: 10,
            name: '百岁山矿泉水 570ml*24瓶',
            description: '天然矿泉水，品质保证',
            category: 'drink',
            currentPrice: 32.9,
            originalPrice: 42.9,
            image: 'images/10.jpg',
            merchant: '商家C'
        },
        {
            id: 11,
            name: '青岛啤酒 330ml*24罐',
            description: '经典青岛啤酒，麦香浓郁',
            category: 'drink',
            currentPrice: 69.9,
            originalPrice: 79.9,
            image: 'images/11.jpg',
            merchant: '商家A'
        },
        // 休闲零食分类 (snack) - 5个商品
        {
            id: 12,
            name: '乐事薯片大礼包 多种口味',
            description: '多种口味组合，休闲必备',
            category: 'snack',
            currentPrice: 39.9,
            originalPrice: 49.9,
            image: 'images/product3.jpg',
            merchant: '商家A'
        },
        {
            id: 13,
            name: '奥利奥夹心饼干 696g',
            description: '经典巧克力夹心饼干',
            category: 'snack',
            currentPrice: 25.9,
            originalPrice: 32.9,
            image: 'images/13.jpg',
            merchant: '商家A'
        },
        {
            id: 14,
            name: '三只松鼠坚果大礼包 1580g',
            description: '多种坚果组合，营养丰富',
            category: 'snack',
            currentPrice: 89.9,
            originalPrice: 109.9,
            image: 'images/14.jpg',
            merchant: '商家B'
        },
        {
            id: 15,
            name: '德芙巧克力 252g',
            description: '丝滑牛奶巧克力，甜蜜享受',
            category: 'snack',
            currentPrice: 32.9,
            originalPrice: 39.9,
            image: 'images/15.jpg',
            merchant: '商家B'
        },
        {
            id: 16,
            name: '旺旺雪饼 520g',
            description: '经典童年零食，香脆可口',
            category: 'snack',
            currentPrice: 18.9,
            originalPrice: 24.9,
            image: 'images/16.jpg',
            merchant: '商家C'
        },
        // 米面粮油分类 (grain) - 4个商品
        {
            id: 17,
            name: '金龙鱼大米 10kg',
            description: '优质大米，颗粒饱满',
            category: 'grain',
            currentPrice: 69.9,
            originalPrice: 79.9,
            image: 'images/product4.jpg',
            merchant: '商家C'
        },
        {
            id: 18,
            name: '鲁花花生油 5L',
            description: '5S压榨一级花生油',
            category: 'grain',
            currentPrice: 129.9,
            originalPrice: 149.9,
            image: 'images/18.jpg',
            merchant: '商家C'
        },
        {
            id: 19,
            name: '金沙河面条 2.5kg',
            description: '优质小麦制作，筋道爽滑',
            category: 'grain',
            currentPrice: 25.9,
            originalPrice: 32.9,
            image: 'images/19.jpg',
            merchant: '商家A'
        },
        {
            id: 20,
            name: '福临门面粉 5kg',
            description: '优质小麦粉，适合各种面食',
            category: 'grain',
            currentPrice: 32.9,
            originalPrice: 39.9,
            image: 'images/20.jpg',
            merchant: '商家A'
        },
        // 日常用品分类 (daily) - 4个商品
        {
            id: 21,
            name: '维达抽纸 3层120抽24包',
            description: '柔软厚实，家庭必备',
            category: 'daily',
            currentPrice: 49.9,
            originalPrice: 59.9,
            image: 'images/product5.jpg',
            merchant: '商家B'
        },
        {
            id: 22,
            name: '蓝月亮洗衣液 3kg',
            description: '深层去渍，护色护衣',
            category: 'daily',
            currentPrice: 39.9,
            originalPrice: 49.9,
            image: 'images/22.jpg',
            merchant: '商家B'
        },
        {
            id: 23,
            name: '黑人牙膏 225g',
            description: '清新口气，保护牙龈',
            category: 'daily',
            currentPrice: 15.9,
            originalPrice: 19.9,
            image: 'images/23.jpg',
            merchant: '商家C'
        },
        {
            id: 24,
            name: '海飞丝洗发水 400ml',
            description: '去屑止痒，清爽控油',
            category: 'daily',
            currentPrice: 35.9,
            originalPrice: 45.9,
            image: 'images/product6.jpg',
            merchant: '商家C'
        }
    ];
}

// 加载客户商品
function loadCustomerProducts(category = 'all') {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    let filteredProducts = products;
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product, 'customer');
        container.appendChild(productCard);
    });
}

// 加载商家商品
function loadMerchantProducts() {
    const container = document.getElementById('merchant-products-container');
    container.innerHTML = '';
    
    // 假设商家只能看到自己上传的商品
    const merchantProducts = products.filter(product => product.merchant === currentUser);
    
    if (merchantProducts.length === 0) {
        container.innerHTML = '<p>您还没有上传任何商品</p >';
        return;
    }
    
    merchantProducts.forEach(product => {
        const productCard = createProductCard(product, 'merchant');
        container.appendChild(productCard);
    });
}

// 加载管理员商品
function loadAdminProducts() {
    const container = document.getElementById('admin-products-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product, 'admin');
        container.appendChild(productCard);
    });
}

// 创建商品卡片
function createProductCard(product, role) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    
    let actionsHTML = '';
    
    if (role === 'customer') {
        actionsHTML = `<button class="add-to-cart" data-id="${product.id}">加入购物车</button>`;
    } else if (role === 'merchant') {
        actionsHTML = `<button class="delete-product" data-id="${product.id}">删除商品</button>`;
    } else if (role === 'admin') {
        actionsHTML = `<button class="delete-product" data-id="${product.id}">删除商品</button>`;
    }
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-category">${getCategoryName(product.category)}</div>
            <div class="product-price-row">
                <div>
                    <span class="current-price">¥${product.currentPrice}</span>
                    <span class="original-price">¥${product.originalPrice}</span>
                </div>
            </div>
            <div class="product-actions">
                ${actionsHTML}
            </div>
        </div>
    `;
    
    // 绑定事件
    if (role === 'customer') {
        const addToCartBtn = card.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', function() {
            addToCart(product);
        });
    } else {
        const deleteBtn = card.querySelector('.delete-product');
        deleteBtn.addEventListener('click', function() {
            deleteProduct(product.id);
        });
    }
    
    return card;
}

// 获取分类名称
function getCategoryName(category) {
    const categoryMap = {
        'all': '全部',
        'fresh': '生鲜水果',
        'drink': '乳饮酒水',
        'snack': '休闲零食',
        'grain': '米面粮油',
        'daily': '日常用品'
    };
    
    return categoryMap[category] || '其他';
}

// 根据分类筛选商品
function filterProductsByCategory(category) {
    if (currentRole === 'customer') {
        loadCustomerProducts(category);
    }
    // 商家和管理员页面可以添加类似的筛选功能
}

// 处理添加商品
function handleAddProduct() {
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const originalPrice = parseFloat(document.getElementById('product-original-price').value);
    const imageFile = document.getElementById('product-image').files[0];
    
    if (!name || !description || !category || !price || !originalPrice) {
        alert('请填写所有必填字段');
        return;
    }
    
    // 模拟图片上传
    let imageUrl = 'images/default-product.jpg';
    if (imageFile) {
        // 实际项目中这里应该上传图片到服务器
        imageUrl = URL.createObjectURL(imageFile);
    }
    
    // 创建新商品
    const newProduct = {
        id: products.length + 1,
        name,
        description,
        category,
        currentPrice: price,
        originalPrice,
        image: imageUrl,
        merchant: currentUser
    };
    
    // 添加到商品列表
    products.push(newProduct);
    
    alert('商品添加成功');
    
    // 返回商家首页
    navigateToPage('merchant-home-page');
}

// 删除商品
function deleteProduct(productId) {
    if (confirm('确定要删除这个商品吗？')) {
        // 从商品列表中移除
        const index = products.findIndex(product => product.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
        }
        
        // 从购物车中移除（如果存在）
        const cartIndex = cartItems.findIndex(item => item.id === productId);
        if (cartIndex !== -1) {
            cartItems.splice(cartIndex, 1);
        }
        
        // 重新加载当前页面
        if (currentRole === 'customer') {
            loadCustomerProducts();
        } else if (currentRole === 'merchant') {
            loadMerchantProducts();
        } else if (currentRole === 'admin') {
            loadAdminProducts();
        }
        
        alert('商品已删除');
    }
}



// 添加到购物车
function addToCart(product) {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            ...product,
            quantity: 1
        });
    }
    
    alert(`已添加 ${product.name} 到购物车`);
    
    // 更新购物车显示
    if (document.getElementById('customer-cart-page').classList.contains('active')) {
        loadCartItems();
    }
}

// 加载购物车项目
function loadCartItems() {
    const container = document.getElementById('cart-list');
    container.innerHTML = '';
    
    if (cartItems.length === 0) {
        container.innerHTML = '<p>购物车为空</p >';
        updateCartTotal();
        return;
    }
    
    cartItems.forEach(item => {
        const cartItem = createCartItem(item);
        container.appendChild(cartItem);
    });
    
    updateCartTotal();
}

// 创建购物车项目
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-id', item.id);
    
    cartItem.innerHTML = `
        <div class="cart-checkbox">
            <input type="checkbox" class="item-checkbox" data-id="${item.id}" checked>
        </div>
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-category">${getCategoryName(item.category)}</div>
            <div class="cart-item-bottom">
                <div class="cart-item-price">¥${item.currentPrice}</div>
                <div class="cart-item-quantity">
                    <div class="quantity-btn minus" data-id="${item.id}">-</div>
                    <input type="text" class="quantity-input" value="${item.quantity}" data-id="${item.id}" readonly>
                    <div class="quantity-btn plus" data-id="${item.id}">+</div>
                </div>
            </div>
        </div>
    `;
    
    // 绑定数量调整事件
    const minusBtn = cartItem.querySelector('.minus');
    const plusBtn = cartItem.querySelector('.plus');
    
    minusBtn.addEventListener('click', function() {
        if (item.quantity > 1) {
            item.quantity--;
            cartItem.querySelector('.quantity-input').value = item.quantity;
            updateCartTotal();
        }
    });
    
    plusBtn.addEventListener('click', function() {
        item.quantity++;
        cartItem.querySelector('.quantity-input').value = item.quantity;
        updateCartTotal();
    });
    
    // 绑定复选框事件
    const checkbox = cartItem.querySelector('.item-checkbox');
    checkbox.addEventListener('change', updateCartTotal);
    
    return cartItem;
}

// 更新购物车总计
function updateCartTotal() {
    const checkboxes = document.querySelectorAll('.item-checkbox:checked');
    let total = 0;
    let count = 0;
    
    checkboxes.forEach(checkbox => {
        const itemId = parseInt(checkbox.getAttribute('data-id'));
        const item = cartItems.find(i => i.id === itemId);
        
        if (item) {
            total += item.currentPrice * item.quantity;
            count += item.quantity;
        }
    });
    
    document.getElementById('total-price').textContent = `¥${total.toFixed(2)}`;
    document.getElementById('selected-count').textContent = count;
}

// 购物车结算
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cart-settlement')) {
        const selectedCount = document.getElementById('selected-count').textContent;
        
        if (selectedCount === '0') {
            alert('请选择要结算的商品');
        } else {
            alert(`结算成功！共${selectedCount}件商品`);
            // 清空购物车
            cartItems = [];
            loadCartItems();
        }
    }
});

// 全选功能
document.addEventListener('change', function(e) {
    if (e.target.id === 'select-all') {
        const checkboxes = document.querySelectorAll('.item-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
        updateCartTotal();
    }
});


