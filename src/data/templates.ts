export const CSV_SOURCE_TEMPLATE = `author,authorTradition,workTitle,originalLanguage,startYear,endYear,certainty,authenticityStatus,sourceProvider,edition,clavisId,tlgId,ctsUrn,bibliographyCitation,verificationStatus,researcherNotes
"Augustinus Hipponensis","Latin/North African","De civitate Dei","la",413,426,"exact","authentic","CCSL","CCSL 47-48 (ed. B. Dombart & A. Kalb, 1955)","CPL 0474","","urn:cts:latinLit:stoa0040.stoa014.opp-lat1","Augustinus. De civitate Dei. CCSL 47-48. Turnhout: Brepols, 1955.","attested","Primary source for the psychology of disordered will and original sin."
"Athanasius Alexandrinus","Alexandrian","De Incarnatione Verbi","grc",328,335,"probable","authentic","SC","SC 199 (ed. Ch. Kannengiesser, 1973)","CPG 2091","TLG 2035.002","","Athanase. Sur l'incarnation du Verbe. SC 199. Paris: Cerf, 1973.","attested","Classic text for theosis and Logos Christology."`;

export const CSV_PASSAGE_TEMPLATE = `sourceId,passageLocator,originalText,translationText,translationLanguage,concepts,verificationStatus,notes
"src-augustine-civ","XIV.16","Quisquis autem carnalem concupiscentiam dicit bonum esse naturae...","Whoever says that carnal concupiscence is a natural good...","en","Concupiscentia / Desire;Soul / Psyche;Peccatum / Sin","attested","Examined in relation to voluntas in Paradise."
"src-athanasius-inc","54.3","Αὐτὸς γὰρ ἐνηνθρώπησεν, ἵνα ἡμεῖς θεοποιηθῶμεν...","For He was made human that we might be made god...","en","Theosis / Deification;Logos;Caro / Flesh","attested","Core axiom of early Greek deification theology."`;

export const JSON_PACKET_TEMPLATE = {
  version: "1.0.0",
  exportedAt: "2026-08-25T00:00:00.000Z",
  project: {
    id: "project-custom-sample",
    title: "Genealogy of Ascetic Askesis in Desert Monasticism",
    subtitle: "Evagrian and Cassianic lineages of apatheia and the passions",
    researchQuestion: "How did Evagrius Ponticus' Greek eight logismoi translate into John Cassian's Latin eight principal vices?",
    methodologyNote: "Philological collation of Greek (SC 170) and Latin (CSEL 17) critical editions.",
    language: "en",
    dateRange: {
      startYear: 345,
      endYear: 435
    },
    createdAt: "2026-08-25T00:00:00.000Z",
    updatedAt: "2026-08-25T00:00:00.000Z"
  },
  sources: [],
  passages: [],
  evidenceCards: [],
  metadata: {
    totalSources: 0,
    totalPassages: 0,
    totalEvidenceCards: 0,
    attestedCount: 0,
    provisionalCount: 0,
    discoveryCount: 0
  }
};
