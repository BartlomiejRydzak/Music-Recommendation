import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function GraphView({ artistName }) {
  const svgRef = useRef();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!artistName) return;
    setLoading(true);
    const fetchGraph = async () => {
      try {
        const query = `
          query {
            graphArtist(name: "${artistName}") {
              nodes { id label type }
              links { source target type }
            }
          }
        `;
        const res = await fetch('https://music-1-0.onrender.com/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        const data = await res.json();
        setGraphData(data.data?.graphArtist || { nodes: [], links: [] });
      } catch (err) {
        console.error(err);
        setGraphData({ nodes: [], links: [] });
      } finally { setLoading(false); }
    };
    fetchGraph();
  }, [artistName]);

  useEffect(() => {
    if (!graphData || !svgRef.current || graphData.nodes.length === 0) return;

    const width = 1000;
    const height = 700;

    d3.select(svgRef.current).selectAll('*').remove();
    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height).attr('viewBox', [0, 0, width, height]);
    const g = svg.append('g');

    svg.call(d3.zoom().scaleExtent([0.5,3]).on('zoom', (event) => g.attr('transform', event.transform)));

    const colorMap = { Artist: '#a78bfa', Song: '#60a5fa', Album: '#34d399', Genre: '#fbbf24' };

    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id(d=>d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width/2, height/2))
      .force('collision', d3.forceCollide().radius(30));

    const link = g.append('g').selectAll('line').data(graphData.links).join('line')
      .attr('stroke','#6366f1').attr('stroke-opacity',0.4).attr('stroke-width',2);

    const node = g.append('g').selectAll('g').data(graphData.nodes).join('g')
      .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));

    node.append('circle')
      .attr('r', d => d.type==='Artist'?20:12)
      .attr('fill', d => colorMap[d.type]||'#ddd')
      .attr('stroke','#fff').attr('stroke-width',3)
      .style('filter','drop-shadow(0 0 8px rgba(167,139,250,0.6))');

    node.append('text')
      .attr('dy',30).attr('text-anchor','middle').attr('font-size',12)
      .attr('font-weight', d=>d.type==='Artist'?'bold':'normal')
      .attr('fill','#fff')
      .style('text-shadow','0 0 4px rgba(0,0,0,0.8)')
      .text(d => d.label.length>20?d.label.slice(0,20)+'...':d.label);

    node.append('title').text(d=>`${d.type}: ${d.label}`);

    simulation.on('tick', () => {
      link.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
      node.attr('transform',d=>`translate(${d.x},${d.y})`);
    });

    function dragstarted(event){if(!event.active) simulation.alphaTarget(0.3).restart(); event.subject.fx=event.subject.x; event.subject.fy=event.subject.y;}
    function dragged(event){event.subject.fx=event.x; event.subject.fy=event.y;}
    function dragended(event){if(!event.active) simulation.alphaTarget(0); event.subject.fx=null; event.subject.fy=null;}

    return ()=>simulation.stop();
  }, [graphData]);

  if(loading) return <div className="card"><p>Loading relationship graph...</p></div>;
  if(!graphData || graphData.nodes.length===0) return null;

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-header">
        <h3 className="section-title">Relationship Graph: {artistName}</h3>
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
          {['Artist','Song','Album','Genre'].map(type => (
            <span key={type} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <div style={{ width:'1rem', height:'1rem', borderRadius:'50%', backgroundColor: {Artist:'#a78bfa',Song:'#60a5fa',Album:'#34d399',Genre:'#fbbf24'}[type] }}></div>
              <span style={{ color:'#c084fc', fontSize:'0.9rem' }}>{type}</span>
            </span>
          ))}
        </div>
        <p style={{ color:'#c084fc', fontSize:'0.8rem', fontStyle:'italic', marginTop:'0.5rem' }}>Drag nodes • Scroll to zoom</p>
      </div>
      <svg ref={svgRef} style={{ width:'100%', height:'700px', background:'linear-gradient(to bottom right, #1e1b2f, #3b0764)' }}></svg>
    </div>
  );
}

export default GraphView;
