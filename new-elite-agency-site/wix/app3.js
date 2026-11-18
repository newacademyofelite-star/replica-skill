"use strict";
  /* ================= Lecteur vidéo ================= */
  var P = null; // état du lecteur
  var DEMO_LEN = 24; // une vidéo de démo dure 24 s réelles
  function vPlayer(id, i) {
    var c = course(id); if (!c || !c.lessons[i]) return v404();
    if (!lessonOpen(id, i)) {
      return '<section class="block view"><div class="wrap" style="max-width:620px;display:grid;gap:16px;justify-items:start"><span class="eyebrow">Contenu verrouillé</span><h2>' + c.lessons[i].t + '</h2><p class="muted">' + (owns(id) ? "Terminez la vidéo précédente et validez son quiz pour débloquer celle-ci." : "Cette vidéo fait partie de la formation complète.") + '</p><a class="btn gold" href="#f-' + id + '">Voir la formation</a></div></section>';
    }
    var l = c.lessons[i], dur = l.m * 60, key = id + ":" + i, done = doneList(id).indexOf(i) !== -1;
    P = { id: id, i: i, dur: dur, pos: done ? DEMO_LEN : 0, seen: done ? DEMO_LEN : 0, playing: false, rate: 1, subs: true, timer: null, wm: null, quiz: false, src: l.src || null, watched: 0, done: done };
    if (owns(id)) { S.last = { c: id, i: i }; save(); }
    var chapters = [["Introduction", 0], ["La méthode", 0.25], ["Exemple concret", 0.55], ["À retenir", 0.85]];
    var notes = S.notes[key] || [];
    var wm = '<span class="wm" id="wm">' + esc(S.logged ? "Ama Mensah · ama@exemple.com" : "Visiteur · essai gratuit") + '</span>';
    var mod = c.modules ? modulesOf(c)[moduleOf(c, i)] : null;
    // Vraie vidéo (Google Drive, YouTube ou Vimeo) : le site ne peut pas lire la position de lecture,
    // la leçon se valide avec « J'ai terminé » (actif après WATCH_MIN secondes passées sur la page) puis le quiz.
    var player = l.src
      ? '<div class="player"><div class="screen video-frame" id="screen"><iframe src="' + esc(l.src) + '" title="' + esc(l.t) + '" allow="autoplay; fullscreen; encrypted-media" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>' + wm + '</div>' +
        '<div class="controls watch"><span class="small" id="watchMsg" aria-live="polite">' + (done ? "Vidéo déjà validée." : "Regardez la vidéo jusqu'au bout, puis validez-la.") + '</span><button class="btn sm gold" id="doneBtn"' + (done ? "" : " disabled") + '>J\'ai terminé la vidéo</button></div></div>' +
        '<p class="small muted">Lecture en ligne uniquement. Après la vidéo, validez-la puis répondez au quiz (2 bonnes réponses sur 3) pour débloquer la suivante.</p>'
      : '<div class="player"><div class="screen" id="screen"><div class="slide"><span class="eyebrow both" style="color:#E8CF85;justify-self:center">' + cat(c.cat).name + '</span><h3>' + l.t + '</h3><p>Vidéo de démonstration · ' + l.m + ' min</p></div>' +
        wm + '<span class="caption" id="cap"></span><span class="pause-note" id="pauseNote" hidden>Lecture mise en pause : onglet inactif</span>' +
        '<button class="play" id="bigPlay" aria-label="Lecture" style="position:absolute"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></button></div>' +
        '<div class="controls"><button id="pp" aria-label="Lecture">▶</button><div class="track" id="track" aria-label="Progression"><span class="seen" id="seen"></span><span class="pos" id="pos"></span></div><span class="time" id="time">0:00 / ' + mmss(dur) + '</span>' +
        '<select id="rate" aria-label="Vitesse"><option value="0.75">0,75×</option><option value="1" selected>1×</option><option value="1.25">1,25×</option><option value="1.5">1,5×</option><option value="2">2×</option></select><button id="subs" aria-pressed="true">CC</button></div></div>' +
        '<p class="small muted">Pas de téléchargement. Impossible d\'avancer au-delà de ce que vous avez déjà regardé. La vidéo est validée à 100 % de visionnage, puis par le quiz (2 bonnes réponses sur 3).</p>' +
        '<div class="card panel"><div class="panel-h"><h2>Chapitres</h2></div><div class="chapters">' + chapters.map(function (ch) { return '<button data-act="chap" data-f="' + ch[1] + '">' + mmss(dur * ch[1]) + ' · ' + ch[0] + '</button>'; }).join("") + '</div></div>';
    var inner = '<div class="main-head"><div><span class="eyebrow">' + c.title + (mod ? ' · Module ' + (moduleOf(c, i) + 1) + ' : ' + mod.t : "") + '</span><h1 style="margin-top:8px">' + (i + 1) + '. ' + l.t + '</h1></div>' + (!owns(id) ? '<span class="chip ok">Vidéo d\'essai gratuite</span>' : "") + '</div>' +
      '<div class="player-layout"><div style="display:grid;gap:16px;min-width:0">' + player +
      '<div id="quizBox"></div>' +
      (S.logged ? '<div class="card panel"><div class="panel-h"><h2>Mes notes</h2><span class="small muted">Horodatées, visibles par vous seul</span></div><ul class="notes-list" id="notes">' + notes.map(function (n) { return '<li><button class="ts" data-act="seek" data-t="' + n.t + '">' + mmss(n.t) + '</button><span>' + esc(n.x) + '</span></li>'; }).join("") + '</ul>' +
        '<div class="row"><input class="input" id="noteIn" placeholder="Ajouter une note à ce moment de la vidéo" style="flex:1;min-width:0"><button class="btn sm" data-act="note">Ajouter</button></div></div>' : "") +
      '<div class="card panel"><div class="panel-h"><h2>Questions et commentaires</h2></div><div class="post" style="padding:0"><div class="by"><b>Moussa T.</b>' + stairs(2) + '<span class="muted small">il y a 2 j</span></div><p>Est-ce que la méthode marche aussi pour un service local (salon de coiffure) ?</p><div class="post" style="padding:10px 0 0 18px;border-left:2px solid var(--gold-soft)"><div class="by"><b>Léa Dossou</b>' + stairs(4) + '</div><p>Oui, en ciblant un rayon de 10 km autour du salon.</p></div></div></div></div>' +
      '<aside class="card panel" style="align-self:start"><div class="panel-h"><h2>Programme</h2><span class="small muted num">' + doneList(id).length + ' / ' + c.lessons.length + '</span></div><div class="bar"><i style="width:' + pct(id) + '%"></i></div>' +
      modulesOf(c).map(function (md, mk) {
        var ul = '<ul class="lessons">' + c.lessons.slice(md.from, md.to + 1).map(function (x, j) { var k = md.from + j, d = doneList(id).indexOf(k) !== -1, o = lessonOpen(id, k); return '<li><button data-act="lesson" data-id="' + id + '" data-i="' + k + '" class="' + (k === i ? "on" : "") + '"' + (k === i ? ' aria-current="true"' : "") + (o ? "" : " disabled") + '><span class="ic' + (d ? " done" : "") + '">' + (d ? "✓" : o ? k + 1 : "🔒") + '</span><span>' + x.t + '</span><span class="small muted num">' + (x.m ? x.m + ' min' : "") + '</span></button></li>'; }).join("") + '</ul>';
        return md.t ? '<details class="module"' + (mk === moduleOf(c, i) ? " open" : "") + '><summary><strong>' + (mk + 1) + '. ' + md.t + '</strong></summary>' + ul + '</details>' : ul;
      }).join("") +
      '<button class="btn ghost sm" data-act="sheet">Fiche récapitulative (PDF)</button></aside></div>';
    return S.logged ? shell("mes-formations", inner) : '<section class="block view"><div class="wrap" style="display:grid;gap:24px">' + inner + '</div></section>';
  }
  var WATCH_MIN = 180; // secondes passées sur une vraie vidéo (onglet visible) avant de pouvoir la valider
  function bindPlayer() {
    if (!P) return;
    var screen = $("screen"); if (!screen) return;
    if (P.src) return bindRealVideo();
    function paint() {
      var f = P.pos / DEMO_LEN, s = P.seen / DEMO_LEN;
      $("pos").style.width = (f * 100) + "%"; $("seen").style.width = (s * 100) + "%";
      $("time").textContent = mmss(f * P.dur) + " / " + mmss(P.dur);
      $("pp").textContent = P.playing ? "❚❚" : "▶"; $("bigPlay").hidden = P.playing;
      var caps = ["Bienvenue dans ce module.", "Voici la méthode en trois étapes.", "Prenons un exemple concret.", "Retenez bien ce point clé."];
      $("cap").hidden = !P.subs || P.pos === 0; $("cap").textContent = caps[Math.min(3, Math.floor(f * 4))];
    }
    function tick() {
      P.pos = Math.min(DEMO_LEN, P.pos + 0.25 * P.rate); P.seen = Math.max(P.seen, P.pos); paint();
      if (P.pos >= DEMO_LEN) { stop(); showQuiz(); }
    }
    function play() { if (P.pos >= DEMO_LEN) P.pos = 0; P.playing = true; $("pauseNote").hidden = true; clearInterval(P.timer); P.timer = setInterval(tick, 250); paint(); }
    function stop() { P.playing = false; clearInterval(P.timer); paint(); }
    P.play = play; P.stop = stop; P.paint = paint;
    $("pp").onclick = function () { P.playing ? stop() : play(); };
    $("bigPlay").onclick = play;
    $("rate").onchange = function () { P.rate = +this.value; };
    $("subs").onclick = function () { P.subs = !P.subs; this.setAttribute("aria-pressed", P.subs); paint(); };
    $("track").onclick = function (e) {
      var r = this.getBoundingClientRect(), want = (e.clientX - r.left) / r.width * DEMO_LEN;
      if (want > P.seen + 0.01) { toast("Impossible d'avancer au-delà de ce que vous avez déjà regardé."); want = P.seen; }
      P.pos = want; paint();
    };
    var corners = [[8, 10], [62, 18], [12, 78], [58, 72], [35, 45]], k = 0;
    function moveWm() { var c = corners[k++ % corners.length]; var w = $("wm"); if (!w) return; w.style.left = c[0] + "%"; w.style.top = c[1] + "%"; }
    moveWm(); P.wm = setInterval(moveWm, 4000);
    paint();
    if (doneList(P.id).indexOf(P.i) !== -1) showQuiz(true);
  }
  function bindRealVideo() {
    var corners = [[8, 10], [62, 18], [12, 78], [58, 72], [35, 45]], k = 0;
    function moveWm() { var c = corners[k++ % corners.length]; var w = $("wm"); if (!w) return; w.style.left = c[0] + "%"; w.style.top = c[1] + "%"; }
    moveWm(); P.wm = setInterval(moveWm, 4000);
    var btn = $("doneBtn"), msg = $("watchMsg");
    if (P.done) { showQuiz(true); return; }
    P.timer = setInterval(function () {
      if (document.hidden || !P) return;
      P.watched++;
      var left = WATCH_MIN - P.watched;
      if (left > 0) { if (left % 15 === 0 || left < 15) msg.textContent = "Regardez la vidéo jusqu'au bout. Validation possible dans " + mmss(left) + "."; return; }
      clearInterval(P.timer); btn.disabled = false; msg.textContent = "Vidéo terminée ? Validez-la pour passer au quiz.";
    }, 1000);
    btn.onclick = function () { btn.disabled = true; msg.textContent = "Répondez au quiz ci-dessous."; showQuiz(); };
  }
  document.addEventListener("visibilitychange", function () { if (document.hidden && P && P.playing) { P.stop(); var n = $("pauseNote"); if (n) n.hidden = false; } });
  function quizFor(c) {
    return [
      { q: "Quelle est la première étape de la méthode présentée ?", a: [c.learn[0], "Acheter de la publicité", "Copier un concurrent"], ok: 0 },
      { q: "Que faut-il faire après chaque module ?", a: ["Passer vite au suivant", "Appliquer sur son propre projet", "Attendre une semaine"], ok: 1 },
      { q: "Quel est l'objectif final de la formation ?", a: ["Collectionner des vidéos", "Obtenir des likes", c.outcome], ok: 2 }
    ];
  }
  function showQuiz(already) {
    var box = $("quizBox"); if (!box) return;
    var c = course(P.id), qs = quizFor(c);
    if (already) { box.innerHTML = '<div class="notice ok">Vidéo validée. Quiz réussi.' + (P.i + 1 < c.lessons.length ? ' <a class="link" href="#v-' + P.id + '-' + (P.i + 1) + '">Vidéo suivante</a>' : "") + '</div>'; return; }
    if (!owns(P.id)) { box.innerHTML = '<div class="card panel"><h2>Vous avez aimé cette vidéo d\'essai ?</h2><p class="muted">Débloquez les ' + c.lessons.length + ' vidéos, les quiz et le certificat.</p><a class="btn gold" href="#f-' + P.id + '">Voir la formation · ' + eur(c.price) + '</a></div>'; return; }
    box.innerHTML = '<form class="card panel quiz" id="quizForm"><div class="panel-h"><h2>Quiz de validation</h2><span class="chip gold">2 / 3 minimum</span></div>' +
      qs.map(function (x, n) { return '<fieldset><legend>' + (n + 1) + '. ' + x.q + '</legend>' + x.a.map(function (a, k) { return '<label><input type="radio" name="q' + n + '" value="' + k + '"> ' + a + '</label>'; }).join("") + '</fieldset>'; }).join("") +
      '<p id="quizMsg" hidden></p><button class="btn gold" type="submit">Valider mes réponses</button></form>';
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    $("quizForm").onsubmit = function (e) {
      e.preventDefault();
      var score = 0; qs.forEach(function (x, n) { var v = this.querySelector('input[name="q' + n + '"]:checked'); if (v && +v.value === x.ok) score++; }, this);
      var msg = $("quizMsg"); msg.hidden = false;
      if (score >= 2) {
        S.done[P.id] = doneList(P.id).concat([P.i]); S.pointsBase += 50; S.weekDone = (S.weekDone || 1) + 1; save();
        msg.className = "notice ok"; msg.innerHTML = "Validé : " + score + "/3. +50 points." + (P.i + 1 < c.lessons.length ? " La vidéo suivante est débloquée." : " Formation terminée : votre certificat est prêt.");
        var pid = P.id, pi = P.i;
        setTimeout(function () { if (P && P.id === pid && P.i === pi) location.hash = pi + 1 < c.lessons.length ? "v-" + pid + "-" + (pi + 1) : "profil"; }, 1600);
      } else { msg.className = "notice err"; msg.textContent = "Score : " + score + "/3. Il faut au moins 2 bonnes réponses. Revoyez le passage concerné et réessayez."; }
    };
  }

  /* ================= Lecteur d'e-book ================= */
  var reader = { size: 18, night: false };
  var EB_CACHE = {};
  function loadEbook(e) {
    if (EB_CACHE[e.id] && !EB_CACHE[e.id].error) return;
    if (loadEbook.pending === e.id) return;
    loadEbook.pending = e.id;
    fetch(e.file).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        // Les images du cours sont rangées à côté du fichier JSON (ebooks/img/…) : même origine que lui.
        var base = e.file.slice(0, e.file.indexOf("ebooks/"));
        if (base) { d.html = d.html.replace(/src="ebooks\//g, 'src="' + base + 'ebooks/'); d.answer = (d.answer || "").replace(/src="ebooks\//g, 'src="' + base + 'ebooks/'); }
        EB_CACHE[e.id] = d;
      }, function () { EB_CACHE[e.id] = { error: true }; })
      .then(function () { loadEbook.pending = null; if (location.hash === "#e-" + e.id) render2(); });
  }
  function vEbook(id) {
    var e = ebook(id); if (!e) return v404();
    if (!ebOwned(id) || !ebUnlocked(id)) return '<section class="block view"><div class="wrap" style="max-width:620px;display:grid;gap:14px;justify-items:start"><span class="eyebrow">E-book verrouillé</span><h2>' + e.title + '</h2><p class="muted">Achetez cet e-book, ou lisez d\'abord le volume précédent de la série.</p><a class="btn" href="#ebooks">Voir les e-books</a></div></section>';
    var read = S.readEb.indexOf(id) !== -1, c = cat(e.cat);
    var body = ["Ce chapitre pose les bases. L'objectif n'est pas de tout savoir, mais de savoir quoi faire lundi matin.", "Commencez par un état des lieux honnête : ce qui marche, ce qui ne marche pas, et ce que vous ne mesurez pas encore. Écrivez-le sur une seule page.", "Ensuite, choisissez une seule action à fort impact et tenez-la pendant quatorze jours. La régularité bat l'intensité.", "Exercice : appliquez ces trois étapes à votre projet et partagez votre résultat sur le mur de réussite du forum."];
    var bodyHtml = body.map(function (p) { return "<p>" + p + "</p>"; }).join("");
    if (e.file) {
      // Vrai contenu : chargé à la demande (ebooks/fsNN.json), puis la page est redessinée.
      var doc = EB_CACHE[id];
      if (!doc) { loadEbook(e); bodyHtml = '<p class="muted" role="status">Chargement du cours…</p>'; }
      else if (doc.error) bodyHtml = '<p class="notice err">Ce cours n\'a pas pu être chargé. Vérifiez votre connexion puis <a class="link" href="#e-' + id + '" data-act="ebretry" data-id="' + id + '">réessayez</a>.</p>';
      else bodyHtml = doc.html + (doc.answer ? '<details class="answer"><summary>Voir le corrigé</summary>' + doc.answer + '</details>' : "");
    }
    var label = e.series === "fs" ? (e.n <= 33 ? "Cours N°" + e.n : e.n <= 36 ? "Bonus" : "Examen final") : "Chapitre 1";
    var inner = '<div class="main-head"><div><span class="eyebrow">' + c.name + ' · ' + e.pages + ' pages</span></div><a class="link" href="#bibliotheque">← Bibliothèque</a></div>' +
      '<div class="reader-tools"><button class="btn sm ghost" data-act="font" data-d="-2" aria-label="Réduire le texte">A−</button><button class="btn sm ghost" data-act="font" data-d="2" aria-label="Agrandir le texte">A+</button><button class="btn sm ghost" data-act="night">' + (reader.night ? "Mode clair" : "Mode sombre") + '</button><button class="btn sm ghost" data-act="dl">Télécharger le PDF</button><button class="btn sm ghost" data-act="offline">Lire hors ligne</button></div>' +
      '<article class="reader' + (reader.night ? " night" : "") + '" style="font-size:' + reader.size + 'px"><span class="eyebrow">' + label + '</span><h1 style="margin-top:10px">' + e.title + '</h1><div class="body">' + bodyHtml + '</div>' +
      '<div class="row" style="margin-top:28px;justify-content:space-between">' + (read ? '<span class="chip ok">Lu · points gagnés</span>' : '<button class="btn gold" data-act="markread" data-id="' + id + '">J\'ai terminé la lecture (+30 pts)</button>') + '<span class="small muted">Reprise automatique à la page 1 / ' + e.pages + '</span></div></article>';
    return S.logged ? shell("bibliotheque", inner) : '<section class="block view"><div class="wrap" style="display:grid;gap:20px">' + inner + '</div></section>';
  }

  /* ================= Profil, classement, forum ================= */
  function vProfile() {
    var lv = myLevel(), done = S.owned.filter(function (id) { return pct(id) === 100; });
    return shell("profil", '<div class="main-head"><div><span class="eyebrow">Mon profil</span><h1 style="margin-top:8px">' + esc(S.usePseudo ? S.pseudo : "Ama Mensah") + '</h1><p>' + LEVELS[lv].name + ' · ' + points().toLocaleString("fr-FR") + ' points · rang #' + myRank() + '</p></div></div>' +
      '<div class="card panel"><div class="panel-h"><h2>Badges de niveau</h2></div><div class="row" style="gap:22px">' + LEVELS.map(function (l, i) { return '<div style="display:grid;justify-items:center;gap:6px;opacity:' + (i <= lv ? 1 : .4) + '">' + medal(i <= lv ? i : -1, 64) + '<span class="small">' + l.name + '</span><span class="small muted num">' + l.min.toLocaleString("fr-FR") + ' pts</span></div>'; }).join("") + '</div></div>' +
      '<div class="grid2"><div class="card panel"><h2>Formations terminées</h2>' + (done.length ? done.map(function (id) { return "<p>" + course(id).title + "</p>"; }).join("") : '<p class="muted small">Aucune pour l\'instant. Marketing Digital : ' + pct("marketing") + ' %.</p>') + '</div>' +
      '<div class="card panel"><h2>Confidentialité</h2><label class="row small"><input type="checkbox" data-act="pseudo"' + (S.usePseudo ? " checked" : "") + ' style="accent-color:var(--gold)"> Afficher mon pseudo « ' + esc(S.pseudo) + ' » au lieu de mon nom</label><label class="row small"><input type="checkbox" data-act="msgs"' + (S.msgs ? " checked" : "") + ' style="accent-color:var(--gold)"> Recevoir des messages privés</label>' +
      '<div class="row"><button class="btn sm ghost" data-act="export">Exporter mes données</button><button class="btn sm ghost" data-act="delete">Supprimer mon compte</button></div><p id="rgpd" class="small" hidden></p></div></div>' +
      '<div><h2 style="font-size:20px;margin-bottom:12px">Votre certificat (aperçu)</h2><div class="cert">' + medal(4, 64) + '<span class="eyebrow both">Certificat de réussite</span><h3>MARKETING DIGITAL : VENDRE EN LIGNE</h3><p class="muted small">décerné à</p><p class="name">' + esc(S.usePseudo ? S.pseudo : "Ama Mensah") + '</p><p class="small muted">N° NE-CERT-2026-000184 · Vérifiable sur newelite.agency/verifier</p><p class="motto" style="font-size:10px">EXCELLENCE <i>•</i> STRATÉGIE <i>•</i> RÉSULTATS</p></div><p class="small muted" style="margin-top:8px">Délivré automatiquement à 100 % de la formation.</p></div>');
  }
  var boardTab = "semaine";
  // Classement par période (données de démonstration) : points gagnés sur la semaine ou le mois, ou total général.
  function boardFor(tab) {
    var b = board();
    var k = { semaine: [0.04, 0.1, 0.11, 0.2, 0.06, 0.04, 0.07, 0.03, 0.05, 0.02], mois: [0.22, 0.3, 0.25, 0.34, 0.2, 0.18, 0.28, 0.15, 0.2, 0.1] }[tab];
    if (!k) return b;
    return b.map(function (r, i) { return { n: r.n, p: Math.round(r.p * k[i]), me: r.me }; }).sort(function (a, z) { return z.p - a.p; });
  }
  function vBoard() {
    var b = boardFor(boardTab);
    var gen = board();
    function lvOf(n) { for (var i = 0; i < gen.length; i++) if (gen[i].n === n) return levelIdx(gen[i].p); return 0; }
    return shell("classement", '<div class="main-head"><div><span class="eyebrow">Classement</span><h1 style="margin-top:8px">Les plus réguliers</h1><p>L\'étudiant de la semaine et celui du mois reçoivent un code promo.</p></div><div class="seg">' +
      [["semaine", "Semaine"], ["mois", "Mois"], ["general", "Général"]].map(function (x) { return '<button data-act="board" data-id="' + x[0] + '" aria-pressed="' + (boardTab === x[0]) + '">' + x[1] + '</button>'; }).join("") + '</div></div>' +
      '<div class="podium">' + b.slice(0, 3).map(function (r, i) { return '<div class="card' + (r.me ? " me" : "") + '">' + medal(lvOf(r.n), 64) + '<span class="eyebrow both">' + (i + 1) + (i ? "e" : "er") + '</span><strong>' + esc(r.n) + '</strong><span class="small muted num">' + r.p.toLocaleString("fr-FR") + ' pts</span>' + (i === 0 && boardTab !== "general" ? '<span class="chip gold">Code promo offert</span>' : "") + '</div>'; }).join("") + '</div>' +
      '<div class="card panel"><div class="rank-list">' + b.map(function (r, i) { return '<div class="rank-row' + (r.me ? " me" : "") + '"><span class="pos">' + (i + 1) + '</span>' + medal(lvOf(r.n), 36) + '<strong style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(r.n) + (r.me ? " (vous)" : "") + '</strong><span class="hide-s small muted">' + LEVELS[lvOf(r.n)].name + (i < 5 && boardTab === "general" ? " · peut répondre au forum" : "") + '</span><span class="num">' + r.p.toLocaleString("fr-FR") + '</span></div>'; }).join("") + '</div></div>' +
      '<p class="small muted">Vous serez notifié quand quelqu\'un vous dépasse. Données de démonstration.</p>');
  }
  function threadRow(f) {
    var n = f.replies.length + (S.myReplies[f.id] || []).length;
    return '<a class="card thread" href="#sujet-' + f.id + '"><div style="min-width:0"><h3>' + esc(f.title) + '</h3><p class="small muted">' + cat(f.cat).name + ' · ' + esc(f.by) + ' · ' + f.ago + '</p></div><span class="chip' + (n ? " ok" : "") + '">' + n + ' réponse' + (n > 1 ? "s" : "") + '</span></a>';
  }
  var forumCat = "all";
  function vForum() {
    var lv = myLevel();
    var list = FORUM.concat(S.myThreads).filter(function (f) { return forumCat === "all" || f.cat === forumCat; });
    return shell("forum", '<div class="main-head"><div><span class="eyebrow">Forum</span><h1 style="margin-top:8px">La communauté</h1><p>' + (canReply() ? "Vous êtes dans le top 5 : vous pouvez répondre aux questions." : "Posez vos questions ; le top 5 et l'équipe y répondent.") + '</p></div><button class="btn sm gold" data-act="ask">Poser une question</button></div>' +
      '<div class="seg"><button data-act="fcat" data-id="all" aria-pressed="' + (forumCat === "all") + '">Tout</button>' + FORUM_CATS.map(function (c) { var lock = c.id === "prive" && lv < 3; return '<button data-act="fcat" data-id="' + c.id + '" aria-pressed="' + (forumCat === c.id) + '"' + (lock ? ' title="Réservé Visionnaire et Élite"' : "") + '>' + (lock ? "🔒 " : "") + c.name + '</button>'; }).join("") + '</div>' +
      (forumCat === "prive" && lv < 3 ? '<div class="card panel"><h2>Salon privé</h2><p class="muted">Réservé aux niveaux Visionnaire et Élite. Il vous manque ' + (LEVELS[3].min - points()).toLocaleString("fr-FR") + ' points.</p></div>' :
        '<div class="my">' + (list.length ? list.map(threadRow).join("") : '<p class="muted">Aucun sujet dans cette catégorie pour l\'instant.</p>') + '</div>'));
  }
  function vThread(id) {
    var f = FORUM.concat(S.myThreads).filter(function (x) { return x.id === id; })[0]; if (!f) return v404();
    var replies = f.replies.concat(S.myReplies[id] || []);
    return shell("forum", '<a class="link" href="#forum">← Forum</a><div class="card post"><div class="by">' + medal(f.lvl, 26) + '<b>' + esc(f.by) + '</b><span class="chip">' + cat(f.cat).name + '</span><span class="muted small">' + f.ago + '</span></div><h1 style="font-size:22px;font-family:var(--body);letter-spacing:0;font-weight:500">' + esc(f.title) + '</h1><p>' + esc(f.body) + '</p><div class="acts"><button data-act="report">Signaler</button></div></div>' +
      '<h2 style="font-size:18px">' + replies.length + ' réponse' + (replies.length > 1 ? "s" : "") + '</h2>' +
      replies.map(function (r, k) { var key = id + ":" + k, v = !!S.votes[key]; return '<div class="card post"><div class="by">' + medal(r.lvl, 26) + '<b>' + esc(r.by) + '</b>' + (r.lvl >= 1 ? '<span class="chip gold">' + LEVELS[r.lvl].name + '</span>' : "") + '</div><p>' + esc(r.body) + '</p><div class="acts"><button data-act="vote" data-k="' + key + '" aria-pressed="' + v + '">Utile · ' + ((r.useful || 0) + (v ? 1 : 0)) + '</button><button data-act="report">Signaler</button></div></div>'; }).join("") +
      (canReply() ? '<div class="card panel"><h2>Votre réponse</h2><textarea class="input" id="replyIn" rows="4" placeholder="Une réponse claire et concrète. Mentionnez quelqu\'un avec @pseudo."></textarea><div class="row"><button class="btn gold sm" data-act="reply" data-id="' + id + '">Publier</button><span class="small muted">Les votes « utile » vous rapportent des points.</span></div></div>'
        : '<div class="notice gold">Seuls l\'équipe et les 5 premiers du classement peuvent répondre. Votez « utile » pour mettre en avant les meilleures réponses.</div>'));
  }

