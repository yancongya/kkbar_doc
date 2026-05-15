<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';

const props = defineProps<{ type: string }>();
const emit = defineEmits<{ 'update:type': [value: string] }>();

// 进场动画状态
const isVisible = ref(false)
onMounted(() => {
  requestAnimationFrame(() => { isVisible.value = true })
})

// 自定义下拉状态
const isTypeDropdownOpen = ref(false)
const typeDropdownRef = ref<HTMLElement | null>(null)

// 内容切换动画状态
const contentKey = ref(0)
watch(() => props.type, () => {
  contentKey.value++
})

const platform = ref('win');
const togglePlatform = () => {
  platform.value = platform.value === 'win' ? 'mac' : 'win';
  refreshShell();
};

// 为每个类型保存独立的名称
const actionNames = ref<Record<string, string>>({
  jsx: '我的脚本',
  preset: '动画预设',
  effect: '高斯模糊',
  expression: '弹性表达式',
  scriptlet: '批量重命名',
  panel: '合成设置面板',
  menuItem: '新建项目',
  clipboard: '快速复制',
  shell: '批量导出',
});

const actionName = computed({
  get: () => actionNames.value[props.type] || '示例动作',
  set: (val) => { actionNames.value[props.type] = val; }
});

// BI 图标配置
const biIcons = ref<Record<string, string>>({
  jsx: 'bi-file-code-fill',
  preset: 'bi-layers-fill',
  effect: 'bi-magic',
  expression: 'bi-code-slash',
  scriptlet: 'bi-terminal-fill',
  panel: 'bi-window',
  menuItem: 'bi-list-ul',
  clipboard: 'bi-clipboard-fill',
  shell: 'bi-hdd-fill'
});

const biIconColors = ref<Record<string, string>>({
  jsx: '#a78bfa',
  preset: '#818cf8',
  effect: '#f97316',
  expression: '#4a9eff',
  scriptlet: '#22c55e',
  panel: '#eab308',
  menuItem: '#ec4899',
  clipboard: '#ef4444',
  shell: '#06b6d4'
});

const biOptions: Record<string, { icon: string; color: string }[]> = {
  jsx: [
    { icon: 'bi-file-code-fill', color: '#a78bfa' },
    { icon: 'bi-file-earmark-code-fill', color: '#818cf8' },
    { icon: 'bi-filetype-jsx', color: '#6366f1' },
    { icon: 'bi-braces', color: '#7c3aed' }
  ],
  preset: [
    { icon: 'bi-layers-fill', color: '#818cf8' },
    { icon: 'bi-stack', color: '#6366f1' },
    { icon: 'bi-collection-fill', color: '#4f46e5' },
    { icon: 'bi-grid-3x3-gap-fill', color: '#a78bfa' }
  ],
  effect: [
    { icon: 'bi-magic', color: '#f97316' },
    { icon: 'bi-stars', color: '#f59e0b' },
    { icon: 'bi-sparkles', color: '#eab308' },
    { icon: 'bi-lightning-fill', color: '#d97706' }
  ],
  expression: [
    { icon: 'bi-code-slash', color: '#4a9eff' },
    { icon: 'bi-braces-asterisk', color: '#3b82f6' },
    { icon: 'bi-hash', color: '#2563eb' },
    { icon: 'bi-sort-numeric-down', color: '#60a5fa' }
  ],
  scriptlet: [
    { icon: 'bi-terminal-fill', color: '#22c55e' },
    { icon: 'bi-terminal', color: '#16a34a' },
    { icon: 'bi-console-fill', color: '#15803d' },
    { icon: 'bi-chevron-right', color: '#4ade80' }
  ],
  panel: [
    { icon: 'bi-window', color: '#eab308' },
    { icon: 'bi-window-stack', color: '#d97706' },
    { icon: 'bi-display', color: '#ca8a04' },
    { icon: 'bi-pc-display', color: '#facc15' }
  ],
  menuItem: [
    { icon: 'bi-list-ul', color: '#ec4899' },
    { icon: 'bi-menu-button-wide-fill', color: '#db2777' },
    { icon: 'bi-ui-checks', color: '#be185d' },
    { icon: 'bi-card-checklist', color: '#f472b6' }
  ],
  clipboard: [
    { icon: 'bi-clipboard-fill', color: '#ef4444' },
    { icon: 'bi-clipboard2-fill', color: '#dc2626' },
    { icon: 'bi-stickies-fill', color: '#b91c1c' },
    { icon: 'bi-journal-text', color: '#f87171' }
  ],
  shell: [
    { icon: 'bi-hdd-fill', color: '#06b6d4' },
    { icon: 'bi-cpu-fill', color: '#0891b2' },
    { icon: 'bi-gear-fill', color: '#0e7490' },
    { icon: 'bi-wrench-adjustable', color: '#22d3ee' }
  ]
};

