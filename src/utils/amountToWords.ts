/**
 * Convert numeric amount to words using the Indian numbering system.
 * 
 * Conventions:
 * - Crore (1,00,00,000)
 * - Lakh (1,00,000)
 * - Thousand (1,000)
 * - Hundred (100)
 * 
 * Example:
 * 8500 -> "Eight Thousand Five Hundred Rupees Only"
 * 100000 -> "One Lakh Rupees Only"
 */

const ONES: string[] = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];

const TENS: string[] = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

function convertTwoDigits(num: number): string {
  if (num === 0) return "";
  if (num < 20) return ONES[num];
  const ten = Math.floor(num / 10);
  const one = num % 10;
  return TENS[ten] + (one > 0 ? " " + ONES[one] : "");
}

function convertThreeDigits(num: number): string {
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  let result = "";

  if (hundred > 0) {
    result += ONES[hundred] + " Hundred";
  }

  if (remainder > 0) {
    if (result.length > 0) result += " ";
    result += convertTwoDigits(remainder);
  }

  return result;
}

export function numberToWordsIndian(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") {
    return "";
  }

  const numericValue = typeof amount === "string" ? parseFloat(amount.replace(/,/g, "")) : amount;

  if (isNaN(numericValue) || !isFinite(numericValue)) {
    return "";
  }

  if (numericValue === 0) {
    return "Zero Rupees Only";
  }

  if (numericValue < 0) {
    return "Minus " + numberToWordsIndian(Math.abs(numericValue));
  }

  const integerPart = Math.floor(numericValue);
  const decimalPart = Math.round((numericValue - integerPart) * 100);

  // Split integer into Indian chunks:
  // Crores (>= 10,00,0000)
  // Lakhs (1,00,000 to 99,99,999)
  // Thousands (1,000 to 99,999)
  // Hundreds & remainder (1 to 999)
  let n = integerPart;

  const crores = Math.floor(n / 10000000);
  n %= 10000000;

  const lakhs = Math.floor(n / 100000);
  n %= 100000;

  const thousands = Math.floor(n / 1000);
  n %= 1000;

  const remainingHundreds = n;

  const parts: string[] = [];

  if (crores > 0) {
    parts.push(numberToWordsIndianChunk(crores) + " Crore");
  }

  if (lakhs > 0) {
    parts.push(numberToWordsIndianChunk(lakhs) + " Lakh");
  }

  if (thousands > 0) {
    parts.push(numberToWordsIndianChunk(thousands) + " Thousand");
  }

  if (remainingHundreds > 0) {
    parts.push(convertThreeDigits(remainingHundreds));
  }

  const words = parts.filter(Boolean).join(" ").trim();
  const rupeeText = words.length > 0 ? `${words} Rupees` : "Zero Rupees";

  if (decimalPart > 0) {
    const paiseText = convertTwoDigits(decimalPart);
    return `${rupeeText} and ${paiseText} Paise Only`;
  }

  return `${rupeeText} Only`;
}

function numberToWordsIndianChunk(num: number): string {
  if (num < 100) {
    return convertTwoDigits(num);
  }
  return convertThreeDigits(num);
}

/**
 * Format currency with Indian Comma grouping
 * e.g. 8500 -> 8,500, 100000 -> 1,00,000
 */
export function formatIndianCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "0";
  const num = typeof amount === "string" ? parseFloat(amount.replace(/,/g, "")) : amount;
  if (isNaN(num)) return "0";
  
  return num.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
}
