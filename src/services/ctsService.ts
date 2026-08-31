export interface CtsValidationResult {
  isValid: boolean;
  editionUrn?: string;
  passageComponent?: string;
  isPerseusScrape: boolean;
  warning?: string;
}

export function parseCtsUrn(urn: string): CtsValidationResult {
  const trimmed = urn.trim();
  if (!trimmed.startsWith('urn:cts:')) {
    return {
      isValid: false,
      isPerseusScrape: false,
      warning: 'URN must begin with "urn:cts:"'
    };
  }

  const parts = trimmed.split(':');
  if (parts.length < 4) {
    return {
      isValid: false,
      isPerseusScrape: false,
      warning: 'Malformed CTS URN: expected at least 4 namespace components (urn:cts:namespace:work.passage)'
    };
  }

  const isPerseus = trimmed.toLowerCase().includes('perseus') || trimmed.toLowerCase().includes('canonical-greekLit') || trimmed.toLowerCase().includes('canonical-latinLit');

  return {
    isValid: true,
    editionUrn: parts.slice(0, 4).join(':'),
    passageComponent: parts[4] || undefined,
    isPerseusScrape: isPerseus,
    warning: isPerseus
      ? 'CTS record matches a public/Perseus repository. Under Patristic Concept Atlas academic rules, this must be verified against a critical edition (CSEL, CCSL, SC, GCS, PTA).'
      : undefined
  };
}
