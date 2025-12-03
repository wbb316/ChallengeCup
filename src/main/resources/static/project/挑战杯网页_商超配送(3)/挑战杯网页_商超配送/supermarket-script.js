// 商家数据（与页面商家信息对应）
const merchants = {
    1: {
        id: 1,
        name: "惠民生活超市",
        type: "supermarket",
        products: [
            {
                id: "p1",
                name: "红富士苹果（500g）",
                category: "vegetable",
                price: 9.9,
                originalPrice: 12.8,
                img: "images/product1.jpg"
            },
            {
                id: "p2",
                name: "精选五花肉（500g）",
                category: "meat",
                price: 26.8,
                originalPrice: 29.8,
                img: "images/02.jpg"
            },
            {
                id: "p3",
                name: "维达卷纸10卷装",
                category: "daily",
                price: 18.9,
                originalPrice: 22.5,
                img: "images/product5.jpg"
            }
        ]
    },
    2: {
        id: 2,
        name: "每日鲜菜场",
        type: "fresh",
        products: [
            {
                id: "p10",
                name: "有机生菜（300g）",
                category: "vegetable",
                price: 5.5,
                originalPrice: 6.9,
                img: "images/010.jpg"
            },
            {
                id: "p11",
                name: "散养土鸡蛋（10枚）",
                category: "fresh",
                price: 15.8,
                originalPrice: 18.8,
                img: "images/011.jpg"
            },
            {
                id: "p12",
                name: "新鲜鲈鱼（约500g）",
                category: "meat",
                price: 28.9,
                originalPrice: 32.9,
                img: "images/012.jpg"
            }
        ]
    },
    3: {
        id: 3,
        name: "邻里便利店",
        type: "convenience",
        products: [
            {
                id: "p20",
                name: "可口可乐（500ml）",
                category: "drink",
                price: 3.0,
                originalPrice: 3.5,
                img: "images/9.jpg"
            },
            {
                id: "p21",
                name: "红烧牛肉面",
                category: "snack",
                price: 4.5,
                originalPrice: 5.0,
                img: "images/021.jpg"
            },
            {
                id: "p22",
                name: "农夫山泉矿泉水",
                category: "drink",
                price: 2.0,
                originalPrice: 2.0,
                img: "images/022.jpg"
            }
        ]
    },
    4: {
        id: 4,
        name: "西域水果行",
        type: "specialty",
        products: [
            {
                id: "p30",
                name: "新疆哈密瓜（约2kg）",
                category: "vegetable",
                price: 19.9,
                originalPrice: 25.9,
                img: "images/030.jpg"
            },
            {
                id: "p31",
                name: "进口车厘子（500g）",
                category: "vegetable",
                price: 59.9,
                originalPrice: 69.9,
                img: "images/031.jpg"
            },
            {
                id: "p32",
                name: "精品葡萄（500g）",
                category: "vegetable",
                price: 12.8,
                originalPrice: 15.8,
                img: "images/5.jpg"
            }
        ]
    }
};

// 购物车数据
let cart = [];
// 银发模式状态
let isSilverMode = false;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    bindMerchantFilterEvents();
    bindCategoryFilterEvents();
    bindCartEvents();
    bindSilverModeToggle();
});

// 初始化页面
function initPage() {
    // 加载默认商家商品（惠民生活超市，id=1）
    loadMerchantProducts(1);
    // 绑定商家切换事件
    bindMerchantSwitchEvents();
}

