const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 要下载的图片列表
const images = [
  {
    name: 'streak-stats-dark.svg',
    url: 'https://github-readme-streak-stats.herokuapp.com/?user=jerry328-sudo&theme=dark&hide_border=true'
  },
  {
    name: 'streak-stats-light.svg',
    url: 'https://github-readme-streak-stats.herokuapp.com/?user=jerry328-sudo&theme=light&hide_border=true'
  },
  {
    name: 'activity-graph-dark.svg',
    url: 'https://github-readme-activity-graph.vercel.app/graph?username=jerry328-sudo&theme=xcode&bg_color=FF000000&hide_border=true'
  },
  {
    name: 'activity-graph-light.svg',
    url: 'https://github-readme-activity-graph.vercel.app/graph?username=jerry328-sudo&theme=xcode&bg_color=FF000000&color=000000&hide_border=true'
  },
  {
    name: 'repobeats.svg',
    url: 'https://repobeats.axiom.co/api/embed/6db568f30b9c177496cc7091f5845b32352d02fc.svg'
  }
];

// 输出目录
const outputDir = path.join(__dirname, '..', 'readme-assets');

// 确保目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 下载单个图片的函数
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filePath);
    
    const protocol = url.startsWith('https') ? https : http;
    
    console.log(`⏳ 正在下载: ${filename}`);
    console.log(`   URL: ${url}`);
    
    const request = protocol.get(url, { timeout: 30000 }, (response) => {
      // 处理重定向
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        console.log(`   ↪️ 重定向到: ${response.headers.location}`);
        file.close();
        fs.unlinkSync(filePath);
        downloadImage(response.headers.location, filename).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filePath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(filePath);
        console.log(`   ✅ 成功! 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);
        resolve({ filename, success: true, size: stats.size });
      });
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(err);
    });
    
    request.on('timeout', () => {
      request.destroy();
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(new Error('请求超时'));
    });
  });
}

// 主函数
async function main() {
  console.log('🚀 开始下载 README 图片...\n');
  console.log(`📁 输出目录: ${outputDir}\n`);
  
  const results = [];
  
  for (const img of images) {
    try {
      const result = await downloadImage(img.url, img.name);
      results.push(result);
    } catch (err) {
      console.log(`   ❌ 失败: ${err.message}`);
      results.push({ filename: img.name, success: false, error: err.message });
    }
    console.log('');
  }
  
  // 打印汇总
  console.log('='.repeat(50));
  console.log('📊 下载结果汇总:\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ 成功: ${successful.length} 个`);
  successful.forEach(r => console.log(`   - ${r.filename} (${(r.size / 1024).toFixed(2)} KB)`));
  
  if (failed.length > 0) {
    console.log(`\n❌ 失败: ${failed.length} 个`);
    failed.forEach(r => console.log(`   - ${r.filename}: ${r.error}`));
  }
  
  console.log('\n' + '='.repeat(50));
}

main().catch(console.error);
