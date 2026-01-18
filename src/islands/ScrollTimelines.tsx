import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ScrollTimelines() {
	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (prefersReducedMotion()) return;

		gsap.registerPlugin(ScrollTrigger);

		const sections = Array.from(document.querySelectorAll('[data-section]'));

		sections.forEach((section) => {
			const animateItems = section.querySelectorAll('[data-animate]');

			if (animateItems.length) {
				gsap.from(animateItems, {
					y: 32,
					ease: 'power2.out',
					stagger: 0.08,
					duration: 0.8,
					scrollTrigger: {
						trigger: section,
						start: 'top 80%',
						toggleActions: 'play none none none',
					},
				});
			}
		});

		const hero = document.querySelector('[data-hero]');
		if (hero) {
			const parallaxTargets = hero.querySelectorAll('[data-parallax]');
			if (parallaxTargets.length) {
				gsap.to(parallaxTargets, {
					y: -60,
					ease: 'none',
					scrollTrigger: {
						trigger: hero,
						start: 'top top',
						end: 'bottom top',
						scrub: true,
					},
				});
			}
		}

		ScrollTrigger.refresh();

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	}, []);

	return null;
}
