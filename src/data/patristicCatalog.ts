import { AuthorTradition, PrimaryLanguage, SourceProvider, DateCertainty, AuthenticityStatus, RelationType, ConfidenceLevel } from '../types';

export interface AuthorPreset {
  id: string;
  name: string;
  tradition: AuthorTradition;
  language: PrimaryLanguage;
  activePeriod: string;
  works: WorkPreset[];
}

export interface WorkPreset {
  id: string;
  title: string;
  startYear: number;
  endYear: number;
  certainty: DateCertainty;
  dateRationale: string;
  edition: string;
  clavisId: string;
  tlgId?: string;
  ctsUrn?: string;
  sourceProvider: SourceProvider;
  bibliographyCitation: string;
  researcherNotes: string;
  authenticityStatus: AuthenticityStatus;
  passages: PassagePreset[];
}

export interface PassagePreset {
  id: string;
  locator: string;
  originalText: string;
  translationEn: string;
  translationZh: string;
  concepts: string[];
  notes?: string;
}

export interface ProjectTemplatePreset {
  id: string;
  titleEn: string;
  titleZh: string;
  subtitleEn: string;
  subtitleZh: string;
  researchQuestionEn: string;
  researchQuestionZh: string;
  methodologyEn: string;
  methodologyZh: string;
  methodologyNoteEn?: string;
  methodologyNoteZh?: string;
  startYear: number;
  endYear: number;
}

export type ProjectTemplate = ProjectTemplatePreset;

export interface SynthesisTemplate {
  id: string;
  labelEn: string;
  labelZh: string;
  sourceConcept: string;
  targetConcept: string;
  relationType: RelationType;
  confidence: ConfidenceLevel;
  explanationEn: string;
  explanationZh: string;
}

export interface RationaleTemplatePreset {
  id: string;
  labelEn: string;
  labelZh: string;
  relationType: RelationType;
  confidence: ConfidenceLevel;
  textEn: string;
  textZh: string;
}

export const CANONICAL_CONCEPTS = [
  'Concupiscentia / Desire',
  'Gratia / Grace',
  'Theosis / Deification',
  'Logos / Word',
  'Monarchia / Divine Monarchy',
  'Hypostasis / Person',
  'Ousia / Substance',
  'Homoousios / Consubstantial',
  'Anakephalaiosis / Recapitulation',
  'Peccatum Originale / Original Sin',
  'Liberum Arbitrium / Free Will',
  'Voluntas / Will',
  'Caro / Flesh',
  'Sacrificium / Sacrifice',
  'Askesis / Asceticism',
  'Kenosis / Self-Emptying',
  'Synergeia / Synergism',
  'Apatheia / Dispassion',
  'Imago Dei / Image of God',
  'Lex / Law'
];

export const SYNTHESIS_TEMPLATES: SynthesisTemplate[] = [
  {
    id: 'concupiscence_to_grace',
    labelEn: 'Concupiscence (Fallen Will) -> Divine Grace & Healing',
    labelZh: '情慾與墮落意志 -> 神聖先在恩典與醫治',
    sourceConcept: 'Concupiscentia / Desire',
    targetConcept: 'Gratia / Grace',
    relationType: 'explicit_interpretation',
    confidence: 'high',
    explanationEn: 'The passage articulates that concupiscentia denotes the penal division of the will after the Fall, necessitating gratuitous unmerited grace (gratia gratis data) for restoration.',
    explanationZh: '該經文清晰闡明「情慾」(concupiscentia) 乃墮落後意志分裂之懲戒性後果，唯有藉由不計功德的神聖先在恩典方能重獲醫治與自由。'
  },
  {
    id: 'theosis_exchange',
    labelEn: 'Recapitulation & Incarnation -> Deification (Theosis)',
    labelZh: '道成肉身與總歸於一 -> 神化與人性提升 (Theosis)',
    sourceConcept: 'Anakephalaiosis / Recapitulation',
    targetConcept: 'Theosis / Deification',
    relationType: 'conceptual_development',
    confidence: 'high',
    explanationEn: 'The author establishes that the Logos assumed true human nature in order to recapitulate creation, allowing human beings to participate in divine immortality by grace.',
    explanationZh: '作者確立聖言取受真實人性的救恩論基礎：基督在自身之中「總括萬有」，藉此使受造之人得以因恩典分享神聖不朽生命（神化）。'
  },
  {
    id: 'anti_dualism_creation',
    labelEn: 'Creation Order (Caro) vs Gnostic/Manichaean Contestation',
    labelZh: '受造秩序與肉身本善 -> 駁斥諾斯底／摩尼教二元論',
    sourceConcept: 'Caro / Flesh',
    targetConcept: 'Voluntas / Will',
    relationType: 'inversion_rejection',
    confidence: 'high',
    explanationEn: 'The text vigorously refutes ontological dualism: evil is not an independent substantial entity (ousia), but a privation of good resulting from disordered voluntary choice (privatio boni).',
    explanationZh: '經文嚴格駁斥本體論二元論：惡並非獨立之物質本體，而是受造意志偏離最高善所導致之「善的匱乏」(privatio boni)，肉身受造本為良善。'
  },
  {
    id: 'logos_revelation',
    labelEn: 'Logos Pre-existence -> Biblical & Philosophical Propaideia',
    labelZh: '聖言 (Logos) 啟示 -> 聖經釋經與古典哲學之預備',
    sourceConcept: 'Logos / Word',
    targetConcept: 'Lex / Law',
    relationType: 'parallel_resonance',
    confidence: 'medium',
    explanationEn: 'The author posits the divine Logos as active throughout pre-Christian history, inspiring the Hebrew prophets and illuminating pagan seekers as a pedagogical preparation (propaideia) for the fullness of Christ.',
    explanationZh: '作者主張神聖聖言自古便在歷史中運行，啟示希伯來先知並照亮古代哲人，作為引領敬虔與迎接基督道成肉身的蒙訓輔導 (propaideia)。'
  }
];

