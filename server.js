const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const ROOT = __dirname;
const NOTION_VERSION = '2025-09-03';

// Cache the discovered data source id so we don't re-fetch on every request.
let CACHED_DATA_SOURCE_ID = null;

async function loadDotEnv() {
  const envPaths = [path.join(ROOT, '.env'), path.join(ROOT, '..', '.env')];

  for (const envPath of envPaths) {
    try {
      const raw = await fs.readFile(envPath, 'utf8');
      raw.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const separator = trimmed.indexOf('=');
        if (separator === -1) return;
        const key = trimmed.slice(0, separator).trim();
        const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
        if (key && process.env[key] === undefined) {
          process.env[key] = value;
        }
      });
    } catch (error) {
      // .env is optional; production hosts usually inject environment variables directly.
    }
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const FIELD_NAMES = [
  'brand_primary_color',
  'brand_second_color',
  'brand_name',
  'id',
  'brand_channel_name',
  'hero_image_url',
  'device_rendering_image_url',
  'hook1_example_1',
  'hook1_example_2',
  'hook1_example_3',
  'content_pillar_1_title',
  'content_pillar_1_body',
  'content_pillar_2_title',
  'content_pillar_2_body',
  'content_pillar_3_title',
  'content_pillar_3_body',
  'content_pillar_4_title',
  'content_pillar_4_body',
  'content_pillar_5_title',
  'content_pillar_5_body',
  'content_pillar_6_title',
  'content_pillar_6_body',
  'magnet_tap',
  'footer_button_url'
];

function slugify(value) {
  return String(value || 'nike').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'nike';
}

function normalizeNotionUuidForMatch(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/-/g, '');
}

function isNotionUuidLike(value) {
  const n = normalizeNotionUuidForMatch(value);
  return n.length === 32 && /^[0-9a-f]{32}$/.test(n);
}

/** Notion REST paths expect hyphenated UUIDs */
function formatNotionIdForApi(raw) {
  const stripped = normalizeNotionUuidForMatch(raw);
  if (stripped.length === 32 && /^[0-9a-f]{32}$/.test(stripped)) {
    return `${stripped.slice(0, 8)}-${stripped.slice(8, 12)}-${stripped.slice(12, 16)}-${stripped.slice(16, 20)}-${stripped.slice(20, 32)}`;
  }
  return String(raw || '').trim();
}

/**
 * In Notion API 2025-09-03 a page's parent can be either `database_id`
 * (legacy) or `data_source_id` (multi-source DBs). We accept either and
 * compare against both the configured DB and the configured data source.
 */
function notionPageBelongsToConfigured(page, expected) {
  const parent = page && page.parent;
  if (!parent) return false;

  const expectedDb = normalizeNotionUuidForMatch(expected.databaseId);
  const expectedDs = normalizeNotionUuidForMatch(expected.dataSourceId);

  if (parent.type === 'data_source_id' && parent.data_source_id) {
    if (expectedDs && normalizeNotionUuidForMatch(parent.data_source_id) === expectedDs) {
      return true;
    }
  }
  if (parent.type === 'database_id' && parent.database_id) {
    if (expectedDb && normalizeNotionUuidForMatch(parent.database_id) === expectedDb) {
      return true;
    }
  }
  return false;
}

async function notionFetch(url, options, label) {
  const response = await fetch(url, options);
  if (!response.ok) {
    let bodyText = '';
    try {
      bodyText = await response.text();
    } catch (_) {}
    console.error(
      `[notion] ${label} failed: ${response.status} ${response.statusText} -> ${bodyText.slice(0, 500)}`
    );
  }
  return response;
}