const refreshBiIcon = () => {
  const options = biOptions[props.type] || [{ icon: 'bi-question-circle', color: '#888' }];
  const idx = Math.floor(Math.random() * options.length);
  biIcons.value[props.type] = options[idx].icon;
  biIconColors.value[props.type] = options[idx].color;
};

const actionTypes = [
  { value: 'jsx', label: '脚本 (JSX/JSXBIN)' },
  { value: 'preset', label: '预设' },
  { value: 'effect', label: '效果' },
  { value: 'expression', label: '表达式' },
  { value: 'scriptlet', label: 'Scriptlet' },
  { value: 'panel', label: '面板' },
  { value: 'menuItem', label: '菜单命令' },
  { value: 'clipboard', label: '剪贴板' },
  { value: 'shell', label: 'Shell 命令' },
];

const selectedType = computed(() => props.type);

const handleTypeChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value
  emit('update:type', value)
}

// 自定义下拉处理
const toggleTypeDropdown = () => {
  isTypeDropdownOpen.value = !isTypeDropdownOpen.value
}

const selectType = (value: string) => {
  emit('update:type', value)
  isTypeDropdownOpen.value = false
}

// 点击外部关闭下拉
const handleClickOutside = (e: Event) => {
  if (typeDropdownRef.value && !typeDropdownRef.value.contains(e.target as Node)) {
    isTypeDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 效果列表
const effects = [
  '高斯模糊', '发光', '色相/饱和度', '曲线', '色阶',
  'CC Lens', 'CC Particle World', 'Particular', '光学耀光',
  '动态拼贴', '湍流置换', '方向模糊', '径向模糊', '锐化'
];
const currentEffect = ref('高斯模糊');
const refreshEffect = () => {
  const idx = Math.floor(Math.random() * effects.length);
  currentEffect.value = effects[idx];
  actionNames.value.effect = effects[idx];
};

// 表达式列表
const expressions = [
  '// 弹性表达式\namp = 0.05;\nfreq = 2.0;\ndecay = 3.0;\nn = 0;\nt = 0;\nif (numKeys > 0) {\n  n = nearestKey(time).index;\n  if (key(n).time > time) n--;\n}\nif (n > 0) {\n  t = time - key(n).time;\n  value + velocityAtTime(key(n).time) * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\n} else {\n  value;\n}',
  
  '// 循环表达式\nloopOut("cycle", 0)',
  
  '// 弹跳表达式\namp = .1;\nfreq = 2.0;\ndecay = 2.0;\nn = 0;\nif (numKeys > 0) {\n  n = nearestKey(time).index;\n  if (key(n).time > time) n--;\n}\nif (n == 0) { t = 0; } else { t = time - key(n).time; }\nif (n > 0 && t < 1) {\n  v = velocityAtTime(key(n).time - .001);\n  value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);\n} else { value; }',
  
  '// 随机抖动\nseedRandom(index, true);\nwiggle(3, 20)',
  
  '// 自动旋转\nvalue + time * 90'
];
const currentExpression = ref(expressions[0]);
const refreshExpression = () => {
  const idx = Math.floor(Math.random() * expressions.length);
  currentExpression.value = expressions[idx];
};

// 脚本片段列表
const scriptlets = [
  '// 批量重命名合成\nfor (var i = 1; i <= app.project.numItems; i++) {\n  var item = app.project.item(i);\n  if (item instanceof CompItem) {\n    item.name = "Comp_" + i;\n  }\n}',
  
  '// 清空项目\nwhile (app.project.numItems > 0) {\n  app.project.item(1).remove();\n}',
  
  '// 创建合成\nvar comp = app.project.items.addComp(\n  "New Comp", 1920, 1080, 1, 10, 30\n);',
  
  '// 导入文件\nvar file = new File("~/Desktop/video.mp4");\napp.project.importFile(new ImportOptions(file));',
  
  '// 设置工作区\nvar comp = app.project.activeItem;\ncomp.workAreaStart = 0;\ncomp.workAreaDuration = 5;'
];
const currentScriptlet = ref(scriptlets[0]);
const refreshScriptlet = () => {
  const idx = Math.floor(Math.random() * scriptlets.length);
  currentScriptlet.value = scriptlets[idx];
};

// 面板ID列表
const panelIds = [
  'com.adobe.AfterEffects',
  'com.adobe.Photoshop',
  'com.fxconsole.panel',
  'com.motiongfx.tools',
  'com.ae-script.kbar',
  'com.videocopilot.fx',
  'com.redefinery.toolbox',
  'com.knightarts.panel'
];
const currentPanelId = ref(panelIds[0]);
const refreshPanelId = () => {
  const idx = Math.floor(Math.random() * panelIds.length);
  currentPanelId.value = panelIds[idx];
  actionNames.value.panel = panelIds[idx].split('.').pop() || '面板';
};

// 菜单命令列表
const menuCommands: Record<string, { id: string; name: string }[]> = {
  '2015': [
    { id: '2', name: '新建项目' },
    { id: '3', name: '打开项目' },
    { id: '4', name: '关闭项目' },
    { id: '22', name: '撤销' },
    { id: '23', name: '重做' }
  ],
  '2019': [
    { id: '2', name: '新建项目' },
    { id: '3', name: '打开项目' },
    { id: '4', name: '关闭项目' },
    { id: '22', name: '撤销' },
    { id: '23', name: '重做' },
    { id: '3012', name: '清理缓存' }
  ],
  '2020': [
    { id: '2', name: '新建项目' },
    { id: '3', name: '打开项目' },
    { id: '4', name: '关闭项目' },
    { id: '22', name: '撤销' },
    { id: '23', name: '重做' },
    { id: '3012', name: '清理缓存' },
    { id: '3073', name: '刷新脚本' }
  ],
  '2024': [
    { id: '2', name: '新建项目' },
    { id: '3', name: '打开项目' },
    { id: '4', name: '关闭项目' },
    { id: '22', name: '撤销' },
    { id: '23', name: '重做' },
    { id: '3012', name: '清理缓存' },
    { id: '3073', name: '刷新脚本' },
    { id: '3143', name: '内容凭据' }
  ],
  '2025': [
    { id: '2', name: '新建项目' },
    { id: '3', name: '打开项目' },
    { id: '4', name: '关闭项目' },
    { id: '22', name: '撤销' },
    { id: '23', name: '重做' },
    { id: '3012', name: '清理缓存' },
    { id: '3073', name: '刷新脚本' },
    { id: '3143', name: '内容凭据' },
    { id: '3147', name: '属性面板' }
  ]
};
const aeVersions = ['2015', '2019', '2020', '2024', '2025'];
const currentVersion = ref('2024');
const currentMenuCommand = ref(menuCommands['2024'][0]);
const refreshMenuCommand = () => {
  const cmds = menuCommands[currentVersion.value] || menuCommands['2024'];
  const idx = Math.floor(Math.random() * cmds.length);
  currentMenuCommand.value = cmds[idx];
  actionNames.value.menuItem = cmds[idx].name;
};
const onVersionChange = (e: Event) => {
  currentVersion.value = (e.target as HTMLSelectElement).value;
  const cmds = menuCommands[currentVersion.value] || menuCommands['2024'];
  currentMenuCommand.value = cmds[0];
};

// Shell 命令列表
const shellCommands = {
  win: [
    '# 批量转换视频格式\npowershell -Command "Get-ChildItem *.avi | ForEach-Object { ffmpeg -i $_.Name ($_.BaseName + \'.mp4\') }"',
    
    '# 打开项目文件夹\nexplorer "$PROJECT_PATH"',
    
    '# 查找所有 AE 项目\npowershell -Command "Get-ChildItem -Path . -Recurse -Filter \'*.aep\'"',
    
    '# 清理缓存文件\npowershell -Command "Remove-Item -Path $env:TEMP\\Adobe\\* -Recurse -Force"',
    
    '# 获取系统信息\nsysteminfo | findstr /B /C:\"OS Name\" /C:\"Total Physical Memory\"'
  ],
  mac: [
    '# 批量转换视频格式\nfor f in *.avi; do ffmpeg -i "$f" "${f%.avi}.mp4"; done',
    
    '# 打开项目文件夹\nopen "$PROJECT_PATH"',
    
    '# 查找所有 AE 项目\nfind . -name "*.aep"',
    
    '# 清理缓存文件\nrm -rf ~/Library/Caches/Adobe/*',
    
    '# 获取系统信息\nsystem_profiler SPHardwareDataType'
  ]
};
const currentShell = ref(shellCommands.win[0]);
const refreshShell = () => {
  const cmds = platform.value === 'win' ? shellCommands.win : shellCommands.mac;
  const idx = Math.floor(Math.random() * cmds.length);
  currentShell.value = cmds[idx];
};

// 剪贴板内容列表
const clipboardContents = [
  '这是一个备注',
  '$FILE:D:\\Projects\\video.mp4',
  '$FOLDER:D:\\Assets\\images',
  '$FILE:D:\\Projects\\footage@footage',
  '$FILE:$SELECTION_FILE',
  '$FOLDER:$PROJECT_PATH\\footage',
  '$FILE:E:\\AE Projects\\assets\\backgrounds',
  '$FILE:D:\\video.mp4@2'
];
const currentClipboard = ref(clipboardContents[0]);
const refreshClipboard = () => {
  const idx = Math.floor(Math.random() * clipboardContents.length);
  currentClipboard.value = clipboardContents[idx];
};
</script>

<template>
  <div class="mockup-dialog-wrapper" :class="{ 'is-visible': isVisible }">
    <div class="dialog" role="dialog">
      <div class="dialog__head">
        <span style="font-weight: 600">功能设置面板</span>
        <button class="btn btn--ghost">关闭</button>
      </div>

      <div class="dialog__body">
        <!-- Name with Icon -->
        <div class="form-row">
          <label class="form-label">名称</label>
          <div class="row" style="flex: 1">
            <input class="input" v-model="actionName" />
            <button class="icon-preview-btn bi-icon-btn" type="button" @click="refreshBiIcon" title="点击切换图标">
                <i class="bi" :class="biIcons[type]" :style="{ color: biIconColors[type] }"></i>
            </button>
          </div>
        </div>

        <!-- Type -->
        <div class="form-row">
          <label class="form-label">类型</label>
          <div class="custom-select" ref="typeDropdownRef">
            <div class="custom-select__trigger" @click="toggleTypeDropdown">
              <span class="custom-select__value">{{ actionTypes.find(a => a.value === props.type)?.label || '选择类型' }}</span>
              <i class="bi bi-chevron-down custom-select__arrow" :class="{ 'custom-select__arrow--open': isTypeDropdownOpen }"></i>
            </div>
            <Transition name="dropdown">
              <div v-if="isTypeDropdownOpen" class="custom-select__dropdown">
                <div v-for="item in actionTypes" :key="item.value"
                  class="custom-select__option"
                  :class="{ 'custom-select__option--active': item.value === props.type }"
                  @click="selectType(item.value)">
                  <span class="custom-select__option-label">{{ item.label }}</span>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Spacer -->
        <div style="height: 10px"></div>

        <!-- Dynamic part based on type -->
        <Transition name="content" mode="out-in">
          <div :key="type" class="content-wrapper">

            <!-- Type: jsx, preset -->
            <template v-if="type === 'jsx' || type === 'preset'">
              <div class="form-row">
                <label class="form-label">{{ type === 'preset' ? '预设文件' : '脚本文件' }}</label>
                <div class="file-picker">
                  <button class="file-picker-btn" type="button">
                    <i class="fa fa-folder-open"></i>
                  </button>
                  <input class="input file-input" :value="type === 'preset' ? 'C:\\path\\to\\animation.ffx' : 'C:\\path\\to\\my-script.jsx'" readonly />
                </div>
              </div>
            </template>

            <!-- Type: effect -->
            <template v-else-if="type === 'effect'">
              <div class="form-row">
                <label class="form-label">效果</label>
                <div class="file-picker">
                    <input class="input" :value="currentEffect" readonly @click="refreshEffect" style="cursor: pointer" />
                    <button class="file-picker-btn refresh-btn--loaded" type="button" @click="refreshEffect">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                    </button>
                </div>
              </div>
            </template>

            <!-- Type: panel -->
            <template v-else-if="type === 'panel'">
              <div class="form-row">
                <label class="form-label">面板 ID</label>
                <div class="file-picker">
                    <input class="input" :value="currentPanelId" readonly @click="refreshPanelId" style="cursor: pointer" />
                    <button class="file-picker-btn refresh-btn--loaded" type="button" @click="refreshPanelId">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                    </button>
                </div>
              </div>
            </template>

            <!-- Type: expression, scriptlet -->
            <template v-else-if="type === 'expression' || type === 'scriptlet'">
                <div class="form-row-vertical">
                    <div class="label-with-actions">
                        <label class="form-label">{{ type === 'expression' ? '表达式' : 'Scriptlet' }}</label>
                        <div class="mockup-action-buttons">
                            <div class="mockup-action-btn" title="点击切换代码" @click="type === 'expression' ? refreshExpression() : refreshScriptlet()">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                        </div>
                    </div>
                    <div class="code-editor-mockup clickable" @click="type === 'expression' ? refreshExpression() : refreshScriptlet()">
                        <pre><code>{{ type === 'expression' ? currentExpression : currentScriptlet }}</code></pre>
                    </div>
                </div>
            </template>

            <!-- Type: menuItem -->
            <template v-else-if="type === 'menuItem'">
                <div class="form-row-vertical" style="gap: 8px;">
                     <div class="form-row">
                        <label class="form-label" style="width: 60px;">版本</label>
                        <select class="select" :value="currentVersion" @change="onVersionChange">
                            <option v-for="v in aeVersions" :key="v" :value="v">AE {{ v }}</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <label class="form-label" style="width: 60px;">命令</label>
                        <input class="input" :value="currentMenuCommand.name + ' (ID: ' + currentMenuCommand.id + ')'" readonly @click="refreshMenuCommand" style="cursor: pointer" />
                    </div>
                </div>
            </template>

            <!-- Type: clipboard, shell -->
            <template v-else-if="type === 'clipboard' || type === 'shell'">
                <div class="form-row-vertical">
                    <div class="label-with-actions">
                        <label class="form-label">{{ type === 'clipboard' ? '剪贴板内容' : 'Shell 命令' }}</label>
                        
                        <!-- Clipboard Buttons -->
                        <div v-if="type === 'clipboard'" class="mockup-action-buttons">
                            <div class="mockup-action-btn">$F</div>
                            <div class="mockup-action-btn">$D</div>
                            <div class="mockup-action-divider"></div>
                            <div class="mockup-action-btn"><i class="fa fa-folder-o"></i></div>
                            <div class="mockup-action-btn">0</div>
                            <div class="mockup-action-btn">1</div>
                            <div class="mockup-action-btn">2</div>
                            <div class="mockup-action-divider"></div>
                            <div class="mockup-action-btn">?</div>
                        </div>

                        <!-- Shell Buttons -->
                        <div v-if="type === 'shell'" class="mockup-action-buttons">
                            <div class="mockup-action-btn platform-toggle-btn" @click="togglePlatform" :title="platform === 'win' ? 'Windows (点击切换为 macOS)' : 'macOS (点击切换为 Windows)'">
                                <svg v-if="platform === 'win'" viewBox="0 0 24 24" width="14" height="14">
                                    <path fill="#00A4EF" d="M3 12V6.75L9 5.43V11.91L3 12M20 3V11.75L10 11.9V5.21L20 3M3 13L9 13.09V19.9L3 18.75V13M20 13.25V22L10 20.09V13.1L20 13.25Z"/>
                                </svg>
                                <svg v-else viewBox="0 0 24 24" width="14" height="14">
                                    <path fill="#999999" d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.7 19.67 18.12 18.71 19.5M13.41 9.89C13.36 10.33 13.3 10.76 13.25 11.19C13.2 11.63 13.15 12.06 13.1 12.5C12.95 12.46 12.8 12.42 12.65 12.38C12.5 12.35 12.35 12.31 12.2 12.27C12.22 11.83 12.24 11.4 12.26 10.97C12.29 10.53 12.31 10.1 12.33 9.66C12.35 9.69 12.37 9.72 12.39 9.75C12.41 9.78 12.43 9.81 12.45 9.84C12.56 9.85 12.68 9.87 12.79 9.88C12.93 9.89 13.07 9.89 13.21 9.9C13.28 9.9 13.35 9.89 13.41 9.89Z"/>
                                </svg>
                            </div>
                            <div class="mockup-action-divider"></div>
                            <div class="mockup-action-btn">⚡</div>
                            <div class="mockup-action-btn">📁</div>
                            <div class="mockup-action-btn">📄</div>
                            <div class="mockup-action-btn">📂</div>
                            <div class="mockup-action-divider"></div>
                            <div class="mockup-action-btn">?</div>
                        </div>

                    </div>
                    <div class="code-editor-mockup clickable" @click="type === 'clipboard' ? refreshClipboard() : refreshShell()">
                        <pre><code>{{ type === 'clipboard' ? currentClipboard : currentShell }}</code></pre>
                    </div>
                </div>
            </template>

          </div>
        </Transition>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Import FontAwesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

.mockup-dialog-wrapper {
    --bg-color: #3a3a3a;
    --border-color: #4a4a4a;
    --label-color: #d1d1d1;
    --input-bg: #2c2c2c;
    --input-border: #4f4f4f;
    --input-text: #f0f0f0;
    --btn-ghost-text: #a0a0a0;
    --icon-fallback-bg: #525252;
    --select-bg: var(--input-bg);
    --menu-item-hover-bg: #4a4a4a;

    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    width: 500px;
    max-width: 100%;
    height: 340px;
    margin: 0 auto;
    
    /* 进场动画 */
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
                transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.mockup-dialog-wrapper.is-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* 内容切换动画 */
.content-wrapper {
    animation: content-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes content-enter {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Vue Transition */
.content-enter-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.content-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.content-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.content-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

html.dark .mockup-dialog-wrapper {
    /* Dark theme is default */
}

html:not(.dark) .mockup-dialog-wrapper {
    --bg-color: #f0f0f0;
    --border-color: #dcdcdc;
    --label-color: #333;
    --input-bg: #ffffff;
    --input-border: #c5c5c5;
    --input-text: #222;
    --btn-ghost-text: #777;
    --icon-fallback-bg: #d1d1d1;
    --select-bg: var(--input-bg);
    --menu-item-hover-bg: #e0e0e0;
}

.dialog {
  background-color: var(--bg-color);
  color: var(--label-color);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dialog__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.dialog__body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}

.form-row, .form-row-vertical {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-row-vertical {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
}

.form-label {
  white-space: nowrap;
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input, .select {
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--input-text);
  border-radius: 6px;
  padding: 8px 12px;
  width: 100%;
  box-sizing: border-box;
  font-size: inherit;
}

.select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23d1d1d1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E');
    background-repeat: no-repeat;
    background-position: right 10px top 50%;
    background-size: .65em auto;
}

html:not(.dark) .select {
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E');
}

/* 自定义下拉样式 */
.custom-select {
  position: relative;
  width: 100%;
}

.custom-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--input-text);
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
  font-size: inherit;
}

.custom-select__trigger:hover {
  border-color: #667eea;
}

.custom-select__trigger:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
}

.custom-select__value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-select__arrow {
  font-size: 10px;
  color: var(--btn-ghost-text);
  transition: transform 0.2s;
  margin-left: 8px;
}

.custom-select__arrow--open {
  transform: rotate(180deg);
}

.custom-select__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 8px;
  padding: 4px;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  max-height: 240px;
  overflow-y: auto;
}

.custom-select__option {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s;
  color: var(--input-text);
}

.custom-select__option:hover {
  background-color: var(--menu-item-hover-bg);
}

.custom-select__option--active {
  background-color: #667eea;
  color: #fff;
}

.custom-select__option--active:hover {
  background-color: #5a6fd6;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.btn {
    background: none;
    border: none;
    cursor: pointer;
}

.btn--ghost {
    color: var(--btn-ghost-text);
}

.icon-preview-btn {
    background-color: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 6px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}

.icon-badge-fallback {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background-color: var(--icon-fallback-bg);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    color: var(--input-text);
}

.file-picker {
  display: flex;
  flex: 1;
  gap: 8px;
}

.file-picker-btn {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  color: var(--label-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

.refresh-btn--loaded {
    color: #16d875;
}

.code-editor-mockup {
    background-color: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 6px;
    height: 110px;
    padding: 10px;
    overflow: hidden;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 13px;
}

.code-editor-mockup pre {
    margin: 0;
}

.menu-list-mockup {
    flex: 1;
    height: 100px;
    border: 1px solid var(--input-border);
    background-color: var(--input-bg);
    border-radius: 6px;
    padding: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.menu-item-mockup {
    padding: 6px 8px;
    border-radius: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.menu-item-mockup.active {
    background-color: var(--menu-item-hover-bg);
}

.label-with-actions {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}

.mockup-action-buttons {
    display: flex;
    align-items: center;
    gap: 2px;
    border-radius: 6px;
    padding: 2px;
    height: 30px;
}

.mockup-action-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    min-width: 24px;
    padding: 0 4px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    color: var(--label-color);
    background-color: var(--input-bg);
    border: 1px solid var(--input-border);
    font-family: system-ui, sans-serif;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.mockup-action-btn:hover {
    background-color: var(--menu-item-hover-bg);
}

.mockup-action-btn:active {
    transform: scale(0.95);
}

.platform-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
}

.mockup-action-divider {
    width: 1px;
    height: 16px;
    background-color: var(--input-border);
    margin: 0 2px;
}

.clickable {
    cursor: pointer;
    transition: border-color 0.2s ease;
}

.clickable:hover {
    border-color: #4a9eff;
}

.code-editor-mockup code {
    color: var(--input-text);
    white-space: pre-wrap;
    word-break: break-all;
}

.bi-icon-btn {
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.bi-icon-btn:hover {
    transform: scale(1.1);
    background-color: var(--menu-item-hover-bg);
}

.bi-icon-btn:active {
    transform: scale(0.95);
}

.bi-icon-btn i {
    font-size: 18px;
}

</style>
