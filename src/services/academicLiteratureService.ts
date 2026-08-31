/**
 * Academic Literature & Responsible Research Service
 * Integrates:
 * 1. OpenAlex API (250M+ open catalog, OA links, abstract reconstruction, concepts)
 * 2. Crossref API (Official DOI metadata, citation formatting, publisher records)
 * 3. Scite.ai API (Smart Citations: supporting, mentioning, and contrasting tallies)
 */

import { CrossrefWork, OpenAlexWork, SciteTallies, VerifiedSecondaryLiterature, ResponsibleResearchAudit } from '../types';

const POLITE_EMAIL = 'patristic.researcher@atlas.academic';
const OPENALEX_API_BASE = 'https://api.openalex.org';
const CROSSREF_API_BASE = 'https://api.crossref.org';
const SCITE_API_BASE = 'https://api.scite.ai';

// Clean DOI helper (removes URL prefixes, trailing punctuation, whitespace)
export function cleanDoi(raw: string): string {
  if (!raw) return '';
  let doi = raw.trim();
  doi = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
  doi = doi.replace(/^doi:\s*/i, '');
  doi = doi.replace(/[.,;:]+$/, '');
  return doi.trim();
}

/**
 * Reconstructs full abstract text from OpenAlex inverted index
 */
export function reconstructAbstractFromInvertedIndex(invertedIndex?: Record<string, number[]> | null): string {
  if (!invertedIndex || typeof invertedIndex !== 'object') return '';
  try {
    const wordEntries: Array<[string, number]> = [];
    for (const [word, positions] of Object.entries(invertedIndex)) {
      for (const pos of positions) {
        wordEntries.push([word, pos]);
      }
    }
    wordEntries.sort((a, b) => a[1] - b[1]);
    return wordEntries.map(e => e[0]).join(' ');
  } catch {
    return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. OPENALEX API CLIENT
// ─────────────────────────────────────────────────────────────────────────────

export interface OpenAlexSearchResponse {
  results: OpenAlexWork[];
  totalCount: number;
}

export async function searchOpenAlex(
  query: string,
  options: { perPage?: number; filter?: string; cursor?: string } = {}
): Promise<OpenAlexSearchResponse> {
  const perPage = options.perPage || 10;
  const url = new URL(`${OPENALEX_API_BASE}/works`);
  url.searchParams.set('search', query);
  url.searchParams.set('per-page', String(perPage));
  url.searchParams.set('mailto', POLITE_EMAIL);
  if (options.filter) {
    url.searchParams.set('filter', options.filter);
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`OpenAlex API error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawResults = data.results || [];

    const results: OpenAlexWork[] = rawResults.map((item: any) => {
      const doi = cleanDoi(item.doi || '');
      const abstractText = reconstructAbstractFromInvertedIndex(item.abstract_inverted_index);
      
      const authors = (item.authorships || []).map((auth: any) => ({
        name: auth.author?.display_name || 'Unknown Author',
        id: auth.author?.id,
        institution: auth.institutions?.[0]?.display_name
      }));

      const concepts = (item.concepts || []).map((c: any) => ({
        name: c.display_name,
        score: c.score,
        level: c.level
      }));

      return {
        id: item.id,
        doi: doi ? `10.1093/${doi.split('10.1093/')[1] || doi}` : undefined,
        rawDoi: doi,
        title: item.title || item.display_name || 'Untitled Document',
        publicationYear: item.publication_year || null,
        publicationDate: item.publication_date,
        hostVenue: item.primary_location?.source?.display_name || item.host_venue?.display_name || 'Academic Venue',
        journalIssn: item.primary_location?.source?.issn_l,
        citedByCount: item.cited_by_count || 0,
        isOa: item.open_access?.is_oa ?? false,
        oaStatus: item.open_access?.oa_status,
        oaUrl: item.open_access?.oa_url || item.primary_location?.pdf_url,
        landingPageUrl: item.primary_location?.landing_page_url || (doi ? `https://doi.org/${doi}` : undefined),
        abstract: abstractText,
        authors,
        concepts,
        referencedWorksCount: item.referenced_works?.length || 0,
        type: item.type
      };
    });

    return {
      results,
      totalCount: data.meta?.count || results.length
    };
  } catch (err: any) {
    console.error('searchOpenAlex failed:', err);
    throw new Error(`OpenAlex request failed: ${err.message || err}`);
  }
}

