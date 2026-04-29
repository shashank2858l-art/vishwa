export interface FundingConfig {
  target: number;
  commission: number; // e.g. 5 for 5%
  qrCodeUrl?: string; // We'll put the QR code here if extracted from media_urls
}

const FUNDING_MARKER_START = "\n\n[FUNDING_CONFIG: ";
const FUNDING_MARKER_END = "]";

/**
 * Appends the funding configuration to the raw complaint text.
 */
export function appendFundingConfig(rawText: string, config: Omit<FundingConfig, 'qrCodeUrl'>): string {
  const jsonStr = JSON.stringify(config);
  return `${rawText}${FUNDING_MARKER_START}${jsonStr}${FUNDING_MARKER_END}`;
}

/**
 * Parses the funding configuration from the raw complaint text.
 * Returns the parsed config and the cleaned text.
 */
export function extractFundingConfig(rawText: string): { cleanText: string; config: FundingConfig | null } {
  if (!rawText) return { cleanText: "", config: null };

  const startIndex = rawText.indexOf(FUNDING_MARKER_START);
  if (startIndex === -1) {
    return { cleanText: rawText, config: null };
  }

  try {
    const startOfJson = startIndex + FUNDING_MARKER_START.length;
    // Find the LAST closing bracket after the start of JSON, to account for any ] inside the JSON.
    const endOfJson = rawText.lastIndexOf(FUNDING_MARKER_END);
    
    if (endOfJson === -1 || endOfJson <= startOfJson) return { cleanText: rawText, config: null };

    const jsonStr = rawText.substring(startOfJson, endOfJson);
    
    // The database or API layer might HTML-escape quotes (e.g. " -> &quot;)
    // We must unescape them back to valid JSON double-quotes before parsing
    const unescapedJsonStr = jsonStr.replace(/&quot;/g, '"');
    
    const config = JSON.parse(unescapedJsonStr) as FundingConfig;

    // Clean text by removing the entire marker block
    const fullMarkerLength = FUNDING_MARKER_START.length + jsonStr.length + FUNDING_MARKER_END.length;
    const cleanText = rawText.slice(0, startIndex) + rawText.slice(startIndex + fullMarkerLength);

    return { cleanText: cleanText.trim(), config };
  } catch (err) {
    // Silently ignore parsing errors to prevent Next.js dev overlay from popping up
    return { cleanText: rawText, config: null };
  }
}
