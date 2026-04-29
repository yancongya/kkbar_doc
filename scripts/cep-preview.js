/**
 * CepPreview - 模拟 CEP 面板预览组件
 */
class CepPreview {
  constructor(selector) {
    this.root = document.querySelector(selector);
    if (!this.root) return;

    this.panels = [
      { id: 'main', name: 'Kkbar 主面板', icon: 'bi-grid-3x3-gap' },
      { id: 'toolbar2', name: 'Kkbar 2', icon: 'bi-layout-sidebar' },
      { id: 'toolbar3', name: 'Kkbar 3', icon: 'bi-layout-sidebar-reverse' },
    ];

    // 侧边栏折叠状态：'expanded' | 'icon-only' | 'collapsed'
    this._sidebarState = 'expanded';
    this._isDragging = false;

    // 分类数据：每个按钮固定，icons 存各热键形态
    // 8 种形态：click | ctrl | shift | alt | ctrl+shift | ctrl+alt | shift+alt | ctrl+shift+alt
    this._categories = [
      {
        name: '常用', color: '#f97316',
        icon: 'bi-info-circle',
        buttons: [
          { label: '关于', icons: {
            click:              { icon: 'bi-info-circle',        color: '#4a9eff' },
            ctrl:               { icon: 'bi-arrow-return-left',  color: '#4a9eff' },
            shift:              { icon: 'bi-arrow-up-circle',    color: '#22c55e' },
            alt:                { icon: 'bi-bullseye',           color: '#f97316' },
            'ctrl+shift':       { icon: 'bi-arrow-up-square',    color: '#a78bfa' },
            'ctrl+alt':         { icon: 'bi-arrow-left-circle',  color: '#eab308' },
            'shift+alt':        { icon: 'bi-arrow-right-circle', color: '#ef4444' },
            'ctrl+shift+alt':   { icon: 'bi-stars',              color: '#f97316' },
          }},
          { label: '过滤器', icons: {
            click:              { icon: 'bi-funnel',             color: '#f97316' },
            ctrl:               { icon: 'bi-funnel-fill',        color: '#22c55e' },
            shift:              { icon: 'bi-arrow-down-circle',  color: '#ef4444' },
            alt:                { icon: 'bi-rulers',             color: '#94a3b8' },
            'ctrl+shift':       { icon: 'bi-filter-circle',      color: '#4a9eff' },
            'ctrl+alt':         { icon: 'bi-filter-square',      color: '#a78bfa' },
            'shift+alt':        { icon: 'bi-sliders',            color: '#eab308' },
            'ctrl+shift+alt':   { icon: 'bi-sliders2',           color: '#f97316' },
          }},
          { label: '播放', icons: {
            click:              { icon: 'bi-play-fill',          color: '#22c55e' },
            ctrl:               { icon: 'bi-clipboard',          color: '#f97316' },
            shift:              { icon: 'bi-skip-backward-fill', color: '#4a9eff' },
            alt:                { icon: 'bi-link-45deg',         color: '#4a9eff' },
            'ctrl+shift':       { icon: 'bi-play-circle-fill',   color: '#22c55e' },
            'ctrl+alt':         { icon: 'bi-pause-fill',         color: '#eab308' },
            'shift+alt':        { icon: 'bi-stop-fill',          color: '#ef4444' },
            'ctrl+shift+alt':   { icon: 'bi-record-fill',        color: '#ef4444' },
          }},
          { label: '剪切', icons: {
            click:              { icon: 'bi-scissors',           color: '#ef4444' },
            ctrl:               { icon: 'bi-trash',              color: '#ef4444' },
            shift:              { icon: 'bi-skip-forward-fill',  color: '#4a9eff' },
            alt:                { icon: 'bi-puzzle',             color: '#a78bfa' },
            'ctrl+shift':       { icon: 'bi-scissors2',          color: '#f97316' },
            'ctrl+alt':         { icon: 'bi-trash3-fill',        color: '#ef4444' },
            'shift+alt':        { icon: 'bi-x-circle-fill',      color: '#94a3b8' },
            'ctrl+shift+alt':   { icon: 'bi-eraser-fill',        color: '#a78bfa' },
          }},
          { label: '收藏', icons: {
            click:              { icon: 'bi-star-fill',          color: '#eab308' },
            ctrl:               { icon: 'bi-search',             color: '#eab308' },
            shift:              { icon: 'bi-shuffle',            color: '#a78bfa' },
            alt:                { icon: 'bi-lightbulb',          color: '#eab308' },
            'ctrl+shift':       { icon: 'bi-bookmark-fill',      color: '#4a9eff' },
            'ctrl+alt':         { icon: 'bi-heart-fill',         color: '#ef4444' },
            'shift+alt':        { icon: 'bi-pin-fill',           color: '#f97316' },
            'ctrl+shift+alt':   { icon: 'bi-trophy-fill',        color: '#eab308' },
          }},
          { label: '设置', icons: {
            click:              { icon: 'bi-gear',               color: '#94a3b8' },
            ctrl:               { icon: 'bi-lightbulb-fill',     color: '#a78bfa' },
            shift:              { icon: 'bi-pin-angle',          color: '#f97316' },
            alt:                { icon: 'bi-key',                color: '#94a3b8' },
            'ctrl+shift':       { icon: 'bi-gear-fill',          color: '#4a9eff' },
            'ctrl+alt':         { icon: 'bi-toggles',            color: '#22c55e' },
            'shift+alt':        { icon: 'bi-wrench-adjustable',  color: '#eab308' },
            'ctrl+shift+alt':   { icon: 'bi-cpu-fill',           color: '#a78bfa' },
          }},
        ],
      },
      {
        name: '脚本', color: '#4a9eff',
        icon: 'bi-file-earmark-code',
        buttons: [
          { label: '运行', icons: {
            click:              { icon: 'bi-file-earmark-code',  color: '#4a9eff' },
            ctrl:               { icon: 'bi-play-circle',        color: '#4a9eff' },
            shift:              { icon: 'bi-bug',                color: '#f97316' },
            alt:                { icon: 'bi-lightning',          color: '#eab308' },
            'ctrl+shift':       { icon: 'bi-play-circle-fill',   color: '#22c55e' },
            'ctrl+alt':         { icon: 'bi-lightning-fill',     color: '#eab308' },
            'shift+alt':        { icon: 'bi-bug-fill',           color: '#ef4444' },
            'ctrl+shift+alt':   { icon: 'bi-rocket-fill',        color: '#a78bfa' },
          }},
          { label: '循环', icons: {
            click:              { icon: 'bi-arrow-repeat',       color: '#22c55e' },
            ctrl:               { icon: 'bi-stop-fill',          color: '#ef4444' },
            shift:              { icon: 'bi-pencil-square',      color: '#4a9eff' },
            alt:                { icon: 'bi-wrench',             color: '#94a3b8' },
            'ctrl+shift':       { icon: 'bi-arrow-clockwise',    color: '#22c55e' },
            'ctrl+alt':         { icon: 'bi-arrow-counterclockwise', color: '#f97316' },
            'shift+alt':        { icon: 'bi-infinity',           color: '#a78bfa' },
            'ctrl+shift+alt':   { icon: 'bi-recycle',            color: '#22c55e' },
          }},
          { label: '导入', icons: {
            click:              { icon: 'bi-folder2-open',       color: '#eab308' },
            ctrl:               { icon: 'bi-upload',             color: '#22c55e' },
            shift:              { icon: 'bi-download',           color: '#eab308' },
            alt:                { icon: 'bi-archive',            color: '#eab308' },
            'ctrl+shift':       { icon: 'bi-folder-plus',        color: '#4a9eff' },
            'ctrl+alt':         { icon: 'bi-cloud-upload',       color: '#22c55e' },
            'shift+alt':        { icon: 'bi-cloud-download',     color: '#4a9eff' },
            'ctrl+shift+alt':   { icon: 'bi-database-fill-up',   color: '#a78bfa' },
          }},
          { label: '保存', icons: {
            click:              { icon: 'bi-save',               color: '#94a3b8' },
            ctrl:               { icon: 'bi-lock',               color: '#94a3b8' },
            shift:              { icon: 'bi-clipboard-check',    color: '#f97316' },
            alt:                { icon: 'bi-cloud-upload',       color: '#4a9eff' },
            'ctrl+shift':       { icon: 'bi-save2',              color: '#22c55e' },
            'ctrl+alt':         { icon: 'bi-lock-fill',          color: '#ef4444' },
            'shift+alt':        { icon: 'bi-floppy2-fill',       color: '#eab308' },
            'ctrl+shift+alt':   { icon: 'bi-safe-fill',          color: '#a78bfa' },
          }},
        ],
      },
      {
        name: '效果', color: '#22c55e',
        icon: 'bi-stars',
        buttons: [
          { label: '发光', icons: {
            click:              { icon: 'bi-stars',              color: '#eab308' },
            ctrl:               { icon: 'bi-brightness-high',    color: '#eab308' },
            shift:              { icon: 'bi-star',               color: '#4a9eff' },
            alt:                { icon: 'bi-mask',               color: '#a78bfa' },
            'ctrl+shift':       { icon: 'bi-brightness-high-fill', color: '#f97316' },
            'ctrl+alt':         { icon: 'bi-sun',                color: '#eab308' },
            'shift+alt':        { icon: 'bi-moon-stars',         color: '#4a9eff' },
            'ctrl+shift+alt':   { icon: 'bi-magic',              color: '#a78bfa' },
          }},
          { label: '模糊', icons: {
            click:              { icon: 'bi-circle',             color: '#4a9eff' },
            ctrl:               { icon: 'bi-rainbow',            color: '#f97316' },
            shift:              { icon: 'bi-water',              color: '#22c55e' },
            alt:                { icon: 'bi-eye',                color: '#f97316' },
            'ctrl+shift':       { icon: 'bi-circle-half',        color: '#94a3b8' },
            'ctrl+alt':         { icon: 'bi-eye-slash',          color: '#94a3b8' },
            'shift+alt':        { icon: 'bi-droplet-half',       color: '#4a9eff' },
            'ctrl+shift+alt':   { icon: 'bi-cloud-fog2',         color: '#a78bfa' },
          }},
          { label: '色彩', icons: {
            click:              { icon: 'bi-palette',            color: '#f97316' },
            ctrl:               { icon: 'bi-square',             color: '#94a3b8' },
            shift:              { icon: 'bi-brush',              color: '#f97316' },
            alt:                { icon: 'bi-film',               color: '#4a9eff' },
            'ctrl+shift':       { icon: 'bi-palette2',           color: '#a78bfa' },
            'ctrl+alt':         { icon: 'bi-paint-bucket',       color: '#eab308' },
            'shift+alt':        { icon: 'bi-brush-fill',         color: '#22c55e' },
            'ctrl+shift+alt':   { icon: 'bi-eyedropper',         color: '#ef4444' },
          }},
          { label: '遮罩', icons: {
            click:              { icon: 'bi-square-fill',        color: '#94a3b8' },
            ctrl:               { icon: 'bi-app',                color: '#94a3b8' },
            shift:              { icon: 'bi-diamond',            color: '#4a9eff' },
            alt:                { icon: 'bi-hexagon',            color: '#eab308' },
            'ctrl+shift':       { icon: 'bi-square-half',        color: '#a78bfa' },
            'ctrl+alt':         { icon: 'bi-pentagon',           color: '#22c55e' },
            'shift+alt':        { icon: 'bi-octagon',            color: '#f97316' },
            'ctrl+shift+alt':   { icon: 'bi-intersect',          color: '#ef4444' },
          }},
          { label: '变形', icons: {
            click:              { icon: 'bi-triangle',           color: '#22c55e' },
            ctrl:               { icon: 'bi-rulers',             color: '#94a3b8' },
            shift:              { icon: 'bi-arrow-clockwise',    color: '#22c55e' },
            alt:                { icon: 'bi-arrows-expand',      color: '#4a9eff' },
            'ctrl+shift':       { icon: 'bi-arrows-angle-expand', color: '#f97316' },
            'ctrl+alt':         { icon: 'bi-arrows-fullscreen',  color: '#a78bfa' },
            'shift+alt':        { icon: 'bi-bounding-box',       color: '#eab308' },
            'ctrl+shift+alt':   { icon: 'bi-bounding-box-circles', color: '#22c55e' },
          }},
        ],
      },
      {
        name: '预设', color: '#a78bfa',
        icon: 'bi-camera-video',
        buttons: [
          { label: '片头', icons: {
            click:              { icon: 'bi-camera-video',       color: '#a78bfa' },
            ctrl:               { icon: 'bi-box-seam',           color: '#a78bfa' },
            shift:              { icon: 'bi-film',               color: '#4a9eff' },
            alt:                { icon: 'bi-folder',             color: '#eab308' },
            'ctrl+shift':       { icon: 'bi-camera-video-fill',  color: '#ef4444' },
            'ctrl+alt':         { icon: 'bi-collection-play',    color: '#22c55e' },
            'shift+alt':        { icon: 'bi-camera-reels',       color: '#f97316' },
            'ctrl+shift+alt':   { icon: 'bi-camera-reels-fill',  color: '#a78bfa' },
          }},
          { label: '文字', icons: {
            click:              { icon: 'bi-fonts',              color: '#4a9eff' },
            ctrl:               { icon: 'bi-arrow-repeat',       color: '#94a3b8' },
            shift:              { icon: 'bi-pencil',             color: '#4a9eff' },
            alt:                { icon: 'bi-plus-circle',        color: '#22c55e' },
            'ctrl+shift':       { icon: 'bi-type-bold',          color: '#eab308' },
            'ctrl+alt':         { icon: 'bi-type-italic',        color: '#f97316' },
            'shift+alt':        { icon: 'bi-type-underline',     color: '#a78bfa' },
            'ctrl+shift+alt':   { icon: 'bi-type-h1',            color: '#4a9eff' },
          }},
          { label: '过渡', icons: {
            click:              { icon: 'bi-water',              color: '#22c55e' },
            ctrl:               { icon: 'bi-fast-forward',       color: '#22c55e' },
            shift:              { icon: 'bi-shuffle',            color: '#a78bfa' },
            alt:                { icon: 'bi-music-note',         color: '#f97316' },
            'ctrl+shift':       { icon: 'bi-fast-forward-fill',  color: '#4a9eff' },
            'ctrl+alt':         { icon: 'bi-rewind-fill',        color: '#eab308' },
            'shift+alt':        { icon: 'bi-music-note-beamed',  color: '#a78bfa' },
            'ctrl+shift+alt':   { icon: 'bi-soundwave',          color: '#22c55e' },
          }},
        ],
      },
    ];

    this.activePanel = 'main';
    this._activeCatIdx = 0;
    this._activeHotkeys = new Set();
    this._mode = 'panel'; // panel | hotkey | longpress | uisettings
    this._longpressType = 'popup'; // popup | ring

    // UI 设置状态
    this._uiSettings = {
      iconSize: 52,
      iconSpacing: 6,
      opacity: 1,
      showToolbar: true,
      viewMode: 'grid', // grid | list
    };

    // 引导系统：记录哪些模式已激活过（不再显示引导）
    this._guideDismissed = new Set();

    // 各模式引导配置
    this._guideConfig = {
      panel: {
        icon: 'bi-grid-3x3-gap',
        iconColor: '#a78bfa',
        title: '扩展面板模式',
        desc: '将 Kkbar 作为独立面板嵌入 Adobe 软件侧边栏，点击按钮即可执行对应功能。',
        hint: '点击任意位置开始体验',
        tags: ['点击执行', '分类管理', '自定义布局'],
        preview: `<div class="cep-guide__preview-btns">
          <span class="cep-guide__preview-btn" style="background:#2d2d2d;border-color:#a78bfa"><i class="bi bi-play-fill" style="color:#22c55e"></i></span>
          <span class="cep-guide__preview-btn"><i class="bi bi-scissors" style="color:#ef4444"></i></span>
          <span class="cep-guide__preview-btn"><i class="bi bi-star-fill" style="color:#eab308"></i></span>
          <span class="cep-guide__preview-btn"><i class="bi bi-gear" style="color:#94a3b8"></i></span>
        </div>`,
      },
      hotkey: {
        icon: 'bi-keyboard',
        iconColor: '#4a9eff',
        title: '热键触发模式',
        desc: '按住 Ctrl / Shift / Alt 键，每个按钮会切换为对应的功能，一个按钮最多承载 4 种操作。',
        hint: '点击任意位置开始体验',
        tags: ['Ctrl', 'Shift', 'Alt', '组合键'],
        preview: `<div class="cep-guide__hotkey-demo">
          <div class="cep-guide__hotkey-row">
            <span class="cep-guide__hk-key">默认</span>
            <span class="cep-guide__hk-arrow">→</span>
            <span class="cep-guide__preview-btn"><i class="bi bi-play-fill" style="color:#22c55e"></i></span>
          </div>
          <div class="cep-guide__hotkey-row">
            <span class="cep-guide__hk-key cep-guide__hk-key--active">Ctrl</span>
            <span class="cep-guide__hk-arrow">→</span>
            <span class="cep-guide__preview-btn"><i class="bi bi-clipboard" style="color:#f97316"></i></span>
          </div>
          <div class="cep-guide__hotkey-row">
            <span class="cep-guide__hk-key cep-guide__hk-key--shift">Shift</span>
            <span class="cep-guide__hk-arrow">→</span>
            <span class="cep-guide__preview-btn"><i class="bi bi-skip-backward-fill" style="color:#4a9eff"></i></span>
          </div>
        </div>`,
      },
      longpress: {
        icon: 'bi-hand-index-thumb',
        iconColor: '#f97316',
        title: '长按菜单模式',
        desc: '长按任意按钮，弹出扩展菜单。支持面板弹出和圆环两种交互形式。',
        hint: '点击任意位置开始体验',
        tags: ['长按触发', '面板模式', '圆环模式'],
        preview: `<div class="cep-guide__longpress-demo">
          <div class="cep-guide__lp-modes">
            <div class="cep-guide__lp-mode cep-guide__lp-mode--active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
              <span>面板弹出</span>
            </div>
            <div class="cep-guide__lp-mode">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>
              <span>圆环选择</span>
            </div>
          </div>
        </div>`,
      },
      uisettings: {
        icon: 'bi-sliders',
        iconColor: '#22c55e',
        title: 'UI 自定义设置',
        desc: '自由调整图标大小、间距、视图模式，打造专属工作流布局。',
        hint: '点击任意位置开始体验',
        tags: ['图标大小', '间距调节', '网格/列表'],
        preview: `<div class="cep-guide__ui-demo">
          <div class="cep-guide__ui-row">
            <span class="cep-guide__ui-label">大小</span>
            <div class="cep-guide__ui-track"><div class="cep-guide__ui-fill" style="width:60%"></div></div>
            <span class="cep-guide__ui-val">52</span>
          </div>
          <div class="cep-guide__ui-row">
            <span class="cep-guide__ui-label">间距</span>
            <div class="cep-guide__ui-track"><div class="cep-guide__ui-fill" style="width:30%"></div></div>
            <span class="cep-guide__ui-val">6</span>
          </div>
          <div class="cep-guide__ui-row">
            <span class="cep-guide__ui-label">视图</span>
            <div class="cep-guide__ui-btns">
              <span class="cep-guide__ui-btn cep-guide__ui-btn--active"><i class="bi bi-grid-3x3-gap"></i></span>
              <span class="cep-guide__ui-btn"><i class="bi bi-view-list"></i></span>
            </div>
          </div>
        </div>`,
      },
    };

    this._render();
    this._bindEvents();
    this._bindSidebarEvents();
    // 初始显示 panel 模式引导
    this._showGuide('panel');
  }

