import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function GraphView({ artistName }) {
  const svgRef = useRef();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState('');

  useEffect(() => {
    if (!artistName) return;

    const fetchGraph = async () => {
      setLoading(true);
      setError(null);
      setDebug('Rozpoczynam pobieranie...');
      
      try {
        const query = `
          query {
            graphArtist(name: "${artistName}") {
              nodes {
                id
                label
                type
              }
              links {
                source
                target
                type
              }
            }
          }
        `;

        setDebug('Wysyłam zapytanie do serwera...');
        
        const response = await fetch('https://music-1-0.onrender.com/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });

        setDebug('Otrzymano odpowiedź, parsowanie...');
        const data = await response.json();
        
        console.log('=== GRAPH DEBUG ===');
        console.log('Artist:', artistName);
        console.log('Full response:', data);
        
        if (data.errors) {
          console.error('GraphQL errors:', data.errors);
          setError('Błąd GraphQL: ' + JSON.stringify(data.errors));
          setDebug('Błąd GraphQL!');
          return;
        }
        
        if (data.data?.graphArtist) {
          const graphData = data.data.graphArtist;
          console.log('Nodes count:', graphData.nodes?.length || 0);
          console.log('Links count:', graphData.links?.length || 0);
          console.log('Nodes:', graphData.nodes);
          console.log('Links:', graphData.links);
          
          setDebug(`Otrzymano: ${graphData.nodes?.length || 0} węzłów, ${graphData.links?.length || 0} połączeń`);
          setGraphData(graphData);
        } else {
          console.log('No graphArtist in response');
          setDebug('Brak danych graphArtist w odpowiedzi');
          setGraphData({ nodes: [], links: [] });
        }
      } catch (error) {
        console.error('Error fetching graph:', error);
        setError('Błąd połączenia: ' + error.message);
        setDebug('Błąd: ' + error.message);
        setGraphData({ nodes: [], links: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [artistName]);

  useEffect(() => {
    if (!graphData || !svgRef.current) return;

    const width = 1000;
    const height = 700;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Add zoom behavior
    const g = svg.append('g');
    
    svg.call(d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      }));

    // Color scheme by node type
    const colorMap = {
      'Artist': '#ff6b6b',
      'Song': '#4ecdc4',
      'Album': '#45b7d1',
      'Genre': '#96ceb4'
    };

    // Create force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links)
        .id(d => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => {
        if (d.type === 'CREATED' || d.type === 'FEATURED_ON') return 2;
        if (d.type === 'SIMILAR_TO') return 3;
        return 1;
      });

    // Draw link labels
    const linkLabel = g.append('g')
      .selectAll('text')
      .data(graphData.links)
      .join('text')
      .attr('font-size', 10)
      .attr('fill', '#666')
      .attr('text-anchor', 'middle')
      .text(d => d.type);

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(graphData.nodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Node circles
    node.append('circle')
      .attr('r', d => {
        if (d.type === 'Artist') return 20;
        if (d.type === 'Song') return 12;
        if (d.type === 'Album') return 15;
        return 10;
      })
      .attr('fill', d => colorMap[d.type] || '#ddd')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Node labels
    node.append('text')
      .attr('dy', 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('font-weight', d => d.type === 'Artist' ? 'bold' : 'normal')
      .attr('fill', '#333')
      .text(d => d.label.length > 20 ? d.label.substring(0, 20) + '...' : d.label);

    // Tooltips
    node.append('title')
      .text(d => `${d.type}: ${d.label}`);

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      linkLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [graphData]);

  if (!artistName) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        Wyszukaj artystę, aby zobaczyć graf powiązań
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Ładowanie grafu...</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>{debug}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#d9534f' }}>
        <div><strong>Błąd:</strong></div>
        <div style={{ fontSize: '14px', marginTop: '10px' }}>{error}</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Sprawdź konsolę (F12)</div>
      </div>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
        <div>Brak danych do wizualizacji dla artysty "{artistName}"</div>
        <div style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
          Debug: {debug}
        </div>
        <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
          Nodes: {graphData?.nodes?.length || 0}, Links: {graphData?.links?.length || 0}
        </div>
        <div style={{ fontSize: '11px', marginTop: '10px', color: '#999' }}>
          Sprawdź konsolę przeglądarki (F12) i konsolę serwera Node.js
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '30px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ padding: '15px', background: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Graf powiązań: {artistName}</h3>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          <span style={{ marginRight: '15px' }}>🔴 Artist</span>
          <span style={{ marginRight: '15px' }}>🔵 Song</span>
          <span style={{ marginRight: '15px' }}>🟢 Album</span>
          <span>🟡 Genre</span>
          <div style={{ marginTop: '5px', fontStyle: 'italic' }}>
            Przeciągnij węzły | Scroll = zoom
          </div>
        </div>
      </div>
      <svg ref={svgRef} style={{ background: '#fff', display: 'block' }}></svg>
    </div>
  );
}

export default GraphView;