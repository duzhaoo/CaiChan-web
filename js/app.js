// 应用主函数
function app() {
    return {
        // 状态变量
        currentPage: 'home',
        assets: [],
        currentAssetIndex: -1,
        showOptions: false,
        isEditing: false,
        editingAsset: {},
        
        // 新资产对象
        newAsset: {
            name: '',
            value: '',
            category: 'financial',
            image: ''
        },
        
        // 初始化
        init() {
            // 从本地存储加载资产数据
            this.loadAssets();
            
            // 设置手势支持
            this.setupHammer();
            
            // 处理 URL 参数，支持快捷方式功能
            const urlParams = new URLSearchParams(window.location.search);
            const page = urlParams.get('page');
            if (page) {
                this.currentPage = page;
            }
        },
        
        // 加载资产数据
        loadAssets() {
            const savedAssets = localStorage.getItem('assets');
            if (savedAssets) {
                this.assets = JSON.parse(savedAssets);
            } else {
                // 示例数据
                this.assets = [
                    {
                        name: 'iPhone15',
                        value: 5499,
                        category: 'valuable',
                        image: ''
                    },
                    {
                        name: 'Macbook M4',
                        value: 6000,
                        category: 'financial',
                        image: ''
                    },
                    {
                        name: '现金存款',
                        value: 2820000,
                        category: 'realestate',
                        image: ''
                    },
                    {
                        name: 'iPhone15',
                        value: 4000,
                        category: 'valuable',
                        image: ''
                    },
                    {
                        name: '天津房产',
                        value: 1020000,
                        category: 'realestate',
                        image: ''
                    }
                ];
                this.saveAssets();
            }
        },
        
        // 保存资产数据到本地存储
        saveAssets() {
            try {
                localStorage.setItem('assets', JSON.stringify(this.assets));
            } catch (e) {
                console.error('保存失败:', e);
                alert('保存失败，可能是因为数据过大。请尝试使用更小的图片。');
                // 尝试移除最后添加的资产
                if (e.name === 'QuotaExceededError' && this.assets.length > 0) {
                    this.assets.pop();
                    alert('已自动移除最后添加的资产，请尝试使用更小的图片。');
                }
            }
        },
        
        // 设置手势支持
        setupHammer() {
            const pageContainer = document.querySelector('.flex-1.overflow-hidden');
            const hammer = new Hammer(pageContainer);
            
            hammer.on('swipeleft', () => {
                if (this.currentPage === 'home') {
                    this.currentPage = 'add';
                    this.resetNewAsset();
                }
            });
            
            hammer.on('swiperight', () => {
                if (this.currentPage === 'add') {
                    this.currentPage = 'home';
                } else if (this.currentPage === 'detail') {
                    this.currentPage = 'home';
                }
            });
        },
        
        // 计算总资产
        get totalAssets() {
            return this.assets.reduce((sum, asset) => sum + Number(asset.value), 0);
        },
        
        // 格式化货币
        formatCurrency(value) {
            const num = Number(value);
            if (isNaN(num)) return '¥0';
            
            if (num >= 10000) {
                // 将数值转换为万单位
                const inWan = num / 10000;
                // 判断是否有小数部分
                if (Math.floor(inWan) === inWan) {
                    // 整数，不显示小数点
                    return `¥${inWan}W`;
                } else {
                    // 有小数部分，保留两位小数
                    // 先转换为两位小数的字符串
                    const withTwoDecimals = inWan.toFixed(2);
                    // 如果小数部分以零结尾，则去除
                    const trimmed = withTwoDecimals.replace(/\.?0+$/, '');
                    return `¥${trimmed}W`;
                }
            } else {
                // 判断是否有小数部分
                if (Math.floor(num) === num) {
                    // 整数，不显示小数点
                    return `¥${num}`;
                } else {
                    // 有小数部分，保留两位小数
                    // 先转换为两位小数的字符串
                    const withTwoDecimals = num.toFixed(2);
                    // 如果小数部分以零结尾，则去除
                    const trimmed = withTwoDecimals.replace(/\.?0+$/, '');
                    return `¥${trimmed}`;
                }
            }
        },
        

        
        // 获取类别名称
        getCategoryName(category) {
            const categories = {
                'financial': '金融资产',
                'realestate': '不动产',
                'valuable': '贵重物品',
                'other': '其他'
            };
            
            return categories[category] || '其他';
        },
        
        // 获取类别图标
        getCategoryIcon(category) {
            const icons = {
                'financial': 'ri-money-cny-box-line',
                'realestate': 'ri-home-line',
                'valuable': 'ri-gift-line',
                'other': 'ri-box-3-line'
            };
            
            return icons[category] || 'ri-box-3-line';
        },
        
        // 获取类别颜色类
        getCategoryColorClass(category) {
            const colors = {
                'financial': 'bg-category-financial',
                'realestate': 'bg-category-realestate',
                'valuable': 'bg-category-valuable',
                'other': 'bg-category-other'
            };
            
            return colors[category] || 'bg-category-other';
        },
        
        // 重置新资产对象
        resetNewAsset() {
            this.newAsset = {
                name: '',
                value: '',
                category: 'financial',
                image: ''
            };
        },
        
        // 保存新资产
        saveAsset() {
            if (!this.newAsset.name || !this.newAsset.value) {
                alert('请填写资产名称和价值');
                return;
            }
            
            this.assets.push({
                name: this.newAsset.name,
                value: Number(this.newAsset.value),
                category: this.newAsset.category,
                image: this.newAsset.image
            });
            
            this.saveAssets();
            this.currentPage = 'home';
            this.resetNewAsset();
        },
        
        // 查看资产详情
        viewAssetDetail(index) {
            this.currentAssetIndex = index;
            this.currentAsset = this.assets[index];
            this.currentPage = 'detail';
            this.isEditing = false;
        },
        
        // 开始编辑资产
        startEditing() {
            // 创建编辑资产的副本，避免直接修改原始资产
            this.editingAsset = JSON.parse(JSON.stringify(this.currentAsset));
            this.isEditing = true;
        },
        
        // 保存编辑的资产
        saveEditing() {
            if (!this.editingAsset.name || !this.editingAsset.value) {
                alert('请填写资产名称和价值');
                return;
            }
            
            // 更新当前资产
            this.assets[this.currentAssetIndex] = {
                name: this.editingAsset.name,
                value: Number(this.editingAsset.value),
                category: this.editingAsset.category,
                image: this.editingAsset.image
            };
            
            // 保存到本地存储
            this.saveAssets();
            
            // 更新当前资产并退出编辑模式
            this.currentAsset = this.assets[this.currentAssetIndex];
            this.isEditing = false;
        },
        
        // 触发编辑模式下的图片上传
        triggerEditImageUpload() {
            document.getElementById('editImageUpload').click();
        },
        
        // 处理编辑模式下的图片上传
        handleEditImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.compressImage(file, 800, 600, 0.7, (compressedDataUrl) => {
                    this.editingAsset.image = compressedDataUrl;
                });
            }
        },
        
        // 删除资产
        deleteAsset() {
            if (this.currentAssetIndex >= 0) {
                this.assets.splice(this.currentAssetIndex, 1);
                this.saveAssets();
                this.currentPage = 'home';
                this.showOptions = false;
            }
        },
        
        // 触发图片上传
        triggerImageUpload() {
            document.getElementById('imageUpload').click();
        },
        
        // 处理图片上传
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.compressImage(file, 800, 600, 0.7);
            }
        },
        
        // 压缩图片
        compressImage(file, maxWidth, maxHeight, quality, callback) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // 计算压缩后的尺寸
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth) {
                        height = Math.round(height * maxWidth / width);
                        width = maxWidth;
                    }
                    
                    if (height > maxHeight) {
                        width = Math.round(width * maxHeight / height);
                        height = maxHeight;
                    }
                    
                    // 创建canvas进行压缩
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // 转换为base64
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    
                    // 如果有回调函数，则调用回调函数
                    if (callback) {
                        callback(compressedDataUrl);
                    } else {
                        this.newAsset.image = compressedDataUrl;
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        
        
        // 获取当前资产
        get currentAsset() {
            return this.currentAssetIndex >= 0 ? this.assets[this.currentAssetIndex] : {};
        },
        
        // 设置当前资产
        set currentAsset(asset) {
            if (this.currentAssetIndex >= 0) {
                this.assets[this.currentAssetIndex] = asset;
                this.saveAssets();
            }
        }
    };
}
