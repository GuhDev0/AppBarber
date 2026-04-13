/**
 * Utilitários de Segurança para o Frontend
 * Este módulo contém funções para sanitização, validação e proteção de dados
 */

/**
 * Sanitiza strings para prevenir XSS
 * Remove tags HTML e caracteres potencialmente perigosos
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Sanitiza objeto recursivamente
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : 
        typeof item === 'object' && item !== null ? sanitizeObject(item as Record<string, unknown>) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

/**
 * Valida e-mail com regex seguro
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}

/**
 * Valida telefone brasileiro
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const phoneClean = phone.replace(/\D/g, '');
  return phoneClean.length >= 10 && phoneClean.length <= 11;
}

/**
 * Formata telefone para exibição
 */
export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  return phone;
}

/**
 * Valida UUID
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Valida data no formato YYYY-MM-DD
 */
export function isValidDate(date: string): boolean {
  if (!date || typeof date !== 'string') return false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Valida hora no formato HH:MM
 */
export function isValidTime(time: string): boolean {
  if (!time || typeof time !== 'string') return false;
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Valida valor monetário
 */
export function isValidCurrency(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= 0 && num <= 999999.99;
}

/**
 * Limita tamanho de string
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str || typeof str !== 'string') return '';
  return str.length > maxLength ? str.slice(0, maxLength) : str;
}

/**
 * Remove caracteres especiais, mantendo apenas alfanuméricos e espaços
 */
export function cleanString(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[^\p{L}\p{N}\s.,@-]/gu, '').trim();
}

/**
 * Valida comprimento de campo
 */
export function validateLength(value: string, min: number, max: number): boolean {
  if (!value || typeof value !== 'string') return min === 0;
  return value.length >= min && value.length <= max;
}

/**
 * Rate limiting simples no cliente
 */
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now - record.timestamp > windowMs) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

/**
 * Previne duplo clique em submissão de formulário
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Gera token CSRF simples para formulários
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Valida se a URL é segura (não é javascript:, data:, etc)
 */
export function isSafeURL(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsed = new URL(url, window.location.origin);
    const unsafeProtocols = ['javascript:', 'data:', 'vbscript:'];
    return !unsafeProtocols.includes(parsed.protocol.toLowerCase());
  } catch {
    // Se não conseguir fazer parse, verifica se é caminho relativo seguro
    return /^[/a-zA-Z0-9._-]+$/.test(url);
  }
}

/**
 * Mascara dados sensíveis para exibição em logs
 */
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (!data || data.length <= visibleChars) return '****';
  return data.slice(0, visibleChars) + '****' + data.slice(-visibleChars);
}

/**
 * Valida entrada de formulário genérica
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateFormData(data: Record<string, unknown>, rules: ValidationRules): ValidationResult {
  const errors: Record<string, string> = {};
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    
    if (fieldRules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field] = fieldRules.requiredMessage || `${field} é obrigatório`;
      continue;
    }
    
    if (value && typeof value === 'string') {
      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        errors[field] = `Mínimo de ${fieldRules.minLength} caracteres`;
      }
      
      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        errors[field] = `Máximo de ${fieldRules.maxLength} caracteres`;
      }
      
      if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
        errors[field] = fieldRules.patternMessage || 'Formato inválido';
      }
      
      if (fieldRules.email && !isValidEmail(value)) {
        errors[field] = 'E-mail inválido';
      }
      
      if (fieldRules.phone && !isValidPhone(value)) {
        errors[field] = 'Telefone inválido';
      }
      
      if (fieldRules.custom && !fieldRules.custom(value)) {
        errors[field] = fieldRules.customMessage || 'Valor inválido';
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export interface ValidationRules {
  [field: string]: {
    required?: boolean;
    requiredMessage?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    patternMessage?: string;
    email?: boolean;
    phone?: boolean;
    custom?: (value: string) => boolean;
    customMessage?: string;
  };
}

/**
 * Escapa HTML para inserção segura
 */
export function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Converte HTML entities de volta para texto
 */
export function unescapeHTML(str: string): string {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.textContent || '';
}
