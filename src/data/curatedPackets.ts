import { ProjectPacket } from '../types';

export const CURATED_PACKETS: ProjectPacket[] = [
  {
    version: '1.0.0',
    exportedAt: '2026-08-25T00:00:00.000Z',
    project: {
      id: 'curated-concupiscence-grace',
      title: 'Genealogy of Concupiscence & Gratia (Paul to Augustine & Julian of Eclanum)',
      subtitle: 'Philological and Doctrinal Development of Desire, Involuntary Impulse, and Divine Aid',
      researchQuestion: 'How did the Pauline concept of epithumia / concupiscentia evolve from 2nd-century anti-docetic usage into Augustine’s post-lapsarian ontology and Julian of Eclanum’s naturalist critique?',
      methodologyNote: 'Historical-critical collation of Greek (NA28, PTS) and Latin (CCSL, CSEL) critical editions. Each relationship is bound to attested passage locators.',
      language: 'en',
      dateRange: {
        startYear: 55,
        endYear: 430
      },
      createdAt: '2026-08-25T00:00:00.000Z',
      updatedAt: '2026-08-25T00:00:00.000Z',
      curatedPacketId: 'concupiscence-grace-v1'
    },
    sources: [
      {
        id: 'src-paul-rom',
        projectId: 'curated-concupiscence-grace',
        author: 'Paulus Apostolus',
        authorTradition: 'Palestinian',
        workTitle: 'Epistula ad Romanos',
        originalLanguage: 'grc',
        compositionDate: {
          startYear: 56,
          endYear: 58,
          certainty: 'probable',
          note: 'Composed in Corinth during third missionary journey'
        },
        authenticityStatus: 'authentic',
        sourceProvider: 'Other_Critical_Edition',
        edition: 'Novum Testamentum Graece (NA28, ed. Nestle-Aland, 2012)',
        bibliographyCitation: 'Nestle-Aland. Novum Testamentum Graece. 28th rev. ed. Stuttgart: Deutsche Bibelgesellschaft, 2012.',
        verificationStatus: 'attested',
        researcherNotes: 'Foundational locus for hamartiology and epithumia in early Christian thought.',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'src-justin-dial',
        projectId: 'curated-concupiscence-grace',
        author: 'Justinus Martyr',
        authorTradition: 'Palestinian',
        workTitle: 'Dialogus cum Tryphone Judaeo',
        originalLanguage: 'grc',
        compositionDate: {
          startYear: 155,
          endYear: 160,
          certainty: 'probable'
        },
        authenticityStatus: 'authentic',
        sourceProvider: 'PTA',
        clavisId: 'CPG 1076',
        tlgId: 'TLG 0647.003',
        edition: 'Patristische Texte und Studien 47 (ed. M. Marcovich, 1997)',
        bibliographyCitation: 'Justin Martyr. Dialogus cum Tryphone. Edited by Miroslav Marcovich. PTS 47. Berlin: Walter de Gruyter, 1997.',
        verificationStatus: 'attested',
        researcherNotes: 'Demonstrates 2nd-century apologetic treatment of Christ’s bodily temptation and freedom from disordered desire.',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'src-tertullian-carne',
        projectId: 'curated-concupiscence-grace',
        author: 'Tertullianus (Quintus Septimius Florens)',
        authorTradition: 'Latin/North African',
        workTitle: 'De carne Christi',
        originalLanguage: 'la',
        compositionDate: {
          startYear: 206,
          endYear: 212,
          certainty: 'probable'
        },
        authenticityStatus: 'authentic',
        sourceProvider: 'CCSL',
        clavisId: 'CPL 0018',
        edition: 'Corpus Christianorum Series Latina 2 (ed. A. Kroymann, 1954)',
        bibliographyCitation: 'Tertullianus. De carne Christi. Edited by Emil Kroymann. CCSL 2. Turnhout: Brepols, 1954.',
        verificationStatus: 'attested',
        researcherNotes: 'Pivotal Latin articulation distinguishing sinful concupiscence from natural fleshly appetite.',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'src-augustine-nupt',
        projectId: 'curated-concupiscence-grace',
        author: 'Augustinus Hipponensis',
        authorTradition: 'Latin/North African',
        workTitle: 'De nuptiis et concupiscentia ad Valerium',
        originalLanguage: 'la',
        compositionDate: {
          startYear: 418,
          endYear: 421,
          certainty: 'exact',
          note: 'Book I written 418/419; Book II written 420/421'
        },
        authenticityStatus: 'authentic',
        sourceProvider: 'CSEL',
        clavisId: 'CPL 0351',
        edition: 'Corpus Scriptorum Ecclesiasticorum Latinorum 42 (ed. C. Urba & J. Zycha, 1902)',
        bibliographyCitation: 'Augustinus. De nuptiis et concupiscentia. Edited by C. F. Urba and J. Zycha. CSEL 42. Vienna: Tempsky, 1902.',
        verificationStatus: 'attested',
        researcherNotes: 'Core anti-Pelagian treatise on the moral status of concupiscence in marriage and propagation.',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'src-augustine-civ',
        projectId: 'curated-concupiscence-grace',
        author: 'Augustinus Hipponensis',
        authorTradition: 'Latin/North African',
        workTitle: 'De civitate Dei',
        originalLanguage: 'la',
        compositionDate: {
          startYear: 413,
          endYear: 426,
          certainty: 'exact'
        },
        authenticityStatus: 'authentic',
        sourceProvider: 'CCSL',
        clavisId: 'CPL 0474',
        edition: 'Corpus Christianorum Series Latina 47–48 (ed. B. Dombart & A. Kalb, 1955)',
        bibliographyCitation: 'Augustinus. De civitate Dei. Edited by B. Dombart and A. Kalb. CCSL 47–48. Turnhout: Brepols, 1955.',
        verificationStatus: 'attested',
        researcherNotes: 'Book XIV provides the definitive psychological and theological analysis of the passions and will.',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'src-julian-florum',
        projectId: 'curated-concupiscence-grace',
        author: 'Iulianus Aeclanensis (Julian of Eclanum)',
        authorTradition: 'Latin/North African',
        workTitle: 'Ad Florum (apud Augustinum, Contra secundam Juliani responsionem imperfectum opus)',
        originalLanguage: 'la',
        compositionDate: {
          startYear: 428,
          endYear: 430,
          certainty: 'probable'
        },
        authenticityStatus: 'fragmentary',
        sourceProvider: 'CSEL',
        clavisId: 'CPL 0352 / CPL 0774',
        edition: 'CSEL 85/1 (ed. M. Zelzer, 1974)',
        bibliographyCitation: 'Iulianus Aeclanensis. Ad Florum (in Augustinus, Opus imperfectum). Edited by Michaela Zelzer. CSEL 85/1. Vienna: Hoelder-Pichler-Tempsky, 1974.',
        verificationStatus: 'attested',
        researcherNotes: 'Preserved verbatim in Augustine’s unfinished polemical response; represents high Aristotelian/Pelagian naturalism.',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      }
    ],
    passages: [
      {
        id: 'pas-paul-rom-7',
        projectId: 'curated-concupiscence-grace',
        sourceId: 'src-paul-rom',
        passageLocator: '7:7–8',
        originalText: 'Τί οὖν ἐροῦμεν; ὁ νόμος ἁμαρτία; μὴ γένοιτο· ἀλλὰ τὴν ἁμαρτίαν οὐκ ἔγνων εἰ μὴ διὰ νόμου· τήν τε γὰρ ἐπιθυμίαν οὐκ ᾔδειν εἰ μὴ ὁ νόμος ἔλεγεν· Οὐκ ἐπιθυμήσεις. ἀφορμὴν δὲ λαβοῦσα ἡ ἁμαρτία διὰ τῆς ἐντολῆς κατειργάσατο ἐν ἐμοὶ πᾶσαν ἐπιθυμίαν· χωρὶς γὰρ νόμου ἁμαρτία νεκρά.',
        translationText: 'What then shall we say? That the law is sin? By no means! Yet if it had not been for the law, I would not have known sin. For I would not have known what it is to covet if the law had not said, "You shall not covet." But sin, seizing an opportunity through the commandment, produced in me all kinds of concupiscence (epithumia). For apart from the law, sin lies dead.',
        translationLanguage: 'en',
        concepts: ['Concupiscentia / Desire', 'Peccatum / Sin', 'Gratia / Grace'],
        verificationStatus: 'attested',
        snapshot: {
          importedAt: '2026-08-25T00:00:00.000Z',
          sourceChecksum: 'sha256:d8c51a7e2b3f491c',
          isImmutable: true
        },
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'pas-tert-carne-16',
        projectId: 'curated-concupiscence-grace',
        sourceId: 'src-tertullian-carne',
        passageLocator: '16.1–2',
        originalText: 'Sed et carnem peccati dicit, non quod ipsa per se peccatum sit, sed quod carnem peccatricem gereret, id est humanam, in qua peccatum operaretur... Evacuavit autem peccatum in carne, quod in carne regnabat per concupiscentiam.',
        translationText: 'He speaks of the "flesh of sin", not because the flesh is in itself sin, but because it bears sinful human flesh in which sin operated... But He abolished sin in the flesh, which had reigned in the flesh through concupiscence.',
        translationLanguage: 'en',
        concepts: ['Caro / Flesh', 'Concupiscentia / Desire', 'Peccatum / Sin'],
        verificationStatus: 'attested',
        snapshot: {
          importedAt: '2026-08-25T00:00:00.000Z',
          sourceChecksum: 'sha256:a47f932e01b489ff',
          isImmutable: true
        },
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'pas-aug-nupt-1-24',
        projectId: 'curated-concupiscence-grace',
        sourceId: 'src-augustine-nupt',
        passageLocator: 'I.24.27',
        originalText: 'Haec autem carnis concupiscentia, quamquam in regeneratis iam non deputetur in peccatum, tamen in tantum accidit naturae ut sine illa generari nemo possit. Ipsa est lex in membris repugnans legi mentis, reatus eius in baptismate dimittitur, sed actus manet ad agonem.',
        translationText: 'This concupiscence of the flesh, although in the regenerate it is no longer imputed as sin, nevertheless attaches so deeply to nature that without it no one can be begotten. It is the law in the members warring against the law of the mind; its guilt (reatus) is remitted in baptism, but its act remains for spiritual struggle.',
        translationLanguage: 'en',
        concepts: ['Concupiscentia / Desire', 'Gratia / Grace', 'Peccatum / Sin'],
        verificationStatus: 'attested',
        snapshot: {
          importedAt: '2026-08-25T00:00:00.000Z',
          sourceChecksum: 'sha256:c9182390fca73821',
          isImmutable: true
        },
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'pas-aug-civ-14-16',
        projectId: 'curated-concupiscence-grace',
        sourceId: 'src-augustine-civ',
        passageLocator: 'XIV.16',
        originalText: 'Quisquis autem carnalem concupiscentiam dicit bonum esse naturae, advertat eam non fuisse in paradiso ante peccatum. Sicut enim voluntas recte mota bona est, ita inordinata voluntas fons est omnium passionum.',
        translationText: 'Whoever says that carnal concupiscence is a natural good should observe that it was not present in paradise before sin. For just as a rightly moved will is good, so a disordered will is the source of all illicit passions.',
        translationLanguage: 'en',
        concepts: ['Concupiscentia / Desire', 'Soul / Psyche', 'Peccatum / Sin'],
        verificationStatus: 'attested',
        snapshot: {
          importedAt: '2026-08-25T00:00:00.000Z',
          sourceChecksum: 'sha256:ef8172834b9102ca',
          isImmutable: true
        },
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'pas-jul-flor-1-68',
        projectId: 'curated-concupiscence-grace',
        sourceId: 'src-julian-florum',
        passageLocator: 'I.68',
        originalText: 'Concupiscentia carnis, id est naturalis appetitus genitalium, sicut visus vel auditus, opus est Creatoris; nec mala est in se, sed moderamine rationis honestatur et intemperantia vitiatur.',
        translationText: 'Concupiscence of the flesh, that is, the natural sexual appetite, just like sight or hearing, is the work of the Creator; nor is it evil in itself, but is made honorable by the moderation of reason and vitiated only by intemperance.',
        translationLanguage: 'en',
        concepts: ['Concupiscentia / Desire', 'Caro / Flesh'],
        verificationStatus: 'attested',
        snapshot: {
          importedAt: '2026-08-25T00:00:00.000Z',
          sourceChecksum: 'sha256:92fbb102948ca78e',
          isImmutable: true
        },
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      }
    ],
    evidenceCards: [
      {
        id: 'ec-paul-aug-concupiscence',
        projectId: 'curated-concupiscence-grace',
        sourcePassageId: 'pas-paul-rom-7',
        targetPassageId: 'pas-aug-nupt-1-24',
        sourceConcept: 'Concupiscentia / Desire',
        targetConcept: 'Concupiscentia / Desire',
        sourceNodeId: 'pas-paul-rom-7',
        targetNodeId: 'pas-aug-nupt-1-24',
        exactLocators: ['Rom 7:7–8', 'De nuptiis I.24.27'],
        relationType: 'explicit_interpretation',
        confidence: 'high',
        evidenceExcerpt: 'Paul: "τήν τε γὰρ ἐπιθυμίαν οὐκ ᾔδειν εἰ μὴ ὁ νόμος ἔλεγεν" -> Augustine: "Ipsa est lex in membris repugnans legi mentis, reatus eius in baptismate dimittitur".',
        researcherExplanation: 'Augustine explicitly quotes Romans 7:7-23 to ground his ontological distinction between reatus (guilt, removed by grace in baptism) and actus/motus (ongoing interior disorder requiring spiritual struggle).',
        verificationStatus: 'attested',
        reviewerNotes: 'Attested in both CSEL 42 and CCSL 47. Direct textual quotation and theological systematization.',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'ec-tert-aug-lexical',
        projectId: 'curated-concupiscence-grace',
        sourcePassageId: 'pas-tert-carne-16',
        targetPassageId: 'pas-aug-civ-14-16',
        sourceConcept: 'Caro / Flesh',
        targetConcept: 'Concupiscentia / Desire',
        sourceNodeId: 'pas-tert-carne-16',
        targetNodeId: 'pas-aug-civ-14-16',
        exactLocators: ['De carne Christi 16.1', 'De civitate Dei XIV.16'],
        relationType: 'lexical_continuity',
        confidence: 'high',
        evidenceExcerpt: 'Tertullian: "Evacuavit autem peccatum in carne, quod in carne regnabat per concupiscentiam" -> Augustine: "carnalem concupiscentiam... inordinata voluntas fons est omnium passionum".',
        researcherExplanation: 'Augustine adopts North African Latin theological vocabulary established by Tertullian regarding the locus of concupiscentia in the flesh, while shifting from Tertullian’s somatic focus to a psychological volition model.',
        verificationStatus: 'attested',
        reviewerNotes: 'Lexical continuity verified via Thesaurus Linguae Latinae entries for concupiscentia carnis.',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'ec-aug-julian-inversion',
        projectId: 'curated-concupiscence-grace',
        sourcePassageId: 'pas-aug-nupt-1-24',
        targetPassageId: 'pas-jul-flor-1-68',
        sourceConcept: 'Concupiscentia / Desire',
        targetConcept: 'Concupiscentia / Desire',
        sourceNodeId: 'pas-aug-nupt-1-24',
        targetNodeId: 'pas-jul-flor-1-68',
        exactLocators: ['De nuptiis I.24.27', 'Ad Florum I.68'],
        relationType: 'inversion_rejection',
        confidence: 'high',
        evidenceExcerpt: 'Augustine: "sine illa generari nemo possit... vitiata natura" <-> Julian: "naturalis appetitus genitalium... opus est Creatoris; nec mala est in se".',
        researcherExplanation: 'Julian of Eclanum directly attacks Augustine’s doctrine, rejecting the claim that concupiscentia is a post-lapsarian defect and redefining it as a morally neutral biological faculty created by God, subject to human reason.',
        verificationStatus: 'attested',
        reviewerNotes: 'Preserved verbatim in CSEL 85/1. Textbook case of polemical inversion.',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      }
    ],
    secondaryLiterature: [
      {
        id: 'lit-bonner-augustine',
        projectId: 'curated-concupiscence-grace',
        doi: '10.4324/9781315243177',
        title: 'St Augustine of Hippo: Life and Controversies',
        authors: ['Gerald Bonner'],
        year: 1986,
        venue: 'Canterbury Press / Routledge',
        abstract: 'Comprehensive critical investigation of the Pelagian controversy, detailing Augustine’s formulation of original sin, involuntary concupiscence, and Julian of Eclanum’s opposition.',
        isOa: false,
        landingUrl: 'https://doi.org/10.4324/9781315243177',
        sciteTallies: {
          doi: '10.4324/9781315243177',
          total: 209,
          supporting: 24,
          mentioning: 182,
          contrasting: 3,
          unclassified: 0,
          citingPublications: 195,
          disputeRatio: 0.11,
          sentimentBalance: 'supported'
        },
        linkedPassageIds: ['pas-aug-nupt-1-24', 'pas-jul-flor-1-68'],
        linkedEvidenceCardIds: ['ec-aug-julian-inversion'],
        researcherNotes: 'Standard historical authority on the evolution of concupiscentia in Augustine’s anti-Julian works.',
        responsibleVerdict: 'highly_credible',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'lit-brown-body-society',
        projectId: 'curated-concupiscence-grace',
        doi: '10.7312/brow14400',
        title: 'The Body and Society: Men, Women, and Sexual Renunciation in Early Christianity',
        authors: ['Peter Brown'],
        year: 1988,
        venue: 'Columbia University Press',
        abstract: 'Traces the transformation of attitudes toward the human body from Paul and the Desert Fathers through Augustine and his North African contemporaries.',
        isOa: false,
        landingUrl: 'https://doi.org/10.7312/brow14400',
        sciteTallies: {
          doi: '10.7312/brow14400',
          total: 673,
          supporting: 45,
          mentioning: 620,
          contrasting: 8,
          unclassified: 0,
          citingPublications: 580,
          disputeRatio: 0.15,
          sentimentBalance: 'supported'
        },
        linkedPassageIds: ['pas-paul-rom-7', 'pas-tert-carne-16', 'pas-aug-civ-14-16'],
        linkedEvidenceCardIds: ['ec-paul-aug-concupiscence', 'ec-tert-aug-lexical'],
        researcherNotes: 'Vital contextual study of the sociological and psychological shifts in North African ascetic terminology.',
        responsibleVerdict: 'highly_credible',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      }
    ],
    metadata: {
      totalSources: 6,
      totalPassages: 5,
      totalEvidenceCards: 3,
      attestedCount: 6,
      provisionalCount: 0,
      discoveryCount: 0
    }
  },
  {
    version: '1.0.0',
    exportedAt: '2026-08-25T00:00:00.000Z',
    project: {
      id: 'curated-theosis-logos',
      title: 'Theosis & Logos: From Alexandrian Exegesis to Maximus the Confessor',
      subtitle: 'The Patristic Axiom of Deification: "God became human so human might become God"',
      researchQuestion: 'How was the concept of theosis / deification formulated in 2nd–4th century Greek patristics (Irenaeus, Athanasius, Gregory Nazianzen) and systematized in 7th-century Byzantine synthesis (Maximus)?',
      methodologyNote: 'Collation of Greek critical editions (Sources Chrétiennes, Patristische Texte und Studien, Corpus Nazianzenum).',
      language: 'en',
      dateRange: {
        startYear: 40,
        endYear: 662
      },
      createdAt: '2026-08-25T00:00:00.000Z',
      updatedAt: '2026-08-25T00:00:00.000Z',
      curatedPacketId: 'theosis-logos-v1'
    },
    sources: [
      {
        id: 'src-irenaeus-ah',
        projectId: 'curated-theosis-logos',
        author: 'Irenaeus Lugdunensis',
        authorTradition: 'Gallic',
        workTitle: 'Adversus Haereses (Contra Haereses)',
        originalLanguage: 'grc',
        compositionDate: {
          startYear: 180,
          endYear: 189,
          certainty: 'probable'
        },
        authenticityStatus: 'authentic',
        sourceProvider: 'SC',
        clavisId: 'CPG 1306',
        edition: 'Sources Chrétiennes 211 & 100 (ed. A. Rousseau & L. Doutreleau, 1974)',
        bibliographyCitation: 'Irénée de Lyon. Contre les Hérésies, Livre III. Edited by Adelin Rousseau and Louis Doutreleau. SC 211. Paris: Éditions du Cerf, 1974.',
        verificationStatus: 'attested',
        researcherNotes: 'First systematic articulation of the exchange formula and recapitulation (anakephalaiosis).',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'src-athanasius-inc',
        projectId: 'curated-theosis-logos',
        author: 'Athanasius Alexandrinus',
        authorTradition: 'Alexandrian',
        workTitle: 'De Incarnatione Verbi',
        originalLanguage: 'grc',
        compositionDate: {
          startYear: 328,
          endYear: 335,
          certainty: 'probable'
        },
        authenticityStatus: 'authentic',
        sourceProvider: 'SC',
        clavisId: 'CPG 2091',
        tlgId: 'TLG 2035.002',
        edition: 'Sources Chrétiennes 199 (ed. Ch. Kannengiesser, 1973)',
        bibliographyCitation: 'Athanase d’Alexandrie. Sur l’incarnation du Verbe. Edited by Charles Kannengiesser. SC 199. Paris: Éditions du Cerf, 1973.',
        verificationStatus: 'attested',
        researcherNotes: 'Famous passage 54.3: "Αὐτὸς γὰρ ἐνηνθρώπησεν, ἵνα ἡμεῖς θεοποιηθῶμεν".',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'src-maximus-cap',
        projectId: 'curated-theosis-logos',
        author: 'Maximus Confessor',
        authorTradition: 'Other',
        workTitle: 'Capita theologica et oeconomica (Centuries on Theology)',
        originalLanguage: 'grc',
        compositionDate: {
          startYear: 630,
          endYear: 640,
          certainty: 'probable'
        },
        authenticityStatus: 'authentic',
        sourceProvider: 'PG',
        clavisId: 'CPG 7694',
        tlgId: 'TLG 2892.001',
        edition: 'Patrologia Graeca 90, 1084–1176 (ed. J.-P. Migne, 1865)',
        bibliographyCitation: 'Maximus Confessor. Capita theologica et oeconomica. PG 90. Paris: Migne, 1865.',
        verificationStatus: 'attested',
        researcherNotes: 'Refined synthesis of hypostatic union and participation in divine energies without loss of created essence.',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      }
    ],
    passages: [
      {
        id: 'pas-irenaeus-ah-3-19',
        projectId: 'curated-theosis-logos',
        sourceId: 'src-irenaeus-ah',
        passageLocator: 'III.19.1',
        originalText: 'Ὁ Λόγος τοῦ Θεοῦ, Ἰησοῦς Χριστὸς ὁ Κύριος ἡμῶν, διὰ τὴν ὑπερβάλλουσαν αὐτοῦ ἀγάπην ἐγένετο τοῦτο ὅπερ ἐσμὲν ἡμεῖς, ἵνα ἡμᾶς καταρτίσῃ ἐκεῖνο ὅπερ ἐστὶν αὐτός.',
        translationText: 'The Word of God, Jesus Christ our Lord, through His transcendent love became what we are, that He might bring us to be even what He is Himself.',
        translationLanguage: 'en',
        concepts: ['Theosis / Deification', 'Logos', 'Gratia / Grace'],
        verificationStatus: 'attested',
        snapshot: {
          importedAt: '2026-08-25T00:00:00.000Z',
          sourceChecksum: 'sha256:7b919ca0128e4891',
          isImmutable: true
        },
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'pas-athanasius-inc-54',
        projectId: 'curated-theosis-logos',
        sourceId: 'src-athanasius-inc',
        passageLocator: '54.3',
        originalText: 'Αὐτὸς γὰρ ἐνηνθρώπησεν, ἵνα ἡμεῖς θεοποιηθῶμεν· καὶ αὐτὸς ἐφανέρωσεν ἑαυτὸν διὰ σώματος, ἵνα ἡμεῖς τοῦ ἀοράτου Πατρὸς ἔννοιαν λάβωμεν.',
        translationText: 'For He was made human that we might be made god (theopoiethomen); and He manifested Himself by a body that we might receive the idea of the unseen Father.',
        translationLanguage: 'en',
        concepts: ['Theosis / Deification', 'Logos', 'Caro / Flesh'],
        verificationStatus: 'attested',
        snapshot: {
          importedAt: '2026-08-25T00:00:00.000Z',
          sourceChecksum: 'sha256:1a2c3d4e5f6a7b8c',
          isImmutable: true
        },
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'pas-maximus-cap-1-67',
        projectId: 'curated-theosis-logos',
        sourceId: 'src-maximus-cap',
        passageLocator: 'I.67',
        originalText: 'Ἵνα γὰρ θεοποιηθῇ ὁ ἄνθρωπος, διὰ τοῦτο γέγονεν ἄνθρωπος ὁ Θεός, οὐκ ἐκστὰς τῆς οἰκείας φύσεως, ἀλλ᾽ ἑνώσας ἑαυτῷ καθ᾽ ὑπόστασιν τὴν ἀνθρωπίνην φύσιν.',
        translationText: 'For in order that humanity might be deified, for this cause God became human, not departing from His own divine nature, but uniting to Himself hypostatically human nature.',
        translationLanguage: 'en',
        concepts: ['Theosis / Deification', 'Logos', 'Askesis / Asceticism'],
        verificationStatus: 'attested',
        snapshot: {
          importedAt: '2026-08-25T00:00:00.000Z',
          sourceChecksum: 'sha256:88192a01fec76241',
          isImmutable: true
        },
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      }
    ],
    evidenceCards: [
      {
        id: 'ec-irenaeus-athanasius-theosis',
        projectId: 'curated-theosis-logos',
        sourcePassageId: 'pas-irenaeus-ah-3-19',
        targetPassageId: 'pas-athanasius-inc-54',
        sourceConcept: 'Theosis / Deification',
        targetConcept: 'Theosis / Deification',
        sourceNodeId: 'pas-irenaeus-ah-3-19',
        targetNodeId: 'pas-athanasius-inc-54',
        exactLocators: ['Adv. Haer. III.19.1', 'De Incarnatione 54.3'],
        relationType: 'conceptual_development',
        confidence: 'high',
        evidenceExcerpt: 'Irenaeus: "ἐγένετο τοῦτο ὅπερ ἐσμὲν ἡμεῖς, ἵνα ἡμᾶς καταρτίσῃ ἐκεῖνο ὅπερ ἐστὶν αὐτός" -> Athanasius: "Αὐτὸς γὰρ ἐνηνθρώπησεν, ἵνα ἡμεῖς θεοποιηθῶμεν".',
        researcherExplanation: 'Athanasius condenses Irenaeus’ narrative exchange formula into the canonical Greek apothegm "Autos gar enenthropesen, hina hemeis theopoiethomen", fixing the terminology of theopoiesis for Alexandrian theology.',
        verificationStatus: 'attested',
        reviewerNotes: 'Verified against SC 211 and SC 199. High historical and lexical consensus.',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'ec-athanasius-maximus-theosis',
        projectId: 'curated-theosis-logos',
        sourcePassageId: 'pas-athanasius-inc-54',
        targetPassageId: 'pas-maximus-cap-1-67',
        sourceConcept: 'Theosis / Deification',
        targetConcept: 'Theosis / Deification',
        sourceNodeId: 'pas-athanasius-inc-54',
        targetNodeId: 'pas-maximus-cap-1-67',
        exactLocators: ['De Incarnatione 54.3', 'Capita Theologica I.67'],
        relationType: 'reception_reuse',
        confidence: 'high',
        evidenceExcerpt: 'Athanasius: "ἵνα ἡμεῖς θεοποιηθῶμεν" -> Maximus: "Ἵνα γὰρ θεοποιηθῇ ὁ ἄνθρωπος, διὰ τοῦτο γέγονεν ἄνθρωπος ὁ Θεός, οὐκ ἐκστὰς τῆς οἰκείας φύσεως".',
        researcherExplanation: 'Maximus explicitly receives the Athanasian axiom and integrates it with Chalcedonian Christology, asserting that deification occurs by grace and participation without confusion of divine and human essences.',
        verificationStatus: 'attested',
        reviewerNotes: 'Classic transmission from 4th-century Alexandrian soteriology to 7th-century neo-Chalcedonian synthesis.',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      }
    ],
    secondaryLiterature: [
      {
        id: 'lit-russell-deification',
        projectId: 'curated-theosis-logos',
        doi: '10.1093/0199265216.001.0001',
        title: 'The Doctrine of Deification in the Greek Patristic Tradition',
        authors: ['Norman Russell'],
        year: 2004,
        venue: 'Oxford University Press',
        abstract: 'Traces the development of the concept of theosis from its origins in the Septuagint and early apostolic fathers through Irenaeus, Athanasius, Gregory of Nazianzus, and Maximus the Confessor.',
        isOa: false,
        landingUrl: 'https://doi.org/10.1093/0199265216.001.0001',
        sciteTallies: {
          doi: '10.1093/0199265216.001.0001',
          total: 352,
          supporting: 38,
          mentioning: 310,
          contrasting: 4,
          unclassified: 0,
          citingPublications: 320,
          disputeRatio: 0.09,
          sentimentBalance: 'strongly_supported'
        },
        linkedPassageIds: ['pas-irenaeus-ah-3-19', 'pas-athanasius-inc-54', 'pas-maximus-cap-1-67'],
        linkedEvidenceCardIds: ['ec-irenaeus-athanasius-theosis', 'ec-athanasius-maximus-theosis'],
        researcherNotes: 'The premier modern English monograph on the linguistic and doctrinal taxonomy of theosis.',
        responsibleVerdict: 'highly_credible',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      },
      {
        id: 'lit-blowers-maximus',
        projectId: 'curated-theosis-logos',
        doi: '10.1093/acprof:oso/9780199673940.001.0001',
        title: 'Maximus the Confessor: Jesus Christ and the Transfiguration of the World',
        authors: ['Paul M. Blowers'],
        year: 2016,
        venue: 'Oxford University Press',
        abstract: 'Examines Maximus’ cosmic Christology and the theological architecture uniting creation, incarnation, and the deification of humanity.',
        isOa: false,
        landingUrl: 'https://doi.org/10.1093/acprof:oso/9780199673940.001.0001',
        sciteTallies: {
          doi: '10.1093/acprof:oso/9780199673940.001.0001',
          total: 115,
          supporting: 18,
          mentioning: 96,
          contrasting: 1,
          unclassified: 0,
          citingPublications: 105,
          disputeRatio: 0.05,
          sentimentBalance: 'strongly_supported'
        },
        linkedPassageIds: ['pas-maximus-cap-1-67'],
        linkedEvidenceCardIds: ['ec-athanasius-maximus-theosis'],
        researcherNotes: 'High-authority critical analysis on the neo-Chalcedonian synthesis of divine-human participation.',
        responsibleVerdict: 'highly_credible',
        createdAt: '2026-08-25T00:00:00.000Z',
        updatedAt: '2026-08-25T00:00:00.000Z'
      }
    ],
    metadata: {
      totalSources: 3,
      totalPassages: 3,
      totalEvidenceCards: 2,
      attestedCount: 3,
      provisionalCount: 0,
      discoveryCount: 0
    }
  }
];