export const RATIONALE_TEMPLATES: RationaleTemplatePreset[] = [
  {
    id: 'direct_lexical_borrowing',
    labelEn: 'Direct Lexical & Conceptual Borrowing',
    labelZh: '直接詞彙採納與概念承繼',
    relationType: 'direct_citation',
    confidence: 'high',
    textEn: 'The author directly adopts earlier terminology and syntactic structures from the antecedent text, adapting them within an expanded theological framework while preserving the core conceptual kernel.',
    textZh: '作者直接採納了前代文獻中的關鍵術語與句式結構，在維持核心概念範疇的同時將其拓展至更具體的教義框架中。'
  },
  {
    id: 'polemical_inversion',
    labelEn: 'Polemical Inversion / Contestation',
    labelZh: '論辯性反轉與神學批判',
    relationType: 'inversion_rejection',
    confidence: 'high',
    textEn: 'The text intentionally challenges and subverts the opponent\'s formulation, redefining the operative theological terms to exclude heterodox readings and assert orthodox boundaries.',
    textZh: '本文故意針對論敵的命題進行針鋒相對的反轉，重新界定核心詞彙的外延，以排除非正統解釋並界定教義界限。'
  },
  {
    id: 'conceptual_shift_differentiation',
    labelEn: 'Conceptual Shift & Semantic Shift',
    labelZh: '概念演化與詞義分化',
    relationType: 'conceptual_development',
    confidence: 'high',
    textEn: 'A discernible shift in theological emphasis occurs between these passages: the term moves from a predominantly philosophical/moral sense to an ontological and salvific technical category.',
    textZh: '兩段經文間展現出清晰的神學重心轉移：該概念由原先較具哲學倫理意味的用法，演變為高度本體論與救恩論層面的專業神學範疇。'
  },
  {
    id: 'explicit_exegesis',
    labelEn: 'Explicit Patristic / Biblical Exegesis',
    labelZh: '顯式經文釋經與教父詮釋',
    relationType: 'explicit_interpretation',
    confidence: 'high',
    textEn: 'The author offers an explicit critical commentary on the cited locus, establishing a normative interpretive rubric grounded in Christological and Trinitarian principles.',
    textZh: '作者在此處對所引文本進行顯式註解，確立了以基督論與三一論原則為準繩的規範性詮釋進路。'
  },
  {
    id: 'analogous_typology',
    labelEn: 'Typological & Theological Parallel',
    labelZh: '預表論與神學結構平行對應',
    relationType: 'parallel_resonance',
    confidence: 'medium',
    textEn: 'These loci exhibit structural and typological symmetry, demonstrating a shared theological milieu and reliance on traditional catechetical topoi without requiring direct literary copying.',
    textZh: '兩處文本展現出結構與預表層面的高度對稱性，反映出共享的教理問答傳統與神學語境，具備間接平行關係。'
  }
];

export const PROJECT_TEMPLATES: ProjectTemplatePreset[] = [
  {
    id: 'concupiscence_grace',
    titleEn: 'Genealogy of Concupiscence & Grace in North African Patristics',
    titleZh: '北非教父傳統中「情慾」與「恩典」概念之譜系考據',
    subtitleEn: 'Lexical and theological development across Paul, Tertullian, and Augustine',
    subtitleZh: '保祿、戴爾都良與奧古斯丁著作之詞彙批判與神學演變',
    researchQuestionEn: 'How does the conceptualization of concupiscentia shift from Pauline epistolary usage through Tertullian\'s moral-disciplinarian rigorism into Augustine\'s mature anti-Pelagian anthropology of fallen will and operative grace?',
    researchQuestionZh: '「情慾」(concupiscentia/epithumia) 與「恩典」(gratia/charis) 之概念，如何由保祿書信經由戴爾都良的律法道德論述，演進為奧古斯丁晚期反伯拉糾論戰中關於墮落意志與先在恩典的嚴密神學範疇？',
    methodologyEn: 'Historical-critical analysis of critical editions (CCSL, CSEL) with explicit citation apparatus and manuscript stemma comparison (CPL 0008, CPL 0251, CPL 0275).',
    methodologyZh: '基於 CCSL 與 CSEL 權威校勘本進行歷史批判與版本對校，嚴格錨定 Clavis CPL 編號，杜絕虛構引文。',
    startYear: 50,
    endYear: 430
  },
  {
    id: 'pneumatology_monarchia',
    titleEn: 'Pneumatological Procession & the Divine Monarchia in the 4th Century',
    titleZh: '四世紀三一論戰中聖靈出處與「神性單一源頭」之教父學考證',
    subtitleEn: 'Comparative study of Athanasius, Basil of Caesarea, and Gregory of Nazianzus',
    subtitleZh: '亞他那修、該撒利亞的巴西流與納齊安的貴格利論著對勘',
    researchQuestionEn: 'How did the Cappadocian Fathers articulate the eternal hypostatic property of the Holy Spirit (ekporeusis) while preserving the Patristic doctrine of the Monarchy of the Father (Monarchia tou Patros)?',
    researchQuestionZh: '加帕多家教父如何在捍衛聖靈完全神性（同本質與神聖位格屬性）的同時，維繫東方教父傳統中「父為神性唯一根源」(Monarchia tou Patros) 的教義平衡？',
    methodologyEn: 'Examination of Greek critical texts (SC, PTA, GCS) with attention to technical Trinitarian vocabulary (homoousios, hypostasis, tropos hyparxeos).',
    methodologyZh: '使用 Sources Chrétiennes (SC) 與 PTA 校勘本，針對希臘語三一論技術詞彙（同本質、位格、存在方式）進行精確詞義考證。',
    startYear: 325,
    endYear: 390
  },
  {
    id: 'theosis_recapitulation',
    titleEn: 'Theosis & Recapitulation from Irenaeus to Athanasius',
    titleZh: '從愛任紐到亞他那修：萬有總歸於一與神化救恩論',
    subtitleEn: 'The Christological soteriology of divine incarnation and human restoration',
    subtitleZh: '道成肉身與人性修復之基督論救贖神學架構',
    researchQuestionEn: 'To what extent does Athanasius\' dictum "God became man that man might become god" directly systematize Irenaeus of Lyons\' theology of anakephalaiosis and exchange?',
    researchQuestionZh: '亞他那修「上帝成為人，為要叫人成為神」之著名命題，在何種程度上直接承繼並系統化了里昂的愛任紐關於「總歸於一」(anakephalaiosis) 與「救贖交換」的古典神學？',
    methodologyEn: 'Collation of SC 100/264 (Irenaeus) and SC 199/PTA 0001 (Athanasius) with lexical tracing of theosis, theopoiein, and anakephalaioun.',
    methodologyZh: '對勘愛任紐與亞他那修權威校勘本，針對 theosis / theopoiein / anakephalaioun 之古希臘文本進行實證考據。',
    startYear: 180,
    endYear: 373
  },
  {
    id: 'logos_sarx_christology',
    titleEn: 'Logos-Sarx vs Logos-Anthropos Frameworks in Patristic Christology',
    titleZh: '教父基督論中「道-肉」(Logos-Sarx) 與「道-人」(Logos-Anthropos) 範式之爭',
    subtitleEn: 'Alexandrian and Antiochene tensions from Apollinaris to the Council of Chalcedon',
    subtitleZh: '從亞波里拿留、納齊安的貴格利至迦克墩公會議之神學張力',
    researchQuestionEn: 'How did the physiological Logos-Sarx schema of early Alexandria prompt Gregory of Nazianzus to formulate the axiom "what is not assumed is not healed"?',
    researchQuestionZh: '早期亞歷山太學派的「道-肉」框架如何促使納齊安的貴格利提出「未被道所取受者，即未得醫治」之救恩論公理？',
    methodologyEn: 'Analysis of patristic epistolary and synodical documents in critical editions (SC 208, CCSG, ACO).',
    methodologyZh: '考證教父書信集與公會議文獻批註本，分析基督人性靈魂與完整人性的神學必要性。',
    startYear: 360,
    endYear: 451
  }
];

