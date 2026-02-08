
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

    // 这里可以添加更多交互逻辑
    console.log('Luke.ai website is ready to vibe!');
});
