/**
 * 實現移動端優化的全屏垂直滑動效果 (Full-Screen Vertical Scrolling)
 */

document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page-section');
    const totalPages = pages.length;
    let currentPageIndex = 0;
    let isScrolling = false; // 鎖定滾動，防止連續觸發

    // 1. 設置每個頁面為 viewport 的高度（確保全屏顯示）
    pages.forEach(page => {
        page.style.height = '100vh';
    });
    // ▼▼▼ 步驟 1：加入這個新函式 ▼▼▼
            function createAmbientParticles() {
                const particleCount = 40; // 每個頁面的粒子數量

                pages.forEach(page => {
                    // 1. 創建一個容器來裝粒子
                    const container = document.createElement('div');
                    container.className = 'particle-container';
                    
                    for (let i = 0; i < particleCount; i++) {
                        // 2. 創建單個粒子
                        const particle = document.createElement('div');
                        particle.className = 'particle';
                        
                        // 3. 設置隨機的初始水平位置 (left)
                        particle.style.left = `${Math.random() * 100}%`;
                        
                        // 4. 設置隨機的大小和透明度
                        const scale = Math.random() * 0.8 + 0.2; // 0.2 到 1.0 之間
                        particle.style.transform = `scale(${scale})`;
                        particle.style.opacity = `${Math.random() * 0.5 + 0.2}`; // 0.2 到 0.7 之間
                        
                        // 5. 設置隨機的動畫延遲和時長
                        // 讓它們從 0-15 秒內隨機開始
                        particle.style.animationDelay = `${Math.random() * 15}s`;
                        // 讓它們花 10-25 秒漂浮
                        particle.style.animationDuration = `${Math.random() * 15 + 10}s`;

                        container.appendChild(particle);
                    }
                    page.appendChild(container); // 6. 把粒子容器加到頁面中
                });
            }

    /**
     * 滾動到指定的頁面
     * @param {number} index - 目標頁面的索引 (0 到 totalPages - 1)
     */
    function goToPage(index) {
        if (index >= 0 && index < totalPages) {
            isScrolling = true;
            currentPageIndex = index;
            
            // 使用 scrollIntoView 配合 CSS 的 scroll-behavior: smooth 實現平滑過渡
            pages[currentPageIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start' // 確保頁面頂部對齊 viewport 頂部
            });

            // 在滾動結束後解除鎖定，才能進行下一次滾動
            // 由於 scrollIntoView 沒有回調，我們使用 setTimeout 模擬滾動時間
            setTimeout(() => {
                isScrolling = false;
                
                // 觸發該頁面的加載動畫
                triggerPageAnimation(currentPageIndex); 
            }, 800); // 這裡的延遲時間應略大於 CSS 中設定的 transition 時間 (例如 0.5s)
        }
    }

    /**
     * 處理滾動事件：檢測滾動方向並切換頁面
     * @param {object} event - 滾動事件對象
     */
    function handleScroll(event) {
        if (isScrolling) return;

        // 判斷滾動方向：向上滾動 (負值) 或 向下滾動 (正值)
        const delta = event.deltaY || event.wheelDelta; 

        if (delta > 0) {
            // 向下滾動 (到下一頁)
            goToPage(currentPageIndex + 1);
        } else if (delta < 0) {
            // 向上滾動 (到上一頁)
            goToPage(currentPageIndex - 1);
        }
    }

    // 處理滑鼠滾輪事件
    document.addEventListener('wheel', handleScroll);

    // 處理移動端觸摸事件 (Swipe)
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        if (isScrolling) return;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        if (isScrolling) return;
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY; // 正值表示向上滑 (到下一頁)

        const threshold = 50; // 最小滑動距離閾值
        
        if (Math.abs(diffY) > threshold) {
            if (diffY > 0) {
                // 向上滑動 (到下一頁)
                goToPage(currentPageIndex + 1);
            } else {
                // 向下滑動 (到上一頁)
                goToPage(currentPageIndex - 1);
            }
        }
    });
    // ▼▼▼ 步驟 2：在 goToPage(0) 之前執行這個函式 ▼▼▼
    createAmbientParticles();

    // 2. 初始化：首次加載時先觸發第一頁的動畫
    // 我們需要確保頁面加載完成後再執行此操作
    setTimeout(() => {
        goToPage(0);
    }, 100); 


    // ===========================================
    // 3. 頁面動畫觸發器 (為下一步準備)
    // ===========================================
    /**
     * @param {number} index - 當前頁面的索引
     */
    function triggerPageAnimation(index) {
        // 確保當前頁面有 "is-active" class，用來觸發該頁的動畫
        pages.forEach((page, i) => {
            if (i === index) {
                page.classList.add('is-active');
            } else {
                page.classList.remove('is-active');
            }
        });
    }

});