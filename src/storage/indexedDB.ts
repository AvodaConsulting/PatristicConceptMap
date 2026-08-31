import { ResearchProject, SourceRecord, Passage, EvidenceCard, VerifiedSecondaryLiterature } from '../types';

const DB_NAME = 'PatristicConceptAtlasDB';
const DB_VERSION = 2;

const STORES = {
  PROJECTS: 'projects',
  SOURCES: 'sources',
  PASSAGES: 'passages',
  EVIDENCE_CARDS: 'evidence_cards',
  SECONDARY_LITERATURE: 'secondary_literature',
  APP_SETTINGS: 'app_settings'
} as const;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
        db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.SOURCES)) {
        const sourceStore = db.createObjectStore(STORES.SOURCES, { keyPath: 'id' });
        sourceStore.createIndex('projectId', 'projectId', { unique: false });
        sourceStore.createIndex('verificationStatus', 'verificationStatus', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.PASSAGES)) {
        const passageStore = db.createObjectStore(STORES.PASSAGES, { keyPath: 'id' });
        passageStore.createIndex('projectId', 'projectId', { unique: false });
        passageStore.createIndex('sourceId', 'sourceId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.EVIDENCE_CARDS)) {
        const cardStore = db.createObjectStore(STORES.EVIDENCE_CARDS, { keyPath: 'id' });
        cardStore.createIndex('projectId', 'projectId', { unique: false });
        cardStore.createIndex('sourcePassageId', 'sourcePassageId', { unique: false });
        cardStore.createIndex('targetPassageId', 'targetPassageId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.SECONDARY_LITERATURE)) {
        const litStore = db.createObjectStore(STORES.SECONDARY_LITERATURE, { keyPath: 'id' });
        litStore.createIndex('projectId', 'projectId', { unique: false });
        litStore.createIndex('doi', 'doi', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.APP_SETTINGS)) {
        db.createObjectStore(STORES.APP_SETTINGS, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runTransaction<T>(
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      let requestResult: any = undefined;

      try {
        const req = callback(store);
        if (req) {
          req.onsuccess = () => {
            requestResult = req.result;
          };
        }
      } catch (err) {
        reject(err);
        return;
      }

      transaction.oncomplete = () => resolve(requestResult);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(new Error('Transaction aborted'));
    });
  });
}