export async function fetchOpenAlexByDoi(doi: string): Promise<OpenAlexWork | null> {
  const cDoi = cleanDoi(doi);
  if (!cDoi) return null;

  try {
    const url = `${OPENALEX_API_BASE}/works/https://doi.org/${cDoi}?mailto=${POLITE_EMAIL}`;
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) return null;

    const item = await response.json();
    const abstractText = reconstructAbstractFromInvertedIndex(item.abstract_inverted_index);

    return {
      id: item.id,
      doi: cDoi,
      rawDoi: cDoi,
      title: item.title || item.display_name || 'Untitled Document',
      publicationYear: item.publication_year || null,
      publicationDate: item.publication_date,
      hostVenue: item.primary_location?.source?.display_name || item.host_venue?.display_name || 'Academic Venue',
      journalIssn: item.primary_location?.source?.issn_l,
      citedByCount: item.cited_by_count || 0,
      isOa: item.open_access?.is_oa ?? false,
      oaStatus: item.open_access?.oa_status,
      oaUrl: item.open_access?.oa_url || item.primary_location?.pdf_url,
      landingPageUrl: item.primary_location?.landing_page_url || `https://doi.org/${cDoi}`,
      abstract: abstractText,
      authors: (item.authorships || []).map((auth: any) => ({
        name: auth.author?.display_name || 'Unknown Author',
        id: auth.author?.id,
        institution: auth.institutions?.[0]?.display_name
      })),
      concepts: (item.concepts || []).map((c: any) => ({
        name: c.display_name,
        score: c.score,
        level: c.level
      })),
      referencedWorksCount: item.referenced_works?.length || 0,
      type: item.type
    };
  } catch (err) {
    console.warn(`fetchOpenAlexByDoi error for ${doi}:`, err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CROSSREF API CLIENT
// ─────────────────────────────────────────────────────────────────────────────

export interface CrossrefSearchResponse {
  results: CrossrefWork[];
  totalResults: number;
}

export async function searchCrossref(
  query: string,
  rows: number = 10
): Promise<CrossrefSearchResponse> {
  const url = new URL(`${CROSSREF_API_BASE}/works`);
  url.searchParams.set('query', query);
  url.searchParams.set('rows', String(rows));
  url.searchParams.set('mailto', POLITE_EMAIL);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Crossref API error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const items = data.message?.items || [];

    const results: CrossrefWork[] = items.map((item: any) => {
      const doi = cleanDoi(item.DOI || '');
      const authors = (item.author || []).map((a: any) => {
        if (a.name) return a.name;
        if (a.given && a.family) return `${a.given} ${a.family}`;
        return a.family || a.given || 'Unknown Author';
      });

      const publishedYear = 
        item.published?.['date-parts']?.[0]?.[0] || 
        item['published-print']?.['date-parts']?.[0]?.[0] || 
        item['published-online']?.['date-parts']?.[0]?.[0] || 
        item.created?.['date-parts']?.[0]?.[0] || 
        null;

      return {
        doi,
        title: Array.isArray(item.title) ? item.title[0] : (item.title || 'Untitled Work'),
        authors,
        containerTitle: Array.isArray(item['container-title']) ? item['container-title'][0] : (item['container-title'] || ''),
        volume: item.volume,
        issue: item.issue,
        page: item.page,
        publishedYear,
        publisher: item.publisher,
        referenceCount: item['reference-count'] || 0,
        isReferencedByCount: item['is-referenced-by-count'] || 0,
        url: item.URL || (doi ? `https://doi.org/${doi}` : undefined),
        issn: Array.isArray(item.ISSN) ? item.ISSN[0] : item.ISSN,
        isbn: Array.isArray(item.ISBN) ? item.ISBN[0] : item.ISBN,
        type: item.type
      };
    });

    return {
      results,
      totalResults: data.message?.['total-results'] || results.length
    };
  } catch (err: any) {
    console.error('searchCrossref failed:', err);
    throw new Error(`Crossref request failed: ${err.message || err}`);
  }
}

export async function fetchCrossrefByDoi(doi: string): Promise<CrossrefWork | null> {
  const cDoi = cleanDoi(doi);
  if (!cDoi) return null;

  try {
    const url = `${CROSSREF_API_BASE}/works/${encodeURIComponent(cDoi)}?mailto=${POLITE_EMAIL}`;
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) return null;

    const data = await response.json();
    const item = data.message;
    if (!item) return null;

    const authors = (item.author || []).map((a: any) => {
      if (a.name) return a.name;
      if (a.given && a.family) return `${a.given} ${a.family}`;
      return a.family || a.given || 'Unknown Author';
    });

    const publishedYear = 
      item.published?.['date-parts']?.[0]?.[0] || 
      item['published-print']?.['date-parts']?.[0]?.[0] || 
      item['published-online']?.['date-parts']?.[0]?.[0] || 
      null;

    return {
      doi: cDoi,
      title: Array.isArray(item.title) ? item.title[0] : (item.title || 'Untitled Work'),
      authors,
      containerTitle: Array.isArray(item['container-title']) ? item['container-title'][0] : (item['container-title'] || ''),
      volume: item.volume,
      issue: item.issue,
      page: item.page,
      publishedYear,
      publisher: item.publisher,
      referenceCount: item['reference-count'] || 0,
      isReferencedByCount: item['is-referenced-by-count'] || 0,
      url: item.URL || `https://doi.org/${cDoi}`,
      issn: Array.isArray(item.ISSN) ? item.ISSN[0] : item.ISSN,
      isbn: Array.isArray(item.ISBN) ? item.ISBN[0] : item.ISBN,
      type: item.type
    };
  } catch (err) {
    console.warn(`fetchCrossrefByDoi error for ${doi}:`, err);
    return null;
  }
}

