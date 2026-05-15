<template>
  <section class="download-section" :id="id">
    <div class="download-hero">
      <div class="download-hero__bg">
        <div class="download-hero__orb"></div>
      </div>
      
      <div class="download-hero__content">
        <h1 class="download-hero__title reveal-up">下载 Kkbar</h1>
        
        <p class="download-hero__desc reveal-up">
          为 After Effects 打造的全能工具栏扩展
        </p>
        
        <div class="download-hero__actions reveal-up">
          <a href="https://www.123pan.com/s/AaaeVj/GtbbI3.html" 
             target="_blank" rel="noopener noreferrer" class="download-btn">
            <i class="bi bi-cloud-arrow-down"></i>
            <div class="download-btn__text">
              <span class="download-btn__label">网盘下载</span>
              <span class="download-btn__size">v2.1.0 · Windows / macOS</span>
            </div>
          </a>
        </div>
        
        <div class="download-hero__meta reveal-up">
          <span><i class="bi bi-shield-check"></i> 安全无毒</span>
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
        <div class="download-card__body">
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
        </div>
        
        <div class="download-card__header">
          <i class="bi bi-list-check"></i>
          <span>安装步骤</span>
        </div>
        <div class="download-card__body">
          <ol class="steps-list">
            <li>下载 .zxp 文件</li>
            <li>使用 ZXP Installer 安装</li>
            <li>AE 中 窗口 → 扩展 → Kkbar</li>
          </ol>
        </div>
      </div>

      <!-- FAQ -->
      <div class="download-card reveal-up">
        <div class="download-card__header">
          <i class="bi bi-question-circle"></i>
          <span>常见问题</span>
        </div>
        <div class="download-card__body">
          <div class="faq-item" v-for="(faq, i) in faqs" :key="i" 
               :class="{ 'faq-item--open': openFaq === i }" @click="toggleFaq(i)">
            <div class="faq-item__q">
              <span>{{ faq.q }}</span>
              <i class="bi bi-chevron-down"></i>
            </div>
            <div class="faq-item__a" v-show="openFaq === i">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ id: { type: String, default: 'download' } })

const openFaq = ref(null)
const toggleFaq = (i) => { openFaq.value = openFaq.value === i ? null : i }

const changelog = [
  { version: 'v2.1.0', date: '2025-05-15', items: ['新增剪贴板动作类型', '优化图标库加载性能'] },
  { version: 'v2.0.5', date: '2025-04-20', items: ['优化按钮拖拽体验', '修复预设应用问题'] },
  { version: 'v2.0.0', date: '2025-03-01', items: ['全新 UI 设计', '支持多分类管理'] },
]

const faqs = [
  { q: '安装后看不到扩展？', a: '请开启 PlayerDebugMode。Win: 注册表 CSXS.11 添加 PlayerDebugMode=1。Mac: 终端执行 defaults write com.adobe.CSXS.11 PlayerDebugMode 1' },
  { q: '支持哪些 AE 版本？', a: '支持 After Effects 2020 及以上版本，推荐 AE 2022+。' },
  { q: '如何升级付费版？', a: '在关于页面选择支持方式，付费后获取解锁文本输入即可。' },
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
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.download-card {
  background: #161618;
  border: 1px solid #222;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
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

/* ── FAQ ──────────────────────────── */
.faq-item {
  border-bottom: 1px solid #222;
  cursor: pointer;
  transition: background 0.2s;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-item:hover {
  background: rgba(255,255,255,0.02);
}

.faq-item__q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 12px;
  color: #ddd;
}

.faq-item__q i {
  font-size: 11px;
  color: #666;
  transition: transform 0.3s;
  flex-shrink: 0;
}

.faq-item--open .faq-item__q i {
  transform: rotate(180deg);
  color: #aaa;
}

.faq-item__a {
  padding-bottom: 10px;
}

.faq-item__a p {
  font-size: 11px;
  color: #888;
  margin: 0;
  line-height: 1.6;
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
