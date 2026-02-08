
// 初始化 AOS 动画库
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800, // 动画持续时间
        easing: 'ease-out-cubic', // 缓动函数
        once: true, // 动画只播放一次
        offset: 50, // 触发动画的偏移量
        delay: 0,
    });

    // 导航栏滚动效果
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
        } else {
            nav.style.background = 'rgba(250, 250, 250, 0.8)';
            nav.style.boxShadow = 'none';
        }
    });

    // 背景视差效果 (鼠标移动时光球微动)
    const spheres = document.querySelectorAll('.gradient-sphere');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        spheres.forEach((sphere, index) => {
            const speed = (index + 1) * 20; // 不同的移动速度
            const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
            const yOffset = (window.innerHeight / 2 - e.clientY) / speed;

            sphere.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    // --- Project Modal Logic ---
    const projectDetails = {
        "coffee": `豆藏（Project Coffee）是一款面向咖啡爱好者的个人咖啡豆管理应用：把「买过、喝过、喜欢过」的豆子集中存档，并且能随时找回当时的口味与评分。它解决的核心痛点很直接：豆子产地与处理法太多记不住；喜好是主观的，隔一段时间就忘；风味描述抽象难复盘；包装信息散落在相册；在哪里买、在哪喝也常对不上。

典型使用场景是：在咖啡店喝到惊艳的一杯，拍下包装或豆卡，系统用 AI 识别并自动填入名称、产地、处理法、风味标签；回家后补上手冲参数与品鉴笔记，给出 0–5 分（支持半星）的评分。之后无论是复购、选豆、对比烘焙商，还是按关键词/星级筛选，都能快速定位到「我真正喜欢的那几款」。

核心功能包括：手机号虚拟登录（免短信）、多用户数据隔离、JWT 保持登录与登出；咖啡豆的新增/列表/详情/编辑/删除（卡片左滑 iOS 风格删除）；风味标签输入管理与星级评分组件；拍照/相册上传识别与图片压缩。

技术上采用 React 19 + TypeScript + Vite 6 + React Router v7，原生 CSS 与 Lucide 图标；后端为 Node.js 20 + Express 4，Prisma 5 连接 Railway 托管的 PostgreSQL，JWT（jsonwebtoken）鉴权；AI 识别接入阿里云 DashScope（Qwen-VL-Plus），整体以 Railway 一体化部署（前端静态资源 + 后端 API）。`
    };

    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-btn');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalLink = document.getElementById('modal-link');
    const projectCards = document.querySelectorAll('.project-card');

    // Open Modal
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default if it was a link

            // Get data from attributes
            const projectId = card.getAttribute('data-project-id');
            const title = card.getAttribute('data-title');
            let desc = card.getAttribute('data-desc');
            const link = card.getAttribute('data-link');

            if (projectId && projectDetails[projectId]) {
                desc = projectDetails[projectId];
            }

            // For placeholder, we use the gradient color if no image source is provided
            // If you implement real images later, use data-img attribute
            const imgColor = card.getAttribute('data-img-color');
            const imgSrc = card.getAttribute('data-img-src'); // Future proofing

            // Populate Modal
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalLink.href = link;

            // Handle Image/Placeholder
            const wrapper = modal.querySelector('.modal-image-wrapper');
            if (imgSrc) {
                modalImage.src = imgSrc;
                modalImage.style.display = 'block';
                wrapper.style.background = 'none';
            } else if (imgColor) {
                modalImage.style.display = 'none';
                wrapper.style.background = imgColor;
            }

            // Show Modal
            modal.style.display = 'flex';
            // Slight delay to allow display:flex to apply before adding opacity class
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        });
    });

    // Close Modal Function
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Match transition duration
    }

    // Close Events
    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