  // ─── render ────────────────────────────────────────────────

  _render() {
    // HTML中已有完整结构，只需渲染主面板内容
    const panelWrap = this.root.querySelector('#cep-panel-wrap');
    if (panelWrap) {
      panelWrap.innerHTML = this._renderMainPanel();
    }
  }

  _renderMainPanel() {
    const cat = this._categories[this._activeCatIdx];
    const hk = this._getHotkeyKey();

    return `
      <div class="cep-main-panel">
        <div class="cep-main-panel__toolbar">
          <div class="cep-cat-wrap" id="cep-cat-wrap">
            <button class="cep-main-panel__cat-select" id="cep-cat-select" type="button">
              <i class="bi ${cat.icon}" style="color:${cat.color};font-size:14px"></i>
              <span class="cep-main-panel__cat-label" id="cep-cat-label">${cat.name}</span>
              <svg class="cep-main-panel__cat-arrow" id="cep-cat-arrow" width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M8 11L3 6h10z"/></svg>
            </button>
            <ul class="cep-cat-dropdown" id="cep-cat-dropdown">
              ${this._categories.map((c, i) => `
                <li class="cep-cat-dropdown__item ${i === this._activeCatIdx ? 'cep-cat-dropdown__item--active' : ''}" data-cat-idx="${i}">
                  <i class="bi ${c.icon}" style="color:${c.color};font-size:12px"></i>
                  <span>${c.name}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          <div class="cep-main-panel__toolbar-icons">
            <button class="cep-main-panel__icon-btn" title="日志">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </button>
            <button class="cep-main-panel__icon-btn" title="切换布局">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg>
            </button>
            <button class="cep-main-panel__icon-btn" title="关于">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="1"/></svg>
            </button>
            <button class="cep-main-panel__icon-btn" title="设置">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </div>

        <div class="cep-main-panel__grid" id="cep-btn-grid">
          ${this._renderButtons(cat.buttons, hk, cat.icon, cat.color)}
        </div>

        <!-- 热键栏：仅 hotkey 模式显示 -->
        <div class="cep-hotkey-bar ${this._mode === 'hotkey' ? 'cep-hotkey-bar--visible' : ''}" id="cep-hotkey-bar">
          <div class="cep-hotkey-bar__keys">
            ${['ctrl', 'shift', 'alt'].map(k => `
              <button class="cep-hotkey-key ${this._activeHotkeys.has(k) ? 'cep-hotkey-key--active' : ''}"
                      data-hotkey="${k}" type="button">
                ${k.toUpperCase()}
              </button>
            `).join('')}
          </div>
          <div class="cep-hotkey-bar__combo" id="cep-hotkey-combo">
            <span class="cep-hotkey-combo__label">默认</span>
          </div>
        </div>

        <!-- 长按模式栏：仅 longpress 模式显示 -->
        <div class="cep-longpress-bar ${this._mode === 'longpress' ? 'cep-longpress-bar--visible' : ''}" id="cep-longpress-bar">
          <button class="cep-longpress-mode ${this._longpressType === 'popup' ? 'cep-longpress-mode--active' : ''}"
                  data-longpress-type="popup" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            <span>面板模式</span>
          </button>
          <button class="cep-longpress-mode ${this._longpressType === 'ring' ? 'cep-longpress-mode--active' : ''}"
                  data-longpress-type="ring" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>
            <span>圆环模式</span>
          </button>
        </div>

        <!-- UI设置栏：仅 uisettings 模式显示 -->
        <div class="cep-ui-settings-bar ${this._mode === 'uisettings' ? 'cep-ui-settings-bar--visible' : ''}" id="cep-ui-settings-bar">
          <div class="cep-ui-setting">
            <span class="cep-ui-setting__label">大小</span>
            <input type="range" class="cep-ui-setting__slider" data-setting="iconSize" 
                   min="30" max="70" step="2" value="${this._uiSettings.iconSize}">
            <span class="cep-ui-setting__value" id="iconsize-value">${this._uiSettings.iconSize}</span>
          </div>
          <div class="cep-ui-setting">
            <span class="cep-ui-setting__label">间距</span>
            <input type="range" class="cep-ui-setting__slider" data-setting="iconSpacing" 
                   min="0" max="20" step="1" value="${this._uiSettings.iconSpacing}">
            <span class="cep-ui-setting__value" id="iconspacing-value">${this._uiSettings.iconSpacing}</span>
          </div>
          <div class="cep-ui-toolbar-toggle">
            <span class="cep-ui-setting__label">导航栏</span>
            <div class="cep-ui-toolbar-group">
              <button class="cep-ui-toolbar-btn ${this._uiSettings.showToolbar ? 'cep-ui-toolbar-btn--active' : ''}" 
                      data-toolbar-state="true" type="button">
                显示
              </button>
              <button class="cep-ui-toolbar-btn ${!this._uiSettings.showToolbar ? 'cep-ui-toolbar-btn--active' : ''}" 
                      data-toolbar-state="false" type="button">
                隐藏
              </button>
            </div>
          </div>
          <div class="cep-ui-toolbar-toggle">
            <span class="cep-ui-setting__label">视图模式</span>
            <div class="cep-ui-toolbar-group">
              <button class="cep-ui-toolbar-btn ${this._uiSettings.viewMode === 'grid' ? 'cep-ui-toolbar-btn--active' : ''}" 
                      data-view-mode="grid" type="button">
                <i class="bi bi-grid-3x3-gap"></i>
                网格
              </button>
              <button class="cep-ui-toolbar-btn ${this._uiSettings.viewMode === 'list' ? 'cep-ui-toolbar-btn--active' : ''}" 
                      data-view-mode="list" type="button">
                <i class="bi bi-view-list"></i>
                列表
              </button>
            </div>
          </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /** 根据当前激活的热键组合，返回查找 key（优先组合，fallback 到单键，再 fallback 到 click） */
  _getHotkeyKey() {
    if (this._activeHotkeys.size === 0) return 'click';
    // 组合键 key，如 'ctrl+shift'（按字母排序）
    const combo = [...this._activeHotkeys].sort().join('+');
    return combo;
  }

  _renderButtons(buttons, hk, catIcon, catColor) {
    return buttons.map((b, idx) => {
      // 第一个按钮使用分类图标
      if (idx === 0 && catIcon) {
        return `
          <div class="cep-main-panel__btn" data-is-category-btn="true" title="${b.label}">
            <div class="cep-main-panel__btn-icon">
              <i class="bi ${catIcon}" style="color:${catColor};font-size:20px"></i>
            </div>
          </div>
        `;
      }
      // 优先组合键，fallback 到单键，再 fallback 到 click
      const state = b.icons[hk]
        || (this._activeHotkeys.size > 0 ? b.icons[[...this._activeHotkeys].sort()[0]] : null)
        || b.icons.click;
      return `
        <div class="cep-main-panel__btn" title="${b.label}">
          <div class="cep-main-panel__btn-icon">
            <i class="bi ${state.icon}" style="color:${state.color};font-size:20px"></i>
          </div>
        </div>
      `;
    }).join('');
  }

  // ─── events ────────────────────────────────────────────────

  _bindEvents() {
    // 折叠按钮
    const collapseBtn = document.getElementById('cep-collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => this._cycleSidebarState());
    }

    // 拖拽分隔线
    const resizer = document.getElementById('cep-resizer');
    const sidebar = document.getElementById('cep-sidebar');
    if (resizer && sidebar) {
      resizer.addEventListener('mousedown', (e) => {
        this._isDragging = true;
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!this._isDragging) return;
        const newWidth = e.clientX - sidebar.getBoundingClientRect().left;
        
        if (newWidth < 60) {
          // 完全折叠
          this._setSidebarState('collapsed');
        } else if (newWidth < 120) {
          // 仅显示图标 - 固定宽度为50px
          this._setSidebarState('icon-only');
          sidebar.style.width = '50px';
        } else {
          // 展开状态 - 可调整宽度
          this._setSidebarState('expanded');
          sidebar.style.width = Math.min(Math.max(newWidth, 180), 300) + 'px';
        }
      });

      document.addEventListener('mouseup', () => {
        this._isDragging = false;
      });
    }

    this.root.addEventListener('click', (e) => {
      if (e.target.closest('#cep-cat-select')) {
        this._toggleDropdown(); return;
      }
      const catItem = e.target.closest('.cep-cat-dropdown__item');
      if (catItem) {
        this._selectCategory(parseInt(catItem.dataset.catIdx, 10)); return;
      }
      const hkBtn = e.target.closest('.cep-hotkey-key');
      if (hkBtn) {
        this._pressHotkey(hkBtn.dataset.hotkey); return;
      }
      // 长按模式切换按钮
      const lpBtn = e.target.closest('.cep-longpress-mode');
      if (lpBtn) {
        this._setLongpressType(lpBtn.dataset.longpressType); return;
      }
      // UI 设置导航栏按钮
      const tbBtn = e.target.closest('.cep-ui-toolbar-btn');
      if (tbBtn) {
        if (tbBtn.dataset.toolbarState) {
          this._updateUISetting('showToolbar', tbBtn.dataset.toolbarState === 'true');
        } else if (tbBtn.dataset.viewMode) {
          this._updateUISetting('viewMode', tbBtn.dataset.viewMode);
        }
        return;
      }
      this._closeDropdown();
    });

    // UI 设置滑块和开关
    this.root.addEventListener('input', (e) => {
      const slider = e.target;
      if (slider.classList.contains('cep-ui-setting__slider')) {
        this._updateUISetting(slider.dataset.setting, parseFloat(slider.value));
      }
    });

    this.root.addEventListener('change', (e) => {
      const checkbox = e.target;
      if (checkbox.type === 'checkbox' && checkbox.dataset.setting) {
        this._updateUISetting(checkbox.dataset.setting, checkbox.checked);
      }
    });

    // 键盘事件
    this._keyDownHandler = this._onKeyDown.bind(this);
    this._keyUpHandler = this._onKeyUp.bind(this);
    document.addEventListener('keydown', this._keyDownHandler);
    document.addEventListener('keyup', this._keyUpHandler);

    // 长按事件（委托到 grid）
    this.root.addEventListener('mousedown', (e) => {
      const btn = e.target.closest('.cep-main-panel__btn');
      if (!btn) return;
      
      btn.style.background = '#3b3b6e';
      btn.style.borderColor = '#4b4b7e';
      
      // 分类按钮的处理
      if (btn.dataset.isCategoryBtn) {
        if (this._mode === 'longpress') {
          this._startLongpress(btn);
        }
        return;
      }
      
      // 普通按钮的长按处理
      if (this._mode === 'longpress') {
        this._startLongpress(btn);
      }
    });
    
    this.root.addEventListener('mouseup', (e) => {
      const btn = e.target.closest('.cep-main-panel__btn');
      if (btn) {
        btn.style.background = '';
        btn.style.borderColor = '';
      }
    });
    
    // 点击事件（委托到 grid）
    this.root.addEventListener('click', (e) => {
      const btn = e.target.closest('.cep-main-panel__btn');
      if (!btn) return;
      
      // 分类按钮的点击：切换到下一个分类
      if (btn.dataset.isCategoryBtn) {
        const nextIdx = (this._activeCatIdx + 1) % this._categories.length;
        this._selectCategory(nextIdx);
        return;
      }
    });
    
    this.root.addEventListener('mouseup', () => {
      this.root.querySelectorAll('.cep-main-panel__btn').forEach(btn => {
        btn.style.background = '';
        btn.style.borderColor = '';
      });
      this._cancelLongpress();
    });
    this.root.addEventListener('mouseleave', () => {
      this.root.querySelectorAll('.cep-main-panel__btn').forEach(btn => {
        btn.style.background = '';
        btn.style.borderColor = '';
      });
      this._cancelLongpress();
    });
  }

