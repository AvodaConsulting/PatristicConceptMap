export type Locale = 'en' | 'zh-Hant';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  nav: {
    projects: string;
    sources: string;
    passages: string;
    evidence: string;
    genealogy: string;
    timeline: string;
    boundedAi: string;
    literature: string;
    dossier: string;
    testSuite: string;
  };
  provenance: {
    title: string;
    attested: string;
    provisional: string;
    discovery_lead: string;
    unsupported: string;
    attestedDesc: string;
    provisionalDesc: string;
    discoveryDesc: string;
    integrityNotice: string;
    immutableChecksum: string;
    unverifiedWarning: string;
  };
  actions: {
    createProject: string;
    importPacket: string;
    exportPacket: string;
    addSource: string;
    addPassage: string;
    createEvidenceCard: string;
    runAnalysis: string;
    exportReport: string;
    filter: string;
    search: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    inspect: string;
    zoomIn: string;
    zoomOut: string;
    fitScreen: string;
    center: string;
    toggleLabels: string;
    close: string;
    apiKeySettings: string;
    forgetKey: string;
    saveKey: string;
    validateKey: string;
    downloadCsvTemplate: string;
    downloadJsonTemplate: string;
    curatedSamplePacket: string;
  };
  fields: {
    title: string;
    researchQuestion: string;
    methodology: string;
    author: string;
    work: string;
    language: string;
    century: string;
    dateRange: string;
    certainty: string;
    authenticity: string;
    provider: string;
    clavisId: string;
    tlgId: string;
    ctsUrn: string;
    edition: string;
    translator: string;
    locator: string;
    originalText: string;
    translation: string;
    concepts: string[];
    relationType: string;
    confidence: string;
    relationBasis: string;
    scholarRationale: string;
    aiInterpretation: string;
    reviewerNotes: string;
    cautionNote: string;
    status: string;
    tradition: string;
  };
  relationTypes: Record<string, string>;
  traditions: Record<string, string>;
  languages: Record<string, string>;
  certainties: Record<string, string>;
  authenticities: Record<string, string>;
  confidences: Record<string, string>;
  checklist: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    step6: string;
    step7: string;
    completed: string;
    inProgress: string;
    notStarted: string;
  };
  aiAnalysis: {
    title: string;
    subtitle: string;
    selectPassages: string;
    actionAnalyzePassage: string;
    actionComparePassages: string;
    actionExplainCard: string;
    actionSynthesis: string;
    actionGaps: string;
    evidenceUsedHeading: string;
    claimsSupportedHeading: string;
    unresolvedQuestionsHeading: string;
    claimsRequiringVerificationHeading: string;
    scholarlySynthesisHeading: string;
    methodologicalNotice: string;
    noKeyWarning: string;
    keyConfigPrompt: string;
    onlyAttestedNotice: string;
  };
  apiKeyModal: {
    title: string;
    description: string;
    privacyNote: string;
    placeholder: string;
    validating: string;
    success: string;
    error: string;
    notConfigured: string;
    configured: string;
  };
  literature: {
    title: string;
    subtitle: string;
    triSourceBadge: string;
    searchPlaceholder: string;
    searchButton: string;
    auditButton: string;
    verifying: string;
    presetsTitle: string;
    savedLiterature: string;
    noSavedLiterature: string;
    linkToPassages: string;
    linkToEvidenceCard: string;
    saveToProject: string;
    removeFromProject: string;
    openAlexLabel: string;
    crossrefLabel: string;
    sciteLabel: string;
    smartCitationsHeading: string;
    supportingCount: string;
    mentioningCount: string;
    contrastingCount: string;
    disputeWarning: string;
    supportedBadge: string;
    openAccess: string;
    closedAccess: string;
    responsibleVerdictTitle: string;
    auditNotesTitle: string;
    conceptTags: string;
    researcherNotesPlaceholder: string;
    copyCitation: string;
    citationCopied: string;
    verdictHighlyCredible: string;
    verdictCredibleNeutral: string;
    verdictDebatedCaution: string;
    verdictInsufficient: string;
    manualDoiPrompt: string;
  };
}