// 绑定商家切换事件
function bindMerchantSwitchEvents() {
    const merchantCards = document.querySelectorAll('.merchant-card');
    merchantCards.forEach(card => {
        card.addEventListener('click', function() {
            // 移除所有商家的active类
            merchantCards.forEach(c => c.classList.remove('active'));
            // 给当前点击的商家添加active类
            this.classList.add('active');
            
            // 获取商家ID并加载对应商品
            const merchantId = parseInt(this.getAttribute('data-id'));
            const merchantName = this.querySelector('.merchant-name').textContent;
            
            // 更新当前商家名称
            document.querySelector('.current-merchant').textContent = merchantName;
            
            // 加载该商家的商品
            loadMerchantProducts(merchantId);
            
            // 重置商品分类筛选为"全部商品"
            const categoryItems = document.querySelectorAll('.category-item');
            categoryItems.forEach(item => {
                if (item.getAttribute('data-category') === 'all') {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        });
    });
}

// 加载商家商品
function loadMerchantProducts(merchantId) {
    const productGrid = document.getElementById('productGrid');
    const products = merchants[merchantId].products;
    
    // 清空商品网格
    productGrid.innerHTML = '';
    
    // 添加商品
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);
        productCard.setAttribute('data-category', product.category);
        
        productCard.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-desc">新鲜直达，品质保证</div>
                <div class="product-price">
                    <span class="price">¥${product.price}</span>
                    <span class="original-price">¥${product.originalPrice}</span>
                </div>
            </div>
            <div class="product-actions">
                <button class="add-to-cart" 
                        data-id="${product.id}" 
                        data-name="${product.name}" 
                        data-price="${product.price}" 
                        data-img="${product.img}">
                    加入购物车
                </button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // 绑定加入购物车事件
    bindAddToCartEvents();
}

// 绑定商家类型筛选事件
function bindMerchantFilterEvents() {
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 移除所有筛选标签的active类
            filterTags.forEach(t => t.classList.remove('active'));
            // 给当前点击的标签添加active类
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-type');
            const merchantCards = document.querySelectorAll('.merchant-card');
            
            // 筛选并显示符合条件的商家
            merchantCards.forEach(card => {
                if (filterType === 'all' || card.getAttribute('data-type') === filterType) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 绑定商品分类筛选事件
function bindCategoryFilterEvents() {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有分类项的active类
            categoryItems.forEach(i => i.classList.remove('active'));
            // 给当前点击的分类项添加active类
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            const productCards = document.querySelectorAll('.product-card');
            
            // 筛选并显示符合条件的商品
            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 绑定加入购物车事件
function bindAddToCartEvents() {
    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImg = this.getAttribute('data-img');
            
            // 添加到购物车
            addToCart(productId, productName, productPrice, productImg);
            
            // 按钮状态变化
            this.textContent = '已添加';
            this.classList.add('added');
            
            // 1.5秒后恢复按钮状态
            setTimeout(() => {
                this.textContent = '加入购物车';
                this.classList.remove('added');
            }, 1500);
        });
    });
}

// 添加商品到购物车
function addToCart(id, name, price, img) {
    // 检查商品是否已在购物车中
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex !== -1) {
        // 已存在，增加数量
        cart[existingItemIndex].quantity++;
    } else {
        // 不存在，添加新商品
        cart.push({
            id,
            name,
            price,
            img,
            quantity: 1
        });
    }
    
    // 更新购物车显示
    updateCartDisplay();
}

// 更新购物车显示
function updateCartDisplay() {
    const cartCountElem = document.getElementById('cartItemCount');
    const cartTotalElem = document.getElementById('cartTotalPrice');
    const modalTotalElem = document.getElementById('modalTotalPrice');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    
    // 计算总数和总价
    let totalItems = 0;
    let totalPrice = 0;
    
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });
    
    // 更新购物车数量和总价
    cartCountElem.textContent = totalItems;
    cartTotalElem.textContent = `¥${totalPrice.toFixed(2)}`;
    modalTotalElem.textContent = `¥${totalPrice.toFixed(2)}`;
    
    // 更新购物车弹窗内容
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <p>购物车还是空的哦</p>
                <p>快去添加商品吧~</p>
            </div>
        `;
        return;
    }
    
    // 清空购物车容器
    cartItemsContainer.innerHTML = '';
    
    // 添加购物车商品
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
            </div>
            <div class="quantity-control">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item" data-id="${item.id}">删除</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // 绑定购物车项目事件
    bindCartItemEvents();
}

// 绑定购物车项目事件
function bindCartItemEvents() {
    // 减少数量按钮
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    cart.splice(itemIndex, 1);
                }
                updateCartDisplay();
            }
        });
    });
    
    // 增加数量按钮
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1) {
                cart[itemIndex].quantity++;
                updateCartDisplay();
            }
        });
    });
    
    // 删除按钮
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1) {
                cart.splice(itemIndex, 1);
                updateCartDisplay();
            }
        });
    });
}

// 绑定购物车相关事件
function bindCartEvents() {
    const cartToggle = document.getElementById('cartToggle');
    const cartModal = document.getElementById('cartModal');
    const closeModal = document.getElementById('closeModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const confirmCheckout = document.getElementById('confirmCheckout');
    
    // 打开购物车弹窗
    cartToggle.addEventListener('click', function() {
        cartModal.style.display = 'block';
    });
    
    // 关闭购物车弹窗
    closeModal.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    // 点击遮罩层关闭弹窗
    modalOverlay.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    // 去结算按钮
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('您的购物车是空的，请先添加商品');
            return;
        }
        cartModal.style.display = 'block';
    });
    
    // 确认下单按钮
    confirmCheckout.addEventListener('click', function() {
        processCheckout();
    });
}

// 处理结算
function processCheckout() {
    if (cart.length === 0) {
        alert('您的购物车是空的，请先添加商品');
        return;
    }
    
    // 关闭购物车弹窗
    cartModal.style.display = 'none';
    
    // 模拟结算流程
    alert('订单提交成功！\n您的商品将尽快送达，请注意查收。');
    
    // 清空购物车
    cart = [];
    updateCartDisplay();
}

// 绑定银发模式切换
function bindSilverModeToggle() {
    const silverModeBtn = document.querySelector('.silver-mode-btn');
    
    silverModeBtn.addEventListener('click', function() {
        if (isSilverMode) {
            disableSilverMode();
        } else {
            enableSilverMode();
        }
    });
}

// 启用银发模式
function enableSilverMode() {
    document.body.classList.add('silver-mode');
    document.querySelector('.silver-mode-btn').textContent = '退出银发模式';
    document.querySelector('.silver-mode-btn').style.backgroundColor = '#52c41a';
    isSilverMode = true;
}

// 禁用银发模式
function disableSilverMode() {
    document.body.classList.remove('silver-mode');
    document.querySelector('.silver-mode-btn').textContent = '银发模式';
    document.querySelector('.silver-mode-btn').style.backgroundColor = '#ff4d4f';
    isSilverMode = false;
}