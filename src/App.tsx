import React, { useState } from 'react';
import { I18nProvider } from './i18n/i18nContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { DataProvenanceBanner } from './components/DataProvenanceBanner';
import { ApiKeyModal } from './components/ApiKeyModal';

// Workspace & Project Views
import { ProjectManager } from './components/workspace/ProjectManager';
import { ProjectModal } from './components/workspace/ProjectModal';
import { CuratedPacketModal } from './components/workspace/CuratedPacketModal';

// Sources Views
import { SourceRegistry } from './components/sources/SourceRegistry';
import { SourceModal } from './components/sources/SourceModal';
import { SourceImportModal } from './components/sources/SourceImportModal';

// Passages Views
import { PassageReader } from './components/passages/PassageReader';
import { PassageModal } from './components/passages/PassageModal';

// Evidence Cards Views
import { EvidenceCardsList } from './components/evidence/EvidenceCardsList';
import { EvidenceCardModal } from './components/evidence/EvidenceCardModal';

// Graph, Timeline, Bounded AI, Dossier Views
import { ConceptGraph } from './components/graph/ConceptGraph';
import { ConceptTimeline } from './components/timeline/ConceptTimeline';
import { BoundedAiAnalysis } from './components/analysis/BoundedAiAnalysis';
import { AcademicVerificationView } from './components/literature/AcademicVerificationView';
import { ResearchDossierView } from './components/dossier/ResearchDossierView';

