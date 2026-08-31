import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ResearchProject, SourceRecord, Passage, EvidenceCard, VerifiedSecondaryLiterature, ProjectPacket } from '../types';
import { dbService } from '../storage/indexedDB';
import { CURATED_PACKETS } from '../data/curatedPackets';

interface ProjectContextType {
  currentProject: ResearchProject | null;
  projects: ResearchProject[];
  sources: SourceRecord[];
  passages: Passage[];
  evidenceCards: EvidenceCard[];
  secondaryLiterature: VerifiedSecondaryLiterature[];
  loading: boolean;
  selectedPassageIds: string[];
  selectProject: (projectId: string) => Promise<void>;
  createProject: (project: Omit<ResearchProject, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ResearchProject>;
  updateProject: (project: ResearchProject) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  duplicateProject: (projectId: string) => Promise<ResearchProject>;
  
  // Sources
  saveSource: (source: SourceRecord) => Promise<void>;
  deleteSource: (sourceId: string) => Promise<void>;
  
  // Passages
  savePassage: (passage: Passage) => Promise<void>;
  deletePassage: (passageId: string) => Promise<void>;
  togglePassageSelection: (passageId: string) => void;
  selectAllPassages: () => void;
  clearPassageSelection: () => void;
  
  // Evidence Cards
  saveEvidenceCard: (card: EvidenceCard) => Promise<void>;
  deleteEvidenceCard: (cardId: string) => Promise<void>;
  
  // Secondary Literature (OpenAlex / Crossref / Scite)
  saveSecondaryPaper: (paper: VerifiedSecondaryLiterature) => Promise<void>;
  deleteSecondaryPaper: (paperId: string) => Promise<void>;
  
  // Packet import
  importProjectPacket: (packet: ProjectPacket) => Promise<void>;
  loadCuratedPacket: (packetId: string) => Promise<void>;
  resetToCuratedSamples: () => Promise<void>;

  // Checklist verification states
  checklistStatus: {
    hasProject: boolean;
    hasSources: boolean;
    hasPassages: boolean;
    hasEvidenceCards: boolean;
    hasGraphViewed: boolean;
    hasAiRun: boolean;
    hasDossierExported: boolean;
    allComplete: boolean;
  };
  markGraphViewed: () => void;
  markAiRun: () => void;
  markDossierExported: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [currentProject, setCurrentProject] = useState<ResearchProject | null>(null);
  const [sources, setSources] = useState<SourceRecord[]>([]);
  const [passages, setPassages] = useState<Passage[]>([]);
  const [evidenceCards, setEvidenceCards] = useState<EvidenceCard[]>([]);
  const [secondaryLiterature, setSecondaryLiterature] = useState<VerifiedSecondaryLiterature[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPassageIds, setSelectedPassageIds] = useState<string[]>([]);
  
  // Ephemeral research milestones for session
  const [hasGraphViewed, setHasGraphViewed] = useState(false);
  const [hasAiRun, setHasAiRun] = useState(false);
  const [hasDossierExported, setHasDossierExported] = useState(false);

  // Packet import
  const importProjectPacket = async (packet: ProjectPacket) => {
    await dbService.saveProject(packet.project);
    await dbService.saveSourcesBulk(packet.sources);
    await dbService.savePassagesBulk(packet.passages);
    await dbService.saveEvidenceCardsBulk(packet.evidenceCards);
    if (packet.secondaryLiterature && packet.secondaryLiterature.length > 0) {
      await dbService.saveSecondaryLiteratureBulk(packet.secondaryLiterature);
    }

    setProjects(prev => {
      const filtered = prev.filter(p => p.id !== packet.project.id);
      return [packet.project, ...filtered];
    });

    await loadProjectData(packet.project.id, packet.project);
  };

  const loadCuratedPacket = async (packetId: string) => {
    const found = CURATED_PACKETS.find(p => p.project.id === packetId || p.project.curatedPacketId === packetId);
    if (!found) throw new Error('Curated packet not found');
    await importProjectPacket(found);
  };

  const resetToCuratedSamples = async () => {
    setLoading(true);
    try {
      for (const packet of CURATED_PACKETS) {
        await dbService.saveProject(packet.project);
        await dbService.saveSourcesBulk(packet.sources);
        await dbService.savePassagesBulk(packet.passages);
        await dbService.saveEvidenceCardsBulk(packet.evidenceCards);
        if (packet.secondaryLiterature && packet.secondaryLiterature.length > 0) {
          await dbService.saveSecondaryLiteratureBulk(packet.secondaryLiterature);
        }
      }
      const allProjects = await dbService.getProjects();
      setProjects(allProjects);
      if (allProjects.length > 0) {
        await loadProjectData(allProjects[0].id, allProjects[0]);
      }
    } catch (err) {
      console.error('Failed to reset curated samples:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load all projects on mount (auto-seed curated showcase projects if empty)
  const refreshProjects = useCallback(async () => {
    try {
      setLoading(true);
      let allProjects = await dbService.getProjects();
      if (allProjects.length === 0) {
        // Auto-seed default canonical research projects so the user can immediately experience the app
        for (const packet of CURATED_PACKETS) {
          await dbService.saveProject(packet.project);
          await dbService.saveSourcesBulk(packet.sources);
          await dbService.savePassagesBulk(packet.passages);
          await dbService.saveEvidenceCardsBulk(packet.evidenceCards);
          if (packet.secondaryLiterature && packet.secondaryLiterature.length > 0) {
            await dbService.saveSecondaryLiteratureBulk(packet.secondaryLiterature);
          }
        }
        allProjects = await dbService.getProjects();
      }
      setProjects(allProjects);
      if (allProjects.length > 0 && !currentProject) {
        // Load first project by default
        await loadProjectData(allProjects[0].id, allProjects[0]);
      }
    } catch (err) {
      console.error('Failed to load projects from IndexedDB:', err);
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  useEffect(() => {
    refreshProjects();
  }, []);

  const loadProjectData = async (projectId: string, projectObj?: ResearchProject) => {
    const proj = projectObj || (await dbService.getProject(projectId));
    if (!proj) return;
    
    setCurrentProject(proj);
    const [pSources, pPassages, pCards, pLit] = await Promise.all([
      dbService.getSources(projectId),
      dbService.getPassages(projectId),
      dbService.getEvidenceCards(projectId),
      dbService.getSecondaryLiterature(projectId)
    ]);
    
    setSources(pSources);
    setPassages(pPassages);
    setEvidenceCards(pCards);
    setSecondaryLiterature(pLit);
    // Select first 2-3 passages by default for analysis convenience
    setSelectedPassageIds(pPassages.slice(0, 3).map(p => p.id));
  };

  const selectProject = async (projectId: string) => {
    setLoading(true);
    await loadProjectData(projectId);
    setLoading(false);
  };

  const createProject = async (
    projectData: Omit<ResearchProject, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ResearchProject> => {
    const newProject: ResearchProject = {
      ...projectData,
      id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await dbService.saveProject(newProject);
    setProjects(prev => [newProject, ...prev]);
    await loadProjectData(newProject.id, newProject);
    return newProject;
  };

  const updateProject = async (project: ResearchProject) => {
    const updated = { ...project, updatedAt: new Date().toISOString() };
    await dbService.saveProject(updated);
    setCurrentProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProject = async (projectId: string) => {
    await dbService.deleteProject(projectId);
    const remaining = projects.filter(p => p.id !== projectId);
    setProjects(remaining);
    if (currentProject?.id === projectId) {
      if (remaining.length > 0) {
        await loadProjectData(remaining[0].id, remaining[0]);
      } else {
        setCurrentProject(null);
        setSources([]);
        setPassages([]);
        setEvidenceCards([]);
        setSelectedPassageIds([]);
      }
    }
  };

  const duplicateProject = async (projectId: string): Promise<ResearchProject> => {
    const srcProj = await dbService.getProject(projectId);
    if (!srcProj) throw new Error('Project not found to duplicate');
    
    const [pSources, pPassages, pCards] = await Promise.all([
      dbService.getSources(projectId),
      dbService.getPassages(projectId),
      dbService.getEvidenceCards(projectId)
    ]);

    const newProjId = `proj-dup-${Date.now()}`;
    const duplicatedProj: ResearchProject = {
      ...srcProj,
      id: newProjId,
      title: `${srcProj.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const sourceMap = new Map<string, string>();
    const dupSources: SourceRecord[] = pSources.map(s => {
      const newId = `src-dup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      sourceMap.set(s.id, newId);
      return { ...s, id: newId, projectId: newProjId };
    });

    const passageMap = new Map<string, string>();
    const dupPassages: Passage[] = pPassages.map(p => {
      const newId = `pas-dup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      passageMap.set(p.id, newId);
      return {
        ...p,
        id: newId,
        projectId: newProjId,
        sourceId: sourceMap.get(p.sourceId) || p.sourceId
      };
    });

    const dupCards: EvidenceCard[] = pCards.map(c => {
      const newId = `ec-dup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      return {
        ...c,
        id: newId,
        projectId: newProjId,
        sourcePassageId: passageMap.get(c.sourcePassageId) || c.sourcePassageId,
        targetPassageId: c.targetPassageId ? (passageMap.get(c.targetPassageId) || c.targetPassageId) : undefined
      };
    });

    await dbService.saveProject(duplicatedProj);
    await dbService.saveSourcesBulk(dupSources);
    await dbService.savePassagesBulk(dupPassages);
    await dbService.saveEvidenceCardsBulk(dupCards);

    setProjects(prev => [duplicatedProj, ...prev]);
    await loadProjectData(newProjId, duplicatedProj);
    return duplicatedProj;
  };

  // Sources
  const saveSource = async (source: SourceRecord) => {
    await dbService.saveSource(source);
    setSources(prev => {
      const idx = prev.findIndex(s => s.id === source.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = source;
        return next;
      }
      return [source, ...prev];
    });
  };

  const deleteSource = async (sourceId: string) => {
    await dbService.deleteSource(sourceId);
    setSources(prev => prev.filter(s => s.id !== sourceId));
  };

  // Passages
  const savePassage = async (passage: Passage) => {
    await dbService.savePassage(passage);
    setPassages(prev => {
      const idx = prev.findIndex(p => p.id === passage.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = passage;
        return next;
      }
      return [passage, ...prev];
    });
  };

  const deletePassage = async (passageId: string) => {
    await dbService.deletePassage(passageId);
    setPassages(prev => prev.filter(p => p.id !== passageId));
    setSelectedPassageIds(prev => prev.filter(id => id !== passageId));
  };

  const togglePassageSelection = (passageId: string) => {
    setSelectedPassageIds(prev =>
      prev.includes(passageId) ? prev.filter(id => id !== passageId) : [...prev, passageId]
    );
  };

  const selectAllPassages = () => {
    setSelectedPassageIds(passages.map(p => p.id));
  };

  const clearPassageSelection = () => {
    setSelectedPassageIds([]);
  };

  // Evidence Cards
  const saveEvidenceCard = async (card: EvidenceCard) => {
    await dbService.saveEvidenceCard(card);
    setEvidenceCards(prev => {
      const idx = prev.findIndex(c => c.id === card.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = card;
        return next;
      }
      return [card, ...prev];
    });
  };

  const deleteEvidenceCard = async (cardId: string) => {
    await dbService.deleteEvidenceCard(cardId);
    setEvidenceCards(prev => prev.filter(c => c.id !== cardId));
  };

  // Secondary Literature (OpenAlex / Crossref / Scite)
  const saveSecondaryPaper = async (paper: VerifiedSecondaryLiterature) => {
    await dbService.saveSecondaryPaper(paper);
    setSecondaryLiterature(prev => {
      const idx = prev.findIndex(p => p.id === paper.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = paper;
        return next;
      }
      return [paper, ...prev];
    });
  };

  const deleteSecondaryPaper = async (paperId: string) => {
    await dbService.deleteSecondaryPaper(paperId);
    setSecondaryLiterature(prev => prev.filter(p => p.id !== paperId));
  };

  // Live calculation of 7-step checklist
  const hasProject = !!currentProject;
  const hasSources = sources.length >= 1;
  const hasPassages = passages.length >= 2;
  const hasEvidenceCards = evidenceCards.length >= 1;
  const allComplete = hasProject && hasSources && hasPassages && hasEvidenceCards && hasGraphViewed && hasAiRun && hasDossierExported;

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        projects,
        sources,
        passages,
        evidenceCards,
        secondaryLiterature,
        loading,
        selectedPassageIds,
        selectProject,
        createProject,
        updateProject,
        deleteProject,
        duplicateProject,
        saveSource,
        deleteSource,
        savePassage,
        deletePassage,
        togglePassageSelection,
        selectAllPassages,
        clearPassageSelection,
        saveEvidenceCard,
        deleteEvidenceCard,
        saveSecondaryPaper,
        deleteSecondaryPaper,
        importProjectPacket,
        loadCuratedPacket,
        resetToCuratedSamples,
        checklistStatus: {
          hasProject,
          hasSources,
          hasPassages,
          hasEvidenceCards,
          hasGraphViewed,
          hasAiRun,
          hasDossierExported,
          allComplete
        },
        markGraphViewed: () => setHasGraphViewed(true),
        markAiRun: () => setHasAiRun(true),
        markDossierExported: () => setHasDossierExported(true)
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
