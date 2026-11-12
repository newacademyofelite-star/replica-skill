"use strict";

  /* ================= Données de démonstration ================= */
  var CATS = [
    { id: "trading", name: "Trading", g: "T", d: "Lire les marchés, gérer le risque." },
    { id: "marketing", name: "Marketing Digital", g: "M", d: "Positionner, publier, vendre." },
    { id: "design", name: "Design", g: "D", d: "Identité, typographie, supports." },
    { id: "code", name: "Code", g: "C", d: "Sites rapides et responsive." },
    { id: "strategie", name: "Stratégie", g: "S", d: "Diagnostic et plan à 90 jours." }
  ];
  function L(t, m) { return { t: t, m: m }; }
  var COURSES = [
    { id: "marketing", cat: "marketing", title: "Marketing Digital : vendre en ligne", level: "Débutant", price: 247, rating: 4.9, reviews: 128,
      lead: "Construire une marque qui attire, publier avec méthode et transformer l'audience en clients.",
      learn: ["Définir une cible et une offre claires", "Écrire des accroches qui arrêtent le scroll", "Planifier 30 jours de contenu", "Lancer une publicité Meta rentable", "Construire un tunnel de vente simple", "Lire ses statistiques chaque semaine"],
      pre: "Aucun. Un smartphone et un compte Instagram suffisent.", outcome: "Lancer et piloter seul la présence en ligne d'une marque.",
      lessons: [L("Bienvenue et méthode", 6), L("Votre client idéal", 14), L("L'offre qui se vend", 17), L("Accroches et formats", 19), L("Calendrier éditorial", 15), L("Publicité Meta : les bases", 22), L("Le tunnel de vente", 18), L("Mesurer et ajuster", 12)] },
    { id: "trading", cat: "trading", title: "Trading : de zéro à la discipline", level: "Intermédiaire", price: 297, rating: 4.8, reviews: 94,
      lead: "Analyser un graphique, protéger son capital et suivre un plan de trading sans émotion.",
      learn: ["Lire tendances et niveaux clés", "Utiliser les chandeliers japonais", "Calculer la taille de position", "Placer stop et objectif", "Tenir un journal de trading", "Construire son plan écrit"],
      pre: "Connaître le vocabulaire de base des marchés.", outcome: "Trader avec un plan écrit et un risque maîtrisé.",
      lessons: [L("Le cadre du trader", 9), L("Lire un graphique", 21), L("Chandeliers japonais", 18), L("Supports et résistances", 20), L("Gestion du risque", 24), L("Psychologie", 16), L("Votre plan de trading", 19)] },
    { id: "design", cat: "design", title: "Design de marque avec Canva et Figma", level: "Débutant", price: 197, rating: 4.9, reviews: 76,
      lead: "Créer une identité visuelle cohérente et des supports qui inspirent confiance.",
      learn: ["Choisir deux polices et s'y tenir", "Composer une palette de marque", "Mettre en page sur une grille", "Créer un kit Canva réutilisable", "Préparer un logo propre", "Monter un portfolio"],
      pre: "Aucun.", outcome: "Livrer une identité et des visuels de qualité professionnelle.",
      lessons: [L("Le regard du designer", 8), L("Typographie", 16), L("Couleurs", 14), L("Grilles et mise en page", 17), L("Canva en mode pro", 21), L("Portfolio", 13)] },
    { id: "code", cat: "code", title: "Créer son site de A à Z", level: "Débutant", price: 247, rating: 4.7, reviews: 61,
      lead: "HTML, CSS et JavaScript pour publier un site vitrine rapide, propre et responsive.",
      learn: ["Structurer une page en HTML", "Styliser avec CSS et Flexbox", "Rendre un site responsive", "Ajouter de l'interactivité", "Versionner avec Git", "Mettre en ligne"],
      pre: "Savoir utiliser un ordinateur.", outcome: "Publier son propre site vitrine en ligne.",
      lessons: [L("Comment marche le web", 10), L("HTML", 22), L("CSS", 25), L("Responsive", 18), L("JavaScript", 24), L("Git et GitHub", 15), L("Mise en ligne", 12)] },
    { id: "strategie", cat: "strategie", title: "Stratégie : le plan d'action 90 jours", level: "Avancé", price: 347, rating: 5.0, reviews: 38,
      lead: "Diagnostiquer une activité, choisir trois priorités et les piloter avec les bons chiffres.",
      learn: ["Faire un diagnostic en une page", "Clarifier le business model", "Choisir trois priorités", "Écrire un plan 90 jours", "Suivre 5 indicateurs", "Conduire une revue hebdomadaire"],
      pre: "Avoir une activité ou un projet en cours.", outcome: "Piloter son activité avec un plan et des chiffres.",
      lessons: [L("Le diagnostic", 18), L("Business model", 20), L("Priorités", 14), L("Plan 90 jours", 22), L("Tableau de bord", 16), L("Revue hebdomadaire", 11)] }
  ];
  var FREE_LESSONS = { marketing: 0, trading: 0, design: 0 };
  var EBOOKS = [
    { id: "eb-erreurs", cat: "trading", title: "Les 10 erreurs du trader débutant", price: 0, pages: 24 },
    { id: "eb-graph", cat: "trading", title: "Lire un graphique en 20 minutes", price: 14, pages: 38 },
    { id: "eb-risque", cat: "trading", title: "Gestion du risque", price: 19, pages: 46 },
    { id: "eb-check", cat: "marketing", title: "Checklist Instagram de lancement", price: 0, pages: 18 },
    { id: "eb-persona", cat: "marketing", title: "Persona et positionnement", price: 12, pages: 32 },
    { id: "eb-accroche", cat: "marketing", title: "100 accroches qui convertissent", price: 17, pages: 52 },
    { id: "eb-meta", cat: "marketing", title: "Meta Ads pas à pas", price: 24, pages: 64 },
    { id: "eb-typo", cat: "design", title: "Kit typographie de marque", price: 0, pages: 20 },
    { id: "eb-couleur", cat: "design", title: "Couleurs et identité", price: 14, pages: 36 },
    { id: "eb-html", cat: "code", title: "HTML et CSS : l'essentiel", price: 16, pages: 58 },
    { id: "eb-js", cat: "code", title: "JavaScript pour débutants", price: 19, pages: 72 },
    { id: "eb-diag", cat: "strategie", title: "Diagnostic d'entreprise", price: 22, pages: 40 },
    { id: "eb-90", cat: "strategie", title: "Le plan d'action 90 jours", price: 29, pages: 54 }
  ];
  var LEVELS = [
    { name: "Aspirant", min: 0, perks: ["Accès au forum", "Classement visible"] },
    { name: "Stratège", min: 500, perks: ["5 % de réduction sur les e-books", "Badge doré sur le forum"] },
    { name: "Architecte", min: 1500, perks: ["10 % sur e-books et formations", "Avant-première 48 h", "Points doublés sur les défis"] },
    { name: "Visionnaire", min: 3500, perks: ["15 % de réduction", "Un e-book offert par trimestre", "Salon privé du forum", "Pseudo mis en avant"] },
    { name: "Élite", min: 7000, perks: ["20 % de réduction", "Une formation offerte par an", "Q&R mensuelle en direct", "Certificat « Membre Élite »"] }
  ];
  var LEVEL_DISC = [0, 0.05, 0.10, 0.15, 0.20];
  var PROMOS = { ELITE10: 0.10, BIENVENUE15: 0.15 };
  var BOARD = [
    { n: "Kofi A.", p: 7420 }, { n: "Léa Dossou", p: 4180 }, { n: "Yann K.", p: 2860 },
    { n: "Ama Mensah", p: 0, me: true }, { n: "Sarah B.", p: 1105 }, { n: "Moussa T.", p: 980 },
    { n: "Inès L.", p: 760 }, { n: "David E.", p: 540 }, { n: "Fatou S.", p: 310 }, { n: "Marc O.", p: 120 }
  ];
  var FORUM = [
    { id: "t1", cat: "marketing", title: "Quelle fréquence de publication pour un compte qui démarre ?", by: "Inès L.", lvl: 1, ago: "il y a 2 h", body: "Je lance le compte de ma boutique de bijoux. Vaut-il mieux 1 post par jour ou 3 par semaine mais plus soignés ?",
      replies: [{ by: "Léa Dossou", lvl: 3, body: "3 par semaine, réguliers, valent mieux que 7 bâclés. Ajoute des stories tous les jours : c'est là que se crée la relation.", useful: 14 }, { by: "Kofi A.", lvl: 4, body: "Garde le même jour et la même heure pendant un mois, puis compare tes statistiques.", useful: 9 }] },
    { id: "t2", cat: "trading", title: "Où placer mon stop sur un breakout ?", by: "Moussa T.", lvl: 1, ago: "hier", body: "Quand le prix casse une résistance, je mets mon stop juste sous la résistance mais je me fais sortir souvent. Une idée ?",
      replies: [{ by: "Kofi A.", lvl: 4, body: "Sous le dernier creux plutôt que sous le niveau, et réduis la taille de position pour garder le même risque en euros.", useful: 21 }] },
    { id: "t3", cat: "design", title: "Cinzel ou Cormorant pour un logo de luxe ?", by: "Fatou S.", lvl: 0, ago: "il y a 3 j", body: "Je prépare l'identité d'un salon de beauté haut de gamme. Laquelle tient le mieux en petit ?", replies: [] },
    { id: "t4", cat: "reussite", title: "Premier client signé à 450 € grâce au module tunnel de vente", by: "Sarah B.", lvl: 1, ago: "il y a 4 j", body: "J'ai appliqué la méthode du module 7 à mon offre de community management. Premier contrat signé cette semaine. Merci à tous pour vos retours !", replies: [{ by: "Léa Dossou", lvl: 3, body: "Bravo Sarah, c'est mérité !", useful: 6 }] },
    { id: "t5", cat: "code", title: "Mon site s'affiche mal sur iPhone", by: "David E.", lvl: 1, ago: "il y a 5 j", body: "Tout est bien sur ordinateur mais le menu déborde sur mobile.", replies: [] }
  ];
  var FORUM_CATS = CATS.concat([{ id: "reussite", name: "Mur de réussite", g: "★", d: "Vos résultats, vos victoires." }, { id: "prive", name: "Salon privé", g: "◆", d: "Réservé Visionnaire et Élite." }]);

  /* ================= Traductions de l'interface ================= */
  var I18N = {
    fr: { home: "Accueil", catalog: "Formations", ebooks: "E-books", about: "L'agence", faq: "FAQ", contact: "Contact", login: "Connexion", space: "Mon espace",
      heroT: "Rejoignez <em>l'élite</em> du digital.", heroL: "Formations vidéo et e-books en trading, marketing, design, code et stratégie. Un parcours exigeant, des niveaux à gravir, une communauté qui vise haut.",
      cta1: "Accéder à mon espace", cta2: "Voir les formations", freeT: "Commencez gratuitement", catsT: "Cinq disciplines, un même niveau d'exigence" },
    de: { home: "Start", catalog: "Kurse", ebooks: "E-Books", about: "Die Agentur", faq: "FAQ", contact: "Kontakt", login: "Anmelden", space: "Mein Bereich",
      heroT: "Werde Teil der <em>digitalen Elite</em>.", heroL: "Videokurse und E-Books zu Trading, Marketing, Design, Code und Strategie. Ein anspruchsvoller Weg, Level zum Aufsteigen und eine ehrgeizige Community.",
      cta1: "Zu meinem Bereich", cta2: "Kurse ansehen", freeT: "Kostenlos starten", catsT: "Fünf Disziplinen, ein Anspruch" },
    en: { home: "Home", catalog: "Courses", ebooks: "E-books", about: "The agency", faq: "FAQ", contact: "Contact", login: "Log in", space: "My space",
      heroT: "Join the <em>digital elite</em>.", heroL: "Video courses and e-books in trading, marketing, design, code and strategy. A demanding path, levels to climb and a community that aims high.",
      cta1: "Go to my space", cta2: "See the courses", freeT: "Start for free", catsT: "Five disciplines, one standard" }
  };

  /* ================= État ================= */
  var KEY = "ne-platform-v2";
  function fresh() {
    return { lang: "fr", logged: false, role: "student", onboarded: false, pseudo: "AmaM", usePseudo: false, msgs: true,
      owned: ["marketing"], ownedEb: ["eb-check", "eb-persona", "eb-accroche"], readEb: ["eb-check", "eb-persona"],
      done: { marketing: [0, 1, 2, 3, 4] }, last: { c: "marketing", i: 5 }, pointsBase: 1240,
      notes: { "marketing:5": [{ t: 95, x: "Tester 2 audiences au lieu d'une" }] }, later: ["trading"],
      purchases: [{ d: "2026-09-14", what: "Marketing Digital : vendre en ligne", amt: 247, how: "Carte", inv: "NE-2026-0118" }, { d: "2026-09-20", what: "Persona et positionnement", amt: 11.4, how: "PayPal", inv: "NE-2026-0131" }, { d: "2026-10-03", what: "100 accroches qui convertissent", amt: 16.15, how: "Apple Pay", inv: "NE-2026-0164" }],
      votes: {}, myReplies: {}, myThreads: [], announcement: "", revoked: [], scheduled: [{ title: "Trading : module 8 « Le swing trading »", date: "2026-11-04" }] };
  }
  var S;
  try { S = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { S = null; }
  if (!S || !S.done) S = fresh();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  /* ================= Utilitaires ================= */
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var EUR = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  function eur(n) { return n === 0 ? "Gratuit" : EUR.format(n); }
  function t(k) { return (I18N[S.lang] || I18N.fr)[k] || I18N.fr[k]; }
  function course(id) { return COURSES.filter(function (c) { return c.id === id; })[0]; }
  function ebook(id) { return EBOOKS.filter(function (e) { return e.id === id; })[0]; }
  function cat(id) { return FORUM_CATS.filter(function (c) { return c.id === id; })[0]; }
  function mins(c) { return c.lessons.reduce(function (a, l) { return a + l.m; }, 0); }
  function hm(m) { return Math.floor(m / 60) + " h " + String(m % 60).padStart(2, "0"); }
  function mmss(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function points() {
    return S.pointsBase;
  }
  function levelIdx(p) { var i = 0; LEVELS.forEach(function (l, k) { if (p >= l.min) i = k; }); return i; }
  function myLevel() { return levelIdx(points()); }
  function board() {
    var b = BOARD.map(function (r) { return { n: r.me ? (S.usePseudo ? S.pseudo : r.n) : r.n, p: r.me ? points() : r.p, me: !!r.me }; });
    b.sort(function (a, z) { return z.p - a.p; });
    return b;
  }
  function myRank() { var b = board(); for (var i = 0; i < b.length; i++) if (b[i].me) return i + 1; return 0; }
  function canReply() { return S.role === "admin" || (myRank() <= 5 && S.revoked.indexOf("me") === -1); }
  function owns(id) { return S.owned.indexOf(id) !== -1; }
  function doneList(id) { return S.done[id] || []; }
  function pct(id) { var c = course(id); return Math.round(doneList(id).length / c.lessons.length * 100); }
  function lessonOpen(id, i) { if (!owns(id)) return FREE_LESSONS[id] === i; return i === 0 || doneList(id).indexOf(i - 1) !== -1; }
  function ebOwned(id) { var e = ebook(id); return e.price === 0 ? S.logged : S.ownedEb.indexOf(id) !== -1; }
  function ebSeries(id) { var e = ebook(id); return EBOOKS.filter(function (x) { return x.cat === e.cat; }); }
  function ebUnlocked(id) { var s = ebSeries(id), i = s.indexOf(ebook(id)); return i === 0 || S.readEb.indexOf(s[i - 1].id) !== -1; }
  function stars(r) { var f = Math.round(r); return "★★★★★".slice(0, f) + "☆☆☆☆☆".slice(0, 5 - f); }
  function initials(n) { return n.split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase(); }

  // Badge médaillon : 5 barres en escalier, remplies selon le niveau (0 à 4)
  function medal(lv, size) {
    var bars = "";
    for (var i = 0; i < 5; i++) {
      var h = 10 + i * 7, x = 17 + i * 7, on = i <= lv;
      bars += '<rect x="' + x + '" y="' + (47 - h) + '" width="5" height="' + h + '" rx="1" fill="' + (on ? "url(#gg)" : "none") + '" stroke="' + (on ? "none" : "currentColor") + '" stroke-opacity=".35"/>';
    }
    return '<svg viewBox="0 0 64 64" class="medal" aria-hidden="true"' + (size ? ' width="' + size + '" height="' + size + '"' : "") + '><defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8CF85"/><stop offset=".5" stop-color="#C9A24A"/><stop offset="1" stop-color="#A07D30"/></linearGradient></defs>' +
      '<circle cx="32" cy="32" r="30" fill="none" stroke="#C9A24A" stroke-width="1.2"/><circle cx="32" cy="32" r="26.5" fill="none" stroke="#C9A24A" stroke-opacity=".4" stroke-width=".8"/>' + bars +
      '<text x="32" y="56" text-anchor="middle" font-family="Cinzel, serif" font-size="7" letter-spacing="1.5" fill="currentColor">NE</text></svg>';
  }
  function stairs(n) { var s = '<span class="stairs" aria-hidden="true">'; for (var i = 0; i < 5; i++) s += '<i class="' + (i < n ? "on" : "") + '"></i>'; return s + "</span>"; }
  function logoSvg() {
    return '<defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8CF85"/><stop offset=".5" stop-color="#C9A24A"/><stop offset="1" stop-color="#A07D30"/></linearGradient></defs>' +
      '<rect x="1" y="1" width="62" height="62" rx="6" fill="#0A0A0A"/>' +
      '<rect x="10" y="40" width="4" height="12" fill="url(#lg)"/><rect x="16" y="34" width="4" height="18" fill="url(#lg)"/><rect x="22" y="28" width="4" height="24" fill="url(#lg)"/><rect x="28" y="22" width="4" height="30" fill="url(#lg)"/><rect x="34" y="16" width="4" height="36" fill="url(#lg)"/>' +
      '<text x="50" y="30" text-anchor="middle" font-family="Cinzel, serif" font-weight="600" font-size="15" fill="#FAFAF8">N</text><text x="50" y="50" text-anchor="middle" font-family="Cinzel, serif" font-weight="600" font-size="15" fill="#C9A24A">E</text>';
  }
  function heroMonogram() {
    return '<svg class="monogram" viewBox="0 0 240 240" role="img" aria-label="Monogramme New Elite"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8CF85"/><stop offset=".5" stop-color="#C9A24A"/><stop offset="1" stop-color="#A07D30"/></linearGradient></defs>' +
      '<circle cx="120" cy="120" r="116" fill="none" stroke="url(#hg)" stroke-width="1.5"/><circle cx="120" cy="120" r="106" fill="none" stroke="#C9A24A" stroke-opacity=".35"/>' +
      '<text x="120" y="128" text-anchor="middle" font-family="Cinzel, serif" font-weight="500" font-size="84" letter-spacing="2" fill="currentColor">NE</text>' +
      '<g fill="url(#hg)"><rect x="86" y="170" width="8" height="10"/><rect x="100" y="162" width="8" height="18"/><rect x="114" y="154" width="8" height="26"/><rect x="128" y="146" width="8" height="34"/><rect x="142" y="138" width="8" height="42"/></g>' +
      '<text x="120" y="204" text-anchor="middle" font-family="Jost, sans-serif" font-size="9" letter-spacing="5" fill="currentColor" opacity=".55">NEW ELITE</text></svg>';
  }
  function toast(msg) { var el = $("toast"); el.textContent = msg; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, 3200); }
  function openModal(html) { $("sheet").innerHTML = '<button class="x" data-act="close" aria-label="Fermer">×</button>' + html; $("modal").hidden = false; var f = $("sheet").querySelector("button:not(.x), input, a"); if (f) f.focus(); }
  function closeModal() { $("modal").hidden = true; }
  function icon(name) {
    var p = { home: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
      play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>', book: '<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>', rank: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
      forum: '<path d="M4 5h16v10H9l-5 4z"/>', chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
      tag: '<path d="M3 12V3h9l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/>', users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c.8-3.5 3.5-5 7-5s6.2 1.5 7 5M16 4.5a3.5 3.5 0 0 1 0 7M22 20c-.5-2.6-2-4.1-4-4.7"/>',
      mega: '<path d="M3 10v4h4l6 4V6L7 10zM17 9a4 4 0 0 1 0 6"/>' }[name] || "";
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>";
  }

