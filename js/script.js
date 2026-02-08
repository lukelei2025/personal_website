
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
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            const link = card.getAttribute('data-link');
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