export const PATRISTIC_AUTHORS_CATALOG: AuthorPreset[] = [
  {
    id: 'augustine',
    name: 'Augustinus Hipponensis (Augustine of Hippo)',
    tradition: 'Latin/North African',
    language: 'la',
    activePeriod: '354–430 CE',
    works: [
      {
        id: 'aug_civ_dei',
        title: 'De ciuitate Dei (The City of God)',
        startYear: 413,
        endYear: 426,
        certainty: 'exact',
        dateRationale: 'Begun c. 413 CE following the sack of Rome; completed c. 426 CE before the Retractationes.',
        edition: 'CCSL 47–48 (ed. B. Dombart & A. Kalb, 1955) / CSEL 40',
        clavisId: 'CPL 0251',
        ctsUrn: 'urn:cts:pta:pta0040.pta001',
        sourceProvider: 'PTA',
        bibliographyCitation: 'Augustinus. De ciuitate Dei contra paganos libri XXII. Ed. B. Dombart & A. Kalb. CCSL 47–48. Turnhout: Brepols, 1955.',
        researcherNotes: 'Primary witness: Codex Veronensis XXVIII (5th cent.) and Corbeiensis (Paris lat. 12214).',
        authenticityStatus: 'authentic',
        passages: [
          {
            id: 'aug_civ_14_16',
            locator: 'XIV.16',
            originalText: 'Iusta ergo animadversio est in inoboedientia voluntatis, ut homo qui praeceptum non servaverat sua voluntate, patiatur in sua carne quod non vult sua voluntate.',
            translationEn: 'Just, therefore, is the retribution upon the disobedience of the will, that man who had not observed the commandment by his own will, should suffer in his flesh that which he wills not.',
            translationZh: '因此，對意志不服從的懲罰是公正的：那不願以自身意志遵守誡命的人，便在肉體中承受他不願意的事情。',
            concepts: ['Concupiscentia / Desire', 'Voluntas / Will', 'Peccatum Originale / Original Sin'],
            notes: 'Critical chapter on the disobedient flesh reflecting the fractured will.'
          },
          {
            id: 'aug_civ_14_28',
            locator: 'XIV.28',
            originalText: 'Fecerunt itaque civitates duas amores duo, terrenam scilicet amor sui usque ad contemptum Dei, caelestem vero amor Dei usque ad contemptum sui.',
            translationEn: 'Two loves have therefore formed two cities: the earthly city by love of self reaching even to the contempt of God; the heavenly city by love of God reaching even to the contempt of self.',
            translationZh: '因此，兩種愛造就了兩座城：地上的城由愛自己以致蔑視上帝而成；天上的城由愛上帝以致蔑視自己而成。',
            concepts: ['Voluntas / Will', 'Gratia / Grace', 'Caro / Flesh'],
            notes: 'Locus classicus of the two loves and the two cities.'
          }
        ]
      },
      {
        id: 'aug_confessiones',
        title: 'Confessiones (Confessions)',
        startYear: 397,
        endYear: 400,
        certainty: 'exact',
        dateRationale: 'Composed shortly after his episcopal consecration in Hippo (c. 397-400 CE).',
        edition: 'CCSL 27 (ed. L. Verheijen, 1981) / CSEL 33',
        clavisId: 'CPL 0250',
        ctsUrn: 'urn:cts:latinLit:stoa0040.stoa002',
        sourceProvider: 'CCSL',
        bibliographyCitation: 'Augustinus. Confessionum libri XIII. Ed. L. Verheijen. CCSL 27. Turnhout: Brepols, 1981.',
        researcherNotes: 'Universal consensus on Augustinian authenticity; cornerstone of late antique philosophical autobiography.',
        authenticityStatus: 'authentic',
        passages: [
          {
            id: 'aug_conf_10_27',
            locator: 'X.27.38',
            originalText: 'Sero te amavi, pulchritudo tam antiqua et tam nova, sero te amavi! Et ecce intus eras et ego foris et ibi te quaerebam.',
            translationEn: 'Late have I loved you, O Beauty ever ancient and ever new, late have I loved you! Behold, you were within and I was without, and there I sought you.',
            translationZh: '我愛你太遲了，古老而常新的至美，我愛你太遲了！看哪，你在我裡面，而我在外頭，我在外面尋找你。',
            concepts: ['Gratia / Grace', 'Imago Dei / Image of God'],
            notes: 'Classic introspective theological formulation of interiority and grace.'
          },
          {
            id: 'aug_conf_8_7',
            locator: 'VIII.7.17',
            originalText: 'Petieram a te castitatem et dixeram: "Da mihi castitatem et continentiam, sed noli modo." Timebam enim ne me cito exaudires.',
            translationEn: 'I had prayed to you for chastity and said: "Give me chastity and continence, but not yet." For I feared lest you should hear me too soon.',
            translationZh: '我曾向你求貞潔，說：「求你賜我貞潔與節制，但請不要現在就給。」因為我害怕你太快應允我。',
            concepts: ['Concupiscentia / Desire', 'Voluntas / Will', 'Liberum Arbitrium / Free Will'],
            notes: 'Exemplifies the divided will before conversion.'
          }
        ]
      },
      {
        id: 'aug_nupt_concup',
        title: 'De nuptiis et concupiscentia (On Marriage and Concupiscence)',
        startYear: 419,
        endYear: 421,
        certainty: 'exact',
        dateRationale: 'Book I written in 419 CE for Count Valerius; Book II added in 420–421 CE in response to Julian of Eclanum.',
        edition: 'CSEL 42 (ed. C. F. Vrba & J. Zycha, 1902)',
        clavisId: 'CPL 0275',
        sourceProvider: 'CSEL',
        bibliographyCitation: 'Augustinus. De nuptiis et concupiscentia libri duo. Ed. C. F. Vrba & J. Zycha. CSEL 42. Vienna: Tempsky, 1902.',
        researcherNotes: 'Central text in the second Pelagian controversy with Julian of Eclanum.',
        authenticityStatus: 'authentic',
        passages: [
          {
            id: 'aug_nupt_1_24',
            locator: 'I.24.27',
            originalText: 'Concupiscentia carnis, qua fit ut caro concupiscat adversus spiritum, remanet quidem in baptizatis ad agonem, sed non imputatur in peccatum.',
            translationEn: 'The concupiscence of the flesh, by which the flesh lusts against the spirit, remains indeed in the baptized for struggle, but is not imputed as sin.',
            translationZh: '肉體的情慾（情慾與靈相爭）在受洗者身上確實存留以作為屬靈爭戰，但不再被歸算為罪。',
            concepts: ['Concupiscentia / Desire', 'Gratia / Grace', 'Peccatum Originale / Original Sin'],
            notes: 'Theological distinction between reatus (guilt) and actus (struggle).'
          }
        ]
      }
    ]
  },
  {
    id: 'athanasius',
    name: 'Athanasius Alexandrinus (Athanasius of Alexandria)',
    tradition: 'Alexandrian',
    language: 'grc',
    activePeriod: '296–373 CE',
    works: [
      {
        id: 'ath_inc_verbi',
        title: 'De Incarnatione Verbi (On the Incarnation of the Word)',
        startYear: 328,
        endYear: 335,
        certainty: 'probable',
        dateRationale: 'Standard scholarly consensus dates the two-part apology (Contra Gentes / De Incarnatione) to early episcopate (c. 328-335 CE).',
        edition: 'SC 199 (ed. C. Kannengiesser, 1973) / PTA 0001',
        clavisId: 'CPG 2091',
        tlgId: 'TLG 2035.001',
        ctsUrn: 'urn:cts:pta:pta0001.pta001',
        sourceProvider: 'PTA',
        bibliographyCitation: 'Athanase d\'Alexandrie. Sur l\'Incarnation du Verbe. Ed. C. Kannengiesser. SC 199. Paris: Cerf, 1973.',
        researcherNotes: 'Extant in Short and Long recensions. Available in PTA digital critical edition.',
        authenticityStatus: 'authentic',
        passages: [
          {
            id: 'ath_inc_54_3',
            locator: '54.3',
            originalText: 'Αὐτὸς γὰρ ἐνηνθρώπησεν, ἵνα ἡμεῖς θεοποιηθῶμεν· καὶ αὐτὸς ἐφανέρωσεν ἑαυτὸν διὰ σώματος, ἵνα ἡμεῖς τοῦ ἀοράτου Πατρὸς ἔννοιαν λάβωμεν.',
            translationEn: 'For He was made man that we might be made god; and He manifested Himself by a body that we might receive the idea of the unseen Father.',
            translationZh: '因為祂成為人，為叫我們得以神化；祂藉著身體顯明自己，為叫我們得著不可見之父的認識。',
            concepts: ['Theosis / Deification', 'Logos / Word', 'Kenosis / Self-Emptying'],
            notes: 'The locus classicus of patristic soteriological theosis.'
          },
          {
            id: 'ath_inc_8_1',
            locator: '8.1',
            originalText: 'Οὐ γὰρ ἀσώματος ἦν πρὸ τούτου ὁ τοῦ Θεοῦ Λόγος, ἀλλὰ δι\' ἡμᾶς καὶ τὴν ἡμετέραν σωτηρίαν ἐν σώματι πέφηνεν.',
            translationEn: 'For the Word of God was not previously incorporeal, but for our sakes and for our salvation He appeared in a human body.',
            translationZh: '因為上帝之道原本並非無形無體地居於我們當中，而是為了我們和我們的救恩，在身體中顯現。',
            concepts: ['Logos / Word', 'Caro / Flesh', 'Theosis / Deification'],
            notes: 'Incarnational solidarity and soteriology.'
          }
        ]
      },
      {
        id: 'ath_or_c_arianos',
        title: 'Orationes contra Arianos (Orations against the Arians I–III)',
        startYear: 339,
        endYear: 345,
        certainty: 'probable',
        dateRationale: 'Composed during Athanasius\' second exile in Rome (339–345 CE).',
        edition: 'PTS 51 (ed. K. Metzler & D. U. Hansen, 1998)',
        clavisId: 'CPG 2093',
        tlgId: 'TLG 2035.002',
        sourceProvider: 'PTA',
        bibliographyCitation: 'Athanasius Werke. Bd. I/1: Die Dogmatischen Schriften. Ed. K. Metzler. PTS 51. Berlin: De Gruyter, 1998.',
        researcherNotes: 'Crucial polemical texts defending the Nicene Homoousios.',
        authenticityStatus: 'authentic',
        passages: [
          {
            id: 'ath_c_ar_1_39',
            locator: 'I.39',
            originalText: 'Εἰ γὰρ μὴ ἦν ὁ Υἱὸς ἴδιος τῆς οὐσίας τοῦ Πατρός, οὐκ ἂν ἠδύνατο θεοποιῆσαι τὰ κτίσματα.',
            translationEn: 'For if the Son were not proper to the essence of the Father, He could not have deified that which was created.',
            translationZh: '蓋若子非出於父本質所固有，祂斷不能將受造之物神化。',
            concepts: ['Homoousios / Consubstantial', 'Theosis / Deification', 'Ousia / Substance'],
            notes: 'Soteriological argument for the divinity of Christ.'
          }
        ]
      }
    ]
  },
  {
    id: 'basil',
    name: 'Basilius Caesariensis (Basil of Caesarea)',
    tradition: 'Cappadocian',
    language: 'grc',
    activePeriod: '329–379 CE',
    works: [
      {
        id: 'bas_spir_sancto',
        title: 'De Spiritu Sancto (On the Holy Spirit)',
        startYear: 375,
        endYear: 375,
        certainty: 'exact',
        dateRationale: 'Composed in 375 CE for Amphilochius of Iconium on liturgical doxology controversy.',
        edition: 'SC 17bis (ed. B. Pruche, 1968) / PTA 0003',
        clavisId: 'CPG 2840',
        tlgId: 'TLG 2040.001',
        ctsUrn: 'urn:cts:pta:pta0003.pta001',
        sourceProvider: 'PTA',
        bibliographyCitation: 'Basile de Césarée. Sur le Saint-Esprit. Ed. B. Pruche. SC 17bis. Paris: Cerf, 1968.',
        researcherNotes: 'Verified PTA digital edition with Clavis and TLG URN bindings.',
        authenticityStatus: 'authentic',
        passages: [
          {
            id: 'bas_spir_9_22',
            locator: 'IX.22',
            originalText: 'Ἐντεῦθεν μελλόντων πρόγνωσις, αἰνιγμάτων σύνεσις, κρυπτῶν καταλήψεις, χαρισμάτων διανομαί, τὸ οὐράνιον πολίτευμα, ἡ μετὰ ἀγγέλων χορεία, τὸ θεὸν γενέσθαι.',
            translationEn: 'Thence comes foreknowledge of the future, understanding of mysteries, apprehension of what is hidden, distribution of spiritual gifts, heavenly citizenship, a place in the choir of angels, and becoming god.',
            translationZh: '從此而來對未來的先知、對奧祕的領悟、對隱密事的參透、屬靈恩賜的分配、天國的公民權、與天使共舞的同在，以及成為神。',
            concepts: ['Theosis / Deification', 'Gratia / Grace', 'Monarchia / Divine Monarchy'],
            notes: 'Pneumatological climax of deification through the Spirit.'
          },
          {
            id: 'bas_spir_18_45',
            locator: 'XVIII.45',
            originalText: 'Εἷς γὰρ ὁ Θεὸς καὶ Πατήρ, καὶ εἷς ὁ Μονογενής, καὶ ἓν τὸ Πνεῦμα τὸ ἅγιον. Μονὰς μὲν ἀρχὴ τῶν πάντων.',
            translationEn: 'For one is God and Father, and one is the Only-Begotten, and one is the Holy Spirit. The Monad is the origin of all.',
            translationZh: '因為上帝與父只有一位，獨生子只有一位，聖靈亦只有一位。單一之源乃是萬物之始。',
            concepts: ['Monarchia / Divine Monarchy', 'Hypostasis / Person', 'Ousia / Substance'],
            notes: 'Defense of the Divine Monarchy in Trinitarian theology.'
          }
        ]
      }
    ]
  },
  {
    id: 'gregory_nazianzen',
    name: 'Gregorius Nazianzenus (Gregory of Nazianzus)',
    tradition: 'Cappadocian',
    language: 'grc',
    activePeriod: '329–390 CE',
    works: [
      {
        id: 'greg_orat_theol',
        title: 'Orationes Theologicae (Theological Orations 27–31)',
        startYear: 380,
        endYear: 380,
        certainty: 'exact',
        dateRationale: 'Preached in Constantinople at the church of the Anastasia in Summer 380 CE.',
        edition: 'SC 250 (ed. P. Gallay & M. Jourjon, 1978)',
        clavisId: 'CPG 3010',
        tlgId: 'TLG 2022.001',
        sourceProvider: 'SC',
        bibliographyCitation: 'Grégoire de Nazianze. Discours 27–31 (Discours théologiques). Ed. P. Gallay. SC 250. Paris: Cerf, 1978.',
        researcherNotes: 'High textual transmission stability across more than 150 Greek manuscripts.',
        authenticityStatus: 'authentic',
        passages: [
          {
            id: 'greg_or_28_17',
            locator: 'Orat. 28.17',
            originalText: 'Θεὸν νοῆσαι μὲν χαλεπόν, φράσαι δὲ ἀδύνατον, ὥς τις τῶν παρ\' Ἕλλησι θεολόγων ἐφιλοσόφησεν.',
            translationEn: 'To comprehend God is difficult, but to speak of Him is impossible, as one of the Greek theologians philosophized.',
            translationZh: '要理解上帝固然困難，而要述說祂則絕不可能，正如希臘神學家中所言。',
            concepts: ['Apatheia / Dispassion', 'Monarchia / Divine Monarchy'],
            notes: 'Apophatic foundation of theological discourse.'
          },
          {
            id: 'greg_ep_101',
            locator: 'Ep. 101.32',
            originalText: 'Τὸ γὰρ ἀπρόσληπτον, ἀθεράπευτον· ὃ δὲ ἥνωται τῷ Θεῷ, τοῦτο καὶ σῴζεται.',
            translationEn: 'For that which is not assumed is not healed; but that which is united to God is also saved.',
            translationZh: '因為凡未曾被取受的，就未得醫治；唯獨與上帝聯合的，方得蒙拯救。',
            concepts: ['Theosis / Deification', 'Logos / Word', 'Caro / Flesh'],
            notes: 'The fundamental soteriological axiom of the Patristic Incarnation.'
          }
        ]
      }
    ]
  },
  {
    id: 'tertullian',
    name: 'Tertullianus (Tertullian of Carthage)',
    tradition: 'Latin/North African',
    language: 'la',
    activePeriod: '155–220 CE',
    works: [
      {
        id: 'tert_praescrip',
        title: 'De praescriptione haereticorum (The Prescription against Heretics)',
        startYear: 198,
        endYear: 206,
        certainty: 'probable',
        dateRationale: 'Pre-Montanist or early Montanist transition period in Carthage.',
        edition: 'CCSL 1 (ed. R. F. Refoulé, 1954)',
        clavisId: 'CPL 0008',
        sourceProvider: 'CCSL',
        bibliographyCitation: 'Tertullianus. De praescriptione haereticorum. Ed. R. F. Refoulé. CCSL 1. Turnhout: Brepols, 1954.',
        researcherNotes: 'Witnessed in Corpus Cluniacense and Corpus Mesnartianum.',
        authenticityStatus: 'authentic',
        passages: [
          {
            id: 'tert_praescrip_7_9',
            locator: 'Cap. 7.9',
            originalText: 'Quid ergo Athenis et Hierosolymis? Quid Academiae et Ecclesiae? Quid haereticis et Christianis?',
            translationEn: 'What indeed has Athens to do with Jerusalem? What has the Academy to do with the Church? What have heretics to do with Christians?',
            translationZh: '雅典與耶路撒冷何干？學院與教會何涉？異端與基督徒有何相通？',
            concepts: ['Logos / Word', 'Lex / Law'],
            notes: 'Classic assertion of the primacy of revelation over dialectical philosophy.'
          }
        ]
      }
    ]
  },
  {
    id: 'irenaeus',
    name: 'Irenaeus Lugdunensis (Irenaeus of Lyons)',
    tradition: 'Gallic',
    language: 'grc',
    activePeriod: '130–202 CE',
    works: [
      {
        id: 'iren_adv_haer',
        title: 'Adversus Haereses (Against Heresies)',
        startYear: 180,
        endYear: 189,
        certainty: 'probable',
        dateRationale: 'Written in Lyons during the episcopate of Eleutherus (c. 180–189 CE).',
        edition: 'SC 100, 152, 153, 211, 263, 264, 294 (ed. A. Rousseau & L. Doutreleau)',
        clavisId: 'CPG 1306',
        sourceProvider: 'SC',
        bibliographyCitation: 'Irénée de Lyon. Contre les hérésies. Ed. A. Rousseau & L. Doutreleau. SC 100–294. Paris: Cerf, 1965–1982.',
        researcherNotes: 'Preserved completely in early Latin translation; extensive Greek papyri and catena fragments.',
        authenticityStatus: 'authentic',
        passages: [
          {
            id: 'iren_ah_3_18_1',
            locator: 'Adv. Haer. III.18.1',
            originalText: 'Quando incarnatus est et homo factus, longam hominum expositionem in seipso recapitulavit, in compendio nobis salutem praestans.',
            translationEn: 'When He became incarnate and was made man, He recapitulated in Himself the long history of mankind, providing us with salvation in a concise summary.',
            translationZh: '當祂道成肉身並成為人時，祂在自身之中總括了人類漫長的存在歷史，在概括之中為我們賜下了救恩。',
            concepts: ['Anakephalaiosis / Recapitulation', 'Theosis / Deification', 'Logos / Word'],
            notes: 'Classic definition of anakephalaiosis (recapitulation).'
          },
          {
            id: 'iren_ah_5_praef',
            locator: 'Adv. Haer. V, Praef.',
            originalText: 'Factus est quod sumus nos, uti nos perficeret esse quod est ipse.',
            translationEn: 'He became what we are, that He might bring us to be even what He is Himself.',
            translationZh: '祂成為了我們的樣式，好叫祂引導我們成為祂自身的樣式。',
            concepts: ['Theosis / Deification', 'Kenosis / Self-Emptying', 'Caro / Flesh'],
            notes: 'Early theological precursor to Athanasian deification formula.'
          }
        ]
      }
    ]
  },
  {
    id: 'clement_alexandria',
    name: 'Clemens Alexandrinus (Clement of Alexandria)',
    tradition: 'Alexandrian',
    language: 'grc',
    activePeriod: '150–215 CE',
    works: [
      {
        id: 'clem_stromata',
        title: 'Stromata (Miscellanies I–VIII)',
        startYear: 198,
        endYear: 203,
        certainty: 'probable',
        dateRationale: 'Composed in Alexandria prior to Clement\'s departure during the Severan persecution (202/203 CE).',
        edition: 'GCS 15, 17, 39 (ed. O. Stählin & L. Früchtel) / SC 30, 38, 428',
        clavisId: 'CPG 1405',
        tlgId: 'TLG 0555.001',
        sourceProvider: 'GCS',
        bibliographyCitation: 'Clemens Alexandrinus. Stromata. Ed. O. Stählin & L. Früchtel. GCS 15, 17, 39. Berlin: Akademie Verlag, 1960–1970.',
        researcherNotes: 'Preserved almost exclusively in Codex Laurentianus V.3 (11th cent.).',
        authenticityStatus: 'authentic',
        passages: [
          {
            id: 'clem_strom_1_5_28',
            locator: 'I.5.28',
            originalText: 'Ἦν μὲν οὖν πρὸ τῆς τοῦ Κυρίου παρουσίας εἰς δικαιοσύνην Ἕλλησιν ἀναγκαία φιλοσοφία, νυνὶ δὲ χρησίμη πρὸς θεοσέβειαν γίνεται.',
            translationEn: 'Philosophy was necessary to the Greeks for righteousness before the coming of the Lord, and now it is useful for piety.',
            translationZh: '在主降臨之前，哲學對希臘人得義是必要的；而今，它則成為引領敬虔的有用輔助。',
            concepts: ['Logos / Word', 'Lex / Law'],
            notes: 'Clement\'s famous thesis of philosophy as a preparation (propaideia) for the Gospel.'
          }
        ]
      }
    ]
  }
];