async function retrieveNotionPage(pageId, token) {
  const formatted = formatNotionIdForApi(pageId);
  const response = await notionFetch(
    `https://api.notion.com/v1/pages/${formatted}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION
      }
    },
    `GET /v1/pages/${formatted}`
  );
  if (!response.ok) {
    return null;
  }
  return response.json();
}

function normalizeKey(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
}

function getTextValue(property) {
  if (!property) return '';

  if (property.type === 'title') {
    return property.title.map(part => part.plain_text).join('');
  }

  if (property.type === 'rich_text') {
    return property.rich_text.map(part => part.plain_text).join('');
  }

  if (property.type === 'url') {
    return property.url || '';
  }

  if (property.type === 'select') {
    return property.select ? property.select.name : '';
  }

  if (property.type === 'number') {
    return property.number == null ? '' : String(property.number);
  }

  if (property.type === 'unique_id') {
    const u = property.unique_id;
    if (!u) return '';
    const prefix = u.prefix != null && String(u.prefix) !== '' ? String(u.prefix) : '';
    const num = u.number != null ? String(u.number) : '';
    if (prefix && num) return `${prefix}-${num}`;
    return num || prefix;
  }

  if (property.type === 'formula') {
    const f = property.formula;
    const v = f && (f.string ?? f.number ?? f.boolean);
    return v == null ? '' : String(v);
  }

  return '';
}

function normalizeNotionPage(page) {
  const byNormalizedName = Object.entries(page.properties || {}).reduce((acc, [name, property]) => {
    acc[normalizeKey(name)] = property;
    return acc;
  }, {});

  const data = FIELD_NAMES.reduce((acc, fieldName) => {
    acc[fieldName] = getTextValue(byNormalizedName[fieldName]);
    return acc;
  }, {});

  // Notion column names like "Magnet Tap" / "MagnetTap" normalize to magnet_tap
  if (!String(data.magnet_tap || '').trim()) {
    const magnetAliases = ['magnettap', 'magnet_tap_url', 'magnettap_url'];
    for (const key of magnetAliases) {
      const v = getTextValue(byNormalizedName[key]);
      if (String(v || '').trim()) {
        data.magnet_tap = v;
        break;
      }
    }
  }

  if (!String(data.id || '').trim()) {
    const idAliases = ['proposal_id', 'proposalid', 'record_id'];
    for (const key of idAliases) {
      const v = getTextValue(byNormalizedName[key]);
      if (String(v || '').trim()) {
        data.id = v;
        break;
      }
    }
  }

  return data;
}

function cleanColor(value) {
  const color = String(value || '').trim();
  const hexMatch = color.match(/#[0-9a-fA-F]{3,8}/);
  return hexMatch ? hexMatch[0] : color;
}

function cleanProposal(data) {
  const proposal = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
  );

  proposal.brand_primary_color = cleanColor(proposal.brand_primary_color);
  proposal.brand_second_color = cleanColor(proposal.brand_second_color);

  if (!proposal.brand_channel_name && proposal.brand_name) {
    proposal.brand_channel_name = `${proposal.brand_name} Family Channel`;
  }

  return proposal;
}

async function loadFallbackProposal(brand) {
  const filePath = path.join(ROOT, 'data', 'proposals', `${slugify(brand)}.json`);
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function loadFallbackProposalById(proposalId) {
  const target = String(proposalId || '').trim();
  if (!target) {
    throw new Error('Missing proposal id');
  }
  const dir = path.join(ROOT, 'data', 'proposals');
  const files = await fs.readdir(dir);
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const raw = await fs.readFile(path.join(dir, file), 'utf8');
    const data = JSON.parse(raw);
    if (String(data.id || '').trim() === target) {
      return data;
    }
  }
  throw new Error('Proposal not found');
}

async function queryNotionProposalRows() {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;

  const dataSourceId = await resolveNotionDataSourceId(token);
  if (!dataSourceId) return null;

  return queryNotionDataSourceAllRows(token, dataSourceId);
}

async function queryNotionDataSourceAllRows(token, dataSourceId) {
  const dsPathId = formatNotionIdForApi(dataSourceId);
  const results = [];
  let start_cursor;

  do {
    const body = { page_size: 100 };
    if (start_cursor) {
      body.start_cursor = start_cursor;
    }

    const response = await notionFetch(
      `https://api.notion.com/v1/data_sources/${dsPathId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Notion-Version': NOTION_VERSION
        },
        body: JSON.stringify(body)
      },
      `POST /v1/data_sources/${dsPathId}/query`
    );

    if (!response.ok) {
      throw new Error(`Notion data source query failed: ${response.status}`);
    }

    const payload = await response.json();
    results.push(...(payload.results || []));
    start_cursor = payload.has_more ? payload.next_cursor : undefined;
  } while (start_cursor);

  return results;
}

