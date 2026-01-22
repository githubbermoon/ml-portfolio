import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function MermaidDiagram({ definition }: { definition: string }) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const render = async () => {
			try {
				const isBright = document.documentElement.dataset.theme === 'bright';
				mermaid.initialize({ 
					startOnLoad: false, 
					theme: isBright ? 'neutral' : 'dark',
					securityLevel: 'loose',
				});

				// Clear previous content
				containerRef.current!.innerHTML = '';

				// Create the mermaid node wrapper
				const graphDiv = document.createElement('div');
				graphDiv.className = 'mermaid';
				// Use textContent to avoid HTML entity parsing issues
				graphDiv.textContent = definition.trim();
				
				containerRef.current!.appendChild(graphDiv);

				// Run mermaid on the specific node
				await mermaid.run({ nodes: [graphDiv] });
			} catch (err) {
				console.error('Mermaid rendering failed:', err);
				if (containerRef.current) {
					containerRef.current.innerHTML = `<div class="text-red-500 text-xs font-mono p-4">Diagram Error</div>`;
				}
			}
		};

		// Small delay to ensure DOM is ready
		const timeout = setTimeout(render, 100);

		const handle = () => render();
		window.addEventListener('theme-change', handle);
		
		return () => {
			clearTimeout(timeout);
			window.removeEventListener('theme-change', handle);
		};
	}, [definition]);

	return (
		<div className="glass-panel overflow-x-auto p-6 text-sm text-glass min-h-[100px]" ref={containerRef} />
	);
}
