import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { GraphNode, GraphLink, EvidenceCard, SourceRecord, Passage, RelationType, ConfidenceLevel } from '../../types';
import { NodeInspectorDrawer } from './NodeInspectorDrawer';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Filter, 
  Layers, 
  ShieldCheck, 
  FileCheck2, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';

interface ConceptGraphProps {
  onNavigateToAnalysisWithPassages?: (passageIds: string[]) => void;
}

export const ConceptGraph: React.FC<ConceptGraphProps> = ({ onNavigateToAnalysisWithPassages }) => {
  const { t, locale } = useI18n();
  const { currentProject, sources, passages, evidenceCards } = useProject();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Inspector Drawer States
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<GraphLink | null>(null);

  // Graph display controls
  const [showLabels, setShowLabels] = useState(true);
  const [showLinkLabels, setShowLinkLabels] = useState(false);
  const [filterConfidence, setFilterConfidence] = useState<string>('all');
  const [filterRelation, setFilterRelation] = useState<string>('all');
  const [filterTradition, setFilterTradition] = useState<string>('all');
  const [highlightConcept, setHighlightConcept] = useState<string>('all');

  // Build Nodes & Links purely from Evidence Cards and Passages
  const { nodes, links } = useMemo(() => {
    if (!currentProject) return { nodes: [], links: [] };

    const nodeMap = new Map<string, GraphNode>();
    const linkList: GraphLink[] = [];

    // Add Concept and Passage Nodes based on project data
    passages.forEach(p => {
      const src = sources.find(s => s.id === p.sourceId);
      
      // Node for Passage
      const pNodeId = `p-${p.id}`;
      if (!nodeMap.has(pNodeId)) {
        nodeMap.set(pNodeId, {
          id: pNodeId,
          label: `${src?.author || 'Author'}: ${p.passageLocator}`,
          sublabel: src?.workTitle,
          type: 'passage',
          tradition: src?.authorTradition,
          dateYear: src?.compositionDate.startYear,
          passageId: p.id,
          sourceId: src?.id,
          verificationStatus: p.verificationStatus
        });
      }

      // Nodes for Concepts
      p.concepts.forEach(c => {
        const cNodeId = `c-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        if (!nodeMap.has(cNodeId)) {
          nodeMap.set(cNodeId, {
            id: cNodeId,
            label: c,
            type: 'concept',
            verificationStatus: p.verificationStatus
          });
        }
      });
    });

    // Generate links strictly from evidence cards
    evidenceCards.forEach(ec => {
      // Filter check
      if (filterConfidence !== 'all' && ec.confidence !== filterConfidence) return;
      if (filterRelation !== 'all' && ec.relationType !== filterRelation) return;

      const srcPassage = passages.find(p => p.id === ec.sourcePassageId);
      const tgtPassage = ec.targetPassageId ? passages.find(p => p.id === ec.targetPassageId) : null;

      const srcNodeId = `p-${ec.sourcePassageId}`;
      const tgtNodeId = tgtPassage ? `p-${tgtPassage.id}` : `c-${ec.sourceConcept.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

      if (nodeMap.has(srcNodeId) && nodeMap.has(tgtNodeId) && srcNodeId !== tgtNodeId) {
        linkList.push({
          id: ec.id,
          source: srcNodeId,
          target: tgtNodeId,
          relationType: ec.relationType,
          confidence: ec.confidence,
          evidenceCardIds: [ec.id],
          verificationStatus: ec.verificationStatus,
          cautionNote: ec.cautionNote
        });
      }

      // Also link source passage to its concept
      const cNodeId = `c-${ec.sourceConcept.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      if (nodeMap.has(srcNodeId) && nodeMap.has(cNodeId)) {
        linkList.push({
          id: `link-p-c-${ec.id}`,
          source: srcNodeId,
          target: cNodeId,
          relationType: 'conceptual_development',
          confidence: ec.confidence,
          evidenceCardIds: [ec.id],
          verificationStatus: ec.verificationStatus
        });
      }
    });

    // Apply Tradition / Concept filters to nodes
    let filteredNodes = Array.from(nodeMap.values());
    if (filterTradition !== 'all') {
      filteredNodes = filteredNodes.filter(n => !n.tradition || n.tradition === filterTradition);
    }
    if (highlightConcept !== 'all') {
      filteredNodes = filteredNodes.filter(n => n.label === highlightConcept || n.type === 'concept');
    }

    const validNodeIds = new Set(filteredNodes.map(n => n.id));
    const validLinks = linkList.filter(l => 
      validNodeIds.has(typeof l.source === 'object' ? (l.source as any).id : l.source) &&
      validNodeIds.has(typeof l.target === 'object' ? (l.target as any).id : l.target)
    );

    return { nodes: filteredNodes, links: validLinks };
  }, [currentProject, passages, sources, evidenceCards, filterConfidence, filterRelation, filterTradition, highlightConcept]);

  // All concepts for dropdown filter
  const allConceptNames = useMemo(() => {
    return Array.from(new Set(passages.flatMap(p => p.concepts)));
  }, [passages]);

  // D3 Force Simulation Setup
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 900;
    const height = 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (nodes.length === 0) return;

    // Deep copy nodes and links for simulation mutate
    const simNodes = nodes.map(d => ({ ...d }));
    const simLinks = links.map(d => ({ ...d }));

    // Container for zoom
    const g = svg.append('g').attr('class', 'graph-container');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Color Scales
    const getNodeColor = (d: GraphNode) => {
      if (d.type === 'concept') return '#92400E'; // Dark Amber/Gold
      if (d.tradition === 'Latin/North African') return '#1A56DB'; // Royal Blue
      if (d.tradition === 'Alexandrian') return '#6B21A8'; // Purple
      if (d.tradition === 'Antiochene') return '#9D174D'; // Crimson
      if (d.tradition === 'Cappadocian') return '#065F46'; // Forest Emerald
      if (d.tradition === 'Byzantine') return '#C2410C'; // Rust
      return '#475569'; // Slate
    };

    // Force Simulation
    const simulation = d3.forceSimulation(simNodes as any)
      .force('link', d3.forceLink(simLinks as any).id((d: any) => d.id).distance(110))
      .force('charge', d3.forceManyBody().strength(-320))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45));

    // Arrowhead marker definitions for directed links
    svg.append('defs').selectAll('marker')
      .data(['arrow-high', 'arrow-medium', 'arrow-low'])
      .enter().append('marker')
      .attr('id', d => d)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 24)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', d => d.includes('high') ? '#065F46' : d.includes('medium') ? '#92400E' : '#78716C');

    // Draw Links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(simLinks)
      .enter().append('line')
      .attr('stroke', (d: any) => {
        if (d.confidence === 'high') return '#065F46';
        if (d.confidence === 'medium') return '#92400E';
        return '#A8A29E';
      })
      .attr('stroke-width', (d: any) => {
        if (d.confidence === 'high') return 2.5;
        if (d.confidence === 'medium') return 1.8;
        return 1.2;
      })
      .attr('stroke-dasharray', (d: any) => {
        if (d.confidence === 'high') return 'none';
        if (d.confidence === 'medium') return '4 3';
        return '2 3';
      })
      .attr('stroke-opacity', 0.85)
      .attr('marker-end', (d: any) => {
        if (d.confidence === 'high') return 'url(#arrow-high)';
        if (d.confidence === 'medium') return 'url(#arrow-medium)';
        return 'url(#arrow-low)';
      })
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        event.stopPropagation();
        setSelectedLink(d);
        setSelectedNode(null);
      });

    // Draw Link Labels if enabled
    let linkLabel: any = null;
    if (showLinkLabels) {
      linkLabel = g.append('g')
        .attr('class', 'link-labels')
        .selectAll('text')
        .data(simLinks)
        .enter().append('text')
        .text((d: any) => d.relationType.replace(/_/g, ' '))
        .attr('font-size', '9px')
        .attr('font-family', 'ui-monospace, monospace')
        .attr('fill', '#666155')
        .attr('text-anchor', 'middle');
    }

    // Draw Nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(simNodes)
      .enter().append('g')
      .style('cursor', 'pointer')
      .call(d3.drag<any, any>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }))
      .on('click', (event, d: any) => {
        event.stopPropagation();
        setSelectedNode(d);
        setSelectedLink(null);
      });

    // Node Circles
    node.append('circle')
      .attr('r', (d: any) => d.type === 'concept' ? 16 : 11)
      .attr('fill', (d: any) => getNodeColor(d))
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)
      .attr('fill-opacity', 0.95);

    // Node Icons/Letters
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('font-size', (d: any) => d.type === 'concept' ? '10px' : '8px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', 'bold')
      .attr('fill', '#FFFFFF')
      .text((d: any) => d.type === 'concept' ? 'C' : 'P');

    // Node Text Labels
    if (showLabels) {
      node.append('text')
        .attr('dx', 18)
        .attr('dy', '.35em')
        .text((d: any) => d.label)
        .attr('font-size', (d: any) => d.type === 'concept' ? '12px' : '11px')
        .attr('font-family', 'Georgia, serif')
        .attr('font-weight', (d: any) => d.type === 'concept' ? 'bold' : 'normal')
        .attr('fill', '#1A1A1A')
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 2)
        .attr('paint-order', 'stroke');
    }

    // Simulation Tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      if (linkLabel) {
        linkLabel
          .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
          .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 4);
      }

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, showLabels, showLinkLabels]);

  // Zoom control handlers
  const handleZoomIn = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.7);
  };

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(d3.zoom<SVGSVGElement, unknown>().transform as any, d3.zoomIdentity);
  };

  if (!currentProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-[#666155]">
        <p>{locale === 'zh-Hant' ? '請先於工作區建立或選定研究專案。' : 'Please create or select a research project in the Workspace tab.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#D1CEBD] pb-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            <Network className="w-5 h-5 text-[#8B7E66]" />
            <span>{t.nav.genealogy}</span>
          </h1>
          <p className="text-xs text-[#666155] mt-0.5">
            {locale === 'zh-Hant'
              ? '力導向概念流變圖譜：所有連線均有實證卡背書，不同線型表示嚴謹度（實線＝高度可信，虛線＝中度／爭議）'
              : 'Force-directed genealogy graph: strictly evidence-backed. Line style represents confidence level.'}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterConfidence}
            onChange={(e) => setFilterConfidence(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] text-xs rounded px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">{locale === 'zh-Hant' ? '全部可信度' : 'All Confidence'}</option>
            <option value="high">{t.confidences.high}</option>
            <option value="medium">{t.confidences.medium}</option>
            <option value="low">{t.confidences.low}</option>
          </select>

          <select
            value={filterRelation}
            onChange={(e) => setFilterRelation(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] text-xs rounded px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">{locale === 'zh-Hant' ? '全部關係類型' : 'All Relation Types'}</option>
            {Object.entries(t.relationTypes).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <select
            value={filterTradition}
            onChange={(e) => setFilterTradition(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] text-xs rounded px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">{locale === 'zh-Hant' ? '全部流派' : 'All Traditions'}</option>
            {Object.entries(t.traditions).map(([k, v]) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <select
            value={highlightConcept}
            onChange={(e) => setHighlightConcept(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] text-xs rounded px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">{locale === 'zh-Hant' ? '全部概念' : 'All Concepts'}</option>
            {allConceptNames.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Graph Area */}
      <div 
        ref={containerRef}
        className="relative bg-white border border-[#D1CEBD] rounded-lg overflow-hidden shadow-xs h-[620px] flex items-center justify-center"
      >
        {nodes.length === 0 ? (
          <div className="text-center space-y-3 p-6 max-w-md">
            <AlertCircle className="w-8 h-8 text-[#8B7E66] mx-auto" />
            <h3 className="text-sm font-serif font-semibold text-[#1A1A1A]">
              {locale === 'zh-Hant' ? '圖譜尚無實證節點' : 'No Graph Nodes Attested'}
            </h3>
            <p className="text-xs text-[#666155]">
              {locale === 'zh-Hant'
                ? '為維護學術真實性，本圖譜不顯示未經考證的虛構連線。請先在「經文閱讀」與「實證卡」中建立經文與關聯。'
                : 'In accordance with integrity guidelines, no links will render until backed by evidence cards.'}
            </p>
          </div>
        ) : (
          <>
            <svg
              ref={svgRef}
              className="w-full h-full cursor-grab active:cursor-grabbing bg-[#FDFCFB]"
              onClick={() => {
                setSelectedNode(null);
                setSelectedLink(null);
              }}
            />

            {/* Floating Zoom & Toggle Toolbar */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs border border-[#D1CEBD] p-1.5 rounded shadow-xs">
              <button
                onClick={handleZoomIn}
                title="Zoom In"
                className="p-1.5 text-[#595347] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] rounded"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                title="Zoom Out"
                className="p-1.5 text-[#595347] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] rounded"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                title="Reset View"
                className="p-1.5 text-[#595347] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] rounded"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="w-full h-px bg-[#D1CEBD] my-0.5" />
              <button
                onClick={() => setShowLabels(!showLabels)}
                title={showLabels ? 'Hide Labels' : 'Show Labels'}
                className="p-1.5 text-[#595347] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] rounded"
              >
                {showLabels ? <Eye className="w-4 h-4 text-[#1A1A1A]" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Floating Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs border border-[#D1CEBD] p-3 rounded text-[11px] text-[#595347] shadow-xs space-y-2 max-w-xs hidden sm:block">
              <span className="font-bold font-serif text-[#1A1A1A] block border-b border-[#F1EDE4] pb-1">
                {locale === 'zh-Hant' ? '圖譜體例說明 (Legend)' : 'Graph Legend'}
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#92400E] inline-block"></span>
                  <span>{locale === 'zh-Hant' ? '神學概念' : 'Concept'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1A56DB] inline-block"></span>
                  <span>{locale === 'zh-Hant' ? '拉丁/北非' : 'Latin/N.African'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6B21A8] inline-block"></span>
                  <span>{locale === 'zh-Hant' ? '亞歷山太' : 'Alexandrian'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#065F46] inline-block"></span>
                  <span>{locale === 'zh-Hant' ? '卡帕多細亞' : 'Cappadocian'}</span>
                </div>
              </div>
              <div className="border-t border-[#F1EDE4] pt-1.5 space-y-1 font-mono text-[10px]">
                <div className="flex items-center justify-between text-[#065F46] font-bold">
                  <span>─── {locale === 'zh-Hant' ? '高度可信 (實證直接引用)' : 'High Confidence'}</span>
                </div>
                <div className="flex items-center justify-between text-[#92400E] font-bold">
                  <span>- - - {locale === 'zh-Hant' ? '中度可信 (概念詮釋演進)' : 'Medium Confidence'}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Inspector Drawer for clicked node or link */}
      <NodeInspectorDrawer
        selectedNode={selectedNode}
        selectedLink={selectedLink}
        evidenceCards={evidenceCards}
        sources={sources}
        passages={passages}
        onClose={() => {
          setSelectedNode(null);
          setSelectedLink(null);
        }}
        onNavigateToAnalysisWithPassages={onNavigateToAnalysisWithPassages}
      />
    </div>
  );
};
