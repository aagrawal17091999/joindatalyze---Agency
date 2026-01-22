const { onRequest } = require('firebase-functions/v2/https');
const { logger } = require('firebase-functions');
const admin = require('firebase-admin');
const { BigQuery } = require('@google-cloud/bigquery');
const crypto = require('crypto');

admin.initializeApp();
const bigquery = new BigQuery();

const datasetId = process.env.BQ_DATASET || 'datalyze_tools';
const tableId = process.env.BQ_TABLE || 'tool_events';

const extractBearerToken = (req) => {
  const header = req.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.replace('Bearer ', '').trim();
};

exports.recordToolEvent = onRequest({
  region: 'us-central1',
  cors: true
}, async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  try {
    const token = extractBearerToken(req);
    if (!token) {
      res.status(401).json({ error: 'Missing auth token.' });
      return;
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const body = req.body || {};

    const row = {
      event_id: crypto.randomUUID(),
      event_name: body.eventName || 'unknown',
      tool_id: body.toolId || null,
      tool_name: body.toolName || null,
      user_id: decoded.uid,
      email: decoded.email || null,
      name: body.name || decoded.name || null,
      created_at: new Date().toISOString(),
      raw_payload: body
    };

    await bigquery.dataset(datasetId).table(tableId).insert(row);
    res.status(200).json({ ok: true });
  } catch (error) {
    logger.error('Failed to record tool event', error);
    res.status(500).json({ error: 'Failed to record event.' });
  }
});
