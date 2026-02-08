# Luke.ai 个人主页

欢迎来到您的个人主页项目！这是一个基于纯静态 HTML/CSS/JS 构建的现代化响应式网站，采用了 Apple 风格的设计语言。

## 📂 项目结构

```
个人主页/
├── index.html          # 主页面文件
├── css/
│   └── style.css       # 样式表（设计、动画、响应式）
├── js/
│   └── script.js       # 交互脚本（滚动动画、视差效果）
├── assets/             # 资源文件夹
│   ├── images/         # 图片资源（项目截图等）
│   └── videos/         # 视频资源（AI创作视频）
└── README.md           # 本说明文件
```

## 🚀 如何预览

1.  **直接打开**：在文件夹中找到 `index.html`，双击即可在浏览器中查看。
2.  **VS Code Live Server（推荐）**：如果您使用 VS Code，安装 "Live Server" 插件，右键 `index.html` 选择 "Open with Live Server"，可以获得实时刷新的开发体验。

## 🖼 如何替换内容

所有内容都可以直接在 `index.html` 中修改。

### 1. 替换图片
将您的项目截图放入 `assets/images/` 文件夹，然后在 `index.html` 中找到对应的 `<img>` 标签或背景图样式进行修改。

例如，找到项目卡片部分：
```html
<!-- 找到这个部分 -->
<div class="placeholder-image" style="...">...</div>
<!-- 替换为 -->
<img src="assets/images/您的截图.jpg" alt="项目名称" style="width:100%; height:100%; object-fit:cover;">
```

### 2. 替换视频
将您的视频文件放入 `assets/videos/` 文件夹，然后在 `index.html` 的 `Creations` 部分取消注释并修改视频路径：

```html
<div class="video-wrapper">
    <video controls poster="assets/images/封面图.jpg">
        <source src="assets/videos/您的视频.mp4" type="video/mp4">
    </video>
</div>
```

## 🌐 如何部署到 Vercel

1.  访问 [Vercel官网](https://vercel.com) 并登录/注册。
2.  在控制台点击 "Add New..." -> "Project"。
3.  选择从 GitHub 导入（推荐），或者直接拖拽本地文件夹上传。
    - **GitHub 方式**：先将此文件夹推送到 GitHub 仓库，然后在 Vercel 中导入该仓库。
    - **拖拽方式**：安装 Vercel CLI (`npm i -g vercel`)，然后在终端运行 `vercel` 命令。
4.  部署完成后，Vercel 会提供一个免费的 `.vercel.app` 域名，您也可以绑定自己的域名。

---
Enjoy building your vibe! ✨
