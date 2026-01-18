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
					stagger: 0.12,
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

			const displacement = document.querySelector('#liquid-hero-displacement');
			const heroHeading = hero.querySelector('[data-hero-heading]');
			const heroContent = hero.querySelector('[data-hero-content]');

			if (displacement) {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: hero,
						start: 'top top',
						end: 'bottom top',
						scrub: true,
					},
				});

				tl.to(
					displacement,
					{
						attr: { scale: 150 },
						ease: 'none',
					},
					0
				);

				if (heroHeading) {
					tl.to(
						heroHeading,
						{
							opacity: 0.25,
							y: -20,
							ease: 'none',
						},
						0
					);
				}

				if (heroContent) {
					tl.to(
						heroContent,
						{
							opacity: 0,
							y: -80,
							ease: 'none',
						},
						0
					);
				}
			}
		}

		ScrollTrigger.refresh();

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	}, []);

	return null;
}
