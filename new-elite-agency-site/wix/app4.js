"use strict";
  /* ================= Admin ================= */
  function revenueChart() {
    var data = [["Mai", 3120], ["Juin", 4480], ["Juil.", 3960], ["Août", 5210], ["Sept.", 6840], ["Oct.", 8125]];
    var W = 640, H = 240, pad = 34, max = 9000, bw = (W - pad * 2) / data.length;
    var s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Revenus par mois, de mai à octobre 2026">';
    [0, 3000, 6000, 9000].forEach(function (v) { var y = H - 30 - (v / max) * (H - 60); s += '<line x1="' + pad + '" x2="' + (W - 8) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (pad - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + (v / 1000) + 'k</text>'; });
    data.forEach(function (d, i) { var h = d[1] / max * (H - 60), x = pad + i * bw + bw * 0.22, w = bw * 0.56, y = H - 30 - h; s += '<rect class="b' + (i === data.length - 1 ? " last" : "") + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2"/><text x="' + (x + w / 2) + '" y="' + (H - 12) + '" text-anchor="middle">' + d[0] + '</text><text class="val" x="' + (x + w / 2) + '" y="' + (y - 6) + '" text-anchor="middle">' + (d[1] / 1000).toFixed(1).replace(".", ",") + ' k€</text>'; });
    return s + "</svg>";
  }
  function vAdmin() {
    return shell("admin", '<div class="main-head"><div><span class="eyebrow">Administration</span><h1 style="margin-top:8px">Vue d\'ensemble</h1><p>Octobre 2026 · données de démonstration</p></div><a class="btn sm ghost" href="#admin-contenus">Ajouter un contenu</a></div>' +
      '<div class="kpis"><div class="kpi"><span>Étudiants</span><strong>2 418</strong><small class="up">+186 ce mois</small></div><div class="kpi"><span>Revenus du mois</span><strong>8 125 €</strong><small class="up">+19 % vs septembre</small></div><div class="kpi"><span>Ventes</span><strong>214</strong><small>38 formations · 176 e-books</small></div><div class="kpi"><span>Remboursements</span><strong>3</strong><small>sous 7 jours</small></div></div>' +
      '<div class="card panel"><div class="panel-h"><h2>Revenus par mois</h2><span class="small muted">TTC, en euros</span></div>' + revenueChart() + '</div>' +
      '<div class="grid2"><div class="card panel"><div class="panel-h"><h2>Où les étudiants décrochent</h2></div><div class="table-wrap"><table><thead><tr><th>Vidéo</th><th class="r">Abandon</th></tr></thead><tbody><tr><td>Trading · 5. Gestion du risque</td><td class="r"><span class="chip danger">34 %</span></td></tr><tr><td>Code · 3. CSS</td><td class="r"><span class="chip danger">27 %</span></td></tr><tr><td>Marketing · 6. Publicité Meta</td><td class="r"><span class="chip gold">18 %</span></td></tr><tr><td>Design · 4. Grilles</td><td class="r"><span class="chip">9 %</span></td></tr></tbody></table></div></div>' +
      '<div class="card panel"><div class="panel-h"><h2>E-books les plus vendus</h2></div><div class="table-wrap"><table><thead><tr><th>E-book</th><th class="r">Ventes</th><th class="r">Lus</th></tr></thead><tbody><tr><td>100 accroches qui convertissent</td><td class="r">64</td><td class="r">71 %</td></tr><tr><td>Meta Ads pas à pas</td><td class="r">41</td><td class="r">58 %</td></tr><tr><td>Gestion du risque</td><td class="r">33</td><td class="r">66 %</td></tr><tr><td>Le plan d\'action 90 jours</td><td class="r">21</td><td class="r">48 %</td></tr></tbody></table></div></div></div>' +
      '<div class="card panel"><div class="panel-h"><h2>À venir</h2><button class="btn sm ghost" data-act="export-csv">Exporter (tableur)</button></div>' + S.scheduled.map(function (x) { return '<div class="row" style="justify-content:space-between"><span>' + esc(x.title) + '</span><span class="chip gold">Sortie le ' + new Date(x.date).toLocaleDateString("fr-FR") + '</span></div>'; }).join("") + '</div>');
  }
  function vAdminContent() {
    return shell("admin-contenus", '<div class="main-head"><div><span class="eyebrow">Contenus</span><h1 style="margin-top:8px">Ajouter un contenu</h1><p>Vidéos, e-books PDF et fiches, avec sortie planifiée.</p></div></div>' +
      '<form class="card form" id="upForm" novalidate><div class="field"><label for="u-type">Type</label><select id="u-type"><option>Vidéo</option><option>E-book (PDF)</option><option>Fiche récapitulative</option></select></div><div class="field"><label for="u-cat">Catégorie</label><select id="u-cat">' + CATS.map(function (c) { return "<option>" + c.name + "</option>"; }).join("") + '</select></div>' +
      '<div class="field full"><label for="u-title">Titre</label><input id="u-title" placeholder="Ex. Module 8 : le swing trading"></div><div class="field"><label for="u-file">Fichier</label><input id="u-file" type="file" accept="video/*,application/pdf"></div><div class="field"><label for="u-date">Date de sortie</label><input id="u-date" type="date" value="2026-11-15"></div>' +
      '<div class="field"><label for="u-price">Prix (e-book)</label><input id="u-price" type="number" min="0" step="1" placeholder="19"></div><div class="field"><label for="u-free">Accès</label><select id="u-free"><option>Payant</option><option>Gratuit (essai)</option></select></div>' +
      '<p class="notice ok full" id="u-ok" hidden></p><div class="full row"><button class="btn gold" type="submit">Planifier la sortie</button><span class="small muted">Sauvegarde automatique des fichiers dans la version finale.</span></div></form>' +
      '<div class="card panel"><div class="panel-h"><h2>Formations publiées</h2></div><div class="table-wrap"><table><thead><tr><th>Formation</th><th>Catégorie</th><th class="r">Vidéos</th><th class="r">Prix</th></tr></thead><tbody>' + COURSES.map(function (c) { return '<tr><td>' + c.title + '</td><td>' + cat(c.cat).name + '</td><td class="r">' + c.lessons.length + '</td><td class="r">' + eur(c.price) + '</td></tr>'; }).join("") + '</tbody></table></div></div>');
  }
  function vAdminPromos() {
    return shell("admin-promos", '<div class="main-head"><div><span class="eyebrow">Codes promo</span><h1 style="margin-top:8px">Codes et remboursements</h1></div></div>' +
      '<div class="card panel"><div class="table-wrap"><table><thead><tr><th>Code</th><th>Remise</th><th>Usage</th><th class="r">Utilisations</th></tr></thead><tbody><tr><td>ELITE10</td><td>−10 %</td><td>Général</td><td class="r">48</td></tr><tr><td>BIENVENUE15</td><td>−15 %</td><td>Premier achat</td><td class="r">112</td></tr><tr><td>TOP-SEMAINE-43</td><td>−20 %</td><td>Étudiant de la semaine</td><td class="r">1</td></tr><tr><td>PANIER5</td><td>−5 %</td><td>Relance panier abandonné</td><td class="r">27</td></tr><tr><td>PARRAIN-AMA</td><td>−10 %</td><td>Parrainage</td><td class="r">3</td></tr></tbody></table></div><p class="small muted">Les codes ne se cumulent pas avec la réduction de niveau : le client garde la remise la plus avantageuse.</p></div>' +
      '<div class="card panel"><div class="panel-h"><h2>Demandes de remboursement</h2></div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Étudiant</th><th>Achat</th><th class="r">Action</th></tr></thead><tbody><tr><td>20/10/2026</td><td>Marc O.</td><td>Design de marque (197 €)</td><td class="r"><button class="btn sm ghost" data-act="refund">Rembourser</button></td></tr></tbody></table></div></div>');
  }
  function vAdminUsers() {
    var b = board();
    return shell("admin-users", '<div class="main-head"><div><span class="eyebrow">Utilisateurs</span><h1 style="margin-top:8px">Étudiants et droits</h1><p>Le top 5 peut répondre au forum. Vous pouvez retirer ce droit.</p></div></div>' +
      '<div class="card panel"><div class="table-wrap"><table><thead><tr><th>#</th><th>Étudiant</th><th>Niveau</th><th class="r">Points</th><th>Forum</th></tr></thead><tbody>' + b.map(function (r, i) { var key = r.me ? "me" : r.n, rev = S.revoked.indexOf(key) !== -1; return '<tr><td>' + (i + 1) + '</td><td>' + esc(r.n) + '</td><td>' + LEVELS[levelIdx(r.p)].name + '</td><td class="r">' + r.p.toLocaleString("fr-FR") + '</td><td>' + (i < 5 ? (rev ? '<button class="btn sm ghost" data-act="revoke" data-k="' + esc(key) + '">Rétablir</button>' : '<button class="btn sm ghost" data-act="revoke" data-k="' + esc(key) + '">Retirer le droit</button>') : '<span class="small muted">Questions seulement</span>') + '</td></tr>'; }).join("") + '</tbody></table></div></div>' +
      '<div class="card panel"><div class="panel-h"><h2>Équipe</h2></div><div class="table-wrap"><table><thead><tr><th>Membre</th><th>Rôle</th><th>Paiements</th></tr></thead><tbody><tr><td>Vous</td><td>Administrateur</td><td>Accès</td></tr><tr><td>Assistant·e (exemple)</td><td>Modération du forum</td><td>Aucun accès</td></tr></tbody></table></div></div>');
  }
  function vAdminNews() {
    return shell("admin-annonces", '<div class="main-head"><div><span class="eyebrow">Annonces</span><h1 style="margin-top:8px">Bandeau en haut du site</h1><p>Visible par tous les étudiants.</p></div></div>' +
      '<div class="card panel"><textarea class="input" id="annIn" rows="3" placeholder="Ex. Nouveau module de trading disponible le 4 novembre.">' + esc(S.announcement) + '</textarea><div class="row"><button class="btn gold sm" data-act="announce">Publier l\'annonce</button><button class="btn ghost sm" data-act="unannounce">Retirer</button></div></div>');
  }

  /* ================= Paiement simulé ================= */
  function buy(kind, id) {
    if (!S.logged) { location.hash = "connexion"; toast("Connectez-vous ou créez un compte pour acheter."); return; }
    var item, base, label;
    if (kind === "course") { item = course(id); base = item.price; label = item.title; }
    else if (kind === "ebook") { item = ebook(id); base = item.price; label = item.title; }
    else { base = packFor(id).price; label = "Pack " + cat(id).name; }
    var lv = myLevel(), lvDisc = kind === "course" ? (lv >= 2 ? LEVEL_DISC[lv] : 0) : LEVEL_DISC[lv];
    var st = { promo: "", method: "card", plan: 1 };
    function calc() { var pd = PROMOS[st.promo] || 0, use = Math.max(pd, lvDisc), total = Math.round(base * (1 - use) * 100) / 100; return { pd: pd, use: use, total: total, src: use === 0 ? "" : pd >= lvDisc ? "Code " + st.promo : "Réduction " + LEVELS[lv].name }; }
    function render() {
      var r = calc();
      openModal('<span class="eyebrow">Paiement sécurisé</span><h2>' + esc(label) + '</h2>' +
        '<div class="methods" role="radiogroup" aria-label="Moyen de paiement">' + [["card", "Carte bancaire"], ["paypal", "PayPal"], ["apple", "Apple Pay"], ["google", "Google Pay"]].map(function (m) { return '<label><input type="radio" name="pm" value="' + m[0] + '"' + (st.method === m[0] ? " checked" : "") + '> ' + m[1] + '</label>'; }).join("") + '</div>' +
        (kind === "course" ? '<div class="plans"><label><input type="radio" name="plan" value="1"' + (st.plan === 1 ? " checked" : "") + '> Payer en 1 fois</label><label><input type="radio" name="plan" value="3"' + (st.plan === 3 ? " checked" : "") + '> Payer en 3 fois sans frais</label></div>' : "") +
        '<div class="row"><input class="input" id="promo" placeholder="Code promo (essayez ELITE10)" value="' + esc(st.promo) + '" style="flex:1;min-width:0"><button class="btn sm ghost" data-act="promo">Appliquer</button></div>' +
        (st.promo && !PROMOS[st.promo] ? '<p class="notice err small">Ce code n\'existe pas ou a expiré.</p>' : "") +
        '<div class="sum"><div><span>Prix</span><span>' + EUR.format(base) + '</span></div>' + (r.use ? '<div><span>' + r.src + ' (−' + Math.round(r.use * 100) + ' %)</span><span>−' + EUR.format(base - r.total) + '</span></div>' : "") +
        (st.promo && PROMOS[st.promo] && lvDisc ? '<div class="small muted"><span>Non cumulable : la remise la plus avantageuse est appliquée.</span></div>' : "") +
        '<div class="total"><span>Total TTC</span><span>' + EUR.format(r.total) + '</span></div>' + (st.plan === 3 ? '<div class="small muted"><span>3 prélèvements de</span><span>' + EUR.format(Math.round(r.total / 3 * 100) / 100) + '</span></div>' : "") + '<div class="small muted"><span>TVA calculée selon votre pays à la validation</span><span></span></div></div>' +
        '<button class="btn gold block" data-act="pay">Payer ' + EUR.format(st.plan === 3 ? Math.round(r.total / 3 * 100) / 100 : r.total) + (st.plan === 3 ? " aujourd'hui" : "") + '</button>' +
        '<div class="guarantee"><svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg><span><strong>Satisfait ou remboursé sous 7 jours.</strong> Démo : aucun paiement réel.</span></div>');
      $("sheet").onchange = function (e) { if (e.target.name === "pm") st.method = e.target.value; if (e.target.name === "plan") { st.plan = +e.target.value; render(); } };
      $("sheet").querySelector('[data-act="promo"]').onclick = function () { st.promo = $("promo").value.trim().toUpperCase(); render(); };
      $("sheet").querySelector('[data-act="pay"]').onclick = function () {
        var r2 = calc(), btn = this; btn.disabled = true; btn.textContent = "Paiement en cours…";
        setTimeout(function () {
          var inv = "NE-2026-0" + (170 + S.purchases.length);
          if (kind === "course") S.owned.push(id); else if (kind === "ebook") S.ownedEb.push(id); else EBOOKS.forEach(function (e) { if (e.cat === id && e.price > 0 && S.ownedEb.indexOf(e.id) === -1) S.ownedEb.push(e.id); });
          var how = { card: "Carte", paypal: "PayPal", apple: "Apple Pay", google: "Google Pay" }[st.method];
          S.purchases.push({ d: "2026-10-22", what: label + (st.plan === 3 ? " (3 fois)" : ""), amt: r2.total, how: how, inv: inv }); save();
          openModal('<div style="display:grid;justify-items:center;text-align:center;gap:14px">' + medal(myLevel(), 72) + '<span class="eyebrow both">Paiement confirmé</span><h2>Bienvenue dans « ' + esc(label) + ' »</h2><p class="muted">Facture ' + inv + ' envoyée à ama@exemple.com (simulé). Vous pouvez demander un remboursement jusqu\'au 29 octobre 2026.</p>' +
            '<a class="btn gold" data-act="close" href="' + (kind === "course" ? "#v-" + id + "-0" : "#bibliotheque") + '">' + (kind === "course" ? "Commencer la formation" : "Ouvrir ma bibliothèque") + '</a></div>');
          render2();
        }, 1100);
      };
    }
    render();
  }

  /* ================= Routage ================= */
  var NAV = [["accueil", "home"], ["catalogue", "catalog"], ["ebooks", "ebooks"], ["apropos", "about"], ["faq", "faq"], ["contact", "contact"]];
  function header(route) {
    var html = NAV.map(function (n) { return '<li><a href="#' + n[0] + '" class="' + (route === n[0] ? "on" : "") + '">' + t(n[1]) + '</a></li>'; }).join("");
    $("navLinks").innerHTML = html;
    $("mobileMenu").innerHTML = NAV.map(function (n) { return '<a href="#' + n[0] + '">' + t(n[1]) + '</a>'; }).join("") +
      '<div class="row"><select class="lang" id="lang2" aria-label="Langue"><option value="fr">FR</option><option value="de">DE</option><option value="en">EN</option></select><button class="btn sm ghost" data-act="theme">Thème clair / sombre</button></div>';
    $("lang").value = S.lang; $("lang2").value = S.lang;
    var sb = $("spaceBtn"); sb.textContent = S.logged ? t("space") : t("login"); sb.href = S.logged ? (S.role === "admin" ? "#admin" : "#espace") : "#connexion";
    var a = $("announce"); a.hidden = !S.announcement; a.innerHTML = S.announcement ? '<div class="wrap"><strong>ANNONCE</strong> · ' + esc(S.announcement) + '</div>' : "";
    document.documentElement.lang = S.lang;
  }
  var PRIVATE = ["espace", "mes-formations", "bibliotheque", "profil", "classement", "forum", "admin", "admin-contenus", "admin-promos", "admin-users", "admin-annonces"];
  function render2() {
    if (P) { clearInterval(P.timer); clearInterval(P.wm); P = null; }
    if (window.NE3D) window.NE3D.unmount(); // jamais de 3D derrière le paiement, les lecteurs, le forum ou l'admin
    var h =(location.hash || "#accueil").slice(1) || "accueil", m, html;
    if ((PRIVATE.indexOf(h) !== -1 || /^sujet-/.test(h)) && !S.logged) { h = "connexion"; }
    if (/^admin/.test(h) && S.role !== "admin") h = "espace";
    if (h === "accueil") html = vHome();
    else if (h === "catalogue") { if (filter.type === "ebook" && !render2.keepType) filter.type = "all"; html = vCatalog(false); }
    else if (h === "ebooks") html = vCatalog(true);
    else if ((m = h.match(/^f-([a-z]+)$/))) html = vCourse(m[1]);
    else if ((m = h.match(/^v-([a-z]+)-(\d+)$/))) html = vPlayer(m[1], +m[2]);
    else if ((m = h.match(/^e-(eb-[a-z0-9]+)$/))) html = vEbook(m[1]);
    else if ((m = h.match(/^sujet-([a-z0-9]+)$/))) html = vThread(m[1]);
    else html = ({ apropos: vAbout, faq: vFaq, contact: vContact, connexion: vLogin, verifier: vVerify,
      cgv: function () { return vLegal("cgv"); }, cgu: function () { return vLegal("cgu"); }, confidentialite: function () { return vLegal("confidentialite"); },
      espace: vDashboard, "mes-formations": vMyCourses, bibliotheque: vLibrary, profil: vProfile, classement: vBoard, forum: vForum,
      admin: vAdmin, "admin-contenus": vAdminContent, "admin-promos": vAdminPromos, "admin-users": vAdminUsers, "admin-annonces": vAdminNews }[h] || v404)();
    render2.keepType = false;
    $("app").innerHTML = html;
    header(h);
    $("mobileMenu").classList.remove("open"); $("menuBtn").setAttribute("aria-expanded", "false");
    bindPlayer();
    var stage3d = $("towerStage") || $("loginStage"); if (window.NE3D && stage3d) window.NE3D.mount(stage3d);
    var q = $("q"); if (q) q.oninput = function () { filter.q = this.value; var pos = this.selectionStart; render2.keepType = true; var hh = location.hash; $("app").innerHTML = vCatalog(hh === "#ebooks"); var nq = $("q"); nq.focus(); nq.setSelectionRange(pos, pos); nq.oninput = q.oninput; };
    bindForms();
  }
  function route() { render2(); window.scrollTo(0, 0); }
  window.addEventListener("hashchange", route);

  function bindForms() {
    var cf = $("contactForm");
    if (cf) cf.onsubmit = function (e) {
      e.preventDefault(); var n = $("c-name").value.trim(), m = $("c-mail").value.trim();
      var err = !n ? "Indiquez votre nom." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m) ? "Indiquez une adresse e-mail valide." : "";
      $("c-err").hidden = !err; $("c-err").textContent = err; if (err) return;
      $("c-ok").hidden = false; $("c-ok").textContent = "Merci " + n + ", votre message est prêt. Démo : aucun envoi réel.";
    };
    var uf = $("upForm");
    if (uf) uf.onsubmit = function (e) {
      e.preventDefault(); var title = $("u-title").value.trim() || "Nouveau contenu", d = $("u-date").value || "2026-11-15", f = $("u-file").files[0];
      S.scheduled.push({ title: title, date: d }); save();
      $("u-ok").hidden = false; $("u-ok").textContent = "« " + title + " » planifié pour le " + new Date(d).toLocaleDateString("fr-FR") + (f ? " (fichier : " + f.name + ")" : "") + ". Démo : le fichier n'est pas envoyé.";
    };
  }

  /* ================= Actions ================= */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-act]"); if (!a) return;
    var act = a.dataset.act, id = a.dataset.id;
    switch (act) {
      case "close": closeModal(); break;
      case "lvl":
        var lv = +a.dataset.level; document.querySelectorAll(".lvl-btn").forEach(function (x) { x.setAttribute("aria-pressed", x === a); });
        $("lvlPerks").innerHTML = levelPerks(lv); a.dispatchEvent(new CustomEvent("ne:level", { detail: lv, bubbles: true })); break;
      case "cat": filter.cat = id; if (location.hash === "#catalogue" || location.hash === "#ebooks") { e.preventDefault(); render2.keepType = true; render2(); } break;
      case "type": filter.type = id; render2.keepType = true; if (location.hash === "#ebooks" && id !== "ebook") location.hash = "catalogue"; else render2(); break;
      case "buy": e.preventDefault(); buy(a.dataset.kind, id); break;
      case "later": var i = S.later.indexOf(id); if (i === -1) S.later.push(id); else S.later.splice(i, 1); save(); render2(); toast(i === -1 ? "Ajouté à « À regarder plus tard »." : "Retiré de la liste."); break;
      case "trailer": openModal('<span class="eyebrow">Bande-annonce</span><h2>' + course(id).title + '</h2><div class="trailer" style="aspect-ratio:16/9;background:#000;border-radius:4px;display:grid;place-items:center;color:#B9B5AB">Bande-annonce de 1 min 30 (vidéo réelle dans la version finale)</div><a class="btn gold" data-act="close" href="#v-' + id + '-' + (FREE_LESSONS[id] !== undefined ? FREE_LESSONS[id] : 0) + '">' + (FREE_LESSONS[id] !== undefined ? "Regarder la vidéo d'essai" : "Fermer") + '</a>'); break;
      case "login":
        S.logged = true; S.role = a.dataset.role; save();
        if (S.role === "admin") { location.hash = "admin"; toast("Connecté en administrateur (2FA simulée)."); }
        else { location.hash = "espace"; if (!S.onboarded || a.dataset.new) { onb = 0; setTimeout(onboarding, 150); } }
        break;
      case "forgot": toast("Un lien de réinitialisation sera envoyé par e-mail (simulé)."); break;
      case "onb": if (onb < 2) { onb++; onboarding(); } else { S.onboarded = true; save(); closeModal(); toast("Bienvenue, Ama. Votre parcours commence."); } break;
      case "logout": e.preventDefault(); S.logged = false; S.role = "student"; save(); location.hash = "accueil"; break;
      case "reset": var lang = S.lang; S = fresh(); S.lang = lang; save(); location.hash = "accueil"; toast("Démo réinitialisée."); break;
      case "theme": toggleTheme(); break;
      case "lesson": location.hash = "v-" + id + "-" + a.dataset.i; break;
      case "chap": if (P) { var want = +a.dataset.f * DEMO_LEN; if (want > P.seen + 0.01) { toast("Ce chapitre se débloque quand vous l'atteignez."); } else { P.pos = want; P.paint(); } } break;
      case "seek": if (P) { P.pos = Math.min(P.seen, +a.dataset.t / P.dur * DEMO_LEN); P.paint(); } break;
      case "note":
        if (!P) break; var v = $("noteIn").value.trim(); if (!v) break; var k = P.id + ":" + P.i, tt = Math.round(P.pos / DEMO_LEN * P.dur);
        (S.notes[k] = S.notes[k] || []).push({ t: tt, x: v }); save();
        $("notes").insertAdjacentHTML("beforeend", '<li><button class="ts" data-act="seek" data-t="' + tt + '">' + mmss(tt) + '</button><span>' + esc(v) + '</span></li>'); $("noteIn").value = ""; break;
      case "sheet": toast("La fiche PDF se télécharge dans la version finale."); break;
      case "read": location.hash = "e-" + id; break;
      case "font": reader.size = Math.min(26, Math.max(14, reader.size + +a.dataset.d)); render2(); break;
      case "night": reader.night = !reader.night; render2(); break;
      case "dl": toast("Téléchargement du PDF disponible dans la version finale."); break;
      case "offline": toast("Dans la version finale, l'e-book sera enregistré pour une lecture hors ligne."); break;
      case "ebretry": e.preventDefault(); delete EB_CACHE[id]; render2(); break;
      case "markread": if (S.readEb.indexOf(id) === -1) { S.readEb.push(id); S.pointsBase += 30; save(); toast("+30 points. Le volume suivant est débloqué."); } render2(); break;
      case "pseudo": S.usePseudo = a.checked; save(); render2(); break;
      case "msgs": S.msgs = a.checked; save(); break;
      case "export": $("rgpd").hidden = false; $("rgpd").textContent = "Export prêt : vous le recevrez par e-mail (simulé)."; break;
      case "delete": $("rgpd").hidden = false; $("rgpd").innerHTML = 'Confirmer la suppression définitive ? <button class="link" data-act="delete2">Oui, supprimer</button>'; break;
      case "delete2": $("rgpd").textContent = "Demande enregistrée. Démo : rien n'est supprimé."; break;
      case "board": boardTab = id; render2(); break;
      case "fcat": forumCat = id; render2(); break;
      case "vote": S.votes[a.dataset.k] = !S.votes[a.dataset.k]; save(); render2(); break;
      case "report": toast("Message signalé à la modération."); break;
      case "reply":
        var txt = $("replyIn").value.trim(); if (!txt) { toast("Écrivez votre réponse avant de publier."); break; }
        (S.myReplies[id] = S.myReplies[id] || []).push({ by: S.role === "admin" ? "New Elite (équipe)" : (S.usePseudo ? S.pseudo : "Ama Mensah"), lvl: S.role === "admin" ? 4 : myLevel(), body: txt, useful: 0 }); save(); render2(); toast("Réponse publiée. L'auteur est notifié."); break;
      case "ask":
        openModal('<span class="eyebrow">Forum</span><h2>Poser une question</h2><div class="field"><label for="askCat">Catégorie</label><select class="input" id="askCat">' + CATS.map(function (c) { return '<option value="' + c.id + '">' + c.name + '</option>'; }).join("") + '<option value="reussite">Mur de réussite</option></select></div><div class="field"><label for="askT">Titre</label><input class="input" id="askT" placeholder="Votre question en une phrase"></div><div class="field"><label for="askB">Détails</label><textarea class="input" id="askB" rows="4"></textarea></div><button class="btn gold" data-act="ask2">Publier</button>'); break;
      case "ask2":
        var ti = $("askT").value.trim(); if (!ti) { toast("Donnez un titre à votre question."); break; }
        S.myThreads.unshift({ id: "m" + Date.now().toString(36), cat: $("askCat").value, title: ti, by: S.usePseudo ? S.pseudo : "Ama Mensah", lvl: myLevel(), ago: "à l'instant", body: $("askB").value.trim(), replies: [] }); save(); closeModal(); forumCat = "all"; render2(); break;
      case "verify":
        var no = ($("certNo").value || "").trim().toUpperCase();
        $("certRes").innerHTML = no === "NE-CERT-2026-000184" ? '<div class="notice ok">Certificat authentique : Ama Mensah · Marketing Digital : vendre en ligne · délivré le 22/10/2026.</div>' : '<div class="notice err">Aucun certificat ne correspond à ce numéro. Vérifiez la saisie (exemple : NE-CERT-2026-000184).</div>'; break;
      case "export-csv": toast("Export tableur des étudiants, ventes et progression (simulé)."); break;
      case "refund": a.outerHTML = '<span class="chip ok">Remboursé</span>'; toast("Remboursement lancé via Stripe (simulé)."); break;
      case "revoke": var kk = a.dataset.k, ix = S.revoked.indexOf(kk); if (ix === -1) S.revoked.push(kk); else S.revoked.splice(ix, 1); save(); render2(); break;
      case "announce": S.announcement = $("annIn").value.trim(); save(); render2(); toast(S.announcement ? "Annonce publiée en haut du site." : "Annonce vide."); break;
      case "unannounce": S.announcement = ""; save(); render2(); break;
    }
  });
  $("modal").addEventListener("click", function (e) { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  function applyTheme() { if (S.theme) document.documentElement.setAttribute("data-theme", S.theme); }
  function toggleTheme() {
    var dark = S.theme ? S.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    S.theme = dark ? "light" : "dark"; save(); applyTheme();
  }
  $("themeBtn").onclick = toggleTheme;
  function setLang(v) { S.lang = v; save(); render2(); }
  $("lang").onchange = function () { setLang(this.value); };
  $("mobileMenu").addEventListener("change", function (e) { if (e.target.id === "lang2") setLang(e.target.value); });
  $("menuBtn").onclick = function () { var o = $("mobileMenu").classList.toggle("open"); this.setAttribute("aria-expanded", o); };
  $("logoMark").innerHTML = logoSvg();
  document.querySelector(".logo2").innerHTML = logoSvg().replace(/id="lg"/, 'id="lg2"').replace(/url\(#lg\)/g, "url(#lg2)");
  applyTheme();
  render2();
