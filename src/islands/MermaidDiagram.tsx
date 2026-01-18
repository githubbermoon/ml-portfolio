import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function MermaidDiagram({ definition }: { definition: string }) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const render = () => {
			const isBright = document.documentElement.dataset.theme === 'bright';
			mermaid.initialize({ startOnLoad: false, theme: isBright ? 'neutral' : 'dark' });
			containerRef.current!.innerHTML = `<div class="mermaid">${definition}</div>`;
			mermaid.run({ nodes: [containerRef.current!] });
		};

		render();
		const handle = () => render();
		window.addEventListener('theme-change', handle);
		return () => window.removeEventListener('theme-change', handle);
	}, [definition]);

	return (
		<div className="glass-panel overflow-x-auto p-6 text-sm text-glass" ref={containerRef} />
	);
}
