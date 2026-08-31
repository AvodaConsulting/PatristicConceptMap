/**
 * Patristic Real Source Strategy & Authority Layer
 *
 * Implements strict scholarly standards for:
 * 1. Clavis Clavium as metadata authority & identifier layer (CPL/CPG, authenticity, chronology, manuscript/edition history).
 * 2. Patristic Text Archive (PTA) as preferred primary text adapter (versioned CTS permalinks, Clavis/TLG cross-refs, explicit verification flags).
 * 3. Perseus Canonical Corpus as discovery/import assistance only (work-in-progress caution & mandatory collation).
 */

import { AuthenticityStatus, SourceProvider, VerificationStatus, DateCertainty, AuthorTradition, PrimaryLanguage } from '../types';

export interface ClavisAuthorityEntry {
  clavisId: string; // e.g. "CPL 0251" or "CPG 2091"
  tlgId?: string;   // e.g. "TLG 2035.001"
  author: string;
  authorTradition: AuthorTradition;
  workTitle: string;
  originalLanguage: PrimaryLanguage;
  authenticityStatus: AuthenticityStatus;
  startYear: number;
  endYear: number;
  certainty: DateCertainty;
  dateRationale: string;
  criticalEdition: string;
  manuscriptTraditionNote: string;
  clavisPermalink: string;
  ptaUrn?: string;
  perseusUrn?: string;
}

