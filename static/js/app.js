// AWS-console-style portfolio SPA: tile routing + global search
(function () {
  "use strict";

  const homeView = document.getElementById("home-view");
  const sectionView = document.getElementById("section-view");
  const sectionContent = document.getElementById("sectionContent");
  const sectionTitle = document.getElementById("sectionTitle");
  const sectionAws = document.getElementById("sectionAws");
  const crumbAws = document.getElementById("crumbAws");
  const crumbTitle = document.getElementById("crumbTitle");
  const templates = document.getElementById("sectionTemplates");
  const tiles = Array.from(document.querySelectorAll(".tile"));
  const tileGrid = document.getElementById("tileGrid");
  const search = document.getElementById("globalSearch");
  const results = document.getElementById("searchResults");
  const homeLink = document.getElementById("homeLink");
  const backHome = document.getElementById("backHome");
  const backHomeBtn = document.getElementById("backHomeBtn");

  // Build searchable index from tiles
  const index = tiles.map((t) => ({
    id: t.dataset.id,
    name: t.dataset.name || "",
    aws: t.dataset.aws || "",
    el: t,
  }));

  function showHome() {
    sectionView.hidden = true;
    homeView.hidden = false;
    if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function openSection(id) {
    const meta = index.find((x) => x.id === id);
    const tpl = templates.querySelector(`template[data-section="${id}"]`);
    if (!meta || !tpl) {
      showHome();
      return;
    }
    sectionContent.innerHTML = "";
    sectionContent.appendChild(tpl.content.cloneNode(true));
    sectionTitle.textContent = meta.name;
    sectionAws.textContent = meta.aws;
    crumbAws.textContent = meta.aws;
    crumbTitle.textContent = meta.name;
    homeView.hidden = true;
    sectionView.hidden = false;
    if (location.hash !== "#" + id) {
      history.pushState({ id }, "", "#" + id);
    }
    window.scrollTo({ top: 0 });
  }

  // ---- Tile clicks ----
  tiles.forEach((t) => {
    t.addEventListener("click", (e) => {
      e.preventDefault();
      openSection(t.dataset.id);
    });
  });

  // ---- Home / back ----
  function goHome(e) {
    if (e) e.preventDefault();
    showHome();
  }
  homeLink && homeLink.addEventListener("click", goHome);
  backHome && backHome.addEventListener("click", goHome);
  backHomeBtn && backHomeBtn.addEventListener("click", goHome);

  // ---- Hash routing (deep links / back button) ----
  function routeFromHash() {
    const id = (location.hash || "").replace(/^#/, "");
    if (id) openSection(id);
    else showHome();
  }
  window.addEventListener("popstate", routeFromHash);

  // ---- Search ----
  let activeIdx = -1;
  let currentMatches = [];

  function renderResults(matches, query) {
    currentMatches = matches;
    activeIdx = matches.length ? 0 : -1;
    if (!query) {
      results.hidden = true;
      results.innerHTML = "";
      return;
    }
    if (!matches.length) {
      results.innerHTML = '<div class="empty">No matching sections</div>';
      results.hidden = false;
      return;
    }
    results.innerHTML = matches
      .map(
        (m, i) =>
          `<div class="res${i === 0 ? " active" : ""}" data-id="${m.id}" role="option">
             <div>
               <div class="res-name">${escape(m.name)}</div>
               <div class="res-sub">${escape(m.aws)}</div>
             </div>
           </div>`
      )
      .join("");
    results.hidden = false;
    results.querySelectorAll(".res").forEach((el, i) => {
      el.addEventListener("mousedown", (e) => {
        e.preventDefault();
        openSection(el.dataset.id);
        clearSearch();
      });
      el.addEventListener("mouseenter", () => setActive(i));
    });
  }

  function setActive(i) {
    const items = results.querySelectorAll(".res");
    items.forEach((el, idx) => el.classList.toggle("active", idx === i));
    activeIdx = i;
  }

  function escape(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function filterTiles(query) {
    const q = query.trim().toLowerCase();
    let visible = 0;
    tiles.forEach((t) => {
      const hay = (t.dataset.name + " " + t.dataset.aws + " " + t.dataset.id).toLowerCase();
      const ok = !q || hay.includes(q);
      t.classList.toggle("hidden", !ok);
      if (ok) visible++;
    });
    return visible;
  }

  function clearSearch() {
    search.value = "";
    results.hidden = true;
    results.innerHTML = "";
    filterTiles("");
  }

  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    const matches = q
      ? index.filter(
          (x) =>
            x.name.toLowerCase().includes(q) ||
            x.aws.toLowerCase().includes(q) ||
            x.id.toLowerCase().includes(q)
        )
      : [];
    if (!sectionView.hidden) {
      // on a section page, just show dropdown
    } else {
      filterTiles(q);
    }
    renderResults(matches, q);
  });

  search.addEventListener("keydown", (e) => {
    if (results.hidden || !currentMatches.length) {
      if (e.key === "Enter" && search.value.trim()) {
        const q = search.value.trim().toLowerCase();
        const first = index.find(
          (x) =>
            x.name.toLowerCase().includes(q) ||
            x.aws.toLowerCase().includes(q)
        );
        if (first) {
          openSection(first.id);
          clearSearch();
        }
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(activeIdx + 1, currentMatches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIdx - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = currentMatches[activeIdx] || currentMatches[0];
      if (pick) {
        openSection(pick.id);
        clearSearch();
      }
    } else if (e.key === "Escape") {
      clearSearch();
      search.blur();
    }
  });

  search.addEventListener("blur", () => {
    setTimeout(() => { results.hidden = true; }, 150);
  });
  search.addEventListener("focus", () => {
    if (search.value.trim() && currentMatches.length) results.hidden = false;
  });

  // Alt+S to focus search
  document.addEventListener("keydown", (e) => {
    if (e.altKey && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      search.focus();
      search.select();
    }
  });

  // Initial route
  routeFromHash();
})();
