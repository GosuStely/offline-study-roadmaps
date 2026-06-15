// Offline study site router + renderer.
// Hash routes:
//   #/                      -> home (list of roadmaps)
//   #/r/<slug>              -> roadmap view, first item selected
//   #/r/<slug>/<itemId>     -> roadmap view with item content shown

(function () {
  var app = document.getElementById('app');
  var STORAGE_PREFIX = 'studyRoadmaps.';

  var ROADMAP_ICONS = {
    'java': '☕',
    'spring-boot': '🍃',
    'typescript': '🔷',
    'system-design': '🧩',
    'software-design-architecture': '🏛️',
    'api-security-best-practices': '🛡️',
    'api-design': '🔌',
    'software-architect': '🧭'
  };

  function h(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- Theme ----------
  function getTheme() {
    return localStorage.getItem(STORAGE_PREFIX + 'theme') || 'dark';
  }

  function setTheme(theme) {
    localStorage.setItem(STORAGE_PREFIX + 'theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  // ---------- Progress tracking (per-roadmap, stored in localStorage) ----------
  function getProgress(slug) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + 'progress.' + slug);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function setProgress(slug, map) {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'progress.' + slug, JSON.stringify(map));
    } catch (e) { /* storage unavailable - progress just won't persist */ }
  }

  function isComplete(slug, itemId) {
    return !!getProgress(slug)[itemId];
  }

  function toggleComplete(slug, itemId) {
    var p = getProgress(slug);
    if (p[itemId]) {
      delete p[itemId];
    } else {
      p[itemId] = true;
    }
    setProgress(slug, p);
  }

  function countComplete(slug, ids) {
    var p = getProgress(slug);
    var n = 0;
    ids.forEach(function (id) { if (p[id]) n++; });
    return n;
  }

  function getAllItemIds(roadmap) {
    var ids = [];
    roadmap.groups.forEach(function (g) {
      g.items.forEach(function (it) { ids.push(it.id); });
    });
    return ids;
  }

  // Flatten groups into an ordered list of {id, title, groupTitle, ...} for prev/next navigation
  function flattenItems(roadmap) {
    var list = [];
    roadmap.groups.forEach(function (g, gi) {
      if (g.overviewId) {
        list.push({ id: g.overviewId, title: g.title, groupTitle: g.title, groupIndex: gi, isOverview: true });
      }
      g.items.forEach(function (it, ii) {
        list.push({
          id: it.id,
          title: it.title,
          groupTitle: g.title,
          groupIndex: gi,
          posInGroup: ii + 1,
          groupItemCount: g.items.length
        });
      });
    });
    return list;
  }

  function progressBarHtml(done, total) {
    var pct = total ? Math.round((done / total) * 100) : 0;
    if (done === 0) {
      return '<div class="progress-track"><div class="progress-fill is-empty"></div></div>' +
        '<span class="progress-label">' + total + ' topic' + (total === 1 ? '' : 's') + ' · not started</span>';
    }
    var label = pct === 100 ? 'All topics completed' : (done + ' / ' + total + ' topics · ' + pct + '%');
    return '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="progress-label' + (pct === 100 ? ' is-done' : '') + '">' + label + '</span>';
  }

  function renderHome() {
    var slugs = Object.keys(window.ROADMAP_DATA);
    var totalTopics = 0;

    var cardsHtml = slugs.map(function (slug) {
      var r = window.ROADMAP_DATA[slug];
      var ids = getAllItemIds(r);
      totalTopics += ids.length;
      var done = countComplete(slug, ids);
      var icon = ROADMAP_ICONS[slug] || '📘';
      var searchBlob = (r.title + ' ' + r.description).toLowerCase();

      return '<a class="roadmap-card" href="#/r/' + slug + '" data-search="' + escapeHtml(searchBlob) + '">' +
        '<div class="card-top">' +
        '<span class="card-icon" aria-hidden="true">' + icon + '</span>' +
        '<span class="meta">' + r.groups.length + ' section' + (r.groups.length === 1 ? '' : 's') + '</span>' +
        '</div>' +
        '<h2>' + escapeHtml(r.title) + '</h2>' +
        '<p>' + escapeHtml(r.description) + '</p>' +
        '<div class="card-progress">' + progressBarHtml(done, ids.length) + '</div>' +
        '</a>';
    }).join('');

    app.innerHTML =
      '<div class="home">' +
      '<section class="hero">' +
      '<h1>Offline Study Roadmaps</h1>' +
      '<p class="lead">Pick a roadmap, work through it topic by topic, and track your progress as you go. ' +
      'Everything works fully offline &mdash; no internet connection required.</p>' +
      '<div class="hero-stats">' +
      '<div class="stat"><span class="stat-num">' + slugs.length + '</span><span class="stat-label">Roadmaps</span></div>' +
      '<div class="stat"><span class="stat-num">' + totalTopics + '</span><span class="stat-label">Topics</span></div>' +
      '<div class="stat"><span class="stat-num">100%</span><span class="stat-label">Offline</span></div>' +
      '</div>' +
      '</section>' +
      '<div class="search-row">' +
      '<input type="search" class="search-input" id="roadmapSearch" placeholder="Search roadmaps&hellip;" aria-label="Search roadmaps">' +
      '</div>' +
      '<p class="section-label">All roadmaps</p>' +
      '<div class="roadmap-grid" id="roadmapGrid">' + cardsHtml + '</div>' +
      '<p class="empty-state" id="noResults" style="display:none">No roadmaps match your search.</p>' +
      '</div>';

    document.title = 'Study Roadmaps';
    renderTopbar(null, null);

    var search = document.getElementById('roadmapSearch');
    var cards = document.querySelectorAll('#roadmapGrid .roadmap-card');
    var noResults = document.getElementById('noResults');
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var match = !q || card.getAttribute('data-search').indexOf(q) !== -1;
        card.classList.toggle('is-hidden', !match);
        if (match) visible++;
      });
      noResults.style.display = visible === 0 ? '' : 'none';
    });
  }

  function renderTopbar(roadmap, slug) {
    var topbar = document.getElementById('topbar');
    var crumbs = '<a href="#/">Roadmaps</a>';
    var navToggle = '';
    if (roadmap) {
      crumbs += ' <span class="sep">/</span> <a href="#/r/' + slug + '">' + escapeHtml(roadmap.title) + '</a>';
      navToggle = '<button class="icon-btn nav-toggle" id="navToggle" aria-label="Toggle topics menu">&#9776; Topics</button>';
    }
    var themeIcon = getTheme() === 'light' ? '☀️' : '🌙';

    topbar.innerHTML =
      '<a class="brand" href="#/">📚 Study Roadmaps</a>' +
      '<nav class="crumbs" aria-label="Breadcrumb">' + crumbs + '</nav>' +
      '<div style="flex:1"></div>' +
      '<div class="topbar-actions">' +
      navToggle +
      '<button class="icon-btn" id="themeToggle" aria-label="Toggle light/dark color theme">' + themeIcon + '</button>' +
      '</div>';

    var t = document.getElementById('navToggle');
    if (t) {
      t.addEventListener('click', function () {
        var nav = document.querySelector('.nav-pane');
        if (nav) nav.classList.toggle('open');
      });
    }

    document.getElementById('themeToggle').addEventListener('click', function () {
      var next = getTheme() === 'light' ? 'dark' : 'light';
      setTheme(next);
      this.innerHTML = next === 'light' ? '☀️' : '🌙';
    });
  }

  function buildContentHtml(roadmap, slug, item, content) {
    if (!content) {
      return '<div class="placeholder-box">' +
        'Content for <strong>' + escapeHtml(item.title) + '</strong> hasn\'t been written yet.<br><br>' +
        'This page is part of the <strong>' + escapeHtml(roadmap.title) + '</strong> roadmap, ' +
        'in the &ldquo;' + escapeHtml(item.groupTitle || '') + '&rdquo; section. ' +
        'Ask your study assistant to fill in the Summary, Examples, and "When to use it" sections for this topic.' +
        '</div>';
    }

    var html = '';

    if (content.summary) {
      html += '<h2><span aria-hidden="true">📘</span> Summary</h2>' + content.summary;
    }

    if (content.examples && content.examples.length) {
      html += '<h2><span aria-hidden="true">🧪</span> Examples</h2>';
      content.examples.forEach(function (ex) {
        html += '<div class="example">';
        if (ex.title) html += '<h3>' + escapeHtml(ex.title) + '</h3>';
        if (ex.description) html += ex.description;
        if (ex.code) {
          html += '<pre><code>' + escapeHtml(ex.code) + '</code></pre>';
        }
        html += '</div>';
      });
    }

    if (content.whenToUse) {
      html += '<h2><span aria-hidden="true">🎯</span> When to use it</h2>' + content.whenToUse;
    }

    return html;
  }

  function renderRoadmap(slug, itemId) {
    var roadmap = window.ROADMAP_DATA[slug];
    if (!roadmap) {
      app.innerHTML = '<div class="home"><h1>Roadmap not found</h1><p><a href="#/">Back to roadmaps</a></p></div>';
      renderTopbar(null, null);
      return;
    }

    var flat = flattenItems(roadmap);
    var current = itemId ? flat.find(function (it) { return it.id === itemId; }) : flat[0];
    if (!current) current = flat[0];

    var allIds = getAllItemIds(roadmap);
    var doneCount = countComplete(slug, allIds);

    // ---- Sidebar ----
    var navHtml = '<div class="nav-header">' +
      '<h2>' + escapeHtml(roadmap.title) + '</h2>' +
      '<div class="nav-progress">' + progressBarHtml(doneCount, allIds.length) + '</div>' +
      '<input type="search" class="nav-search" id="navSearch" placeholder="Filter topics&hellip;" aria-label="Filter topics in this roadmap">' +
      '</div>';

    navHtml += '<div class="nav-groups">';
    roadmap.groups.forEach(function (g, gi) {
      var groupId = 'g' + gi;
      var headActive = g.overviewId && g.overviewId === current.id ? ' overview-active' : '';
      var groupIds = g.items.map(function (it) { return it.id; });
      var groupDone = countComplete(slug, groupIds);
      navHtml += '<div class="nav-group" data-group="' + groupId + '">';
      navHtml += '<div class="nav-group-title' + headActive + '">';
      navHtml += '<button class="chev-btn" aria-label="Toggle section"><span class="chev">&#9660;</span></button>';
      if (g.overviewId) {
        navHtml += '<a class="nav-group-label" href="#/r/' + slug + '/' + g.overviewId + '">' + escapeHtml(g.title) + '</a>';
      } else {
        navHtml += '<span class="nav-group-label">' + escapeHtml(g.title) + '</span>';
      }
      if (groupIds.length) {
        navHtml += '<span class="group-progress' + (groupDone === groupIds.length ? ' is-done' : '') + '">' + groupDone + '/' + groupIds.length + '</span>';
      }
      navHtml += '</div>';
      navHtml += '<ul class="nav-items">';
      g.items.forEach(function (it) {
        var active = it.id === current.id ? ' active' : '';
        var done = isComplete(slug, it.id);
        navHtml += '<li class="nav-item' + active + '" data-search="' + escapeHtml(it.title.toLowerCase()) + '">' +
          '<button type="button" class="item-check' + (done ? ' is-done' : '') + '" data-toggle-id="' + escapeHtml(it.id) + '" aria-pressed="' + done + '" aria-label="Mark &quot;' + escapeHtml(it.title) + '&quot; as ' + (done ? 'not complete' : 'complete') + '">' + (done ? '✓' : '') + '</button>' +
          '<a href="#/r/' + slug + '/' + it.id + '"><span class="item-title">' + escapeHtml(it.title) + '</span></a>' +
          '</li>';
      });
      navHtml += '</ul></div>';
    });
    navHtml += '</div>';

    // ---- Content ----
    var content = (window.CONTENT_DATA[slug] || {})[current.id];
    var sectionsHtml = buildContentHtml(roadmap, slug, current, content);

    var breadcrumb = '<nav class="breadcrumb" aria-label="Breadcrumb">' +
      '<a href="#/">Roadmaps</a> <span class="sep">/</span> ' +
      '<a href="#/r/' + slug + '">' + escapeHtml(roadmap.title) + '</a> <span class="sep">/</span> ' +
      '<span class="current">' + escapeHtml(current.groupTitle) + '</span>' +
      '</nav>';

    var kicker = escapeHtml(current.groupTitle);
    if (current.isOverview) {
      kicker += ' · Section overview';
    } else if (current.posInGroup && current.groupItemCount) {
      kicker += ' · Topic ' + current.posInGroup + ' of ' + current.groupItemCount;
    }

    var completeToggle = '';
    if (!current.isOverview) {
      var done = isComplete(slug, current.id);
      completeToggle = '<button type="button" class="complete-toggle' + (done ? ' is-complete' : '') + '" id="completeToggle" data-id="' + escapeHtml(current.id) + '" aria-pressed="' + done + '">' +
        '<span class="check-icon" aria-hidden="true"></span>' +
        (done ? 'Completed' : 'Mark as complete') +
        '</button>';
    }

    var header = '<div class="content-header">' +
      '<div><span class="content-kicker">' + kicker + '</span><h1>' + escapeHtml(current.title) + '</h1></div>' +
      completeToggle +
      '</div>';

    // prev/next
    var idx = flat.findIndex(function (it) { return it.id === current.id; });
    var prev = flat[idx - 1];
    var next = flat[idx + 1];
    var navLinks = '<div class="content-nav">';
    if (prev) {
      navLinks += '<a class="prev" href="#/r/' + slug + '/' + prev.id + '"><span class="label">&larr; Previous</span>' + escapeHtml(prev.title) + '</a>';
    } else {
      navLinks += '<span></span>';
    }
    if (next) {
      navLinks += '<a class="next" href="#/r/' + slug + '/' + next.id + '"><span class="label">Next &rarr;</span>' + escapeHtml(next.title) + '</a>';
    } else {
      navLinks += '<span></span>';
    }
    navLinks += '</div>';

    app.innerHTML =
      '<div class="roadmap-view">' +
      '<nav class="nav-pane" aria-label="Roadmap navigation">' + navHtml + '</nav>' +
      '<div class="content-pane">' +
      '<div class="inner">' + breadcrumb + header + sectionsHtml + navLinks + '</div>' +
      '<button type="button" class="scroll-top" id="scrollTop" aria-label="Scroll to top of page">&uarr;</button>' +
      '</div>' +
      '</div>';

    document.title = current.title + ' – ' + roadmap.title;

    // collapsible groups (chevron button toggles, without navigating)
    document.querySelectorAll('.chev-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        btn.closest('.nav-group').classList.toggle('collapsed');
      });
    });

    // collapse all groups except the one containing (or heading) the active item
    document.querySelectorAll('.nav-group').forEach(function (grp) {
      var hasActive = grp.querySelector('.nav-item.active') ||
        grp.querySelector('.nav-group-title.overview-active');
      if (!hasActive) {
        grp.classList.add('collapsed');
      }
    });

    // close mobile nav when navigating to any page (item or section overview)
    document.querySelectorAll('.nav-item a, .nav-group-label').forEach(function (a) {
      if (a.tagName === 'A') {
        a.addEventListener('click', function () {
          var nav = document.querySelector('.nav-pane');
          if (nav) nav.classList.remove('open');
        });
      }
    });

    // toggle completion from the sidebar checkmark, without navigating
    document.querySelectorAll('.item-check').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleComplete(slug, btn.getAttribute('data-toggle-id'));
        renderRoadmap(slug, current.id);
      });
    });

    // mark the current topic complete / not complete
    var completeBtn = document.getElementById('completeToggle');
    if (completeBtn) {
      completeBtn.addEventListener('click', function () {
        toggleComplete(slug, completeBtn.getAttribute('data-id'));
        renderRoadmap(slug, current.id);
      });
    }

    // filter sidebar items by search text
    var navSearch = document.getElementById('navSearch');
    navSearch.addEventListener('input', function () {
      var q = navSearch.value.trim().toLowerCase();
      document.querySelectorAll('.nav-group').forEach(function (grp) {
        var anyMatch = false;
        grp.querySelectorAll('.nav-item').forEach(function (li) {
          var match = !q || li.getAttribute('data-search').indexOf(q) !== -1;
          li.classList.toggle('is-hidden', !match);
          if (match) anyMatch = true;
        });
        var label = grp.querySelector('.nav-group-label');
        var groupMatches = !q || (label && label.textContent.toLowerCase().indexOf(q) !== -1);
        grp.classList.toggle('is-hidden', !anyMatch && !groupMatches);
        if (q) {
          grp.classList.toggle('collapsed', !anyMatch);
        } else {
          var hasActive = grp.querySelector('.nav-item.active') || grp.querySelector('.nav-group-title.overview-active');
          grp.classList.toggle('collapsed', !hasActive);
        }
      });
    });

    // copy-to-clipboard button on code blocks
    document.querySelectorAll('.content-pane pre').forEach(function (pre) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.textContent : pre.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(function () {
              btn.textContent = 'Copy';
              btn.classList.remove('copied');
            }, 1500);
          });
        }
      });
      pre.appendChild(btn);
    });

    // scroll-to-top button
    var contentPane = document.querySelector('.content-pane');
    var scrollTopBtn = document.getElementById('scrollTop');
    contentPane.addEventListener('scroll', function () {
      scrollTopBtn.classList.toggle('is-visible', contentPane.scrollTop > 400);
    });
    scrollTopBtn.addEventListener('click', function () {
      contentPane.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // scroll active item (or active section header) into view
    var activeEl = document.querySelector('.nav-item.active') ||
      document.querySelector('.nav-group-title.overview-active');
    if (activeEl) activeEl.scrollIntoView({ block: 'center' });

    // scroll content to top
    contentPane.scrollTop = 0;

    renderTopbar(roadmap, slug);
  }

  function route() {
    var hash = window.location.hash || '#/';
    var parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);

    if (parts.length === 0) {
      renderHome();
      return;
    }
    if (parts[0] === 'r' && parts[1]) {
      renderRoadmap(parts[1], parts[2]);
      return;
    }
    renderHome();
  }

  document.documentElement.setAttribute('data-theme', getTheme());

  window.addEventListener('hashchange', route);
  window.addEventListener('DOMContentLoaded', route);
  if (document.readyState !== 'loading') route();
})();