export const translations: Record<Locale, TranslationDictionary> = {
  en: {
    appName: 'Patristic Concept Atlas',
    appSubtitle: 'A Source-Attested Genealogy of Concepts in Early Christianity',
    nav: {
      projects: 'Workspace',
      sources: 'Source Registry',
      passages: 'Passage Reader',
      evidence: 'Evidence Cards',
      genealogy: 'Concept Genealogy Graph',
      timeline: 'Timeline & Topography',
      boundedAi: 'Bounded AI Analysis',
      literature: 'Secondary Literature & Scite Audit',
      dossier: 'Research Dossier',
      testSuite: 'Quality Gates'
    },
    provenance: {
      title: 'Scholarly Provenance & Integrity Gate',
      attested: 'Attested Record',
      provisional: 'Provisional Record',
      discovery_lead: 'Discovery Lead (Unverified)',
      unsupported: 'Unsupported (Excluded)',
      attestedDesc: 'Exact critical locator verified against stable edition (CSEL, CCSL, SC, GCS, PTA).',
      provisionalDesc: 'Supplied by researcher; pending secondary collation against critical apparatus.',
      discoveryDesc: 'From preliminary database query (e.g. Perseus scrape). No scholarly claim permitted.',
      integrityNotice: 'The Atlas never fabricates nodes or links. Graph connections require attested evidence cards with exact textual locators.',
      immutableChecksum: 'Passage snapshot verified via immutable cryptographic checksum.',
      unverifiedWarning: 'Perseus and external discovery sources require collation against authoritative critical editions.'
    },
    actions: {
      createProject: 'Create Project',
      importPacket: 'Import Research Packet',
      exportPacket: 'Export Project Packet (JSON)',
      addSource: 'Register Source',
      addPassage: 'Add Passage Record',
      createEvidenceCard: 'Create Evidence Card',
      runAnalysis: 'Run Bounded Analysis',
      exportReport: 'Export Dossier',
      filter: 'Filter',
      search: 'Search records...',
      cancel: 'Cancel',
      save: 'Save Record',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View Details',
      inspect: 'Inspect Node/Edge',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      fitScreen: 'Fit to Screen',
      center: 'Center View',
      toggleLabels: 'Toggle Line Labels',
      close: 'Close',
      apiKeySettings: 'API Key Settings',
      forgetKey: 'Forget API Key',
      saveKey: 'Apply Key to Session',
      validateKey: 'Validate Key',
      downloadCsvTemplate: 'Download CSV Template',
      downloadJsonTemplate: 'Download JSON Schema',
      curatedSamplePacket: 'Import Curated Scholarly Packet'
    },
    fields: {
      title: 'Project Title',
      researchQuestion: 'Research Question',
      methodology: 'Methodology & Scope Note',
      author: 'Patristic Author',
      work: 'Work Title',
      language: 'Original Language',
      century: 'Century (CE)',
      dateRange: 'Composition Date Range',
      certainty: 'Chronological Certainty',
      authenticity: 'Authenticity Status',
      provider: 'Source Provider / Series',
      clavisId: 'Clavis Identifier (CPL/CPG)',
      tlgId: 'TLG Identifier',
      ctsUrn: 'CTS URN',
      edition: 'Critical Edition & Volume',
      translator: 'Translator & Version',
      locator: 'Passage Locator (Book.Chapter.Section)',
      originalText: 'Primary Source Text (Original Language)',
      translation: 'Scholarly Translation',
      concepts: ['Concupiscentia / Desire', 'Theosis / Deification', 'Logos', 'Gratia / Grace', 'Sacrificium', 'Caro / Flesh', 'Peccatum / Sin', 'Askesis / Asceticism', 'Soul / Psyche'],
      relationType: 'Relationship Type',
      confidence: 'Evidential Confidence',
      relationBasis: 'Relation Basis',
      scholarRationale: 'Researcher Explanation (Evidence-Based)',
      aiInterpretation: 'AI Model Interpretation (Tagged Distinctly)',
      reviewerNotes: 'Scholarly Peer Review Notes',
      cautionNote: 'Academic Caution Note',
      status: 'Verification Status',
      tradition: 'Theological / Geographical Tradition'
    },
    relationTypes: {
      direct_citation: 'Direct Quotation / Citation',
      explicit_interpretation: 'Explicit Exegetical Interpretation',
      lexical_continuity: 'Lexical & Terminological Continuity',
      translation_interpretation: 'Translation & Concept Transmission',
      conceptual_development: 'Direct Conceptual Development',
      inversion_rejection: 'Polemics, Rejection or Inversion',
      parallel_resonance: 'Parallel Tradition / Independent Resonance',
      reception_reuse: 'Structural Reception & Reuse',
      disputed_proposal: 'Disputed Scholarly Proposal'
    },
    traditions: {
      'Latin/North African': 'Latin / North African (Tertullian, Cyprian, Augustine)',
      'Alexandrian': 'Alexandrian (Clement, Origen, Athanasius, Cyril)',
      'Antiochene': 'Antiochene (John Chrysostom, Theodore of Mopsuestia)',
      'Cappadocian': 'Cappadocian (Basil, Gregory of Nazianzus, Gregory of Nyssa)',
      'Syriac': 'Syriac (Ephrem the Syrian, Aphrahat, Narsai)',
      'Gallic': 'Gallic (Irenaeus of Lyons, John Cassian, Vincent of Lérins)',
      'Palestinian': 'Palestinian (Justin Martyr, Eusebius of Caesarea)',
      'Roman': 'Early Roman (Clement of Rome, Hippolytus)',
      'Other': 'Other Patristic Context'
    },
    languages: {
      la: 'Latin (Latina)',
      grc: 'Ancient Greek (Ἑλληνική)',
      syr: 'Classical Syriac (ܠܫܢܐ ܣܘܪܝܝܐ)',
      cop: 'Coptic (ⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ)',
      arm: 'Classical Armenian (Գրաբար)',
      he: 'Hebrew (עִבְרִית)',
      other: 'Other Ancient Language'
    },
    certainties: {
      exact: 'Exact (Firmly dated)',
      probable: 'Probable (Narrow historical consensus)',
      approximate: 'Approximate (Within ~25-50 years)',
      contested: 'Contested (Compromised or disputed dating)',
      unknown: 'Unknown'
    },
    authenticities: {
      authentic: 'Authentic Critical Text',
      spuria_pseudepigrapha: 'Pseudepigrapha / Spuria',
      dubia: 'Dubia (Attribution Disputed)',
      fragmentary: 'Fragmentary Catena / Excerpt'
    },
    confidences: {
      high: 'High Confidence (Direct textual corroboration)',
      medium: 'Medium Confidence (Probable lexical/structural link)',
      low: 'Low Confidence (Plausible parallel; warrants caution)'
    },
    checklist: {
      title: 'Scholarly Research Workflow Protocol',
      subtitle: 'Dynamic 7-step checklist verifying actual data integrity in this project',
      step1: '1. Create or Open a Specific Research Project',
      step2: '2. Register Authoritative Source Records (≥ 1 Critical Edition)',
      step3: '3. Transcribe / Ingest Exact Passages with Locators (≥ 2 Passages)',
      step4: '4. Bind Passages with Source-Attested Evidence Cards (≥ 1 Card)',
      step5: '5. Inspect Force-Directed Concept Genealogy Graph',
      step6: '6. Execute Evidence-Bounded AI Analysis on Selected Passages',
      step7: '7. Generate & Export Scholarly Research Dossier',
      completed: 'Complete',
      inProgress: 'In Progress',
      notStarted: 'Pending'
    },
    aiAnalysis: {
      title: 'Evidence-Bounded AI Analysis',
      subtitle: 'Hermeneutic assistance strictly bounded by your attested primary passages',
      selectPassages: 'Select Passages to Analyze:',
      actionAnalyzePassage: '1. Analyze Selected Passage in Historical Context',
      actionComparePassages: '2. Comparative Collation of Selected Passages',
      actionExplainCard: '3. Explicate Evidence Card Lineage',
      actionSynthesis: '4. Draft Source-Attested Research Synthesis',
      actionGaps: '5. Identify Evidential Gaps & Unattested Claims',
      evidenceUsedHeading: 'Primary Evidence Employed (Verbatim Locators)',
      claimsSupportedHeading: 'Claims Supported by Direct Textual Citation',
      unresolvedQuestionsHeading: 'Unresolved Philological & Historical Inquiries',
      claimsRequiringVerificationHeading: 'Claims Requiring External Manuscript Collation',
      scholarlySynthesisHeading: 'Evidence-Bounded Synthesis',
      methodologicalNotice: 'Academic Notice: AI generated text represents interpretive scaffolding, not historical primary evidence. All claims must be verified against critical editions.',
      noKeyWarning: 'Researcher API Key not detected in session storage.',
      keyConfigPrompt: 'Please enter your own Google Gemini API key via the key icon in the navigation bar. Keys are stored only in your temporary browser session storage.',
      onlyAttestedNotice: 'Analysis operates exclusively on passages marked as Attested or Provisional.'
    },
    apiKeyModal: {
      title: 'Researcher Gemini API Key',
      description: 'To maintain academic integrity and multi-tenant security, the server never relays or logs API keys. Each researcher enters their own Gemini API key for on-demand analysis.',
      privacyNote: 'Storage Policy: Your key is kept exclusively in browser sessionStorage. It will disappear upon closing the tab and is never persisted to IndexedDB or export files.',
      placeholder: 'Enter your AI Studio API key...',
      validating: 'Validating key via minimal ping...',
      success: 'API Key validated successfully and stored in session.',
      error: 'Invalid API Key or network error. Please verify your key.',
      notConfigured: 'No API Key Configured (Manual tools fully active)',
      configured: 'API Key Active (Session Storage)'
    },
    literature: {
      title: 'Evidence-Backed Scholarly Verification (OpenAlex, Crossref & Scite.ai)',
      subtitle: 'Perform responsible research audits by cross-referencing global catalogs, critical editions, and smart citation sentiment tallies.',
      triSourceBadge: 'Triple-Verified: OpenAlex + Crossref + Scite.ai',
      searchPlaceholder: 'Enter DOI (e.g. 10.1163/187254706X149721) or paper title / patristic search query...',
      searchButton: 'Search OpenAlex & Crossref',
      auditButton: 'Triple-Check & Audit with Scite',
      verifying: 'Connecting to OpenAlex, Crossref & Scite APIs...',
      presetsTitle: 'Authoritative Patristic Studies (Quick Audit Presets)',
      savedLiterature: 'Project Secondary Bibliography',
      noSavedLiterature: 'No secondary literature records saved in this project yet. Search and audit papers above to link them to your passages.',
      linkToPassages: 'Link to Passages',
      linkToEvidenceCard: 'Link to Evidence Card',
      saveToProject: 'Save to Project Bibliography',
      removeFromProject: 'Remove from Project',
      openAlexLabel: 'OpenAlex Catalog',
      crossrefLabel: 'Crossref Metadata',
      sciteLabel: 'Scite.ai Smart Citations',
      smartCitationsHeading: 'Scite.ai Citation Sentiment Breakdown',
      supportingCount: 'Supporting Citations',
      mentioningCount: 'Mentioning Citations',
      contrastingCount: 'Contrasting / Disputed Citations',
      disputeWarning: 'High Dispute Notice: Over 25% of citing literature reports contrasting or contested findings.',
      supportedBadge: 'Strong Scholarly Consensus: Citing studies overwhelmingly corroborate this claim.',
      openAccess: 'Open Access (Free PDF Available)',
      closedAccess: 'Subscription / Paywalled',
      responsibleVerdictTitle: 'Responsible Research Verdict',
      auditNotesTitle: 'Methodological Audit Notes',
      conceptTags: 'Academic Concepts & Field Tags',
      researcherNotesPlaceholder: 'Add critical appraisal notes or notes on how this paper relates to primary Greek/Latin sources...',
      copyCitation: 'Copy Citation',
      citationCopied: 'Citation Copied!',
      verdictHighlyCredible: 'Highly Credible & Supported',
      verdictCredibleNeutral: 'Credible & Neutral',
      verdictDebatedCaution: 'Debated / Requires Caution',
      verdictInsufficient: 'Insufficient External Records',
      manualDoiPrompt: 'Audit via DOI'
    }
  },
  'zh-Hant': {
    appName: '教父學概念圖譜',
    appSubtitle: '早期基督宗教概念之源文依據與思想譜系考證',
    nav: {
      projects: '研究工作區',
      sources: '文獻出處檔案庫',
      passages: '原始經文閱讀器',
      evidence: '考據證據卡',
      genealogy: '概念譜系力導向圖',
      timeline: '年代序列與思想地貌',
      boundedAi: '源文約束型 AI 考析',
      literature: '現代學術考證 (OpenAlex/Scite)',
      dossier: '學術研究檔案報告',
      testSuite: '學術品管閘門'
    },
    provenance: {
      title: '文獻源流學術可信度閘門',
      attested: '源文實證記錄 (Attested)',
      provisional: '暫定記錄 (Provisional)',
      discovery_lead: '線索發現記錄 (Discovery Lead)',
      unsupported: '無依據排除 (Unsupported)',
      attestedDesc: '具備權威批判校勘本（如 CSEL, CCSL, SC, GCS, PTA）之精確章節出處與穩定文字。',
      provisionalDesc: '由學者登錄，但尚未經對校批判校勘本或手稿異文之第二重複核。',
      discoveryDesc: '源自初步資料庫檢索（如 Perseus 初譯抓取）。不可作為定論學術主張。',
      integrityNotice: '本圖譜絕不虛構節點或連線。所有概念關聯必須繫於附有確切出處之實證證據卡。',
      immutableChecksum: '經文快照已透過不可篡改的加密校驗和（Checksum）予以鎖定。',
      unverifiedWarning: 'Perseus 等初步發現來源必須與權威學術校勘本進行人工比對審查。'
    },
    actions: {
      createProject: '建立新研究專案',
      importPacket: '匯入研究資料包',
      exportPacket: '匯出專案封包 (JSON)',
      addSource: '登錄古文獻出處',
      addPassage: '新增經文選段',
      createEvidenceCard: '建立考據證據卡',
      runAnalysis: '執行源文約束考析',
      exportReport: '匯出研究檔案',
      filter: '篩選過濾',
      search: '檢索文獻或概念...',
      cancel: '取消',
      save: '儲存記錄',
      delete: '刪除',
      edit: '編輯',
      view: '檢視詳情',
      inspect: '檢視節點／關聯',
      zoomIn: '放大視圖',
      zoomOut: '縮小視圖',
      fitScreen: '符合螢幕',
      center: '置中',
      toggleLabels: '切換關係文字',
      close: '關閉',
      apiKeySettings: 'API 金鑰設定',
      forgetKey: '清除金鑰 (Session)',
      saveKey: '儲存至瀏覽器會話',
      validateKey: '驗證金鑰',
      downloadCsvTemplate: '下載 CSV 匯入範本',
      downloadJsonTemplate: '下載 JSON 規範綱要',
      curatedSamplePacket: '匯入權威教父學精選範例包'
    },
    fields: {
      title: '專案名稱',
      researchQuestion: '核心研究問題 / 論題',
      methodology: '方法論與界限備忘',
      author: '教父／古代作者',
      work: '著作名稱',
      language: '原始語言',
      century: '世紀 (公元紀年)',
      dateRange: '成書年代範圍',
      certainty: '斷代確定度',
      authenticity: '真偽判定',
      provider: '出版叢書／資料來源',
      clavisId: '教父目錄編號 (CPL/CPG)',
      tlgId: 'TLG 希臘文庫編號',
      ctsUrn: 'CTS 統一資源名稱 (URN)',
      edition: '校勘本卷期與主編',
      translator: '譯者與版本',
      locator: '章節出處 (卷.章.節)',
      originalText: '原始語言原文 (希臘文／拉丁文／敘利亞文等)',
      translation: '學術翻譯文本',
      concepts: ['欲念 / 情慾 (Concupiscentia)', '神化 (Theosis)', '聖言 / 邏各斯 (Logos)', '恩典 (Gratia)', '祭獻 / 犧牲 (Sacrificium)', '肉軀 (Caro)', '罪 (Peccatum)', '靈修禁慾 (Askesis)', '靈魂 (Psyche/Anima)'],
      relationType: '關聯類型',
      confidence: '考據可信度',
      relationBasis: '關聯論據基礎',
      scholarRationale: '學者實證論述依據',
      aiInterpretation: 'AI 詮釋建議（明確標記）',
      reviewerNotes: '同儕審查註記',
      cautionNote: '學術慎審備忘',
      status: '查證狀態',
      tradition: '神學思想／地域傳統'
    },
    relationTypes: {
      direct_citation: '直接引用／徵引 (Direct Quotation)',
      explicit_interpretation: '明確釋經與詮釋 (Explicit Exegesis)',
      lexical_continuity: '詞彙與術語延續 (Lexical Continuity)',
      translation_interpretation: '譯本跨語言轉譯詮釋 (Translation)',
      conceptual_development: '概念深化與邏輯發展 (Conceptual Development)',
      inversion_rejection: '論戰駁斥與立場倒轉 (Polemics / Rejection)',
      parallel_resonance: '平行傳統／獨立思想共鳴 (Parallel Resonance)',
      reception_reuse: '結構性繼承與再利用 (Reception & Reuse)',
      disputed_proposal: '具爭議之學界假說 (Disputed Proposal)'
    },
    traditions: {
      'Latin/North African': '拉丁／北非傳統 (戴爾都良、居普良、奧古斯丁)',
      'Alexandrian': '亞歷山大里亞學派 (革利免、俄利根、亞他那修、濟利祿)',
      'Antiochene': '安提阿學派 (金口若望、摩普綏提亞的狄奧多羅)',
      'Cappadocian': '加帕多家學派 (巴西流、納齊安的貴格利、尼撒的貴格利)',
      'Syriac': '敘利亞傳統 (敘利亞的以法蓮、阿芙拉哈特、納爾賽)',
      'Gallic': '高盧傳統 (里昂的愛任紐、若望·卡西安、萊蘭的味增爵)',
      'Palestinian': '巴勒斯坦傳統 (殉道者猶斯丁、該撒利亞的優西比烏)',
      'Roman': '早期羅馬傳統 (羅馬的革利免、希玻里)',
      'Other': '其他古代教父學脈絡'
    },
    languages: {
      la: '拉丁文 (Latina)',
      grc: '古希臘文 (Ἑλληνική)',
      syr: '古典敘利亞文 (ܠܫܢܐ ܣܘܪܝܝܐ)',
      cop: '科普特文 (ⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ)',
      arm: '古典亞美尼亞文 (Գրաբար)',
      he: '希伯來文 (עִבְרִית)',
      other: '其他古代語言'
    },
    certainties: {
      exact: '確定 (有明確文獻或歷史年表)',
      probable: '高度可能 (學界共識約略年代)',
      approximate: '約略 (誤差約 25–50 年)',
      contested: '具爭議 (學術界斷代歧異顯著)',
      unknown: '未知'
    },
    authenticities: {
      authentic: '真作 (校勘本確認真品)',
      spuria_pseudepigrapha: '偽作 / 假託作品 (Pseudepigrapha)',
      dubia: '存疑作品 (Dubia)',
      fragmentary: '殘篇 / 經文集粹 (Fragmentary / Catena)'
    },
    confidences: {
      high: '高可信度（文本直接印證，出處詳實）',
      medium: '中可信度（具高度詞彙或結構親緣性）',
      low: '低可信度（具啟發性但需審慎對校）'
    },
    checklist: {
      title: '教父學考證標準研究流程',
      subtitle: '動態 7 步驟檢核表，即時核實當前專案資料之學術完整性',
      step1: '1. 建立或開啟特定研究專案',
      step2: '2. 登錄權威出處檔案（至少包含 1 部批判校勘本）',
      step3: '3. 謄錄或匯入帶有精確出處之經文選段（至少 2 段）',
      step4: '4. 建立源文實證證據卡並繫聯經文（至少 1 張）',
      step5: '5. 檢視力導向概念譜系圖譜與思想流派',
      step6: '6. 對所選經文執行源文約束型 AI 考析',
      step7: '7. 產出並匯出完整學術研究檔案報告',
      completed: '已完成',
      inProgress: '進行中',
      notStarted: '未開始'
    },
    aiAnalysis: {
      title: '源文約束型 AI 考析 (Evidence-Bounded AI Analysis)',
      subtitle: '嚴格基於所選古文獻實證選段之詮釋輔助工具',
      selectPassages: '請選擇欲納入考析之經文選段：',
      actionAnalyzePassage: '1. 考析單一選段之歷史神學語境',
      actionComparePassages: '2. 多重選段之跨傳統對校與比較',
      actionExplainCard: '3. 闡釋特定證據卡之思想承傳軌跡',
      actionSynthesis: '4. 草擬源文實證研究綜述 (Synthesis)',
      actionGaps: '5. 診斷文獻論證缺口與未證主張',
      evidenceUsedHeading: '所採納之原始文獻依據（確切出處與原文）',
      claimsSupportedHeading: '獲得直接文本支持之學術論點',
      unresolvedQuestionsHeading: '尚待解決之文獻學與思想史問題',
      claimsRequiringVerificationHeading: '需要對校外部手稿或校勘本之待查論點',
      scholarlySynthesisHeading: '源文約束論述綜述',
      methodologicalNotice: '學術聲明：AI 產出之文字僅為詮釋架構與輔助參考，非古代原始文獻證據。所有引證與結論均須對照批判校勘本。',
      noKeyWarning: '會話暫存中尚未設定學者 Gemini API 金鑰。',
      keyConfigPrompt: '請點擊上方導航列之金鑰圖示輸入個人 Google Gemini API 金鑰。金鑰僅儲存於當前瀏覽器分頁會話（Session Storage），絕不上傳伺服器。',
      onlyAttestedNotice: '考析功能僅對標記為「源文實證」或「暫定」之有效經文生效。'
    },
    apiKeyModal: {
      title: '學者個人 Gemini API 金鑰設定',
      description: '為確保學術資料安全與合規，伺服器不轉發亦不記錄任何金鑰。每位學者請於會話中輸入個人金鑰以啟用考析功能。',
      privacyNote: '安全隱私政策：金鑰僅存於瀏覽器 sessionStorage。分頁關閉後立即銷毀，絕不寫入 IndexedDB 或匯出封包。',
      placeholder: '請輸入您的 Google AI Studio API 金鑰...',
      validating: '正在發送極小驗證請求以測試金鑰...',
      success: 'API 金鑰驗證成功，已安全寫入當前會話。',
      error: 'API 金鑰無效或網路連線失敗，請檢查金鑰權限。',
      notConfigured: '未配置 API 金鑰（手動研究與視覺化功能完全正常運作）',
      configured: 'API 金鑰已就緒（瀏覽器會話存儲）'
    },
    literature: {
      title: '現代二手文獻學術可信度考證 (OpenAlex / Crossref / Scite.ai)',
      subtitle: '三重學術 API 連線驗證：對照全球學術目錄、DOI 詮釋資料與 Scite 智慧引文立場（支持/爭議比例），確保研究負責且具實證背書。',
      triSourceBadge: '三重交叉檢驗：OpenAlex + Crossref + Scite.ai',
      searchPlaceholder: '輸入 DOI（如 10.1163/187254706X149721）或教父學論文標題／關鍵字...',
      searchButton: '檢索 OpenAlex & Crossref',
      auditButton: '執行 Scite 智慧引文三重審查',
      verifying: '正在連線 OpenAlex、Crossref 與 Scite.ai 學術 API...',
      presetsTitle: '權威教父學典範文獻（一鍵快速審查）',
      savedLiterature: '專案已儲存之二手研究書目',
      noSavedLiterature: '本專案尚未儲存二手考證文獻。可於上方搜尋並審查文獻，將其繫聯至經文選段或證據卡。',
      linkToPassages: '繫聯至經文選段',
      linkToEvidenceCard: '繫聯至證據卡',
      saveToProject: '儲存至專案書目',
      removeFromProject: '自專案移除',
      openAlexLabel: 'OpenAlex 學術目錄',
      crossrefLabel: 'Crossref 出版詮釋資料',
      sciteLabel: 'Scite.ai 智慧引文語意分析',
      smartCitationsHeading: 'Scite.ai 引文立場分佈 (Smart Citations)',
      supportingCount: '明確支持引文 (Supporting)',
      mentioningCount: '一般提及引文 (Mentioning)',
      contrastingCount: '提出異議／爭議引文 (Contrasting)',
      disputeWarning: '高爭議預警：引用本文之論文中有超過 25% 提出異議或提出相反論點，引述時須保持批判審慎。',
      supportedBadge: '高度學術共識：後續研究具強烈實證支持，無顯著學術異議。',
      openAccess: '開放取用 (Open Access - 提供免費 PDF)',
      closedAccess: '期刊訂閱／付費限制 (Subscription)',
      responsibleVerdictTitle: '負責任研究審查裁決 (Responsible Verdict)',
      auditNotesTitle: '方法論審查備忘',
      conceptTags: '學術概念與學科分類標籤',
      researcherNotesPlaceholder: '撰寫學者批判評註，或說明該論文如何對應古希臘文／拉丁文原始文本...',
      copyCitation: '複製學術引用格式',
      citationCopied: '引用格式已複製！',
      verdictHighlyCredible: '高可信度且具多重支持',
      verdictCredibleNeutral: '具學術可信度（中性提及）',
      verdictDebatedCaution: '學界存在重大爭議（須審慎論證）',
      verdictInsufficient: '外部索引資料不足',
      manualDoiPrompt: '以 DOI 執行深度審查'
    }
  }
};