import { ResearchProject, SourceRecord, Passage, EvidenceCard } from './types';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('workspace');
  
  // Modals state
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ResearchProject | null>(null);
  
  const [isCuratedModalOpen, setIsCuratedModalOpen] = useState(false);

  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [sourceToEdit, setSourceToEdit] = useState<SourceRecord | null>(null);
  const [isSourceImportOpen, setIsSourceImportOpen] = useState(false);

  const [isPassageModalOpen, setIsPassageModalOpen] = useState(false);
  const [passageToEdit, setPassageToEdit] = useState<Passage | null>(null);
  const [defaultSourceIdForPassage, setDefaultSourceIdForPassage] = useState<string | undefined>(undefined);

  const [isEvidenceCardModalOpen, setIsEvidenceCardModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<EvidenceCard | null>(null);
  const [defaultSourcePassageIdForCard, setDefaultSourcePassageIdForCard] = useState<string | undefined>(undefined);

  // Navigation callbacks
  const handleOpenNewProject = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (project: ResearchProject) => {
    setProjectToEdit(project);
    setIsProjectModalOpen(true);
  };

  const handleOpenAddSource = () => {
    setSourceToEdit(null);
    setIsSourceModalOpen(true);
  };

  const handleOpenEditSource = (source: SourceRecord) => {
    setSourceToEdit(source);
    setIsSourceModalOpen(true);
  };

  const handleAddPassageForSource = (sourceId: string) => {
    setDefaultSourceIdForPassage(sourceId);
    setPassageToEdit(null);
    setIsPassageModalOpen(true);
  };

  const handleOpenAddPassage = () => {
    setDefaultSourceIdForPassage(undefined);
    setPassageToEdit(null);
    setIsPassageModalOpen(true);
  };

  const handleOpenEditPassage = (passage: Passage) => {
    setPassageToEdit(passage);
    setIsPassageModalOpen(true);
  };

  const handleOpenAddCard = () => {
    setCardToEdit(null);
    setDefaultSourcePassageIdForCard(undefined);
    setIsEvidenceCardModalOpen(true);
  };

  const handleOpenEditCard = (card: EvidenceCard) => {
    setCardToEdit(card);
    setIsEvidenceCardModalOpen(true);
  };

  const handleNavigateToEvidenceForPassage = (passageId: string) => {
    setDefaultSourcePassageIdForCard(passageId);
    setCardToEdit(null);
    setIsEvidenceCardModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#E5D5B0] selection:text-[#1A1A1A]">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenNewProject={handleOpenNewProject}
        onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
      />

      {/* Real-Time Integrity & Provenance Bar */}
      <DataProvenanceBanner />

      {/* Main View Body */}
      <main className="flex-1 pb-10">
        {activeTab === 'workspace' && (
          <ProjectManager
            onOpenNewProject={handleOpenNewProject}
            onOpenEditProject={handleOpenEditProject}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
            onNavigateTab={setActiveTab}
            onOpenAddSource={handleOpenAddSource}
            onOpenAddPassage={handleOpenAddPassage}
            onOpenAddCard={handleOpenAddCard}
          />
        )}

        {activeTab === 'sources' && (
          <SourceRegistry
            onOpenAddSource={handleOpenAddSource}
            onOpenEditSource={handleOpenEditSource}
            onOpenImportModal={() => setIsSourceImportOpen(true)}
            onAddPassageForSource={handleAddPassageForSource}
          />
        )}

        {activeTab === 'passages' && (
          <PassageReader
            onOpenAddPassage={handleOpenAddPassage}
            onOpenEditPassage={handleOpenEditPassage}
            onNavigateToAnalysis={() => setActiveTab('boundedAi')}
            onNavigateToEvidence={handleNavigateToEvidenceForPassage}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceCardsList
            onOpenAddCard={handleOpenAddCard}
            onOpenEditCard={handleOpenEditCard}
            onNavigateToGraph={() => setActiveTab('genealogy')}
          />
        )}

        {activeTab === 'genealogy' && (
          <ConceptGraph
            onNavigateToAnalysisWithPassages={(_pIds) => {
              setActiveTab('boundedAi');
            }}
          />
        )}

        {activeTab === 'timeline' && (
          <ConceptTimeline />
        )}

        {activeTab === 'boundedAi' && (
          <BoundedAiAnalysis
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            onOpenAddCard={handleOpenAddCard}
            onNavigateToLiterature={() => setActiveTab('literature')}
          />
        )}

        {activeTab === 'literature' && (
          <AcademicVerificationView />
        )}

        {activeTab === 'dossier' && (
          <ResearchDossierView />
        )}
      </main>

      {/* High-Density Scholarly Status Footer */}
      <footer className="bg-[#FAF8F5] border-t border-[#D1CEBD] text-[10px] text-[#8B7E66] px-4 py-1.5 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1A1A1A]">PATRISTIC CONCEPT ATLAS</span>
          <span>•</span>
          <span>CRITICAL APPARATUS ENGINE</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">ZERO-HALLUCINATION ENFORCED</span>
        </div>
        <div className="flex items-center gap-3">
          <span>LATIN &amp; GREEK PATROLOGY</span>
          <span>•</span>
          <span>CCSG / CSEL / SCh / PG / PL COMPLIANT</span>
        </div>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        projectToEdit={projectToEdit}
        onClose={() => setIsProjectModalOpen(false)}
      />

      <CuratedPacketModal
        isOpen={isCuratedModalOpen}
        onClose={() => setIsCuratedModalOpen(false)}
      />

      <SourceModal
        isOpen={isSourceModalOpen}
        sourceToEdit={sourceToEdit}
        onClose={() => setIsSourceModalOpen(false)}
      />

      <SourceImportModal
        isOpen={isSourceImportOpen}
        onClose={() => setIsSourceImportOpen(false)}
      />

      <PassageModal
        isOpen={isPassageModalOpen}
        passageToEdit={passageToEdit}
        defaultSourceId={defaultSourceIdForPassage}
        onClose={() => setIsPassageModalOpen(false)}
      />

      <EvidenceCardModal
        isOpen={isEvidenceCardModalOpen}
        cardToEdit={cardToEdit}
        defaultSourcePassageId={defaultSourcePassageIdForCard}
        onClose={() => setIsEvidenceCardModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <ProjectProvider>
        <MainAppContent />
      </ProjectProvider>
    </I18nProvider>
  );
}
