<template>
  <section class="download-section" :id="id">
    <div class="download-hero">
      <div class="download-hero__bg">
        <div class="download-hero__orb"></div>
      </div>
      
      <div class="download-hero__content">
        <h1 class="download-hero__title reveal-up">下载 Kkbar</h1>
        
        <p class="download-hero__desc reveal-up">
          AE 工具栏扩展，九种动作类型，告别窗口切换
        </p>
        
        <div class="download-hero__actions reveal-up">
          <a href="https://1821783597.share.123pan.cn/123pan/FQvajv-Ch02H?pwd=tycn#" 
             target="_blank" rel="noopener noreferrer" class="download-btn">
            <i class="bi bi-cloud-arrow-down"></i>
            <div class="download-btn__text">
              <span class="download-btn__label">网盘下载</span>
              <span class="download-btn__size">v1.0.0 · Windows / macOS</span>
            </div>
          </a>
          <a href="https://github.com/yancongya/kkbar_doc/tree/master/docs/public/release" 
             target="_blank" rel="noopener noreferrer" class="download-btn download-btn--github">
            <i class="bi bi-github"></i>
            <div class="download-btn__text">
              <span class="download-btn__label">GitHub 下载</span>
              <span class="download-btn__size">Releases</span>
            </div>
          </a>
        </div>
        
        <div class="download-hero__meta reveal-up">
          <span><i class="bi bi-puzzle"></i> CEP 扩展</span>
          <span class="dot">·</span>
          <span><i class="bi bi-lightning"></i> 即装即用</span>
          <span class="dot">·</span>
          <span>AE 2020+ · Win10+ / macOS 11+</span>
        </div>
      </div>
    </div>

    <div class="download-body">
      <!-- Changelog -->
      <div class="download-card reveal-up">
        <div class="download-card__header">
          <i class="bi bi-journal-text"></i>
          <span>更新日志</span>
        </div>
        <div class="download-card__body download-card__body--scroll">
          <div class="changelog-item" v-for="log in changelog" :key="log.version">
            <div class="changelog-item__head">
              <span class="changelog-tag">{{ log.version }}</span>
              <span class="changelog-date">{{ log.date }}</span>
            </div>
            <ul>
              <li v-for="item in log.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Requirements & Steps -->
      <div class="download-card reveal-up">
        <div class="download-card__header">
          <i class="bi bi-pc-display"></i>
          <span>系统要求</span>
        </div>
        <div class="download-card__body">
          <ul class="req-list">
            <li><i class="bi bi-check2-circle"></i> Windows 10+ 64位 / macOS 11+</li>
            <li><i class="bi bi-check2-circle"></i> After Effects 2020+</li>
            <li><i class="bi bi-check2-circle"></i> 已安装 CEP 扩展支持</li>
          </ul>
          
          <div class="download-card__header" style="margin: 16px -16px 12px; padding: 12px 16px; border-top: 1px solid #222;">
            <i class="bi bi-list-check"></i>
            <span>安装步骤</span>
          </div>
          <ol class="steps-list">
            <li>下载 .zxp 文件</li>
            <li>使用 ZXP Installer 安装</li>
            <li>AE 中 窗口 → 扩展 → Kkbar</li>
          </ol>
          <a href="/guides/02-installation" class="doc-link">
            <i class="bi bi-book"></i> 查看详细安装教程
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ id: { type: String, default: 'download' } })

const changelog = [
  { version: 'v1.0.0', date: '2025-05-17', items: ['首次发布', '支持9种动作类型', '支持多主题切换', '支持配置导入导出'] },
  { version: 'v0.9.5', date: '2025-04-28', items: ['优化按钮拖拽体验', '修复预设应用问题', '新增Shell命令动作'] },
  { version: 'v0.9.0', date: '2025-04-10', items: ['新增剪贴板动作类型', '优化图标库加载性能', '修复部分AE版本兼容问题'] },
  { version: 'v0.8.0', date: '2025-03-15', items: ['全新UI设计，支持4套主题', '支持多分类管理', '新增Gist云备份功能'] },
]
</script>

<style scoped>
.download-section {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 60px;
  scroll-margin-top: 100px;
}

/* ── Hero ──────────────────────────── */
.download-hero {
  position: relative;
  text-align: center;
  padding: 50px 0 40px;
  overflow: hidden;
}

.download-hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.download-hero__orb {
  position: absolute;
  width: 200px;
  height: 200px;
  background: #333;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
}

.download-hero__content {
  position: relative;
  z-index: 1;
}

.download-hero__title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 8px;
  color: #fff;
}

.download-hero__desc {
  font-size: 1rem;
  color: #888;
  margin: 0 0 24px;
}

.download-hero__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: #fff;
  color: #111;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.25s ease;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  color: #111;
}

.download-btn i {
  font-size: 1.4rem;
}

.download-btn__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.download-btn__label {
  font-size: 14px;
}

.download-btn__size {
  font-size: 11px;
  font-weight: 400;
  color: #666;
}

.download-btn--github {
  background: #24292e;
  color: #fff;
}

.download-btn--github:hover {
  background: #1b1f23;
  color: #fff;
}

.download-btn--github .download-btn__size {
  color: rgba(255, 255, 255, 0.6);
}

.download-hero__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: #777;
  flex-wrap: wrap;
}

.download-hero__meta i {
  margin-right: 2px;
}

.dot { color: #555; }

/* ── Body Grid ──────────────────────────── */
.download-body {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  align-items: start;
}

.download-card {
  background: #161618;
  border: 1px solid #222;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.download-card:hover {
  border-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.download-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #222;
  font-size: 13px;
  font-weight: 600;
  color: #ddd;
}

.download-card__header:last-of-type {
  border-top: 1px solid #222;
}

.download-card__header i {
  color: #888;
  font-size: 14px;
}

.download-card__body {
  padding: 14px 16px;
  flex: 1;
}

.download-card__body--scroll {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #333 transparent;
}

.download-card__body--scroll::-webkit-scrollbar {
  width: 4px;
}

.download-card__body--scroll::-webkit-scrollbar-track {
  background: transparent;
}

.download-card__body--scroll::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 2px;
}

/* ── Changelog ──────────────────────────── */
.changelog-item {
  margin-bottom: 14px;
}

.changelog-item:last-child {
  margin-bottom: 0;
}

.changelog-item__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.changelog-tag {
  padding: 1px 6px;
  background: rgba(255,255,255,0.08);
  color: #aaa;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
}

.changelog-date {
  font-size: 11px;
  color: #666;
}

.changelog-item ul {
  margin: 0;
  padding-left: 16px;
}

.changelog-item li {
  font-size: 12px;
  color: #999;
  margin-bottom: 3px;
  line-height: 1.5;
}

/* ── Requirements ──────────────────────────── */
.req-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.req-list li {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

.req-list li:last-child {
  margin-bottom: 0;
}

.req-list i {
  color: #4ade80;
  font-size: 13px;
}

/* ── Steps ──────────────────────────── */
.steps-list {
  margin: 0;
  padding-left: 20px;
}

.steps-list li {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  line-height: 1.5;
}

.steps-list li:last-child {
  margin-bottom: 0;
}

/* ── Responsive ──────────────────────────── */
@media (max-width: 768px) {
  .download-hero {
    padding: 36px 0 28px;
  }
  
  .download-hero__title {
    font-size: 1.6rem;
  }
  
  .download-body {
    grid-template-columns: 1fr;
  }
  
  .download-hero__meta {
    flex-direction: column;
    gap: 4px;
  }
  
  .dot { display: none; }
}
</style>
