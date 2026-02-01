/**
 * 車輛號牌與電話正規化工具
 * 依據台灣車輛號牌處理規範
 */

// 新式 7 碼車牌 (3 英文 + 4 數字)：不含 I、O，數字不含 4
// 舊式 6 碼：2 英文 + 4 數字 或 4 數字 + 2 英文
const LICENSE_PLATE_REGEX = /^([A-HJ-NP-Z]{3}[0-35-9]{4}|[A-HJ-NP-Z]{2}[0-9]{4}|[0-9]{4}[A-HJ-NP-Z]{2})$/;

// 台灣手機號碼：09 開頭，共 10 碼
// 台灣市話號碼：0 開頭，2~8 碼區域碼 + 6~8 碼電話號碼，共 9~10 碼
const PHONE_REGEX = /^(09[0-9]{8}|0[2-8][0-9]{7,8})$/;

/**
 * 正規化車牌號碼
 * - 轉大寫
 * - 移除連字號與空白
 */
export function normalizeLicensePlate(plate: string): string {
    return plate
        .toUpperCase()
        .replace(/[-\s]/g, '');
}

/**
 * 正規化電話號碼
 * - 移除連字號與空白
 */
export function normalizePhone(phone: string): string {
    return phone.replace(/[-\s]/g, '');
}

/**
 * 驗證車牌格式
 * @returns 錯誤訊息，若正確則回傳 null
 */
export function validateLicensePlate(plate: string): string | null {
    const normalized = normalizeLicensePlate(plate);

    if (!normalized) {
        return "請填寫車牌號碼";
    }

    // 檢查是否包含 I 或 O
    if (/[IO]/i.test(normalized)) {
        return "車牌格式不正確（不可包含 I、O）";
    }

    // 檢查新式車牌是否包含 4
    if (normalized.length === 7 && /4/.test(normalized)) {
        return "車牌格式不正確（新式車牌不含 4）";
    }

    // 正則驗證
    if (!LICENSE_PLATE_REGEX.test(normalized)) {
        return "車牌格式不正確（不可包含 I、O，新式車牌不含 4）";
    }

    return null;
}

/**
 * 驗證電話格式
 * @returns 錯誤訊息，若正確則回傳 null
 */
export function validatePhone(phone: string): string | null {
    const normalized = normalizePhone(phone);

    if (!normalized) {
        return "請填寫聯絡電話";
    }

    if (normalized.length < 9 || normalized.length > 10) {
        return "請輸入正確的聯絡電話（手機 10 碼或市話 9-10 碼）";
    }

    if (!PHONE_REGEX.test(normalized)) {
        return "請輸入正確的手機或市話號碼";
    }

    return null;
}

/**
 * 正規化所有預約資料
 */
export function normalizeBookingData(data: {
    licensePlate: string;
    phoneNumber: string;
    carModel: string;
}) {
    return {
        licensePlate: normalizeLicensePlate(data.licensePlate),
        phoneNumber: normalizePhone(data.phoneNumber),
        carModel: data.carModel.trim(),
    };
}