export const CLAVIS_AUTHORITY_DATABASE: Record<string, ClavisAuthorityEntry> = {
  'CPL 0251': {
    clavisId: 'CPL 0251',
    author: 'Augustinus Hipponensis',
    authorTradition: 'Latin/North African',
    workTitle: 'De ciuitate Dei',
    originalLanguage: 'la',
    authenticityStatus: 'authentic',
    startYear: 413,
    endYear: 426,
    certainty: 'exact',
    dateRationale: 'Begun after sack of Rome (410 CE), completed c. 426 CE before Retractationes.',
    criticalEdition: 'CCSL 47–48 (ed. B. Dombart & A. Kalb, 1955) / CSEL 40 (ed. E. Hoffmann, 1899-1900)',
    manuscriptTraditionNote: 'Extensive stemma; primary witnesses include codex Veronensis XXVIII (26) (5th cent.) and Corbeiensis (Paris lat. 12214).',
    clavisPermalink: 'https://clavis.brepols.net/clavisclavium/cpl/0251',
    ptaUrn: 'urn:cts:pta:pta0040.pta001'
  },
  'CPL 0263': {
    clavisId: 'CPL 0263',
    author: 'Augustinus Hipponensis',
    authorTradition: 'Latin/North African',
    workTitle: 'De gratia Christi et de peccato originali',
    originalLanguage: 'la',
    authenticityStatus: 'authentic',
    startYear: 418,
    endYear: 418,
    certainty: 'exact',
    dateRationale: 'Addressed to Albina, Pinianus, and Melania in 418 CE during anti-Pelagian crisis.',
    criticalEdition: 'CSEL 42 (ed. C. F. Vrba & J. Zycha, 1902)',
    manuscriptTraditionNote: 'Directly cited in Retractationes II.50.',
    clavisPermalink: 'https://clavis.brepols.net/clavisclavium/cpl/0263'
  },
  'CPL 0275': {
    clavisId: 'CPL 0275',
    author: 'Augustinus Hipponensis',
    authorTradition: 'Latin/North African',
    workTitle: 'De nuptiis et concupiscentia',
    originalLanguage: 'la',
    authenticityStatus: 'authentic',
    startYear: 419,
    endYear: 421,
    certainty: 'exact',
    dateRationale: 'Book I written late 418/early 419 CE for Count Valerius; Book II added 420-421 CE after Julian of Eclanum response.',
    criticalEdition: 'CSEL 42 (ed. C. F. Vrba & J. Zycha, 1902)',
    manuscriptTraditionNote: 'Important manuscript transmission witness: Parisinus lat. 2110 (9th cent.).',
    clavisPermalink: 'https://clavis.brepols.net/clavisclavium/cpl/0275'
  },
  'CPL 0008': {
    clavisId: 'CPL 0008',
    author: 'Tertullianus',
    authorTradition: 'Latin/North African',
    workTitle: 'De praescriptione haereticorum',
    originalLanguage: 'la',
    authenticityStatus: 'authentic',
    startYear: 198,
    endYear: 206,
    certainty: 'probable',
    dateRationale: 'Pre-Montanist or early Montanist transition period in Carthage.',
    criticalEdition: 'CCSL 1 (ed. R. F. Refoulé, 1954)',
    manuscriptTraditionNote: 'Corpus Cluniacense and Corpus Mesnartianum branches.',
    clavisPermalink: 'https://clavis.brepols.net/clavisclavium/cpl/0008'
  },
  'CPG 2091': {
    clavisId: 'CPG 2091',
    tlgId: 'TLG 2035.001',
    author: 'Athanasius Alexandrinus',
    authorTradition: 'Alexandrian',
    workTitle: 'Contra Gentes — De Incarnatione Verbi',
    originalLanguage: 'grc',
    authenticityStatus: 'authentic',
    startYear: 328,
    endYear: 335,
    certainty: 'probable',
    dateRationale: 'Scholarly consensus favors early episcopate (c. 328-335 CE); some scholars argue for pre-318 CE.',
    criticalEdition: 'SC 199 (ed. C. Kannengiesser, 1973) / PTA 0001 (Berlin-Brandenburgische Akademie)',
    manuscriptTraditionNote: 'Attested in both Short (vulgate) and Long recensions (Codex Athous Dochiariou 78).',
    clavisPermalink: 'https://clavis.brepols.net/clavisclavium/cpg/2091',
    ptaUrn: 'urn:cts:pta:pta0001.pta001'
  },
  'CPG 2840': {
    clavisId: 'CPG 2840',
    tlgId: 'TLG 2040.001',
    author: 'Basilius Caesariensis',
    authorTradition: 'Cappadocian',
    workTitle: 'De Spiritu Sancto',
    originalLanguage: 'grc',
    authenticityStatus: 'authentic',
    startYear: 375,
    endYear: 375,
    certainty: 'exact',
    dateRationale: 'Composed for Amphilochius of Iconium in 375 CE regarding the doxology controversy.',
    criticalEdition: 'SC 17bis (ed. B. Pruche, 1968) / PTA 0003',
    manuscriptTraditionNote: 'Broad Eastern Byzantine manuscript tradition with high textual stability.',
    clavisPermalink: 'https://clavis.brepols.net/clavisclavium/cpg/2840',
    ptaUrn: 'urn:cts:pta:pta0003.pta001'
  },
  'CPG 3010': {
    clavisId: 'CPG 3010',
    tlgId: 'TLG 2022.001',
    author: 'Gregorius Nazianzenus',
    authorTradition: 'Cappadocian',
    workTitle: 'Orationes Theologicae (Orat. 27–31)',
    originalLanguage: 'grc',
    authenticityStatus: 'authentic',
    startYear: 380,
    endYear: 380,
    certainty: 'exact',
    dateRationale: 'Preached in Constantinople at the Anastasia church in Summer/Autumn 380 CE.',
    criticalEdition: 'SC 250 (ed. P. Gallay & M. Jourjon, 1978)',
    manuscriptTraditionNote: 'Massive manuscript tradition; more than 150 Greek manuscripts witness the theological orations.',
    clavisPermalink: 'https://clavis.brepols.net/clavisclavium/cpg/3010'
  },
  'CPG 1405': {
    clavisId: 'CPG 1405',
    tlgId: 'TLG 0555.001',
    author: 'Clemens Alexandrinus',
    authorTradition: 'Alexandrian',
    workTitle: 'Stromata (I–VIII)',
    originalLanguage: 'grc',
    authenticityStatus: 'authentic',
    startYear: 198,
    endYear: 203,
    certainty: 'probable',
    dateRationale: 'Written in Alexandria prior to Clement departure during the Severan persecution (202/203 CE).',
    criticalEdition: 'GCS 15, 17, 39 (ed. O. Stählin & L. Früchtel, 1960-1970) / SC 30, 38, 428, 446, 463',
    manuscriptTraditionNote: 'Preserved almost uniquely in Codex Laurentianus V.3 (11th cent.).',
    clavisPermalink: 'https://clavis.brepols.net/clavisclavium/cpg/1405'
  }
};

export interface PtaAdapterDetails {
  urn: string;
  work: string;
  author: string;
  clavisId: string;
  tlgId?: string;
  hasDownloadableData: boolean;
  teiXmlUrl?: string;
  annotationWarning: string;
}

