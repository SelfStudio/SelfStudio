/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // 如果你的项目是部署到 GitHub Pages 的子路径（例如 username.github.io/repo-name/），请取消注释下面这行
  // basePath: '/repo-name',
};

module.exports = nextConfig;