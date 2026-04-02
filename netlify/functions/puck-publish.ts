import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const secret = process.env.PUCK_SECRET;
  const headerSecret =
    event.headers['x-puck-secret'] ?? event.headers['X-Puck-Secret'];

  if (!secret) {
    console.error('PUCK_SECRET env var not set');
    return { statusCode: 500, body: 'Server misconfiguration' };
  }

  if (headerSecret !== secret) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const { slug, data } = JSON.parse(event.body ?? '{}');

  if (!slug || !data) {
    return { statusCode: 400, body: 'Missing slug or data' };
  }

  // Store data in Netlify Blobs
  const { getStore } = await import('@netlify/blobs');
  const store = getStore({ name: 'puck-pages' });
  await store.set(`${slug}.json`, JSON.stringify(data));

  return { statusCode: 200, body: 'ok' };
};

export { handler };
