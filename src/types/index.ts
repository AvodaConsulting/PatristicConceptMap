export type VerificationStatus = 'attested' | 'provisional' | 'discovery_lead' | 'unsupported';

export type RelationType = 
  | 'direct_citation'
  | 'explicit_interpretation'
  | 'lexical_continuity'
  | 'translation_interpretation'
  | 'conceptual_development'
  | 'inversion_rejection'
  | 'parallel_resonance'
  | 'reception_reuse'
  | 'disputed_proposal';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type Locale = 'en' | 'zh-Hant';

export type AuthorTradition =
  | 'Latin/North African'
  | 'Alexandrian'
  | 'Antiochene'
  | 'Cappadocian'
  | 'Syriac'
  | 'Gallic'
  | 'Palestinian'
  | 'Roman'
  | 'Byzantine'
  | 'Other';

export type PrimaryLanguage = 'la' | 'grc' | 'syr' | 'cop' | 'arm' | 'he' | 'other';

export type AuthenticityStatus = 'authentic' | 'spuria_pseudepigrapha' | 'dubia' | 'fragmentary';

export type SourceProvider = 
  | 'CSEL'
  | 'CCSL'
  | 'CCG'
  | 'SC'
  | 'GCS'
  | 'PG'
  | 'PL'
  | 'PTA'
  | 'Perseus'
  | 'TLG_Ref'
  | 'Clavis_Ref'
  | 'Other_Critical_Edition';

export type DateCertainty = 'exact' | 'probable' | 'approximate' | 'contested' | 'unknown';

export interface CompositionDate {
  startYear: number; // e.g., 397 (CE) or -50 (BCE)
  endYear: number;
  certainty: DateCertainty;
  note?: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  subtitle?: string;
  researchQuestion: string;
  methodologyNote: string;
  language: 'en' | 'zh-Hant';
  dateRange: {
    startYear: number;
    endYear: number;
  };
  createdAt: string;
  updatedAt: string;
  curatedPacketId?: string;
}

