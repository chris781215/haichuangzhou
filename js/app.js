/* ===== 海创周 · JavaScript ===== */

(function() {
  'use strict';

  /* ----- 1. 倒计时 ----- */
  function updateCountdown() {
    const target = new Date('2026-07-10T09:00:00+08:00').getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2, '0');
    const el = id => document.getElementById(id);
    if (el('cdDays'))  el('cdDays').textContent  = pad(d);
    if (el('cdHours')) el('cdHours').textContent = pad(h);
    if (el('cdMins'))  el('cdMins').textContent  = pad(m);
    if (el('cdSecs'))  el('cdSecs').textContent  = pad(s);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ----- 2. 演讲嘉宾（风琴页）----- */
  const speakers = [
    {
      name: '贾振元',
      role: '中国科学院院士',
      title: '大连理工大学校长',
      bio: '机械工程专家，长期从事高端装备精密制造与智能控制研究。曾获国家技术发明奖一等奖、国家科技进步奖多项，主持国家科技重大专项、973计划项目等。'
    },
    {
      name: '石勇',
      role: '国务院参事',
      title: '中科院大数据挖掘重点实验室主任',
      bio: '数据科学领域领军学者，专注虚拟经济与大数据分析。曾获"中国青年科技奖"、国际数据挖掘领域最高荣誉。'
    },
    {
      name: '汤敏',
      role: '原国务院参事',
      title: '国务院发展研究中心研究员',
      bio: '宏观经济与教育发展领域资深专家。长期从事经济政策研究，参与国家多项重大改革方案设计。'
    },
    {
      name: '金安君',
      role: '俄罗斯自然科学院院士',
      title: '华能集团首席科学家',
      bio: '清洁能源与低碳技术领域专家。主持研发多项国家级清洁能源示范项目，推动碳中和关键技术产业化。'
    },
    {
      name: '海博',
      role: 'OECD驻华高级顾问',
      title: '经合组织中国区负责人',
      bio: '长期致力于国际合作与科技创新政策研究，推动中国与OECD在科技创新、数字经济等领域的深度合作。'
    },
    {
      name: '何宪',
      role: '人社部原副部长',
      title: '中国人才研究会会长',
      bio: '人才管理与人力资源领域权威专家。主导推动多项国家人才政策改革，在人才引进、评价机制创新方面有深入研究。'
    }
  ];

  function renderAccordion() {
    const container = document.getElementById('speakerAccordion');
    if (!container) return;

    container.innerHTML = speakers.slice(0, 10).map((s, i) => `
      <div class="accordion-item fade-in" data-index="${i}">
        <div class="accordion-header" role="button" tabindex="0">
          <div class="avatar">${s.name[0]}</div>
          <div class="info">
            <h4>${s.name}</h4>
            <div class="role">${s.role}</div>
          </div>
          <div class="arrow"><i class="fas fa-chevron-down"></i></div>
        </div>
        <div class="accordion-body">
          <div class="title">${s.title}</div>
          <div class="bio-detail">${s.bio}</div>
        </div>
      </div>
    `).join('');

    // 点击切换
    container.addEventListener('click', e => {
      const header = e.target.closest('.accordion-header');
      if (!header) return;
      const item = header.closest('.accordion-item');
      if (!item) return;
      item.classList.toggle('open');
    });
  }
  renderAccordion();

  /* ----- 3. 媒体报道 ----- */
  const mediaItems = [
    {
      title: '第26届"海创周"7月10日在大连开幕',
      source: '腾讯新闻 / 半岛晨报',
      icon: 'fas fa-ticket-alt',
      url: 'https://new.qq.com/rain/a/20250705A035HF00'
    },
    {
      title: '第26届海外学子(大连)创业周人才交流洽谈会启幕',
      source: '凤凰网 / 半岛晨报',
      icon: 'fas fa-newspaper',
      url: 'https://new.qq.com/rain/a/20250711A03MIK00'
    },
    {
      title: '海创周"大篷车"再出发，深度对接创新创业资源',
      source: '新浪财经',
      icon: 'fas fa-bus',
      url: 'https://finance.sina.com.cn/jjxw/2025-04-11/doc-inestrki8702953.shtml'
    },
    {
      title: '第25届海创周：科技赋能产业·创新引领未来',
      source: '大连市人民政府官网',
      icon: 'fas fa-gov',
      url: 'https://www.dl.gov.cn/art/2024/7/6/art_1185_2337797.html'
    },
    {
      title: '第24届海创周盛大开幕，40场活动精彩纷呈',
      source: '新浪财经',
      icon: 'fas fa-star',
      url: 'https://finance.sina.com.cn/jjxw/2023-06-30/doc-imyyzutu8900350.shtml'
    }
  ];

  function renderMedia() {
    const grid = document.getElementById('mediaGrid');
    if (!grid) return;
    grid.innerHTML = mediaItems.map(m => `
      <a class="media-card fade-in" href="${m.url}" target="_blank" rel="noopener">
        <div class="thumb"><i class="${m.icon}"></i></div>
        <div class="body">
          <h4>${m.title}</h4>
          <div class="src"><i class="far fa-file-alt"></i> ${m.source}</div>
        </div>
      </a>
    `).join('');
  }
  renderMedia();

  /* ----- 4. 粒子动画 ----- */
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = Math.min(30, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.style.left = Math.random() * 100 + '%';
      span.style.animationDuration = (8 + Math.random() * 14) + 's';
      span.style.animationDelay = Math.random() * 12 + 's';
      span.style.width = span.style.height = (2 + Math.random() * 3) + 'px';
      container.appendChild(span);
    }
  }
  createParticles();

  /* ----- 5. 移动端导航 ----- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ----- 6. 滚动高亮 + 渐入动画 ----- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function highlightNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  function checkFade() {
    document.querySelectorAll('.fade-in').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', () => {
    highlightNav();
    checkFade();
  }, { passive: true });

  checkFade();
  highlightNav();

  /* ----- 8. 签到（localStorage）----- */
  const CI_KEY = 'haichuangzhou_checkins';

  function getCheckins() {
    try { return JSON.parse(localStorage.getItem(CI_KEY)) || []; } catch { return []; }
  }
  function saveCheckins(arr) {
    localStorage.setItem(CI_KEY, JSON.stringify(arr));
  }

  function renderCheckins() {
    const list = document.getElementById('checkinList');
    const total = document.getElementById('checkinTotal');
    if (!list) return;

    const arr = getCheckins();
    if (total) total.textContent = arr.length;

    list.innerHTML = arr.length === 0
      ? '<div style="text-align:center;padding:24px;color:var(--text-light);font-size:13px;">暂无签到记录</div>'
      : arr.map((c, i) => `
        <div class="checkin-person">
          <span class="rank ${i < 3 ? 'top3' : ''}">${i + 1}</span>
          <span class="ci-name">${c.name}</span>
          <span class="ci-time">${formatTime(c.time)}</span>
          <button class="ci-del" data-ci="${i}" title="删除">✕</button>
        </div>
      `).join('');
  }

  function showCheckinDone(name) {
    const form = document.getElementById('checkinForm');
    const done = document.getElementById('checkinDone');
    const stamp = document.getElementById('checkinStamp');
    const rank = document.getElementById('checkinRank');
    if (form) form.style.display = 'none';
    if (done) done.style.display = 'block';
    if (stamp) stamp.textContent = name;

    const arr = getCheckins();
    const idx = arr.findIndex(c => c.name === name);
    if (rank) rank.textContent = idx >= 0 ? idx + 1 : '--';

    localStorage.setItem('haichuangzhou_my_checkin', name);
  }

  function showCheckinForm() {
    const form = document.getElementById('checkinForm');
    const done = document.getElementById('checkinDone');
    if (form) form.style.display = 'block';
    if (done) done.style.display = 'none';
    localStorage.removeItem('haichuangzhou_my_checkin');
  }

  // 签到按钮
  const ciBtn = document.getElementById('checkinBtn');
  const ciInput = document.getElementById('checkinName');
  if (ciBtn && ciInput) {
    ciBtn.addEventListener('click', () => {
      const name = ciInput.value.trim();
      if (!name || name.length < 1) {
        ciInput.focus();
        ciInput.style.borderColor = '#ef4444';
        setTimeout(() => ciInput.style.borderColor = '', 1000);
        return;
      }

      const arr = getCheckins();
      arr.unshift({ name: name.slice(0, 20), time: Date.now() });
      saveCheckins(arr);
      renderCheckins();
      showCheckinDone(name);
      ciInput.value = '';
    });

    ciInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); ciBtn.click(); }
    });
  }

  // 重新签到
  const resetBtn = document.getElementById('checkinReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', showCheckinForm);
  }

  // 删除单条签到
  document.addEventListener('click', e => {
    const del = e.target.closest('.ci-del');
    if (!del) return;
    const idx = parseInt(del.dataset.ci);
    if (isNaN(idx)) return;
    const arr = getCheckins();
    arr.splice(idx, 1);
    saveCheckins(arr);
    renderCheckins();
  });



  // 恢复签到状态
  (function restoreCheckin() {
    const saved = localStorage.getItem('haichuangzhou_my_checkin');
    if (saved) {
      const arr = getCheckins();
      const exists = arr.some(c => c.name === saved);
      if (exists) { showCheckinDone(saved); }
      else { localStorage.removeItem('haichuangzhou_my_checkin'); }
    }
  })();

  renderCheckins();

  /* ----- 9. 留言板（localStorage）----- */
  const STORAGE_KEY = 'haichuangzhou_messages';
  const MAX_MSGS = 100;

  function getMessages() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function saveMessages(msgs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(0, MAX_MSGS)));
  }

  function renderMessages() {
    const list = document.getElementById('gbList');
    const empty = document.getElementById('gbEmpty');
    if (!list) return;

    const msgs = getMessages();

    // 隐藏/显示空状态
    if (empty) {
      empty.style.display = msgs.length === 0 ? 'block' : 'none';
    }

    // 移除 js 渲染的留言（保留空状态）
    list.querySelectorAll('.gb-item').forEach(el => el.remove());

    msgs.forEach((msg, idx) => {
      const div = document.createElement('div');
      div.className = 'gb-item';
      div.innerHTML = `
        <div class="gb-item-head">
          <span class="gb-item-avatar">${msg.label || '🙂'}</span>
          <span class="gb-item-name">${escapeHtml(msg.name || '匿名')}</span>
          <span class="gb-item-time">${formatTime(msg.time)}</span>
          <button class="gb-item-del" data-idx="${idx}" title="删除">✕</button>
        </div>
        <div class="gb-item-text">${escapeHtml(msg.text)}</div>
      `;
      list.appendChild(div);
    });
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function formatTime(ts) {
    const d = new Date(ts);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getMonth()+1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // 提交留言
  const submitBtn = document.getElementById('gbSubmit');
  const nameInput = document.getElementById('gbName');
  const msgInput = document.getElementById('gbMsg');
  const labelSelect = document.getElementById('gbLabel');
  const countSpan = document.getElementById('gbCount');

  if (submitBtn && msgInput) {
    // 字数统计
    msgInput.addEventListener('input', () => {
      if (countSpan) countSpan.textContent = msgInput.value.length;
    });

    submitBtn.addEventListener('click', () => {
      const text = msgInput.value.trim();
      if (!text) {
        msgInput.focus();
        msgInput.style.borderColor = '#ef4444';
        setTimeout(() => msgInput.style.borderColor = '', 1000);
        return;
      }

      const msgs = getMessages();
      msgs.unshift({
        label: labelSelect ? labelSelect.value : '🙂',
        name: nameInput ? nameInput.value.trim().slice(0, 20) : '',
        text: text.slice(0, 500),
        time: Date.now()
      });
      saveMessages(msgs);
      renderMessages();

      msgInput.value = '';
      if (countSpan) countSpan.textContent = '0';
    });

    // 回车发送
    msgInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitBtn.click();
      }
    });
  }

  // 清空所有留言
  const clearBtn = document.getElementById('gbClear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (getMessages().length === 0) return;
      if (!confirm('确定清空所有留言？')) return;
      saveMessages([]);
      renderMessages();
    });
  }

  // 删除单条留言（事件委托）
  document.addEventListener('click', e => {
    const delBtn = e.target.closest('.gb-item-del');
    if (!delBtn) return;
    const idx = parseInt(delBtn.dataset.idx);
    if (isNaN(idx)) return;
    const msgs = getMessages();
    msgs.splice(idx, 1);
    saveMessages(msgs);
    renderMessages();
  });

  // 初始渲染
  renderMessages();

})();
