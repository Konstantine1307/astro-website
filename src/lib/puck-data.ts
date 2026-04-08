import { readFile } from 'node:fs/promises';

import type { AstroGlobal } from 'astro';

export interface PuckData {
  content: any[];
  root: {
    props: Record<string, any>;
  };
}

export interface PuckPages {
  [key: string]: PuckData;
}

async function readPuckFile() {
  const fileUrl = new URL('../data/puck-data.json', import.meta.url);
  const file = await readFile(fileUrl, 'utf-8');
  return JSON.parse(file) as PuckPages;
}

export async function getAllPuckPages(): Promise<PuckPages> {
  try {
    return await readPuckFile();
  } catch (error) {
    console.error('Error loading all Puck pages:', error);
    return {};
  }
}

export async function getPuckData(Astro: AstroGlobal): Promise<PuckPages> {
  try {
    return await readPuckFile();
  } catch (error) {
    console.error('Error loading Puck data:', error);
    return {};
  }
}

export async function getPageData(
  path: string = '/',
): Promise<PuckData | null> {
  try {
    const data = await readPuckFile();
    return data[path] || null;
  } catch (error) {
    console.error('Error loading page data:', error);
    return null;
  }
}
