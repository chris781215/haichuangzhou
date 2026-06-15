/**
 * 海创周 H5 - Cloudflare Worker API
 * 
 * D1 数据库表:
 *   CREATE TABLE checkins (
 *     id INTEGER PRIMARY KEY AUTOINCREMENT,
 *     name TEXT NOT NULL,
 *     t INTEGER NOT NULL
 *   );
 *   CREATE TABLE messages (
 *     id INTEGER PRIMARY KEY AUTOINCREMENT,
 *     label TEXT DEFAULT '🙂',
 *     name TEXT DEFAULT '',
 *     text TEXT NOT NULL,
 *     t INTEGER NOT NULL
 *   );
 */

const ALLOWED_ORIGINS = [
  'https://haichuangzhou.pages.dev',   // Cloudflare Pages（旧）
  'https://haichuangzhou1.pages.dev',  // Cloudflare Pages（新）
  'https://hkgexport.com',             // 自定义域名
  'http://localhost:8787',              // 本地预览
  'http://localhost:3000',
  'http://127.0.0.1:8787',            // 本地预览（IP直连）              // 本地开发
];

// CORS 头
function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : (ALLOWED_ORIGINS[0]);
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

// 管理员鉴权
function checkAdmin(request, env) {
  const pwd = request.headers.get('X-Admin-Password') || '';
  const expected = env.ADMIN_PASSWORD || 'admin123';
  return pwd === expected;
}

function ok(data, origin) {
  return new Response(JSON.stringify({ ok: true, data }), {
    headers: corsHeaders(origin),
  });
}

function err(msg, origin, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status,
    headers: corsHeaders(origin),
  });
}

async function handleCheckin(request, env, origin) {
  // --- GET: 获取所有签到 ---
  if (request.method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT id, name, t FROM checkins ORDER BY id DESC LIMIT 200'
    ).all();
    return ok(results.map(r => ({ name: r.name, time: r.t })), origin);
  }

  // --- POST: 添加签到 ---
  if (request.method === 'POST') {
    let body;
    try {
      body = await request.json();
    } catch {
      return err('无效的请求体', origin);
    }

    const name = (body.name || '').trim().slice(0, 20);
    if (!name) return err('姓名不能为空', origin);

    await env.DB.prepare(
      'INSERT INTO checkins (name, t) VALUES (?, ?)'
    ).bind(name, Date.now()).run();

    // 返回当前排名
    const { results } = await env.DB.prepare(
      'SELECT COUNT(*) as cnt FROM checkins'
    ).all();
    return ok({ name, rank: results[0].cnt }, origin);
  }

  return err('Method Not Allowed', origin, 405);
}

async function handleMessage(request, env, origin) {
  // --- GET: 获取所有留言 ---
  if (request.method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT id, label, name, text, t FROM messages ORDER BY id DESC LIMIT 100'
    ).all();
    return ok(results.map(r => ({
      label: r.label,
      name: r.name,
      text: r.text,
      time: r.t,
    })), origin);
  }

  // --- POST: 添加留言 ---
  if (request.method === 'POST') {
    let body;
    try {
      body = await request.json();
    } catch {
      return err('无效的请求体', origin);
    }

    const text = (body.text || '').trim().slice(0, 500);
    if (!text) return err('留言内容不能为空', origin);

    const label = (body.label || '🙂').slice(0, 10);
    const name = (body.name || '').trim().slice(0, 20);

    await env.DB.prepare(
      'INSERT INTO messages (label, name, text, t) VALUES (?, ?, ?, ?)'
    ).bind(label, name, text, Date.now()).run();

    return ok({ label, name, text }, origin);
  }

  return err('Method Not Allowed', origin, 405);
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';

    // 处理 CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api/, '');

    try {
      if (path === '/checkin' || path === '/checkin/') {
        return handleCheckin(request, env, origin);
      }
      if (path === '/message' || path === '/message/') {
        return handleMessage(request, env, origin);
      }

      // --- 管理员接口 ---
      if (path.startsWith('/admin/')) {
        if (!checkAdmin(request, env)) {
          return err('密码错误', origin, 401);
        }

        // GET /api/admin/checkins - 查看全部签到（含ID）
        if (path === '/admin/checkins' && request.method === 'GET') {
          const { results } = await env.DB.prepare(
            'SELECT id, name, t FROM checkins ORDER BY id DESC'
          ).all();
          return ok(results, origin);
        }

        // GET /api/admin/messages - 查看全部留言（含ID）
        if (path === '/admin/messages' && request.method === 'GET') {
          const { results } = await env.DB.prepare(
            'SELECT id, label, name, text, t FROM messages ORDER BY id DESC'
          ).all();
          return ok(results, origin);
        }

        // DELETE /api/admin/checkin?id=N - 删除签到
        if (path === '/admin/checkin' && request.method === 'DELETE') {
          const id = parseInt(url.searchParams.get('id'));
          if (!id) return err('缺少 id 参数', origin);
          await env.DB.prepare('DELETE FROM checkins WHERE id = ?').bind(id).run();
          return ok({ deleted: id }, origin);
        }

        // DELETE /api/admin/message?id=N - 删除留言
        if (path === '/admin/message' && request.method === 'DELETE') {
          const id = parseInt(url.searchParams.get('id'));
          if (!id) return err('缺少 id 参数', origin);
          await env.DB.prepare('DELETE FROM messages WHERE id = ?').bind(id).run();
          return ok({ deleted: id }, origin);
        }

        // DELETE /api/admin/messages/all - 清空全部留言
        if (path === '/admin/messages/all' && request.method === 'DELETE') {
          await env.DB.prepare('DELETE FROM messages').run();
          return ok({ cleared: true }, origin);
        }

        return err('Not Found', origin, 404);
      }

      return err('Not Found', origin, 404);
    } catch (e) {
      return err('服务器内部错误: ' + e.message, origin, 500);
    }
  },
};
