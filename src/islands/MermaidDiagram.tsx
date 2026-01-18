import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function MermaidDiagram({ definition }: { definition: string }) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;
		mermaid.initialize({ startOnLoad: false, theme: 'dark' });
		containerRef.current.innerHTML = `<div class="mermaid">${definition}</div>`;
		mermaid.run({ nodes: [containerRef.current] });
	}, [definition]);

	return (
		<div className="glass-panel overflow-hidden p-6 text-sm" ref={containerRef} />
	);
}