export interface SourceRecord {
  id: string;
  projectId: string;
  author: string;
  authorTradition: AuthorTradition;
  workTitle: string;
  originalLanguage: PrimaryLanguage;
  compositionDate: CompositionDate;
  authenticityStatus: AuthenticityStatus;
  sourceProvider: SourceProvider;
  providerUrl?: string;
  clavisId?: string; // e.g., CPL 0251 or CPG 2091
  tlgId?: string; // e.g., TLG 2035.001
  ctsUrn?: string; // e.g., urn:cts:latinLit:stoa0040.stoa014.opp-lat1
  edition: string; // e.g., CSEL 40/1 (ed. E. Hoffmann, 1899)
  translator?: string;
  rightsAccessNote?: string;
  bibliographyCitation: string;
  verificationStatus: VerificationStatus;
  researcherNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PassageSnapshot {
  importedAt: string;
  sourceChecksum: string;
  providerUri?: string;
  isImmutable: boolean;
}

export interface Passage {
  id: string;
  projectId: string;
  sourceId: string;
  passageLocator: string; // e.g. XIV.16 or 54.3
  originalText: string;
  translationText: string;
  translationLanguage: 'en' | 'zh-Hant';
  concepts: string[];
  verificationStatus: VerificationStatus;
  snapshot: PassageSnapshot;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceCard {
  id: string;
  projectId: string;
  sourcePassageId: string;
  targetPassageId?: string;
  sourceConcept: string;
  targetConcept?: string;
  sourceNodeId: string; // graph node id or identifier
  targetNodeId: string; // graph node id or identifier
  exactLocators: string[];
  relationType: RelationType;
  confidence: ConfidenceLevel;
  evidenceExcerpt: string; // verbatim primary excerpt
  researcherExplanation: string; // human rationale
  aiInterpretation?: string; // strictly tagged if AI contributed
  verificationStatus: VerificationStatus;
  reviewerNotes?: string;
  cautionNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GraphNode {
  id: string;
  label: string;
  sublabel?: string;
  type: 'author' | 'work' | 'passage' | 'concept' | 'tradition';
  tradition?: AuthorTradition;
  century?: number;
  year?: number;
  dateYear?: number;
  verificationStatus: VerificationStatus;
  sourceId?: string;
  passageId?: string;
  conceptName?: string;
  metadata?: Record<string, any>;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  relationType: RelationType;
  confidence: ConfidenceLevel;
  evidenceCardIds: string[];
  verificationStatus: VerificationStatus;
  cautionNote?: string;
}

export interface BoundedAiAnalysisResult {
  analysisType: 'passage' | 'comparison' | 'evidence_explanation' | 'synthesis' | 'gap_identification';
  projectQuestion: string;
  timestamp: string;
  evidenceUsed: Array<{
    passageId: string;
    author: string;
    work: string;
    locator: string;
    verbatimExcerpt: string;
    verificationStatus: VerificationStatus;
  }>;
  claimsSupported: Array<{
    claim: string;
    supportStrength: 'strong' | 'moderate' | 'weak';
    groundedInPassageIds: string[];
  }>;
  unresolvedQuestions: string[];
  claimsRequiringVerification: string[];
  scholarlySynthesis: string;
  methodologicalLimitations: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// OPENALEX, CROSSREF & SCITE SCHOLARLY LITERATURE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface SciteTallies {
  doi: string;
  total: number;
  supporting: number;
  mentioning: number;
  contrasting: number;
  unclassified: number;
  citingPublications: number;
  disputeRatio: number; // contrasting / (supporting + contrasting)
  sentimentBalance: 'strongly_supported' | 'supported' | 'neutral' | 'debated_or_disputed' | 'untested';
}

export interface CrossrefWork {
  doi: string;
  title: string;
  authors: string[];
  containerTitle: string;
  volume?: string;
  issue?: string;
  page?: string;
  publishedYear: number | null;
  publisher?: string;
  referenceCount: number;
  isReferencedByCount: number;
  url?: string;
  issn?: string;
  isbn?: string;
  type?: string;
}

export interface OpenAlexWork {
  id: string;
  doi?: string;
  rawDoi?: string;
  title: string;
  publicationYear: number | null;
  publicationDate?: string;
  hostVenue?: string;
  journalIssn?: string;
  citedByCount: number;
  isOa: boolean;
  oaStatus?: string;
  oaUrl?: string;
  landingPageUrl?: string;
  abstract?: string;
  authors: Array<{
    name: string;
    id?: string;
    institution?: string;
  }>;
  concepts: Array<{
    name: string;
    score: number;
    level: number;
  }>;
  referencedWorksCount: number;
  type?: string;
}

export interface VerifiedSecondaryLiterature {
  id: string;
  projectId: string;
  doi: string;
  title: string;
  authors: string[];
  year: number | null;
  venue: string;
  abstract?: string;
  isOa?: boolean;
  oaUrl?: string;
  landingUrl?: string;
  crossrefData?: CrossrefWork;
  openAlexData?: OpenAlexWork;
  sciteTallies?: SciteTallies;
  formattedCitation?: string;
  linkedPassageIds: string[];
  linkedEvidenceCardIds: string[];
  researcherNotes?: string;
  responsibleVerdict: 'highly_credible' | 'credible_neutral' | 'debated_caution' | 'insufficient_records';
  createdAt: string;
  updatedAt: string;
}

export interface ResponsibleResearchAudit {
  queriedValue: string;
  canonicalDoi: string;
  title: string;
  authors: string[];
  year: number | null;
  venue: string;
  crossref: CrossrefWork | null;
  openAlex: OpenAlexWork | null;
  scite: SciteTallies | null;
  verdict: 'highly_credible' | 'credible_neutral' | 'debated_caution' | 'insufficient_records';
  auditNotes: string[];
  auditedAt: string;
}

export interface ProjectPacket {
  version: '1.0.0';
  exportedAt: string;
  project: ResearchProject;
  sources: SourceRecord[];
  passages: Passage[];
  evidenceCards: EvidenceCard[];
  secondaryLiterature?: VerifiedSecondaryLiterature[];
  metadata: {
    totalSources: number;
    totalPassages: number;
    totalEvidenceCards: number;
    totalSecondaryLiterature?: number;
    attestedCount: number;
    provisionalCount: number;
    discoveryCount: number;
  };
}