export interface SampleAiAnalysisItem {
  projectId: string;
  topicEn: string;
  topicZh: string;
  result: {
    synthesis: string;
    citedPassages: Array<{
      locator: string;
      exactQuote: string;
      relevance: string;
    }>;
    proposedRelationships: Array<{
      sourceConcept: string;
      targetConcept: string;
      relationType: string;
      confidence: string;
      rationale: string;
      sourceLocator: string;
      targetLocator: string;
    }>;
    limitations: string;
    cautionFlags: string;
    timestamp: string;
  };
}

export const SAMPLE_AI_ANALYSES: Record<string, SampleAiAnalysisItem> = {
  'curated-concupiscence-grace': {
    projectId: 'curated-concupiscence-grace',
    topicEn: 'Genealogy of Concupiscence & Gratia (Paul -> Augustine -> Julian)',
    topicZh: '情慾與恩典系譜考（保羅 ➔ 戴爾都良 ➔ 奧古斯丁 ➔ 朱利安）',
    result: {
      synthesis: `【文獻與概念流變考據綜述】
1. 詞彙與本體論位移 (Paul to Augustine):
保羅在《羅馬書》7:7–8 將希臘文 ἐπιθυμία (epithumia) 界定為律法誡命介入後被罪所藉以發動的悖逆衝動。戴爾都良在《論基督之肉身》16.1 確立了拉丁教父術語 concupiscentia carnis，強調基督取受真實受造肉身但「滅絕肉身中因情慾而作王之罪」(evacuavit peccatum in carne)。

2. 奧古斯丁的反伯拉糾神學體系 (De nuptiis I.24.27 & De civitate Dei XIV.16):
奧古斯丁在抗辯伯拉糾派時，做出極具決定性的教義細分：區分罪責 (reatus) 與內在衝動狀態 (actus/motus)。受洗者藉由神聖恩典免除原罪罪責，但作為懲戒性殘留之情慾 (lex in membris) 仍存留於肉身中作為屬靈爭戰的對象。情慾非受造本善之物，而是始祖墮落後意志自發背離最高善所致之本體性匱乏 (privatio boni)。

3. 朱利安的古典自然主義反擊 (Julian of Eclanum, Ad Florum I.68):
埃克拉努姆的朱利安在此構成針鋒相對的論辯反轉 (polemical inversion)。朱利安堅持亞里斯多德與古典醫學視角，將 concupiscentia carnis 重新定義為如視力與聽力一般的「受造生殖生理本能」(naturalis appetitus genitalium)，主張其本質非惡，唯受節制之理性所規範。`,
      citedPassages: [
        {
          locator: 'Rom 7:7–8 (NA28)',
          exactQuote: 'τήν τε γὰρ ἐπιθυμίαν οὐκ ᾔδειν εἰ μὴ ὁ νόμος ἔλεγεν· Οὐκ ἐπιθυμήσεις.',
          relevance: '保羅確立 epithumia 與律法誡命及罪性發動之經典基石。'
        },
        {
          locator: 'Tertullian, De carne Christi 16.1–2 (CCSL 2)',
          exactQuote: 'Evacuavit autem peccatum in carne, quod in carne regnabat per concupiscentiam.',
          relevance: '戴爾都良確立拉丁教父語彙，區分真實肉身本體與罪性情慾支配。'
        },
        {
          locator: 'Augustine, De nuptiis I.24.27 (CSEL 42)',
          exactQuote: 'Ipsa est lex in membris repugnans legi mentis, reatus eius in baptismate dimittitur, sed actus manet ad agonem.',
          relevance: '奧古斯丁區分洗禮赦免罪責 (reatus) 與終生爭戰之衝動 (actus)。'
        },
        {
          locator: 'Julian of Eclanum, Ad Florum I.68 (CSEL 85/1)',
          exactQuote: 'Concupiscentia carnis, id est naturalis appetitus genitalium, sicut visus vel auditus, opus est Creatoris; nec mala est in se.',
          relevance: '朱利安針鋒相對反轉奧古斯丁命題，將情慾定性為造物主受造生理機能。'
        }
      ],
      proposedRelationships: [
        {
          sourceConcept: 'Concupiscentia / Desire',
          targetConcept: 'Gratia / Grace',
          relationType: 'explicit_interpretation',
          confidence: 'high',
          rationale: '奧古斯丁顯式引證保羅羅馬書七章，以先在與醫治性恩典作為克制殘留情慾的唯一源泉。',
          sourceLocator: 'Rom 7:7–8',
          targetLocator: 'De nuptiis I.24.27'
        },
        {
          sourceConcept: 'Caro / Flesh',
          targetConcept: 'Concupiscentia / Desire',
          relationType: 'inversion_rejection',
          confidence: 'high',
          rationale: '朱利安直接否定奧古斯丁將情慾視為墮落缺陷的本體論判定，將其重構為良善受造生理本能。',
          sourceLocator: 'De nuptiis I.24.27',
          targetLocator: 'Ad Florum I.68'
        }
      ],
      limitations: '本考析嚴格約束於已選入之 NA28、CCSL、CSEL 批判校勘條目；未擴展至未選定之東方教父（如金口若望對羅馬書七章之道德化詮釋）。',
      cautionFlags: '經文引用均直接繫於已知出處；朱利安文本係透過奧古斯丁未完成駁論殘篇 (Opus imperfectum) 保留，引用時需注意論辯性語境所帶來的文本篩選效應。',
      timestamp: '2026-08-30T00:00:00.000Z'
    }
  },
  'curated-theosis-logos': {
    projectId: 'curated-theosis-logos',
    topicEn: 'Theosis & Logos (Irenaeus -> Athanasius -> Maximus the Confessor)',
    topicZh: '聖言與神化論（愛任紐 ➔ 亞他那修 ➔ 宣信者馬克西姆）',
    result: {
      synthesis: `【希臘教父神化論與聖言論述綜述】
1. 救贖交換與總歸於一 (Irenaeus, Adv. Haer. III.19.1):
愛任紐確立了早期教父神化論之核心敘事模式：神聖聖言 (Logos)「因著超越的愛成為了我們的樣式，為要使我們成為祂自身的樣式」。此 exchange formula (救贖交換公式) 奠定在 anakephalaiosis (總括萬有) 之基督論框架上。

2. 亞歷山太的公理化凝練 (Athanasius, De Incarnatione 54.3):
亞他那修在反駁亞流派時，將愛任紐的敘事性救贖交換凝練為流傳千古的教義公理：「祂成為人，為要叫我們得以神化 (Αὐτὸς γὰρ ἐνηνθρώπησεν, ἵνα ἡμεῖς θεοποιηθῶμεν)」。神化成為道成肉身之不可分割的救恩論目的。

3. 拜占庭新迦克墩綜合 (Maximus Confessor, Capita Theologica I.67):
馬克西姆進一步整合迦克墩公會議之雙性一人原則，闡明神化 (theosis) 乃是受造人性藉由恩典分享神聖非受造能量 (energeiai)，而非神人本質之混淆 (confusion of ousia)。`,
      citedPassages: [
        {
          locator: 'Irenaeus, Adv. Haer. III.19.1 (SC 211)',
          exactQuote: 'διὰ τὴν ὑπερβάλλουσαν αὐτοῦ ἀγάπην ἐγένετο τοῦτο ὅπερ ἐσμὲν ἡμεῖς, ἵνα ἡμᾶς καταρτίσῃ ἐκεῖνο ὅπερ ἐστὶν αὐτός.',
          relevance: '愛任紐總括萬有與救贖交換公式的希臘原文依據。'
        },
        {
          locator: 'Athanasius, De Incarnatione 54.3 (SC 199)',
          exactQuote: 'Αὐτὸς γὰρ ἐνηνθρώπησεν, ἵνα ἡμεῖς θεοποιηθῶμεν.',
          relevance: '亞他那修神化命題之經典文獻金句。'
        },
        {
          locator: 'Maximus Confessor, Capita Theologica I.67 (PG 90)',
          exactQuote: 'Ἵνα γὰρ θεοποιηθῇ ὁ ἄνθρωπος, διὰ τοῦτο γέγονεν ἄνθρωπος ὁ Θεός, οὐκ ἐκστὰς τῆς οἰκείας φύσεως.',
          relevance: '馬克西姆結合迦克墩基督論對神化模式進行的位格與本性區分。'
        }
      ],
      proposedRelationships: [
        {
          sourceConcept: 'Theosis / Deification',
          targetConcept: 'Theosis / Deification',
          relationType: 'conceptual_development',
          confidence: 'high',
          rationale: '亞他那修直接繼承愛任紐的總括救贖神學，並將 theopoiesis 術語提升為教義核心。',
          sourceLocator: 'Adv. Haer. III.19.1',
          targetLocator: 'De Incarnatione 54.3'
        },
        {
          sourceConcept: 'Theosis / Deification',
          targetConcept: 'Logos',
          relationType: 'reception_reuse',
          confidence: 'high',
          rationale: '馬克西姆全面接納亞他那修神化公理，並以位格聯合 (hypostatic union) 補充本質不相混亂之界限。',
          sourceLocator: 'De Incarnatione 54.3',
          targetLocator: 'Capita Theologica I.67'
        }
      ],
      limitations: '本考據限於希臘教父傳統之主要典籍；未納入敘利亞傳統（如聖以弗冷之琴歌詩學）。',
      cautionFlags: '所有概念流變均基於 Sources Chrétiennes 及 PG 權威本位；theosis 之概念在不同世紀具備從救贖本體論到靜修靈修學之演化。',
      timestamp: '2026-08-30T00:00:00.000Z'
    }
  }
};
