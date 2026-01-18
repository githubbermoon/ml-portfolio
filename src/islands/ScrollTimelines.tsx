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
			const fadeItems = section.querySelectorAll('[data-fade]');

			if (animateItems.length) {
				gsap.fromTo(
					animateItems,
					{ y: 40, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						ease: 'none',
						stagger: 0.08,
						scrollTrigger: {
							trigger: section,
							start: 'top 70%',
							end: 'bottom 45%',
							scrub: true,
						},
					}
				);
			}

			if (fadeItems.length) {
				gsap.fromTo(
					fadeItems,
					{ opacity: 0 },
					{
						opacity: 1,
						ease: 'none',
						scrollTrigger: {
							trigger: section,
							start: 'top 80%',
							end: 'bottom 60%',
							scrub: true,
						},
					}
				);
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
