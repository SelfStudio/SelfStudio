'use client';

import { useEffect } from 'react';

type AppStoreVersionProps = {
  appId: string;
};

export default function AppStoreVersion({ appId }: AppStoreVersionProps) {
  useEffect(() => {
    // 获取App Store版本信息 - 使用JSONP方式避免CORS问题
    function fetchAppStoreVersion() {
      // 创建script标签
      const script = document.createElement('script');
      const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      
      // 设置全局回调函数
      (window as any)[callbackName] = function(data: any) {
        try {
          if (data.results && data.results.length > 0) {
            const appInfo = data.results[0];
            const versionInfoElement = document.querySelector('.version-info');
            
            if (versionInfoElement) {
              // 格式化日期
              const releaseDate = new Date(appInfo.currentVersionReleaseDate || appInfo.releaseDate);
              const formattedDate = releaseDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              
              versionInfoElement.innerHTML = `Current Version: ${appInfo.version} | Release Date: ${formattedDate}`;
            }
          }
        } catch (error) {
          console.error('Failed to process App Store version info:', error);
        } finally {
          // 清理
          document.head.removeChild(script);
          delete (window as any)[callbackName];
        }
      };

      // 从App Store链接中提取应用ID
      const idMatch = appId.match(/id(\d+)/);
      const numericId = idMatch ? idMatch[1] : appId;

      // 设置请求URL
      script.src = `https://itunes.apple.com/lookup?id=${numericId}&callback=${callbackName}`;
      script.onerror = () => {
        console.error('Failed to load App Store version info');
        document.head.removeChild(script);
        delete (window as any)[callbackName];
      };
      
      document.head.appendChild(script);

      // 清理函数
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        delete (window as any)[callbackName];
      };
    }

    fetchAppStoreVersion();
  }, [appId]);

  return null; // 这个组件不渲染任何UI，只负责获取数据
}