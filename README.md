# 新泰汽車傳動軸 - 專業維修預約管理系統

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

這是為 **新泰汽車傳動軸** 量身打造的專業預約與客製化管理系統。結合現代化的網頁技術，提供客戶流暢的預約體驗，並為管理者提供強大的後台管理功能。

## 目錄
- [核心功能](#核心功能)
    - [前端入口 (Public)](#前端入口-public)
    - [管理後台 (Admin Panel)](#管理後台-admin-panel)
- [技術棧](#技術棧)
- [快速開始](#快速開始)
- [專案文件](#專案文件)

## 核心功能

### 前端入口 (Public)
- **動態展示**：自動同步後台設定的商家資訊（名稱、電話、地址）。
- **服務說明**：專業的傳動軸維修與平衡服務介紹。
- **線上預約**：整合 Google 登入，提供 **月曆格式 (Month View)** 的時段選擇器，支援月份切換並自動顯示國定假日與補班狀態。
- **LINE 整合**：支援 LINE LIFF 內開模式，自動隱藏網頁導航列，並提供 **無感自動登入** 體驗。
- **保固查詢**：
    - **訪客**：透過電話與車牌快速查詢。
    - **會員**：登入後於「我的保固」頁面自動帶出所有有效保固卡。

### 管理後台 (Admin Panel)
- **預約看板**：即時掌握每日預約狀況，支援完整狀態生命週期：待確認、已確認、已完成、**已取消**。
- **假日管理**：一鍵獲取台灣行政機關辦公日曆，並支援 **手動調整 (Override)**，可隨時變更特定日期為店休或營業。
- **系統設定**：動態修改商家基本資料、預約時段限制。
- **維修項目管理**：自定義服務名稱、預計工時與價格。
- **客戶/車輛管理**：建立完整的客戶維修歷史資料庫。
- **保固管理**：一鍵生成保固記錄，自動計算到期日。

## 技術棧

- **框架**: Next.js 15 (App Router / Turbopack)
- **資料庫**: PostgreSQL (透過 Prisma ORM)
- **身分驗證**: Auth.js (NextAuth v5) + Google Provider + LINE Provider
- **UI 框架**: Tailwind CSS + Shadcn/UI (部分自定義)
- **圖示庫**: Lucide React
- **LINE 整合**: LIFF SDK (@line/liff)
- **日期處理**: date-fns

## 快速開始

### 環境變數設定
建立 `.env` 檔案並填入以下內容：
```env
DATABASE_URL="your_postgresql_url"
AUTH_SECRET="your_nextauth_secret"
GOOGLE_CLIENT_ID="your_google_id"
GOOGLE_CLIENT_SECRET="your_google_secret"
```

### 安裝與運行
1. 安裝依賴：
   ```bash
   npm install
   ```
2. 資料庫遷移與產出：
   ```bash
   npx prisma db push
   npx prisma generate
   ```
3. 啟動開發伺服器：
   ```bash
   npm run dev
   ```
### 部署至 Vercel (搭配 Supabase DB)
本專案採用的架構為：**Vercel (App)** + **Supabase (PostgreSQL)**。

1. 在 **Supabase** 建立新專案，並取得 `Transaction` 或 `Session` 模式的連線字串。
2. 在 **Vercel** 匯入本專案。
3. 設定環境變數：
   - `DATABASE_URL`: 填入 Supabase 提供的連線字串。
   - `AUTH_SECRET`: 使用 `npx auth secret` 生成或手動設定。
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: 填入 Google Console 憑證。
4. 點擊 `Deploy` 即可完成建置。

## 專案文件
- [系統規格書 (SYSTEM_SPEC.md)](./SYSTEM_SPEC.md)
- [系統分析與設計文件 (SYSTEM_DESIGN.md)](./SYSTEM_DESIGN.md)
- [資料庫架構文件 (database_schema.md)](./database_schema.md)
- [使用者操作手冊 (USER_MANUAL.md)](./USER_MANUAL.md)
- [系統安全與漏洞檢核報告 (SECURITY_AUDIT.md)](./SECURITY_AUDIT.md)
- [系統測試報告 (TEST_REPORT.md)](./TEST_REPORT.md)

---
© 2026 新泰汽車傳動軸. 專業、誠信、精密平衡.
