import studio from '@theatre/studio';
import { getProject } from '@theatre/core';

let studioReady = false;

const project = getProject('ClawdPortfolio');

const initStudio = () => {
	if (!import.meta.env.DEV || studioReady) return;
	studio.initialize();
	studioReady = true;
};

export const getSceneSheet = (name: string) => {
	initStudio();
	return project.sheet(name);
};
