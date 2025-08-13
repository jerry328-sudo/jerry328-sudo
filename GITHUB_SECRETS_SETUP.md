# GitHub Actions 所需的 Secrets 和 Token 配置

## 📋 必需的 GitHub Secrets

以下是您需要在 GitHub 仓库设置中配置的所有 secrets：

### 1. 🔑 **GITHUB_TOKEN** 
- **用途**: GitHub API 访问令牌
- **使用场景**: 
  - `snake.yml`: 生成贪吃蛇贡献图
  - `contrib.yml`: 生成3D贡献图
- **获取方式**: GitHub 自动提供，无需手动设置
- **权限**: `contents: write`

### 2. 🔑 **METRICS_TOKEN**
- **用途**: GitHub Metrics 插件专用令牌
- **使用场景**: `metrics.yml` 中的所有统计图表生成
- **获取方式**: 
  1. 访问 GitHub Settings → Developer settings → Personal access tokens
  2. 创建新的 Classic Token
  3. 选择以下权限：
     - `repo` (完整仓库访问权限)
     - `user` (用户信息读取权限)
     - `read:org` (组织信息读取权限)
- **配置位置**: Repository Settings → Secrets and variables → Actions

### 3. 🔑 **WAKATIME_API_KEY**
- **用途**: WakaTime API 访问密钥
- **使用场景**: 
  - `waka.yml`: 更新 README 中的 WakaTime 统计
  - `metrics.yml`: 生成 WakaTime 图表
- **获取方式**:
  1. 访问 [WakaTime 设置页面](https://wakatime.com/settings/api-key)
  2. 复制 Secret API Key
- **配置位置**: Repository Settings → Secrets and variables → Actions

### 4. 🔑 **GH_TOKEN**
- **用途**: GitHub API 访问令牌（用于 WakaTime 插件）
- **使用场景**: `waka.yml` 中更新 README 内容
- **获取方式**: 与 METRICS_TOKEN 相同的方式获取
- **权限**: `repo`, `user`
- **配置位置**: Repository Settings → Secrets and variables → Actions

## 📂 各工作流文件的 Token 使用情况

### `blog.yml`
- ❌ **无需额外配置** - 使用默认的 GitHub Actions 权限

### `contrib.yml` 
- ✅ **GITHUB_TOKEN** - GitHub 自动提供

### `metrics.yml`
- ✅ **METRICS_TOKEN** - 需要手动配置
- ✅ **WAKATIME_API_KEY** - 需要手动配置

### `snake.yml`
- ✅ **GITHUB_TOKEN** - GitHub 自动提供

### `waka.yml`
- ✅ **WAKATIME_API_KEY** - 需要手动配置
- ✅ **GH_TOKEN** - 需要手动配置

## 🔧 配置步骤

1. **访问仓库设置**
   ```
   GitHub 仓库页面 → Settings → Secrets and variables → Actions
   ```

2. **添加 Secrets**
   - 点击 "New repository secret"
   - 输入 Secret 名称和值
   - 点击 "Add secret"

3. **需要添加的 Secrets**：
   - `METRICS_TOKEN`: Personal Access Token (Classic)
   - `WAKATIME_API_KEY`: WakaTime Secret API Key  
   - `GH_TOKEN`: Personal Access Token (Classic)

## ⚠️ 重要提醒

- **GITHUB_TOKEN** 由 GitHub Actions 自动提供，无需手动配置
- **METRICS_TOKEN** 和 **GH_TOKEN** 可以使用同一个 Personal Access Token
- 确保 Personal Access Token 具有足够的权限
- 定期更新 Token 以确保安全性
- 不要在代码中直接写入任何 Token 或 API Key

## 🔍 验证配置

配置完成后，您可以：
1. 手动触发 GitHub Actions 工作流
2. 检查 Actions 页面的运行日志
3. 确认各种统计图表是否正常生成和更新
