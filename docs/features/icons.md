# 图标系统

## IconRef 类型

```typescript
type IconRef =
  | { kind: "builtin"; name: string; color?: string }
  | { kind: "fa"; name: string; color?: string }
  | { kind: "file"; path: string }
  | { kind: "dataUrl"; dataUrl: string }
  | { kind: "svgText"; svgText: string }
```

## 图标来源

| 类型 | 说明 |
|------|------|
| `builtin` | 内置 SVG 图标 |
| `fa` | FontAwesome 4.7 图标 |
| `file` | 本地文件路径 |
| `dataUrl` | Base64 Data URL |
| `svgText` | 内联 SVG 文本 |
