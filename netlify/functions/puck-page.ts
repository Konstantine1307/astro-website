import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async (event) => {
  const slug =
    event.path.replace('/.netlify/functions/puck-page/', '') || 'home';
  const store = getStore({ name: 'puck-pages' });
  const raw = await store.get(`${slug}.json`);
  if (!raw) return { statusCode: 404, body: 'Not found' };
  const body =
    typeof raw === 'string' ? raw : new TextDecoder('utf-8').decode(raw);
  return {
    statusCode: 200,
    body,
    headers: { 'Content-Type': 'application/json' },
  };
};