export const dbService = {
  // Projects
  async getProjects(): Promise<ResearchProject[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PROJECTS, 'readonly');
      const store = tx.objectStore(STORES.PROJECTS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async getProject(id: string): Promise<ResearchProject | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PROJECTS, 'readonly');
      const store = tx.objectStore(STORES.PROJECTS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  },

  async saveProject(project: ResearchProject): Promise<void> {
    await runTransaction(STORES.PROJECTS, 'readwrite', (store) => store.put(project));
  },

  async deleteProject(id: string): Promise<void> {
    const db = await openDB();
    const storesToOpen: string[] = [STORES.PROJECTS, STORES.SOURCES, STORES.PASSAGES, STORES.EVIDENCE_CARDS];
    if (db.objectStoreNames.contains(STORES.SECONDARY_LITERATURE)) {
      storesToOpen.push(STORES.SECONDARY_LITERATURE);
    }
    const tx = db.transaction(storesToOpen, 'readwrite');
    
    // Delete project
    tx.objectStore(STORES.PROJECTS).delete(id);

    // Delete associated sources
    const sourceStore = tx.objectStore(STORES.SOURCES);
    const sourceIndex = sourceStore.index('projectId');
    const sourceReq = sourceIndex.getAllKeys(id);
    sourceReq.onsuccess = () => {
      for (const key of sourceReq.result) {
        sourceStore.delete(key);
      }
    };

    // Delete associated passages
    const passageStore = tx.objectStore(STORES.PASSAGES);
    const passageIndex = passageStore.index('projectId');
    const passageReq = passageIndex.getAllKeys(id);
    passageReq.onsuccess = () => {
      for (const key of passageReq.result) {
        passageStore.delete(key);
      }
    };

    // Delete associated evidence cards
    const cardStore = tx.objectStore(STORES.EVIDENCE_CARDS);
    const cardIndex = cardStore.index('projectId');
    const cardReq = cardIndex.getAllKeys(id);
    cardReq.onsuccess = () => {
      for (const key of cardReq.result) {
        cardStore.delete(key);
      }
    };

    // Delete associated secondary literature
    if (db.objectStoreNames.contains(STORES.SECONDARY_LITERATURE)) {
      const litStore = tx.objectStore(STORES.SECONDARY_LITERATURE);
      const litIndex = litStore.index('projectId');
      const litReq = litIndex.getAllKeys(id);
      litReq.onsuccess = () => {
        for (const key of litReq.result) {
          litStore.delete(key);
        }
      };
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  // Sources
  async getSources(projectId: string): Promise<SourceRecord[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SOURCES, 'readonly');
      const store = tx.objectStore(STORES.SOURCES);
      const index = store.index('projectId');
      const req = index.getAll(projectId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async saveSource(source: SourceRecord): Promise<void> {
    await runTransaction(STORES.SOURCES, 'readwrite', (store) => store.put(source));
  },

  async saveSourcesBulk(sources: SourceRecord[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SOURCES, 'readwrite');
      const store = tx.objectStore(STORES.SOURCES);
      for (const src of sources) {
        store.put(src);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async deleteSource(id: string): Promise<void> {
    await runTransaction(STORES.SOURCES, 'readwrite', (store) => store.delete(id));
  },

  // Passages
  async getPassages(projectId: string): Promise<Passage[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PASSAGES, 'readonly');
      const store = tx.objectStore(STORES.PASSAGES);
      const index = store.index('projectId');
      const req = index.getAll(projectId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async savePassage(passage: Passage): Promise<void> {
    await runTransaction(STORES.PASSAGES, 'readwrite', (store) => store.put(passage));
  },

  async savePassagesBulk(passages: Passage[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PASSAGES, 'readwrite');
      const store = tx.objectStore(STORES.PASSAGES);
      for (const p of passages) {
        store.put(p);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async deletePassage(id: string): Promise<void> {
    await runTransaction(STORES.PASSAGES, 'readwrite', (store) => store.delete(id));
  },

  // Evidence Cards
  async getEvidenceCards(projectId: string): Promise<EvidenceCard[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.EVIDENCE_CARDS, 'readonly');
      const store = tx.objectStore(STORES.EVIDENCE_CARDS);
      const index = store.index('projectId');
      const req = index.getAll(projectId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async saveEvidenceCard(card: EvidenceCard): Promise<void> {
    await runTransaction(STORES.EVIDENCE_CARDS, 'readwrite', (store) => store.put(card));
  },

  async saveEvidenceCardsBulk(cards: EvidenceCard[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.EVIDENCE_CARDS, 'readwrite');
      const store = tx.objectStore(STORES.EVIDENCE_CARDS);
      for (const card of cards) {
        store.put(card);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async deleteEvidenceCard(id: string): Promise<void> {
    await runTransaction(STORES.EVIDENCE_CARDS, 'readwrite', (store) => store.delete(id));
  },

  // Secondary Literature (OpenAlex / Crossref / Scite)
  async getSecondaryLiterature(projectId: string): Promise<VerifiedSecondaryLiterature[]> {
    const db = await openDB();
    if (!db.objectStoreNames.contains(STORES.SECONDARY_LITERATURE)) {
      return [];
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SECONDARY_LITERATURE, 'readonly');
      const store = tx.objectStore(STORES.SECONDARY_LITERATURE);
      const index = store.index('projectId');
      const req = index.getAll(projectId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async saveSecondaryPaper(paper: VerifiedSecondaryLiterature): Promise<void> {
    const db = await openDB();
    if (!db.objectStoreNames.contains(STORES.SECONDARY_LITERATURE)) {
      return;
    }
    await runTransaction(STORES.SECONDARY_LITERATURE, 'readwrite', (store) => store.put(paper));
  },

  async saveSecondaryLiteratureBulk(papers: VerifiedSecondaryLiterature[]): Promise<void> {
    const db = await openDB();
    if (!db.objectStoreNames.contains(STORES.SECONDARY_LITERATURE)) {
      return;
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SECONDARY_LITERATURE, 'readwrite');
      const store = tx.objectStore(STORES.SECONDARY_LITERATURE);
      for (const p of papers) {
        store.put(p);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async deleteSecondaryPaper(id: string): Promise<void> {
    const db = await openDB();
    if (!db.objectStoreNames.contains(STORES.SECONDARY_LITERATURE)) {
      return;
    }
    await runTransaction(STORES.SECONDARY_LITERATURE, 'readwrite', (store) => store.delete(id));
  }
};
