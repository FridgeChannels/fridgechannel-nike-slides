const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const ROOT = __dirname;
const NOTION_VERSION = '2022-06-28';

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
  'brand_channel_name',
  'hero_image_url',
  'device_rendering_image_url',
  'act1_example_1',
  'act1_example_2',
  'act1_example_3',
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
  'footer_button_url'
];

function slugify(value) {
  return String(value || 'nike').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'nike';
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
    return property.number ?? '';
  }

  if (property.type === 'formula') {
    return property.formula.string || property.formula.number || property.formula.boolean || '';
  }

  return '';
}

function normalizeNotionPage(page) {
  const byNormalizedName = Object.entries(page.properties || {}).reduce((acc, [name, property]) => {
    acc[normalizeKey(name)] = property;
    return acc;
  }, {});

  return FIELD_NAMES.reduce((data, fieldName) => {
    data[fieldName] = getTextValue(byNormalizedName[fieldName]);
    return data;
  }, {});
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

async function fetchNotionProposal(brand) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = await resolveNotionDatabaseId(process.env.NOTION_DATABASE_ID, token);

  if (!token || !databaseId) {
    return null;
  }

  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION
    },
    body: JSON.stringify({ page_size: 100 })
  });

  if (!response.ok) {
    throw new Error(`Notion query failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  const target = slugify(brand);
  const page = payload.results.find(item => {
    const data = normalizeNotionPage(item);
    return slugify(data.brand_name) === target;
  });

  return page ? cleanProposal(normalizeNotionPage(page)) : null;
}

async function resolveNotionDatabaseId(id, token) {
  if (!id || !token) return null;

  const queryResponse = await fetch(`https://api.notion.com/v1/databases/${id}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION
    },
    body: JSON.stringify({ page_size: 1 })
  });

  if (queryResponse.ok) return id;

  const errorPayload = await queryResponse.json().catch(() => ({}));
  if (errorPayload.code !== 'validation_error' || !String(errorPayload.message || '').includes('page')) {
    throw new Error(`Notion query failed: ${queryResponse.status} ${JSON.stringify(errorPayload)}`);
  }

  const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${id}/children?page_size=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION
    }
  });

  if (!blocksResponse.ok) {
    throw new Error(`Notion page children lookup failed: ${blocksResponse.status} ${await blocksResponse.text()}`);
  }

  const blocksPayload = await blocksResponse.json();
  const childDatabase = (blocksPayload.results || []).find(block => block.type === 'child_database');
  if (!childDatabase) {
    throw new Error('No child database found inside the configured Notion page.');
  }

  return childDatabase.id;
}

async function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
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

async function handleRequest(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname === '/api/proposal') {
    const brand = requestUrl.searchParams.get('brand');

    try {
      if (!brand) {
        const proposal = await loadFallbackProposal('Nike');
        await sendJson(res, 200, proposal);
        return;
      }

      const notionProposal = await fetchNotionProposal(brand);
      const proposal = notionProposal || await loadFallbackProposal(brand);
      await sendJson(res, 200, proposal);
    } catch (error) {
      try {
        const proposal = await loadFallbackProposal(brand);
        await sendJson(res, 200, proposal);
      } catch (fallbackError) {
        await sendJson(res, 500, { error: error.message });
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
