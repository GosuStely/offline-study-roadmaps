// Offline study site router + renderer.
// Hash routes:
//   #/                      -> home (list of roadmaps)
//   #/r/<slug>              -> roadmap view, first item selected
//   #/r/<slug>/<itemId>     -> roadmap view with item content shown

(function () {
  var app = document.getElementById('app');

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

  // Flatten groups into an ordered list of {id, title, groupTitle} for prev/next navigation
  function flattenItems(roadmap) {
    var list = [];
    roadmap.groups.forEach(function (g) {
      if (g.overviewId) {
        list.push({ id: g.overviewId, title: g.title, groupTitle: g.title, isOverview: true });
      }
      g.items.forEach(function (it) {
        list.push({ id: it.id, title: it.title, groupTitle: g.title });
      });
    });
    return list;
  }

  function renderHome() {
    var metas = Object.keys(window.ROADMAP_DATA).map(function (slug) {
      var r = window.ROADMAP_DATA[slug];
      var count = 0;
      r.groups.forEach(function (g) { count += g.items.length; });
      return { slug: slug, title: r.title, description: r.description, groupCount: r.groups.length, itemCount: count };
    });

    var cardsHtml = metas.map(function (m) {
      return '<a class="roadmap-card" href="#/r/' + m.slug + '">' +
        '<h2>' + escapeHtml(m.title) + '</h2>' +
        '<p>' + escapeHtml(m.description) + '</p>' +
        '<span class="meta">' + m.groupCount + ' sections &middot; ' + m.itemCount + ' topics</span>' +
        '</a>';
    }).join('');

    app.innerHTML =
      '<div class="home">' +
      '<h1>Offline Study Roadmaps</h1>' +
      '<p class="lead">Click a roadmap to start studying. Everything works fully offline &mdash; no internet required.</p>' +
      '<div class="roadmap-grid">' + cardsHtml + '</div>' +
      '</div>';

    document.title = 'Study Roadmaps';
    renderTopbar(null, null);
  }

  function renderTopbar(roadmap, slug) {
    var topbar = document.getElementById('topbar');
    var crumbs = '<a href="#/">Roadmaps</a>';
    var toggle = '';
    if (roadmap) {
      crumbs += ' / <a href="#/r/' + slug + '">' + escapeHtml(roadmap.title) + '</a>';
      toggle = '<button class="nav-toggle" id="navToggle">&#9776; Topics</button>';
    }
    topbar.innerHTML =
      '<span class="brand">Study Roadmaps</span>' +
      '<span class="crumbs">' + crumbs + '</span>' +
      '<div style="flex:1"></div>' +
      toggle;

    var t = document.getElementById('navToggle');
    if (t) {
      t.addEventListener('click', function () {
        var nav = document.querySelector('.nav-pane');
        if (nav) nav.classList.toggle('open');
      });
    }
  }

  function buildContentHtml(roadmap, slug, item, content) {
    if (!content) {
      return '<h1>' + escapeHtml(item.title) + '</h1>' +
        '<div class="placeholder-box">' +
        'Content for <strong>' + escapeHtml(item.title) + '</strong> hasn\'t been written yet.<br><br>' +
        'This page is part of the <strong>' + escapeHtml(roadmap.title) + '</strong> roadmap, ' +
        'in the &ldquo;' + escapeHtml(item.groupTitle || '') + '&rdquo; section. ' +
        'Ask your study assistant to fill in the Summary, Examples, and "When to use it" sections for this topic.' +
        '</div>';
    }

    var html = '<h1>' + escapeHtml(item.title) + '</h1>';

    if (content.summary) {
      html += '<h2>Summary</h2>' + content.summary;
    }

    if (content.examples && content.examples.length) {
      html += '<h2>Examples</h2>';
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
      html += '<h2>When to use it</h2>' + content.whenToUse;
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

    // Build nav
    var navHtml = '<h2>' + escapeHtml(roadmap.title) + '</h2>';
    roadmap.groups.forEach(function (g, gi) {
      var groupId = 'g' + gi;
      var headActive = g.overviewId && g.overviewId === current.id ? ' overview-active' : '';
      navHtml += '<div class="nav-group" data-group="' + groupId + '">';
      navHtml += '<div class="nav-group-title' + headActive + '">';
      navHtml += '<button class="chev-btn" aria-label="Toggle section"><span class="chev">&#9660;</span></button>';
      if (g.overviewId) {
        navHtml += '<a class="nav-group-label" href="#/r/' + slug + '/' + g.overviewId + '">' + escapeHtml(g.title) + '</a>';
      } else {
        navHtml += '<span class="nav-group-label">' + escapeHtml(g.title) + '</span>';
      }
      navHtml += '</div>';
      navHtml += '<ul class="nav-items">';
      g.items.forEach(function (it) {
        var active = it.id === current.id ? ' active' : '';
        navHtml += '<li class="nav-item' + active + '"><a href="#/r/' + slug + '/' + it.id + '">' + escapeHtml(it.title) + '</a></li>';
      });
      navHtml += '</ul></div>';
    });

    // Build content
    var content = (window.CONTENT_DATA[slug] || {})[current.id];
    var contentHtml = buildContentHtml(roadmap, slug, current, content);

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
      '<nav class="nav-pane">' + navHtml + '</nav>' +
      '<div class="content-pane"><div class="inner">' + contentHtml + navLinks + '</div></div>' +
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

    // scroll active item (or active section header) into view
    var activeEl = document.querySelector('.nav-item.active') ||
      document.querySelector('.nav-group-title.overview-active');
    if (activeEl) activeEl.scrollIntoView({ block: 'center' });

    // scroll content to top
    document.querySelector('.content-pane').scrollTop = 0;

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

  window.addEventListener('hashchange', route);
  window.addEventListener('DOMContentLoaded', route);
  if (document.readyState !== 'loading') route();
})();