/**
 * Formats a clean standard citation (APA / BibTeX / Chicago) from Crossref
 */
export async function fetchFormattedCitation(
  doi: string,
  style: 'apa' | 'bibtex' | 'chicago-author-date' = 'apa'
): Promise<string> {
  const cDoi = cleanDoi(doi);
  if (!cDoi) return '';

  const acceptHeader = style === 'bibtex' 
    ? 'application/x-bibtex' 
    : `text/x-bibliography; style=${style}`;

  try {
    const response = await fetch(`https://doi.org/${encodeURIComponent(cDoi)}`, {
      headers: {
        'Accept': acceptHeader
      }
    });

    if (response.ok) {
      const text = await response.text();
      return text.trim();
    }
  } catch {
    // fallback to local generator
  }

  // Local fallback citation builder
  const work = await fetchCrossrefByDoi(cDoi);
  if (!work) return `https://doi.org/${cDoi}`;

  const authorsStr = work.authors.length > 0 ? work.authors.join(', ') : 'Unknown Author';
  const yearStr = work.publishedYear ? ` (${work.publishedYear}).` : '.';
  const titleStr = ` "${work.title}."`;
  const containerStr = work.containerTitle ? ` *${work.containerTitle}*` : '';
  const volStr = work.volume ? ` ${work.volume}` : '';
  const pageStr = work.page ? `: ${work.page}` : '';
  const doiStr = ` https://doi.org/${work.doi}`;

  return `${authorsStr}${yearStr}${titleStr}${containerStr}${volStr}${pageStr}.${doiStr}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SCITE.AI SMART CITATIONS API CLIENT
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchSciteTallies(doi: string): Promise<SciteTallies | null> {
  const cDoi = cleanDoi(doi);
  if (!cDoi) return null;

  try {
    const url = `${SCITE_API_BASE}/tallies/${encodeURIComponent(cDoi)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Not yet indexed in scite database
        return {
          doi: cDoi,
          total: 0,
          supporting: 0,
          mentioning: 0,
          contrasting: 0,
          unclassified: 0,
          citingPublications: 0,
          disputeRatio: 0,
          sentimentBalance: 'untested'
        };
      }
      return null;
    }

    const data = await response.json();
    const total = data.total || 0;
    const supporting = data.supporting || 0;
    const mentioning = data.mentioning || 0;
    const contrasting = data.contrasting || 0;
    const unclassified = data.unclassified || 0;
    const citingPublications = data.citingPublications || 0;

    // Calculate dispute and sentiment balance
    const classifiedTotal = supporting + contrasting;
    const disputeRatio = classifiedTotal > 0 ? contrasting / classifiedTotal : 0;

    let sentimentBalance: SciteTallies['sentimentBalance'] = 'untested';
    if (total === 0) {
      sentimentBalance = 'untested';
    } else if (contrasting > 0 && disputeRatio >= 0.2) {
      sentimentBalance = 'debated_or_disputed';
    } else if (supporting >= 3 && contrasting === 0) {
      sentimentBalance = 'strongly_supported';
    } else if (supporting > 0) {
      sentimentBalance = 'supported';
    } else {
      sentimentBalance = 'neutral';
    }

    return {
      doi: cDoi,
      total,
      supporting,
      mentioning,
      contrasting,
      unclassified,
      citingPublications,
      disputeRatio,
      sentimentBalance
    };
  } catch (err) {
    console.warn(`fetchSciteTallies error for ${doi}:`, err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TRIPLE-CHECK RESPONSIBLE AUDIT (OPENALEX + CROSSREF + SCITE)
// ─────────────────────────────────────────────────────────────────────────────

export async function verifyPaperTripleCheck(
  doiOrQuery: string
): Promise<ResponsibleResearchAudit> {
  const cDoi = cleanDoi(doiOrQuery);
  const isDoi = cDoi.includes('/') && cDoi.length > 5;

  let crossrefData: CrossrefWork | null = null;
  let openAlexData: OpenAlexWork | null = null;
  let sciteData: SciteTallies | null = null;

  if (isDoi) {
    const [crRes, oaRes, scRes] = await Promise.allSettled([
      fetchCrossrefByDoi(cDoi),
      fetchOpenAlexByDoi(cDoi),
      fetchSciteTallies(cDoi)
    ]);

    if (crRes.status === 'fulfilled') crossrefData = crRes.value;
    if (oaRes.status === 'fulfilled') openAlexData = oaRes.value;
    if (scRes.status === 'fulfilled') sciteData = scRes.value;
  } else {
    // Text search query: find best matching paper on Crossref & OpenAlex
    const [crSearch, oaSearch] = await Promise.allSettled([
      searchCrossref(doiOrQuery, 1),
      searchOpenAlex(doiOrQuery, { perPage: 1 })
    ]);

    if (crSearch.status === 'fulfilled' && crSearch.value.results.length > 0) {
      crossrefData = crSearch.value.results[0];
    }
    if (oaSearch.status === 'fulfilled' && oaSearch.value.results.length > 0) {
      openAlexData = oaSearch.value.results[0];
    }

    const foundDoi = crossrefData?.doi || openAlexData?.rawDoi;
    if (foundDoi) {
      try {
        sciteData = await fetchSciteTallies(foundDoi);
      } catch {
        // ignore
      }
    }
  }

  // Formulate responsible research evaluation
  const effectiveDoi = crossrefData?.doi || openAlexData?.rawDoi || cDoi;
  const title = crossrefData?.title || openAlexData?.title || doiOrQuery;
  const authors = crossrefData?.authors || openAlexData?.authors.map(a => a.name) || [];
  const year = crossrefData?.publishedYear || openAlexData?.publicationYear || null;
  const venue = crossrefData?.containerTitle || openAlexData?.hostVenue || 'Scholarly Publication';

  // Audit flags
  const flags: string[] = [];
  let verdict: 'highly_credible' | 'credible_neutral' | 'debated_caution' | 'insufficient_records' = 'credible_neutral';

  if (!crossrefData && !openAlexData) {
    verdict = 'insufficient_records';
    flags.push('No authoritative DOI metadata located in Crossref or OpenAlex catalogue. Verify citation authenticity manually.');
  } else {
    if (sciteData) {
      if (sciteData.contrasting > 0) {
        flags.push(`⚠️ Controversy Flag: Scite records ${sciteData.contrasting} contrasting/disputing citation(s). Scholars have contested claims in this work.`);
        if (sciteData.disputeRatio >= 0.25) {
          verdict = 'debated_caution';
        }
      }
      if (sciteData.supporting >= 3) {
        flags.push(`✅ Strong Peer Endorsement: Scite records ${sciteData.supporting} supporting citations confirming empirical or hermeneutic claims.`);
        if (sciteData.contrasting === 0) {
          verdict = 'highly_credible';
        }
      }
    }

    if (openAlexData?.isOa) {
      flags.push('🔓 Open Access Available: Full-text PDF or repository copy is freely accessible.');
    }
  }

  return {
    queriedValue: doiOrQuery,
    canonicalDoi: effectiveDoi,
    title,
    authors,
    year,
    venue,
    crossref: crossrefData,
    openAlex: openAlexData,
    scite: sciteData,
    verdict,
    auditNotes: flags,
    auditedAt: new Date().toISOString()
  };
}

export async function searchOpenAlexWorks(
  query: string,
  limit: number = 6
): Promise<OpenAlexWork[]> {
  const resp = await searchOpenAlex(query, { perPage: limit });
  return resp.results;
}

export function generateChicagoCitation(
  authors: string[],
  title: string,
  venue: string,
  year: number | null,
  doi?: string
): string {
  const authorPart = authors.length > 0 ? authors.join(', ') : 'Unknown Author';
  const yearPart = year ? ` (${year}).` : '.';
  const titlePart = ` "${title}."`;
  const venuePart = venue ? ` *${venue}*.` : '';
  const doiPart = doi ? ` https://doi.org/${cleanDoi(doi)}` : '';
  return `${authorPart}${yearPart}${titlePart}${venuePart}${doiPart}`;
}

export interface SeminalPaperPreset {
  doi: string;
  title: string;
  authors: string[];
  year: number;
  topic: string;
}

export const PATRISTIC_SEMINAL_PAPERS: SeminalPaperPreset[] = [
  {
    doi: '10.1093/0199265216.001.0001',
    title: 'The Doctrine of Deification in the Greek Patristic Tradition',
    authors: ['Norman Russell'],
    year: 2004,
    topic: 'Theosis & Greek Fathers'
  },
  {
    doi: '10.7312/brow14400',
    title: 'The Body and Society: Men, Women, and Sexual Renunciation in Early Christianity',
    authors: ['Peter Brown'],
    year: 1988,
    topic: 'Asceticism & Flesh'
  },
  {
    doi: '10.4324/9781315243177',
    title: 'St Augustine of Hippo: Life and Controversies',
    authors: ['Gerald Bonner'],
    year: 1986,
    topic: 'Augustine & Pelagianism'
  },
  {
    doi: '10.1093/acprof:oso/9780199673940.001.0001',
    title: 'Maximus the Confessor: Jesus Christ and the Transfiguration of the World',
    authors: ['Paul M. Blowers'],
    year: 2016,
    topic: 'Maximus & Christology'
  }
];

/**
 * Pre-curated Patristic and Classical Theology scholarly search suggestions
 */
export const CURATED_ACADEMIC_SEARCH_PRESETS = [
  {
    id: 'concupiscence-augustine',
    labelEn: 'Augustine Concupiscence & Pelagius (JECS / Vigiliae Christianae)',
    labelZh: '奧古斯丁情慾論與反伯拉糾論爭（JECS／VC）',
    query: 'Augustine concupiscentia Julian of Eclanum grace baptism'
  },
  {
    id: 'theosis-irenaeus',
    labelEn: 'Irenaeus Recapitulation & Deification (Studia Patristica)',
    labelZh: '愛任紐總括萬有與神化論（Studia Patristica）',
    query: 'Irenaeus recapitulation deification anakephalaiosis divine exchange'
  },
  {
    id: 'athanasius-incarnation',
    labelEn: 'Athanasius De Incarnatione Divine Exchange formula',
    labelZh: '亞他那修《論道成肉身》神人交換公理',
    query: 'Athanasius De Incarnatione 54.3 theopoiesis soteriology'
  },
  {
    id: 'tertullian-flesh',
    labelEn: 'Tertullian De carne Christi Christology & Flesh',
    labelZh: '戴爾都良《論基督之肉身》基督論肉身觀',
    query: 'Tertullian De carne Christi flesh concupiscence peccatum'
  },
  {
    id: 'privatio-boni',
    labelEn: 'Privatio Boni & Theodicy in Patristic Thought',
    labelZh: '教父神學中的「善之匱乏」與神義論',
    query: 'privatio boni Augustine evil deficiency Neo-Platonic patristic'
  }
];
