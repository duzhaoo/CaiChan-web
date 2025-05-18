// 应用主函数
function app() {
    return {
        // 状态变量
        currentPage: 'home',
        assets: [],
        currentAssetIndex: -1,
        showOptions: false,
        
        // 新资产对象
        newAsset: {
            name: '',
            value: '',
            category: 'financial',
            image: '',
            purchaseDate: new Date().toISOString().split('T')[0]
        },
        
        // 初始化
        init() {
            // 从本地存储加载资产数据
            this.loadAssets();
            
            // 设置手势支持
            this.setupHammer();
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
                        image: '',
                        purchaseDate: '2025-05-15'
                    },
                    {
                        name: 'Macbook M4',
                        value: 6000,
                        category: 'financial',
                        image: '',
                        purchaseDate: '2025-05-15'
                    },
                    {
                        name: '现金存款',
                        value: 2820000,
                        category: 'realestate',
                        image: '',
                        purchaseDate: '2025-05-15'
                    },
                    {
                        name: 'iPhone15',
                        value: 4000,
                        category: 'valuable',
                        image: '',
                        purchaseDate: '2025-05-15'
                    },
                    {
                        name: '天津房产',
                        value: 1020000,
                        category: 'realestate',
                        image: '',
                        purchaseDate: '2025-05-15'
                    }
                ];
                this.saveAssets();
            }
        },
        
        // 保存资产数据到本地存储
        saveAssets() {
            localStorage.setItem('assets', JSON.stringify(this.assets));
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
                return `¥${(num / 10000).toFixed(2)}W`;
            } else {
                return `¥${num}`;
            }
        },
        
        // 格式化日期
        formatDate(dateString) {
            if (!dateString) return '';
            
            const date = new Date(dateString);
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
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
                image: '',
                purchaseDate: new Date().toISOString().split('T')[0]
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
                image: this.newAsset.image,
                purchaseDate: this.newAsset.purchaseDate
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
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.newAsset.image = e.target.result;
                };
                reader.readAsDataURL(file);
            }
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