export const PTA_ADAPTER_REGISTRY: Record<string, PtaAdapterDetails> = {
  'urn:cts:pta:pta0001.pta001': {
    urn: 'urn:cts:pta:pta0001.pta001',
    author: 'Athanasius Alexandrinus',
    work: 'De Incarnatione Verbi',
    clavisId: 'CPG 2091',
    tlgId: 'TLG 2035.001',
    hasDownloadableData: true,
    teiXmlUrl: 'https://patristic-text-archive.de/pta0001.pta001.xml',
    annotationWarning: 'PTA provides digital critical edition data. Note: automated linguistic annotations and morphosyntactic tagging remain under active development and require explicit scholar verification.'
  },
  'urn:cts:pta:pta0003.pta001': {
    urn: 'urn:cts:pta:pta0003.pta001',
    author: 'Basilius Caesariensis',
    work: 'De Spiritu Sancto',
    clavisId: 'CPG 2840',
    tlgId: 'TLG 2040.001',
    hasDownloadableData: true,
    teiXmlUrl: 'https://patristic-text-archive.de/pta0003.pta001.xml',
    annotationWarning: 'PTA CTS edition with verified critical text. Scholar apparatus review recommended for doubtful manuscript variants.'
  },
  'urn:cts:pta:pta0040.pta001': {
    urn: 'urn:cts:pta:pta0040.pta001',
    author: 'Augustinus Hipponensis',
    work: 'De ciuitate Dei',
    clavisId: 'CPL 0251',
    hasDownloadableData: true,
    teiXmlUrl: 'https://patristic-text-archive.de/pta0040.pta001.xml',
    annotationWarning: 'Digital alignment with CCSL critical text. Explicit verification state required before citing automated grammatical parses.'
  }
};

/**
 * Validates and provides source strategy feedback for a given provider & URN.
 */
export function auditSourceStrategy(
  provider: SourceProvider,
  ctsUrn?: string,
  clavisId?: string
): {
  recommendation: 'optimal' | 'authority_linked' | 'caution_perseus' | 'standard';
  badgeLabel: string;
  badgeColor: string;
  guidanceText: string;
  externalLink?: string;
  clavisMatch?: ClavisAuthorityEntry;
  ptaMatch?: PtaAdapterDetails;
} {
  // 1. Check Clavis match
  const clavisKey = clavisId ? clavisId.trim().toUpperCase() : undefined;
  const clavisMatch = clavisKey ? CLAVIS_AUTHORITY_DATABASE[clavisKey] : undefined;

  // 2. Check PTA
  const ptaKey = ctsUrn ? ctsUrn.trim() : undefined;
  const ptaMatch = ptaKey ? PTA_ADAPTER_REGISTRY[ptaKey] : undefined;

  if (provider === 'PTA' || (ctsUrn && ctsUrn.startsWith('urn:cts:pta:'))) {
    return {
      recommendation: 'optimal',
      badgeLabel: 'PTA First-Class Adapter',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      guidanceText: 'Patristic Text Archive preferred adapter active: provides versioned CTS permalinks, downloadable TEI data, and Clavis/TLG cross-links. (Retain explicit verification state for linguistic annotations).',
      externalLink: 'https://patristic-text-archive.de/',
      clavisMatch,
      ptaMatch
    };
  }

  if (provider === 'Perseus' || (ctsUrn && (ctsUrn.includes('perseus') || ctsUrn.includes('canonical-greekLit') || ctsUrn.includes('canonical-latinLit')))) {
    return {
      recommendation: 'caution_perseus',
      badgeLabel: 'Perseus Discovery Lead (Collation Required)',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      guidanceText: 'Perseus source designated as discovery/import assistance only. Canonical Greek/Latin corpus is work-in-progress; headers and apparatus must be manually verified against critical editions (CSEL, CCSL, SC, PTA).',
      externalLink: 'http://www.perseus.tufts.edu/hopper/',
      clavisMatch,
      ptaMatch
    };
  }

  if (clavisMatch || provider === 'Clavis_Ref' || (clavisId && clavisId.length > 0)) {
    return {
      recommendation: 'authority_linked',
      badgeLabel: 'Clavis Clavium Authority Bound',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-300',
      guidanceText: 'Clavis Clavium metadata authority bound: authenticates authorship, chronology, authenticity status, and manuscript stemma.',
      externalLink: clavisMatch?.clavisPermalink || 'https://clavis.brepols.net/clavisclavium/',
      clavisMatch,
      ptaMatch
    };
  }

  return {
    recommendation: 'standard',
    badgeLabel: `${provider} Critical Edition`,
    badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
    guidanceText: 'Critical edition registered. Ensure full publication bibliographic citation and exact passage locators.',
    clavisMatch,
    ptaMatch
  };
}