async function fetchNotionProposal(brand) {
  let results;
  try {
    results = await queryNotionProposalRows();
  } catch (err) {
    console.error('[notion] brand query threw:', err && err.message);
    return null;
  }
  if (!results) {
    return null;
  }

  const target = slugify(brand);
  const page = results.find(item => {
    const data = normalizeNotionPage(item);
    return slugify(data.brand_name) === target;
  });

  return page ? cleanProposal(normalizeNotionPage(page)) : null;
}

async function fetchNotionProposalById(proposalId) {
  const token = process.env.NOTION_TOKEN;
  const target = String(proposalId || '').trim();
  if (!target || !token) {
    return { proposal: null, reason: !token ? 'NOTION_TOKEN missing' : 'empty id' };
  }

  const dataSourceId = await resolveNotionDataSourceId(token);
  if (!dataSourceId) {
    return { proposal: null, reason: 'NOTION_DATA_SOURCE_ID missing or could not be resolved from NOTION_DATABASE_ID' };
  }

  const expected = {
    databaseId: process.env.NOTION_DATABASE_ID,
    dataSourceId
  };

  // 1) Notion page id: GET /pages/{id} (no row-count limit)
  if (isNotionUuidLike(target)) {
    const directPage = await retrieveNotionPage(target, token);
    if (directPage) {
      if (notionPageBelongsToConfigured(directPage, expected)) {
        return { proposal: cleanProposal(normalizeNotionPage(directPage)) };
      }
      console.error(
        `[notion] page ${target} found but parent ${JSON.stringify(directPage.parent)} ` +
          `does not match configured data source ${dataSourceId} / db ${expected.databaseId}`
      );
    }
  }

  // 2) Full data-source scan: match `id` property or page id
  let results;
  try {
    results = await queryNotionDataSourceAllRows(token, dataSourceId);
  } catch (err) {
    console.error('[notion] data source scan threw:', err && err.message);
    return { proposal: null, reason: 'Notion data source query failed (see server logs)' };
  }

  let page = results.find(item => {
    const data = normalizeNotionPage(item);
    return String(data.id || '').trim() === target;
  });

  if (!page && isNotionUuidLike(target)) {
    const targetNorm = normalizeNotionUuidForMatch(target);
    page = results.find(item => normalizeNotionUuidForMatch(item.id) === targetNorm);
  }

  if (page) {
    return { proposal: cleanProposal(normalizeNotionPage(page)) };
  }
  return {
    proposal: null,
    reason: `id not found in data source ${dataSourceId} (scanned ${results.length} rows)`
  };
}

/**
 * Returns the data_source_id to query against. Priority:
 *   1. NOTION_DATA_SOURCE_ID (preferred for 2025-09-03 multi-source DBs)
 *   2. Discover from NOTION_DATABASE_ID by calling GET /v1/databases/{id}
 *      and using the first entry of `data_sources`.
 * Result is cached in CACHED_DATA_SOURCE_ID for subsequent calls.
 */