  /** 绑定左侧 sidebar 列表项 */
  _bindSidebarEvents() {
    document.querySelectorAll('[data-cep-mode]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const mode = el.dataset.cepMode;
        // 更新高亮
        document.querySelectorAll('[data-cep-mode]').forEach(a => {
          a.classList.toggle('cep-sidebar-item--active', a === el);
        });
        this._setMode(mode);
      });
    });
  }

  // ─── mode ──────────────────────────────────────────────────

  /** 循环切换侧边栏状态 */
  _cycleSidebarState() {
    // 如果当前是折叠状态，直接恢复到展开状态
    if (this._sidebarState === 'collapsed') {
      this._setSidebarState('expanded');
      return;
    }
    
    const states = ['expanded', 'icon-only', 'collapsed'];
    const currentIdx = states.indexOf(this._sidebarState);
    const nextState = states[(currentIdx + 1) % states.length];
    this._setSidebarState(nextState);
  }

  /** 设置侧边栏状态 */
  _setSidebarState(state) {
    this._sidebarState = state;
    const sidebar = document.getElementById('cep-sidebar');
    const resizer = document.getElementById('cep-resizer');
    const collapseBtn = document.getElementById('cep-collapse-btn');
    const preview = this.root.querySelector('.cep-preview');

    if (!sidebar || !preview) return;

    // 移除所有状态类
    preview.classList.remove('cep-preview--sidebar-expanded', 'cep-preview--sidebar-icon-only', 'cep-preview--sidebar-collapsed');
    
    // 添加对应状态类
    preview.classList.add(`cep-preview--sidebar-${state}`);

    // 更新折叠按钮图标 - 完全折叠时也显示按钮
    if (collapseBtn) {
      const svg = collapseBtn.querySelector('svg path');
      if (svg) {
        if (state === 'collapsed') {
          // 完全折叠时显示右箭头（展开图标）
          svg.setAttribute('d', 'M9 18l6-6-6-6');
          collapseBtn.title = '展开侧边栏';
        } else if (state === 'icon-only') {
          // 仅图标时显示左箭头
          svg.setAttribute('d', 'M15 18l-6-6 6-6');
          collapseBtn.title = '折叠侧边栏';
        } else {
          // 展开时显示左箭头
          svg.setAttribute('d', 'M15 18l-6-6 6-6');
          collapseBtn.title = '折叠侧边栏';
        }
      }
    }

    // 更新分隔线显示状态
    if (resizer) {
      resizer.style.display = state === 'collapsed' ? 'none' : 'block';
    }

    // 设置宽度
    if (state === 'expanded') {
      sidebar.style.width = '180px';
    } else if (state === 'icon-only') {
      sidebar.style.width = '50px';
    }
    // collapsed 状态不需要设置宽度，因为侧边栏会被隐藏
  }

  _setMode(mode) {
    this._mode = mode;
    if (mode === 'panel') {
      this._activeHotkeys.clear();
      this._refreshGrid();
    }
    if (mode === 'longpress') {
      this._activeHotkeys.clear();
      this._refreshGrid();
    }
    const hkBar = this.root.querySelector('#cep-hotkey-bar');
    const lpBar = this.root.querySelector('#cep-longpress-bar');
    const uiBar = this.root.querySelector('#cep-ui-settings-bar');
    if (hkBar) hkBar.classList.toggle('cep-hotkey-bar--visible', mode === 'hotkey');
    if (lpBar) lpBar.classList.toggle('cep-longpress-bar--visible', mode === 'longpress');
    if (uiBar) uiBar.classList.toggle('cep-ui-settings-bar--visible', mode === 'uisettings');
    this._updateHotkeyBar();

    // 切换模式时显示引导（每个模式只显示一次）
    if (!this._guideDismissed.has(mode)) {
      this._showGuide(mode);
    }
  }

  // ─── uisettings ────────────────────────────────────────────

  _updateUISetting(key, value) {
    this._uiSettings[key] = value;

    // 更新显示值
    if (key === 'iconSize') {
      const el = this.root.querySelector('#iconsize-value');
      if (el) el.textContent = value;
      // 应用按钮大小
      const buttons = this.root.querySelectorAll('.cep-main-panel__btn');
      buttons.forEach(btn => {
        btn.style.width = value + 'px';
        btn.style.height = value + 'px';
      });
    } else if (key === 'iconSpacing') {
      const el = this.root.querySelector('#iconspacing-value');
      if (el) el.textContent = value;
      // 应用间距
      const grid = this.root.querySelector('#cep-btn-grid');
      if (grid) grid.style.gap = value + 'px';
    } else if (key === 'showToolbar') {
      // 显示/隐藏导航栏
      const toolbar = this.root.querySelector('.cep-main-panel__toolbar');
      if (toolbar) toolbar.style.display = value ? 'flex' : 'none';
      // 更新按钮状态
      this.root.querySelectorAll('.cep-ui-toolbar-btn').forEach(btn => {
        btn.classList.toggle('cep-ui-toolbar-btn--active', btn.dataset.toolbarState === String(value));
      });
    } else if (key === 'viewMode') {
      // 切换视图模式
      const grid = this.root.querySelector('#cep-btn-grid');
      if (grid) {
        grid.classList.toggle('cep-main-panel__grid--list', value === 'list');
      }
      // 更新按钮状态
      this.root.querySelectorAll('.cep-ui-toolbar-btn').forEach(btn => {
        btn.classList.toggle('cep-ui-toolbar-btn--active', btn.dataset.viewMode === value);
      });
    }
  }

  // ─── longpress ─────────────────────────────────────────────

  _setLongpressType(type) {
    this._longpressType = type;
    this.root.querySelectorAll('.cep-longpress-mode').forEach(btn => {
      btn.classList.toggle('cep-longpress-mode--active', btn.dataset.longpressType === type);
    });
  }

  _startLongpress(btnEl) {
    this._cancelLongpress();
    this._longpressTimer = setTimeout(() => {
      this._showLongpressMenu(btnEl);
    }, 300);
  }

  _cancelLongpress() {
    if (this._longpressTimer) {
      clearTimeout(this._longpressTimer);
      this._longpressTimer = null;
    }
  }

  _showLongpressMenu(btnEl) {
    const isCategoryBtn = btnEl.dataset.isCategoryBtn === 'true';

    let actions;
    if (isCategoryBtn) {
      // 分类按钮固定菜单
      actions = [
        { id: 'category-switch',    label: '切换分类', hotkey: 'Click',         icon: 'bi-grid-3x3',        color: '#4a9eff' },
        { id: 'category-settings',  label: '打开设置', hotkey: 'Ctrl',          icon: 'bi-gear',            color: '#94a3b8' },
        { id: 'category-log',       label: '打开日志', hotkey: 'Shift',         icon: 'bi-file-earmark-text', color: '#f97316' },
        { id: 'category-about',     label: '打开关于', hotkey: 'Alt',           icon: 'bi-info-circle',     color: '#22c55e' },
        { id: 'category-view',      label: '切换视图', hotkey: 'Ctrl+Alt',      icon: 'bi-view-list',       color: '#a78bfa' },
      ];
    } else {
      // 从按钮的 8 种形态数据动态生成
      const bIdx = parseInt(btnEl.dataset.btnIdx, 10);
      const cat = this._categories[this._activeCatIdx];
      const btn = cat?.buttons[bIdx];

      const hotkeyOrder = [
        { key: 'click',           label: '默认',              shortLabel: 'Click' },
        { key: 'ctrl',            label: 'Ctrl',              shortLabel: 'Ctrl' },
        { key: 'shift',           label: 'Shift',             shortLabel: 'Shift' },
        { key: 'alt',             label: 'Alt',               shortLabel: 'Alt' },
        { key: 'ctrl+shift',      label: 'Ctrl + Shift',      shortLabel: 'C+S' },
        { key: 'ctrl+alt',        label: 'Ctrl + Alt',        shortLabel: 'C+A' },
        { key: 'shift+alt',       label: 'Shift + Alt',       shortLabel: 'S+A' },
        { key: 'ctrl+shift+alt',  label: 'Ctrl+Shift+Alt',    shortLabel: 'C+S+A' },
      ];

      if (btn) {
        actions = hotkeyOrder
          .filter(h => btn.icons[h.key])
          .map(h => {
            const state = btn.icons[h.key];
            return {
              id: h.key,
              label: btn.label,
              hotkey: h.shortLabel,
              icon: state.icon,
              color: state.color,
            };
          });
      } else {
        // fallback
        actions = [
          { id: '1', label: '执行动作', hotkey: 'Click', icon: 'bi-play-fill',  color: '#22c55e' },
          { id: '2', label: '编辑设置', hotkey: 'Ctrl',  icon: 'bi-gear',       color: '#94a3b8' },
          { id: '3', label: '复制按钮', hotkey: 'Shift', icon: 'bi-clipboard',  color: '#f97316' },
          { id: '4', label: '删除按钮', hotkey: 'Alt',   icon: 'bi-trash',      color: '#ef4444' },
        ];
      }
    }
    
    if (this._longpressType === 'ring') {
      this._showRingMenu(actions, btnEl);
    } else {
      this._showPopupMenu(actions);
    }
  }

  _showPopupMenu(actions) {
    const overlay = document.createElement('div');
    overlay.className = 'cep-popup-overlay';
    let hoveredIdx = -1;

    const panel = document.createElement('div');
    panel.className = 'cep-popup-panel';

    actions.forEach((a, i) => {
      const btn = document.createElement('button');
      btn.className = 'cep-popup-item';
      btn.dataset.actionId = a.id;
      btn.dataset.idx = i;

      const iconWrap = document.createElement('span');
      iconWrap.className = 'cep-popup-item__icon';
      
      // 使用 Bootstrap Icons
      const icon = document.createElement('i');
      icon.className = `bi ${a.icon}`;
      icon.style.color = a.color;
      iconWrap.appendChild(icon);

      const content = document.createElement('span');
      content.className = 'cep-popup-item__content';

      const label = document.createElement('span');
      label.className = 'cep-popup-item__label';
      label.textContent = a.label;

      const hotkey = document.createElement('span');
      hotkey.className = 'cep-popup-item__hotkey';
      hotkey.textContent = a.hotkey;

      content.appendChild(label);
      content.appendChild(hotkey);
      btn.appendChild(iconWrap);
      btn.appendChild(content);

      btn.addEventListener('mouseenter', () => {
        hoveredIdx = i;
        panel.querySelectorAll('.cep-popup-item').forEach((el, idx) => {
          el.classList.toggle('cep-popup-item--active', idx === i);
        });
      });

      panel.appendChild(btn);
    });

    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('cep-popup-overlay--visible'), 10);

    overlay.addEventListener('mouseup', (e) => {
      const item = e.target.closest('.cep-popup-item');
      if (item && hoveredIdx >= 0) {
        console.log('选中:', actions[hoveredIdx].label);
      }
      overlay.remove();
    });
  }

  _showRingMenu(actions, btnEl) {
    const panelWrap = this.root.querySelector('.cep-preview__main');
    if (!panelWrap) return;

    const panelRect = panelWrap.getBoundingClientRect();
    const panelCx = panelRect.left + panelRect.width / 2;
    const panelCy = panelRect.top + panelRect.height / 2;

    const overlay = document.createElement('div');
    overlay.className = 'cep-ring-overlay';
    overlay.style.position = 'fixed';
    overlay.style.left = panelRect.left + 'px';
    overlay.style.top = panelRect.top + 'px';
    overlay.style.width = panelRect.width + 'px';
    overlay.style.height = panelRect.height + 'px';

    const localCx = panelRect.width / 2;
    const localCy = panelRect.height / 2;
    const radius = 100;

    // 创建背景圆环
    const bg = document.createElement('div');
    bg.className = 'cep-ring-bg';
    bg.style.left = localCx + 'px';
    bg.style.top = localCy + 'px';
    overlay.appendChild(bg);

    // 创建中心提示
    const hint = document.createElement('div');
    hint.className = 'cep-ring-hint';
    hint.id = 'cep-ring-hint';
    hint.style.left = localCx + 'px';
    hint.style.top = localCy + 'px';
    const hintLabel = document.createElement('span');
    hintLabel.className = 'cep-ring-hint__label';
    hintLabel.textContent = '拖拽选择';
    hint.appendChild(hintLabel);
    overlay.appendChild(hint);

    // 创建环形图标
    actions.forEach((a, i) => {
      const angle = (2 * Math.PI * i) / actions.length - Math.PI / 2;
      const x = localCx + radius * Math.cos(angle);
      const y = localCy + radius * Math.sin(angle);

      const item = document.createElement('div');
      item.className = 'cep-ring-item';
      item.dataset.actionId = a.id;
      item.dataset.idx = i;
      item.style.left = x + 'px';
      item.style.top = y + 'px';

      // 使用 Bootstrap Icons
      const icon = document.createElement('i');
      icon.className = `bi ${a.icon}`;
      icon.style.fontSize = '18px';
      icon.style.color = a.color;
      item.appendChild(icon);

      overlay.appendChild(item);
    });

    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('cep-ring-overlay--visible'), 10);

    let hoveredIdx = -1;
    overlay.addEventListener('mousemove', (e) => {
      const dx = e.clientX - panelCx;
      const dy = e.clientY - panelCy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 130) {
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        const step = (2 * Math.PI) / actions.length;
        const idx = Math.round(angle / step);
        hoveredIdx = ((idx % actions.length) + actions.length) % actions.length;

        overlay.querySelectorAll('.cep-ring-item').forEach((el, i) => {
          el.classList.toggle('cep-ring-item--hover', i === hoveredIdx);
        });

        if (hoveredIdx >= 0) {
          hint.innerHTML = '';
          const hk = document.createElement('span');
          hk.className = 'cep-ring-hint__hk';
          hk.textContent = actions[hoveredIdx].hotkey;
          const lb = document.createElement('span');
          lb.className = 'cep-ring-hint__label';
          lb.textContent = actions[hoveredIdx].label;
          hint.appendChild(hk);
          hint.appendChild(lb);
        }
      } else {
        hoveredIdx = -1;
        overlay.querySelectorAll('.cep-ring-item').forEach(el => el.classList.remove('cep-ring-item--hover'));
        hint.innerHTML = '';
        const lb = document.createElement('span');
        lb.className = 'cep-ring-hint__label';
        lb.textContent = '拖拽选择';
        hint.appendChild(lb);
      }
    });

    overlay.addEventListener('mouseup', () => {
      if (hoveredIdx >= 0) console.log('选中:', actions[hoveredIdx].label);
      overlay.remove();
    });
  }

  // ─── hotkey ────────────────────────────────────────────────

  _pressHotkey(key) {
    if (this._activeHotkeys.has(key)) {
      this._activeHotkeys.delete(key);
    } else {
      this._activeHotkeys.add(key);
    }
    this._updateHotkeyBar();
    this._refreshGrid();
  }

  _updateHotkeyBar() {
    this.root.querySelectorAll('.cep-hotkey-key').forEach(btn => {
      btn.classList.toggle('cep-hotkey-key--active', this._activeHotkeys.has(btn.dataset.hotkey));
    });
    // 更新组合状态标签
    const comboEl = this.root.querySelector('#cep-hotkey-combo');
    if (!comboEl) return;
    const hk = this._getHotkeyKey();
    const labelMap = {
      'click':           { text: '默认',              color: '#888' },
      'ctrl':            { text: 'Ctrl',              color: '#4a9eff' },
      'shift':           { text: 'Shift',             color: '#22c55e' },
      'alt':             { text: 'Alt',               color: '#f97316' },
      'ctrl+shift':      { text: 'Ctrl + Shift',      color: '#a78bfa' },
      'ctrl+alt':        { text: 'Ctrl + Alt',        color: '#eab308' },
      'shift+alt':       { text: 'Shift + Alt',       color: '#ef4444' },
      'ctrl+shift+alt':  { text: 'Ctrl + Shift + Alt', color: '#f97316' },
    };
    const info = labelMap[hk] || { text: hk, color: '#888' };
    comboEl.innerHTML = `<span class="cep-hotkey-combo__label" style="color:${info.color}">${info.text}</span>`;
  }

  /** 键盘按下：同步激活热键按钮（仅 hotkey 模式） */
  _onKeyDown(e) {
    if (this._mode !== 'hotkey') return;
    const map = { Control: 'ctrl', Shift: 'shift', Alt: 'alt' };
    const key = map[e.key];
    if (!key || this._activeHotkeys.has(key)) return;
    this._activeHotkeys.add(key);
    this._updateHotkeyBar();
    this._refreshGrid();
  }

  /** 键盘松开：移除对应热键 */
  _onKeyUp(e) {
    if (this._mode !== 'hotkey') return;
    const map = { Control: 'ctrl', Shift: 'shift', Alt: 'alt' };
    const key = map[e.key];
    if (!key) return;
    this._activeHotkeys.delete(key);
    this._updateHotkeyBar();
    this._refreshGrid();
  }

  // ─── category ──────────────────────────────────────────────

  _toggleDropdown() {
    const dd = this.root.querySelector('#cep-cat-dropdown');
    const arrow = this.root.querySelector('#cep-cat-arrow');
    if (!dd) return;
    const open = dd.classList.toggle('cep-cat-dropdown--open');
    if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
  }

  _closeDropdown() {
    const dd = this.root.querySelector('#cep-cat-dropdown');
    const arrow = this.root.querySelector('#cep-cat-arrow');
    if (dd) dd.classList.remove('cep-cat-dropdown--open');
    if (arrow) arrow.style.transform = '';
  }

  _selectCategory(idx) {
    if (idx === this._activeCatIdx) { this._closeDropdown(); return; }
    this._activeCatIdx = idx;
    const cat = this._categories[idx];

    const catSelect = this.root.querySelector('#cep-cat-select');
    if (catSelect) {
      catSelect.querySelector('.bi')?.remove();
      const icon = document.createElement('i');
      icon.className = `bi ${cat.icon}`;
      icon.style.cssText = `color:${cat.color};font-size:14px`;
      catSelect.insertBefore(icon, catSelect.querySelector('.cep-main-panel__cat-label'));
    }

    this.root.querySelectorAll('.cep-cat-dropdown__item').forEach((el, i) => {
      el.classList.toggle('cep-cat-dropdown__item--active', i === idx);
    });

    this._closeDropdown();
    this._refreshGrid();
  }

  // ─── grid ──────────────────────────────────────────────────

  _refreshGrid() {
    const cat = this._categories[this._activeCatIdx];
    const hk = this._getHotkeyKey();
    const grid = this.root.querySelector('#cep-btn-grid');
    if (!grid) return;
    grid.style.opacity = '0';
    setTimeout(() => {
      // 清空并重新创建按钮
      grid.textContent = '';
      
      // 第一个按钮：使用分类图标
      const categoryBtn = document.createElement('div');
      categoryBtn.className = 'cep-main-panel__btn cep-main-panel__btn--category';
      categoryBtn.dataset.isCategoryBtn = 'true';

      const categoryIconWrap = document.createElement('div');
      categoryIconWrap.className = 'cep-main-panel__btn-icon';

      categoryBtn.title = '切换分类';

      const categoryIcon = document.createElement('i');
      categoryIcon.className = `bi ${cat.icon}`;
      categoryIcon.style.color = cat.color;
      categoryIcon.style.fontSize = '20px';

      // 添加分类指示点（仅在 click 状态显示）
      if (hk === 'click') {
        const categoryDot = document.createElement('span');
        categoryDot.className = 'cep-category-indicator';
        categoryDot.style.background = cat.color;
        categoryIconWrap.appendChild(categoryDot);
      }

      categoryIconWrap.appendChild(categoryIcon);
      categoryBtn.appendChild(categoryIconWrap);
      grid.appendChild(categoryBtn);

      // 其他按钮
      cat.buttons.forEach((b, bIdx) => {
        const state = b.icons[hk]
          || (this._activeHotkeys.size > 0 ? b.icons[[...this._activeHotkeys].sort()[0]] : null)
          || b.icons.click;

        const btn = document.createElement('div');
        btn.className = 'cep-main-panel__btn';
        btn.title = b.label;
        btn.dataset.btnIdx = bIdx; // 存索引供长按菜单使用

        const iconWrap = document.createElement('div');
        iconWrap.className = 'cep-main-panel__btn-icon';

        const icon = document.createElement('i');
        icon.className = `bi ${state.icon}`;
        icon.style.color = state.color;
        icon.style.fontSize = '20px';

        iconWrap.appendChild(icon);
        btn.appendChild(iconWrap);
        grid.appendChild(btn);
      });

      // 应用 UI 设置
      this._applyUISettings();

      grid.style.transition = 'opacity 0.18s ease';
      grid.style.opacity = '1';
    }, 100);
  }

  /** 应用所有 UI 设置到当前面板 */
  _applyUISettings() {
    // 应用按钮大小
    const buttons = this.root.querySelectorAll('.cep-main-panel__btn');
    buttons.forEach(btn => {
      btn.style.width = this._uiSettings.iconSize + 'px';
      btn.style.height = this._uiSettings.iconSize + 'px';
    });

    // 应用间距
    const grid = this.root.querySelector('#cep-btn-grid');
    if (grid) grid.style.gap = this._uiSettings.iconSpacing + 'px';

    // 应用导航栏显示状态
    const toolbar = this.root.querySelector('.cep-main-panel__toolbar');
    if (toolbar) toolbar.style.display = this._uiSettings.showToolbar ? 'flex' : 'none';
  }

  // ─── guide overlay ─────────────────────────────────────────

  /** 显示指定模式的引导遮罩 */
  _showGuide(mode) {
    const cfg = this._guideConfig[mode];
    if (!cfg) return;

    // 移除已有引导层
    const existing = this.root.querySelector('.cep-guide-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'cep-guide-overlay';
    overlay.setAttribute('data-guide-mode', mode);

    overlay.innerHTML = `
      <div class="cep-guide-card">
        <div class="cep-guide-card__header">
          <div class="cep-guide-card__icon-wrap">
            <i class="bi ${cfg.icon}" style="color:${cfg.iconColor}"></i>
          </div>
          <div class="cep-guide-card__title-group">
            <h3 class="cep-guide-card__title">${cfg.title}</h3>
            <div class="cep-guide-card__tags">
              ${cfg.tags.map(t => `<span class="cep-guide-tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
        <p class="cep-guide-card__desc">${cfg.desc}</p>
        <div class="cep-guide-card__preview">
          ${cfg.preview}
        </div>
        <button class="cep-guide-card__cta" type="button">
          <i class="bi bi-cursor-fill"></i>
          <span>${cfg.hint}</span>
        </button>
      </div>
      <div class="cep-guide-pulse" style="border-color:${cfg.iconColor}"></div>
    `;

    // 插入到主面板区域
    const panelWrap = this.root.querySelector('.cep-preview__main');
    if (panelWrap) panelWrap.appendChild(overlay);

    // 入场动画
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('cep-guide-overlay--visible');
      });
    });

    // 点击任意位置关闭
    const dismiss = (e) => {
      e.stopPropagation();
      this._dismissGuide(overlay, mode);
    };
    overlay.addEventListener('click', dismiss, { once: true });
  }

  /** 关闭引导遮罩 */
  _dismissGuide(overlay, mode) {
    this._guideDismissed.add(mode);
    overlay.classList.add('cep-guide-overlay--exit');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }
}
