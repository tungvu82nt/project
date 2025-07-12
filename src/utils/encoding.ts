/**
 * Encoding utilities để tránh loạn mã trong ứng dụng
 * Xử lý UTF-8 encoding và character normalization
 */

/**
 * Normalize Unicode string để tránh vấn đề encoding
 * @param text - Chuỗi cần normalize
 * @returns Chuỗi đã được normalize
 */
export const normalizeText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Normalize Unicode using NFC (Canonical Decomposition, followed by Canonical Composition)
  return text.normalize('NFC');
};

/**
 * Kiểm tra xem chuỗi có chứa ký tự Unicode hợp lệ không
 * @param text - Chuỗi cần kiểm tra
 * @returns true nếu chuỗi hợp lệ
 */
export const isValidUTF8 = (text: string): boolean => {
  try {
    // Encode và decode để kiểm tra tính hợp lệ
    const encoded = encodeURIComponent(text);
    const decoded = decodeURIComponent(encoded);
    return decoded === text;
  } catch (error) {
    return false;
  }
};

/**
 * Làm sạch chuỗi từ các ký tự không mong muốn
 * @param text - Chuỗi cần làm sạch
 * @returns Chuỗi đã được làm sạch
 */
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    // Loại bỏ các ký tự điều khiển (trừ tab, newline, carriage return)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize Unicode
    .normalize('NFC')
    // Trim whitespace
    .trim();
};

/**
 * Chuyển đổi chuỗi thành Base64 UTF-8 an toàn
 * @param text - Chuỗi cần encode
 * @returns Chuỗi Base64
 */
export const encodeToBase64UTF8 = (text: string): string => {
  try {
    // Sử dụng TextEncoder để đảm bảo UTF-8 encoding
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Chuyển đổi Uint8Array thành string
    let binary = '';
    for (let i = 0; i < data.length; i++) {
      binary += String.fromCharCode(data[i]);
    }
    
    return btoa(binary);
  } catch (error) {
    console.error('Base64 encoding error:', error);
    return '';
  }
};

/**
 * Giải mã chuỗi Base64 thành UTF-8
 * @param base64 - Chuỗi Base64 cần decode
 * @returns Chuỗi UTF-8 gốc
 */
export const decodeFromBase64UTF8 = (base64: string): string => {
  try {
    const binary = atob(base64);
    
    // Chuyển đổi binary string thành Uint8Array
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    // Sử dụng TextDecoder để đảm bảo UTF-8 decoding
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
  } catch (error) {
    console.error('Base64 decoding error:', error);
    return '';
  }
};

/**
 * Kiểm tra và sửa lỗi encoding cho Vietnamese text
 * @param text - Chuỗi tiếng Việt
 * @returns Chuỗi đã được sửa lỗi encoding
 */
export const fixVietnameseEncoding = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Mapping các ký tự bị lỗi encoding phổ biến
  const encodingFixes: Record<string, string> = {
    // Ký tự 'a'
    'Ã¡': 'á', 'Ã\u00A0': 'à', 'áº£': 'ả', 'Ã£': 'ã', 'áº¡': 'ạ',
    // Ký tự 'e'
    'Ã©': 'é', 'Ã¨': 'è', 'áº»': 'ẻ', 'áº½': 'ẽ', 'áº¹': 'ẹ',
    // Ký tự 'i'
    'Ã­': 'í', 'Ã¬': 'ì', 'áº¿': 'ỉ', 'Ä©': 'ĩ', 'á»‹': 'ị',
    // Ký tự 'o'
    'Ã³': 'ó', 'Ã²': 'ò', 'á»\u008F': 'ỏ', 'Ãµ': 'õ', 'á»\u008D': 'ọ',
    // Ký tự 'u'
    'Ãº': 'ú', 'Ã¹': 'ù', 'á»§': 'ủ', 'Å©': 'ũ', 'á»¥': 'ụ',
    // Ký tự 'y'
    'Ã½': 'ý', 'á»³': 'ỳ', 'á»·': 'ỷ', 'á»¹': 'ỹ', 'á»µ': 'ỵ'
  };
  
  let fixedText = text;
  
  // Áp dụng các fix
  Object.entries(encodingFixes).forEach(([wrong, correct]) => {
    fixedText = fixedText.replace(new RegExp(wrong, 'g'), correct);
  });
  
  return normalizeText(fixedText);
};

/**
 * Đảm bảo chuỗi được hiển thị đúng trong các môi trường khác nhau
 * @param text - Chuỗi cần xử lý
 * @returns Chuỗi an toàn cho hiển thị
 */
export const ensureDisplaySafe = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return normalizeText(sanitizeText(text));
};

/**
 * Utility để log text với encoding information (cho debugging)
 * @param text - Chuỗi cần log
 * @param label - Label cho log
 */
export const debugEncoding = (text: string, label: string = 'Text'): void => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔤 Encoding Debug: ${label}`);
    console.log('Original:', text);
    console.log('Length:', text.length);
    console.log('Normalized:', normalizeText(text));
    console.log('Is Valid UTF-8:', isValidUTF8(text));
    console.log('Char codes:', text.split('').map(char => char.charCodeAt(0)));
    console.groupEnd();
  }
};

/**
 * Constants cho encoding
 */
export const ENCODING_CONSTANTS = {
  UTF8: 'utf-8',
  UTF16: 'utf-16',
  CHARSET_META: '<meta charset="UTF-8" />',
  CONTENT_TYPE_HEADER: 'text/html; charset=utf-8'
} as const;

/**
 * Type definitions
 */
export type EncodingType = 'utf-8' | 'utf-16' | 'ascii' | 'latin1';

export interface EncodingResult {
  success: boolean;
  data: string;
  error?: string;
}

/**
 * Wrapper function để xử lý encoding an toàn
 * @param operation - Function cần thực hiện
 * @param fallback - Giá trị fallback nếu có lỗi
 * @returns Kết quả hoặc fallback
 */
export const safeEncodingOperation = <T>(
  operation: () => T,
  fallback: T
): T => {
  try {
    return operation();
  } catch (error) {
    console.error('Encoding operation failed:', error);
    return fallback;
  }
};