async function resolveNotionDataSourceId(token) {
  if (CACHED_DATA_SOURCE_ID) return CACHED_DATA_SOURCE_ID;

  const explicit = (process.env.NOTION_DATA_SOURCE_ID || '').trim();
  if (explicit) {
    CACHED_DATA_SOURCE_ID = formatNotionIdForApi(explicit);
    return CACHED_DATA_SOURCE_ID;
  }

  const databaseId = (process.env.NOTION_DATABASE_ID || '').trim();
  if (!databaseId || !token) return null;

  const dbPathId = formatNotionIdForApi(databaseId);
  const response = await notionFetch(
    `https://api.notion.com/v1/databases/${dbPathId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION
      }
    },
    `GET /v1/databases/${dbPathId}`
  );

  if (!response.ok) return null;

  const payload = await response.json().catch(() => ({}));
  const dataSources = Array.isArray(payload.data_sources) ? payload.data_sources : [];
  if (dataSources.length === 0) {
    console.error(`[notion] database ${dbPathId} has no data_sources in response`);
    return null;
  }

  CACHED_DATA_SOURCE_ID = formatNotionIdForApi(dataSources[0].id);
  console.log(
    `[notion] resolved data_source_id ${CACHED_DATA_SOURCE_ID} from database ${dbPathId}` +
      (dataSources.length > 1 ? ` (using first of ${dataSources.length})` : '')
  );
  return CACHED_DATA_SOURCE_ID;
}

async function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function serveIndex(res) {
  try {
    const body = await fs.readFile(path.join(ROOT, 'index.html'));
    res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] });
    res.end(body);
  } catch (error) {
    res.writeHead(500);
    res.end('Failed to load index.html');
  }
}

async function serveStatic(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname === '/' ? '/index.html' : decodeURIComponent(requestUrl.pathname);
  const filePath = path.normalize(path.join(ROOT, pathname));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(body);
  } catch (error) {
    res.writeHead(404);
    res.end('Not found');
  }
}

/**
 * Pretty path /proposal/{id} (and bare /proposal or /proposal/) all serve
 * the SPA shell (index.html). The front-end reads `id` from the URL and
 * calls /api/proposal?id=... internally.
 */
const PROPOSAL_ROUTE_RE = /^\/proposal(?:\/([^/?#]+))?\/?$/;

async function handleRequest(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (PROPOSAL_ROUTE_RE.test(requestUrl.pathname)) {
    await serveIndex(res);
    return;
  }

  if (requestUrl.pathname === '/api/proposal') {
    const id = requestUrl.searchParams.get('id');
    const brand = requestUrl.searchParams.get('brand');
    const debug = requestUrl.searchParams.get('debug') === '1';
    const reasons = [];

    try {
      if (id) {
        const { proposal: notionProposal, reason } = await fetchNotionProposalById(id);
        if (reason) reasons.push(`notion: ${reason}`);
        if (notionProposal) {
          await sendJson(res, 200, notionProposal);
          return;
        }
        try {
          const proposal = await loadFallbackProposalById(id);
          await sendJson(res, 200, proposal);
          return;
        } catch (fallbackErr) {
          reasons.push(`fallback: ${fallbackErr.message}`);
          await sendJson(res, 404, {
            error: 'Proposal not found',
            id,
            reasons: debug ? reasons : undefined,
            hint:
              'Check that NOTION_TOKEN is a real integration token, that the integration is shared with the database, and that NOTION_DATA_SOURCE_ID (or NOTION_DATABASE_ID) points to the database that owns this row.'
          });
          return;
        }
      }

      if (!brand) {
        const proposal = await loadFallbackProposal('Nike');
        await sendJson(res, 200, proposal);
        return;
      }

      const notionProposal = await fetchNotionProposal(brand);
      const proposal = notionProposal || (await loadFallbackProposal(brand));
      await sendJson(res, 200, proposal);
    } catch (error) {
      console.error('[api/proposal] unexpected error:', error && error.message);
      try {
        let proposal;
        if (brand) {
          proposal = await loadFallbackProposal(brand);
        } else {
          proposal = await loadFallbackProposal('Nike');
        }
        await sendJson(res, 200, proposal);
      } catch (fallbackError) {
        const status = brand ? 404 : 500;
        await sendJson(res, status, {
          error: brand ? 'Proposal not found' : error.message
        });
      }
    }
    return;
  }

  await serveStatic(req, res);
}

if (require.main === module) {
  loadDotEnv().then(() => {
  const port = Number(process.env.PORT || 4173);
    const server = http.createServer(handleRequest);

    server.listen(port, () => {
      console.log(`Proposal server running at http://localhost:${port}`);
    });
  });
}

module.exports = async function handler(req, res) {
  await loadDotEnv();
  return handleRequest(req, res);
};
