# 系統安全與漏洞檢核報告 (Security Audit & Vulnerability Assessment)

**專案名稱**: 新泰汽車傳動軸預約系統
**檢核日期**: 2026-01-31
**檢核版本**: V1.5 (LINE Integration Release)

## 1. 架構安全檢視 (Architecture Security)

### 1.1 身分驗證 (Authentication)
*   **機制**: 採用 `NextAuth.js (v5)` 進行標準化 OAuth 流程。
*   **提供者**: Google, LINE。
*   **Token 安全**:
    *   Session Token 儲存於 `HttpOnly`, `Secure` Cookie 中，防止客戶端腳本存取 (抗 XSS)。
    *   CSRF Protection: NextAuth 內建 CSRF Token 驗證，防止跨站請求偽造。
*   **狀態**: ✅Pass

### 1.2 資料庫存取 (Database Access)
*   **ORM 防護**: 使用 `Prisma ORM` 進行資料庫操作。
*   **SQL Injection**: Prisma 使用 Parameterized Queries (參數化查詢)，原生防止 SQL Injection 攻擊。
*   **連線安全**: 資料庫連線字串 (Connection String) 強制使用 SSL (如果部署於支援的雲端環境)。
*   **狀態**: ✅Pass

### 1.3 權限控制 (Authorization)
*   **角色制 (RBAC)**: 區分 `ADMIN` 與 `USER` 角色。
*   **Middleware 保護**: 
    *   `/admin` 路徑受 Middleware 保護，非 ADMIN 角色請求會被攔截並導向首頁。
    *   API Routes (`/api/admin/*`) 內部再次驗證 Session Role，確保無權限繞過風險。
*   **狀態**: ✅Pass

## 2. 常見漏洞檢查表 (Vulnerability Checklist)

| 檢核項目 | 說明 | 實作防護 | 狀態 |
| :--- | :--- | :--- | :--- |
| **SQL Injection** | 防止惡意 SQL 指令注入 | Prisma ORM 自動參數化處理 | ✅ Pass |
| **XSS (跨站腳本)** | 防止惡意腳本在瀏覽器執行 | React 自動跳脫 (Escaping) 輸出內容 | ✅ Pass |
| **CSRF (跨站請求)** | 防止偽造使用者意願的操作 | NextAuth 內建 CSRF Token 與 SameSite Cookie | ✅ Pass |
| **Insecure Direct Object References (IDOR)** | 防止存取非本人的資料 | API 層級 (如 `getUserWarranties`) 強制檢查 `session.user.id` | ✅ Pass |
| **Sensitive Data Exposure** | 防止敏感資料外洩 | API 回傳資料經過篩選 (例如不回傳 User Password Hash 雖然此專案無密碼) | ✅ Pass |
| **Broken Access Control** | 越權存取 | Middleware + Server Action 內部身分雙重檢查 | ✅ Pass |
| **Man-in-the-Middle** | 中間人攻擊 | 強制 HTTPS (HSTS)，正式環境由 Vercel 自動處理憑證 | ✅ Pass |

## 3. 敏感資料處理 (Data Privacy)

### 3.1 隱私資料
*   **客戶電話/車牌**: 作為業務識別碼，儲存於資料庫。
*   **保護措施**: 
    *   保固查詢 API 要求「車牌」+「電話」雙重符合才回傳資料，防止暴力枚舉 (Enumeration Attack)。
    *   非管理員無法批次撈取客戶清單。

### 3.2 系統設定 (Configuration)
*   **環境變數**: 所有敏感金鑰 (Client Secret, DB URL) 僅存於 `.env` (本地) 或雲端環境變數 (Production)，絕不提交至 Git版控。
*   **狀態**: ✅Pass

## 4. 建議改善事項 (Recommendations)

雖然目前架構已符合標準 Web 應用程式安全規範，但針對高規格交付建議：

1.  **Rate Limiting (頻率限制)**:
    *   目前狀態: 依賴 Vercel 平台層級防護。
    *   建議: 針對 `createAppointment` 等寫入介面增加應用層 Rate Limit，防止惡意刷單。
2.  **Audit Log (稽核紀錄)**:
    *   目前狀態: 記錄基本的 UpdatedAt。
    *   建議: 建立 dedicated `AuditLog` 資料表，記錄管理員的關鍵操作 (如刪除預約、修改設定)。
3.  **定期備份**:
    *   建議: 設定每日資料庫自動備份 (視雲端資料庫供應商而定)。

---
**簽署人**: System Architect (AI Agent)
