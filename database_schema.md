# 資料庫架構文件 (Database Schema)

本文件描述 **Shintai Driveshaft (新泰汽車傳動軸)** 預約系統的資料庫實體關聯模型 (ER Model)。

## 實體關聯圖 (ER Diagram)

```mermaid
erDiagram
    User ||--o{ Account : "擁有 (OAuth)"
    User ||--o{ Session : "擁有 (登入階段)"
    User ||--o{ Appointment : "建立/關聯"
    
    Customer ||--o{ Vehicle : "擁有"
    
    Vehicle ||--o{ Appointment : "維修對象"
    Service ||--o{ Appointment : "施作項目"
    
    %% User (使用者/管理員)
    User {
        String id PK "使用者 ID"
        String name "姓名"
        String email "Email (唯一)"
        String image "頭像 URL"
        Role role "角色 (ADMIN/USER)"
    }

    %% Customer (客戶資料 - 管理員維護)
    Customer {
        String id PK "客戶 ID"
        String name "客戶姓名"
        String phoneNumber "電話號碼 (唯一)"
        String notes "備註"
    }

    %% Vehicle (車輛資料)
    Vehicle {
        String id PK "車輛 ID"
        String licensePlate "車牌號碼 (唯一)"
        String carModel "車型 (例: Toyota RAV4)"
        String customerId FK "關聯客戶 ID"
    }

    %% Service (服務項目)
    Service {
        String id PK "服務 ID"
        String name "服務名稱"
        Int duration "工時 (分鐘)"
        Int price "價格"
        Int warrantyMonths "保固期 (月)"
        Boolean isActive "是否啟用"
    }

    %% Appointment (預約紀錄)
    Appointment {
        String id PK "預約 ID"
        DateTime date "預約日期時間"
        String status "狀態 (PENDING/CONFIRMED/COMPLETED/CANCELLED)"
        String carModel "當下填寫的車型"
        String licensePlate "當下填寫的車牌"
        String phoneNumber "當下填寫的電話"
        Int actualDuration "實際工時"
        DateTime warrantyUntil "保固截止日"
        String userId FK "建立者/關聯使用者 ID"
        String serviceId FK "服務項目 ID"
        String vehicleId FK "關聯車輛 ID"
    }

    %% Settings (系統設定)
    Settings {
        String id PK "固定為 default"
        String businessName "商家名稱"
        String phoneNumber "商家電話"
        String address "商家地址"
        Int slotDuration "預約時段單位 (分)"
        String lineOfficialAccountUrl "LINE 官方帳號連結"
    }

    %% Holiday (特殊日期)
    Holiday {
        String id PK "ID"
        DateTime date "日期"
        String name "名稱"
        Boolean isHoliday "是否休假 (true=休假, false=補班)"
    }
    
    %% BlockedSlot (封鎖時段)
    BlockedSlot {
        String id PK "ID"
        DateTime date "封鎖時間點"
        String reason "原因"
    }
```

## 資料表欄位詳細說明

### 1. User (使用者)
系統的使用者，包含管理員和一般客戶（若有開放註冊）。
*   `id`: 唯一識別碼 (CUID)
*   `name`: 使用者顯示名稱
*   `email`: 電子郵件 (用於登入)
*   `role`: 權限角色，區分為 `ADMIN` (管理員) 與 `USER` (一般用戶)

### 2. Customer (客戶資料)
由管理員建立或系統自動歸檔的客戶資料，主要依據電話號碼識別。
*   `phoneNumber`: 客戶電話，作為唯一識別鍵。
*   `vehicles`: 該客戶名下的車輛列表。

### 3. Vehicle (車輛資料)
其輛資料，綁定於特定客戶。
*   `licensePlate`: 車牌號碼，標準化後儲存 (去除符號，轉大寫)。
*   `carModel`: 車型描述。

### 4. Appointment (預約)
核心預約資料，記錄了誰、什麼時候、做什麼服務。
*   `date`: 預約的具體時間點 (例如 2023-10-27 09:00:00)。
*   `status`: 預約狀態。
    *   `PENDING`: 等待確認
    *   `CONFIRMED`: 已確認
    *   `COMPLETED`: 已完工 (會觸發保固計算)
    *   `CANCELLED`: 已取消
*   `warrantyUntil`: 保固截止日期。當狀態變為 `COMPLETED` 時，系統會根據 Service 的保固設定自動計算並填入此欄位。

### 5. Service (服務項目)
提供的維修服務項目定義。
*   `duration`: 預設工時，用於排程計算。
*   `warrantyMonths`: 保固月數，用於計算 `warrantyUntil`。

### 6. Settings (全域設定)
系統的全域設定參數。
*   `lineOfficialAccountUrl`: LINE 官方帳號的加入連結，用於前端顯示按鈕。
