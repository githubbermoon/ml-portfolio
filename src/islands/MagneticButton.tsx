import { useEffect, useRef } from 'react';

type Props = {
	href: string;
	className?: string;
	children: React.ReactNode;
	radius?: number;
	strength?: number;
};

export default function MagneticButton({
	href,
	className,
	children,
	radius = 120,
	strength = 0.25,
}: Props) {
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLAnchorElement | null>(null);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const wrapper = wrapperRef.current;
		const button = buttonRef.current;
		if (!wrapper || !button) return;

		const handleMove = (event: PointerEvent) => {
			const rect = wrapper.getBoundingClientRect();
			const x = event.clientX - rect.left - rect.width / 2;
			const y = event.clientY - rect.top - rect.height / 2;
			const distance = Math.hypot(x, y);
			if (distance < radius) {
				const pull = (1 - distance / radius) * strength;
				button.style.transform = `translate3d(${x * pull}px, ${y * pull}px, 0)`;
				return;
			}
			button.style.transform = 'translate3d(0, 0, 0)';
		};

		const handleLeave = () => {
			button.style.transform = 'translate3d(0, 0, 0)';
		};

		wrapper.addEventListener('pointermove', handleMove);
		wrapper.addEventListener('pointerleave', handleLeave);

		return () => {
			wrapper.removeEventListener('pointermove', handleMove);
			wrapper.removeEventListener('pointerleave', handleLeave);
		};
	}, [radius, strength]);

	return (
		<div ref={wrapperRef} className="relative inline-flex">
			<a
				ref={buttonRef}
				href={href}
				className={className}
				style={{ transition: 'transform 200ms ease' }}
			>
				{children}
			</a>
		</div>
	);
}
