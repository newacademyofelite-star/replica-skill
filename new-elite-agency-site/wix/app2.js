"use strict";
  /* ================= Vues publiques ================= */
  function courseCard(c) {
    return '<a class="card course" href="#f-' + c.id + '"><div class="thumb"><div class="top"><span class="chip">' + cat(c.cat).name + '</span>' + (FREE_LESSONS[c.id] !== undefined ? '<span class="chip gold">Essai gratuit</span>' : "") + '</div><span class="big">' + cat(c.cat).g + '</span></div>' +
      '<div class="course-body"><h3>' + c.title + '</h3><p>' + c.lead + '</p><div class="meta"><span>' + c.lessons.length + ' vidéos</span><span>' + hm(mins(c)) + '</span><span>' + c.level + '</span></div>' +
      '<div class="meta"><span class="stars">' + stars(c.rating) + '</span><span>' + c.rating.toFixed(1) + ' · ' + c.reviews + ' avis vérifiés</span></div>' +
      '<div class="price-row"><span class="price">' + eur(c.price) + ' <small>ou 3 × ' + eur(Math.ceil(c.price / 3)) + '</small></span><span class="link">Découvrir</span></div></div></a>';
  }
  function bookCard(e) {
    var owned = ebOwned(e.id), open = owned && ebUnlocked(e.id), read = S.readEb.indexOf(e.id) !== -1;
    var series = ebSeries(e.id), vol = series.indexOf(e) + 1;
    var status = read ? '<span class="chip ok">Lu</span>' : owned ? (open ? '<span class="chip gold">À lire</span>' : '<span class="chip">Après le vol. ' + (vol - 1) + '</span>') : e.price === 0 ? '<span class="chip ok">Gratuit</span>' : '<span class="price" style="font-size:17px">' + eur(e.price) + '</span>';
    var act = owned ? (open ? '<button class="link" data-act="read" data-id="' + e.id + '">Lire</button>' : '<span class="small muted">Verrouillé</span>')
      : e.price === 0 ? '<a class="link" href="#connexion">Créer un compte</a>' : '<button class="link" data-act="buy" data-kind="ebook" data-id="' + e.id + '">Acheter</button>';
    return '<article class="card book' + (owned ? "" : " locked") + '"><div class="cover"><small>' + cat(e.cat).name + '</small><span class="vol">' + vol + '</span><h4>' + e.title + '</h4></div>' +
      '<div class="book-body"><span class="small muted num">' + e.pages + ' pages · PDF</span><div class="between">' + status + act + '</div></div></article>';
  }

  function vHome() {
    return '<section class="hero view"><div class="wrap hero-in">' + heroMonogram() +
      '<p class="motto">EXCELLENCE <i>•</i> STRATÉGIE <i>•</i> RÉSULTATS</p>' +
      '<h1>' + t("heroT") + '</h1><p class="lead">' + t("heroL") + '</p>' +
      '<div class="row center"><a class="btn gold" href="' + (S.logged ? "#espace" : "#connexion") + '">' + t("cta1") + '</a><a class="btn ghost" href="#catalogue">' + t("cta2") + '</a></div>' +
      '<div class="proof"><div><strong>2 418</strong><span>Étudiants</span></div><div><strong>31 560</strong><span>Vidéos terminées</span></div><div><strong>642</strong><span>Certificats délivrés</span></div><div><strong>4,8/5</strong><span>Avis vérifiés</span></div></div>' +
      '<p class="demo-flag">Chiffres de démonstration</p></div></section>' +
      '<section class="block"><div class="wrap"><div class="head c"><span class="eyebrow both">Catégories</span><h2>' + t("catsT") + '</h2></div><div class="cats">' +
      CATS.map(function (c) { return '<a class="card cat" href="#catalogue" data-act="cat" data-id="' + c.id + '"><span class="glyph">' + c.g + '</span><h3>' + c.name + '</h3><p>' + c.d + '</p></a>'; }).join("") + '</div></div></section>' +
      '<section class="block" style="padding-top:0"><div class="wrap"><div class="head"><span class="eyebrow">Formations vidéo</span><h2>Les parcours les plus suivis</h2><p class="lead">Un prix unique par formation, des vidéos qui se débloquent une à une, un quiz pour valider chaque étape et un certificat à la fin.</p></div><div class="grid3">' +
      COURSES.slice(0, 3).map(courseCard).join("") + '</div><div class="row center" style="margin-top:28px"><a class="btn ghost" href="#catalogue">Tout le catalogue</a></div></div></section>' +
      '<section class="block" style="background:var(--surface);border-block:1px solid var(--line)"><div class="wrap"><div class="head"><span class="eyebrow">' + t("freeT") + '</span><h2>3 vidéos et 3 e-books offerts</h2><p class="lead">Regardez la première vidéo de nos trois formations phares sans payer. Les e-books gratuits se téléchargent dès la création de votre compte.</p></div>' +
      '<div class="books">' + EBOOKS.filter(function (e) { return e.price === 0; }).map(bookCard).join("") +
      COURSES.filter(function (c) { return FREE_LESSONS[c.id] !== undefined; }).map(function (c) { return '<a class="card book" href="#v-' + c.id + '-0" style="text-decoration:none"><div class="cover" style="justify-content:center;align-items:center;text-align:center;gap:14px"><small>Vidéo d\'essai</small><span class="play">' + '<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></span><h4>' + c.lessons[0].t + '</h4></div><div class="book-body"><span class="small muted">' + cat(c.cat).name + ' · ' + c.lessons[0].m + ' min</span><div class="between"><span class="chip ok">Gratuit</span><span class="link">Regarder</span></div></div></a>'; }).join("") +
      '</div></div></section>' +
      '<section class="block"><div class="wrap about-grid"><div><p class="quote big-quote">« On ne forme pas des spectateurs. On forme des gens qui livrent. »</p><p class="small muted" style="margin-top:14px;letter-spacing:.14em;text-transform:uppercase">Fondateur, New Elite Agency</p></div>' +
      '<div><span class="eyebrow">Progression</span><h2 style="font-size:clamp(24px,3vw,34px);margin-top:12px">Cinq niveaux, de Aspirant à Élite.</h2><p class="lead" style="margin-top:12px">Chaque vidéo terminée, chaque e-book lu et chaque réponse jugée utile vous rapporte des points. Les barres du monogramme se remplissent à chaque niveau, avec des avantages concrets.</p>' +
      '<div class="row" style="margin-top:22px;gap:18px">' + LEVELS.map(function (l, i) { return '<div style="display:grid;justify-items:center;gap:6px">' + medal(i, 56) + '<span class="small">' + l.name + '</span></div>'; }).join("") + '</div></div></div></section>';
  }

  var filter = { cat: "all", type: "all", q: "" };
  function vCatalog(onlyEbooks) {
    if (onlyEbooks) filter.type = "ebook";
    var q = filter.q.trim().toLowerCase();
    var cs = COURSES.filter(function (c) { return (filter.cat === "all" || c.cat === filter.cat) && (!q || (c.title + c.lead).toLowerCase().indexOf(q) !== -1); });
    var es = EBOOKS.filter(function (e) { return (filter.cat === "all" || e.cat === filter.cat) && (!q || e.title.toLowerCase().indexOf(q) !== -1); });
    var fs = q ? FORUM.filter(function (f) { return (f.title + f.body).toLowerCase().indexOf(q) !== -1; }) : [];
    var packs = CATS.filter(function (c) { return filter.cat === "all" || c.id === filter.cat; }).map(function (c) {
      var paid = EBOOKS.filter(function (e) { return e.cat === c.id && e.price > 0; }); if (paid.length < 2) return "";
      var sum = paid.reduce(function (a, e) { return a + e.price; }, 0);
      return '<div class="card panel" style="grid-template-columns:1fr auto;align-items:center"><div><strong>Pack ' + c.name + '</strong><p class="small muted">' + paid.length + ' e-books · <s>' + eur(sum) + '</s> ' + eur(Math.round(sum * 0.75)) + ' (−25 %)</p></div><button class="btn sm gold" data-act="buy" data-kind="pack" data-id="' + c.id + '">Acheter le pack</button></div>';
    }).join("");
    return '<section class="block view"><div class="wrap"><div class="head"><span class="eyebrow">Catalogue</span><h2>' + (filter.type === "ebook" ? "Les e-books" : "Toutes les formations") + '</h2></div>' +
      '<div class="toolbar"><div class="seg" role="group" aria-label="Catégorie"><button data-act="cat" data-id="all" aria-pressed="' + (filter.cat === "all") + '">Toutes</button>' +
      CATS.map(function (c) { return '<button data-act="cat" data-id="' + c.id + '" aria-pressed="' + (filter.cat === c.id) + '">' + c.name + '</button>'; }).join("") + '</div>' +
      '<label class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="q" type="search" placeholder="Rechercher formations, e-books, forum" value="' + esc(filter.q) + '" aria-label="Rechercher"></label></div>' +
      '<div class="seg" role="group" aria-label="Type" style="margin-bottom:24px">' + [["all", "Tout"], ["video", "Formations vidéo"], ["ebook", "E-books"]].map(function (x) { return '<button data-act="type" data-id="' + x[0] + '" aria-pressed="' + (filter.type === x[0]) + '">' + x[1] + '</button>'; }).join("") + '</div>' +
      (filter.type !== "ebook" ? (cs.length ? '<div class="grid3">' + cs.map(courseCard).join("") + '</div>' : '<p class="muted">Aucune formation ne correspond.</p>') : "") +
      (filter.type !== "video" ? '<div class="head" style="margin:48px 0 20px"><span class="eyebrow">E-books</span><h2 style="font-size:26px">Un prix par e-book, ou le pack à −25 %</h2><p class="muted">Séquentiels : le volume suivant s\'ouvre quand le précédent est lu. Après achat : lecture en ligne et téléchargement.</p></div>' +
        (packs ? '<div class="grid2" style="margin-bottom:22px">' + packs + '</div>' : "") + (es.length ? '<div class="books">' + es.map(bookCard).join("") + '</div>' : '<p class="muted">Aucun e-book ne correspond.</p>') : "") +
      (fs.length ? '<div class="head" style="margin:48px 0 16px"><span class="eyebrow">Forum</span><h2 style="font-size:24px">Dans les discussions</h2></div><div class="my">' + fs.map(threadRow).join("") + '</div>' : "") +
      '</div></section>';
  }

  function vCourse(id) {
    var c = course(id); if (!c) return v404();
    var o = owns(id);
    var reviews = [["Ama M.", 5, "Clair, concret, et le quiz oblige vraiment à comprendre. J'ai lancé ma première campagne dès la semaine 2."], ["Kofi A.", 5, "Le niveau d'exigence est là. Les fiches récapitulatives sont parfaites pour réviser."], ["Sarah B.", 4, "Excellent contenu. J'aurais aimé encore plus d'exemples africains, mais le forum compense."]];
    var faq = [["Combien de temps ai-je accès à la formation ?", "À vie, mises à jour comprises."], ["Puis-je payer en plusieurs fois ?", "Oui, en 3 fois sans frais par carte."], ["Et si la formation ne me convient pas ?", "Vous êtes remboursé sous 7 jours, sans justification."], ["Puis-je télécharger les vidéos ?", "Non. Les vidéos se regardent en ligne ; les fiches récapitulatives, elles, se téléchargent."]];
    return '<div class="view"><section class="course-hero"><div class="wrap"><a class="link" href="#catalogue" style="color:#E8CF85">← Catalogue</a><div style="margin-top:22px"><span class="eyebrow">' + cat(c.cat).name + ' · ' + c.level + '</span><h1>' + c.title + '</h1><p class="lead">' + c.lead + '</p>' +
      '<div class="meta"><span class="stars">' + stars(c.rating) + '</span><span>' + c.rating.toFixed(1) + ' (' + c.reviews + ' avis vérifiés)</span><span>' + c.lessons.length + ' vidéos</span><span>' + hm(mins(c)) + '</span><span>Certificat inclus</span></div></div></div></section>' +
      '<div class="wrap course-layout"><div style="display:grid;gap:20px">' +
      '<div class="card section-card"><h2>Ce que vous allez apprendre</h2><ul class="ticks">' + c.learn.map(function (x) { return "<li>" + x + "</li>"; }).join("") + '</ul></div>' +
      '<div class="card section-card"><h2>Programme</h2><ol class="program">' + c.lessons.map(function (l, i) { var free = FREE_LESSONS[id] === i; return '<li><span class="n">' + String(i + 1).padStart(2, "0") + '</span><span>' + l.t + (free ? ' <span class="chip ok">Gratuit</span>' : "") + '</span><span class="t">' + l.m + ' min' + (free || o ? ' <a class="link" href="#v-' + id + '-' + i + '">' + (o ? "Voir" : "Essai") + '</a>' : " 🔒") + '</span></li>'; }).join("") + '</ol></div>' +
      '<div class="grid2"><div class="card section-card"><h2>Prérequis</h2><p class="muted">' + c.pre + '</p></div><div class="card section-card"><h2>À la fin</h2><p class="muted">' + c.outcome + '</p></div></div>' +
      '<div class="card section-card"><h2>Avis vérifiés</h2><p class="small muted">Seuls les étudiants ayant acheté la formation peuvent la noter.</p>' + reviews.map(function (r) { return '<div class="review"><div class="row"><b>' + r[0] + '</b><span class="stars">' + stars(r[1]) + '</span><span class="chip ok">Achat vérifié</span></div><p>' + r[2] + '</p></div>'; }).join("") + '</div>' +
      '<div class="card section-card"><h2>Questions fréquentes</h2>' + faq.map(function (f) { return '<details class="faq"><summary>' + f[0] + '</summary><p>' + f[1] + '</p></details>'; }).join("") + '</div></div>' +
      '<aside class="card sticky-buy"><div class="trailer"><button class="play" data-act="trailer" data-id="' + id + '" aria-label="Voir la bande-annonce"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></button></div><span class="small muted">Bande-annonce gratuite · 1 min 30</span>' +
      (o ? '<span class="chip ok" style="justify-self:start">Vous suivez cette formation</span><a class="btn block" href="#v-' + id + '-' + nextLesson(id) + '">Continuer</a>'
        : '<div class="price" style="font-size:30px">' + eur(c.price) + '</div><span class="small muted">ou 3 × ' + eur(Math.ceil(c.price / 3)) + ' sans frais</span><button class="btn gold block" data-act="buy" data-kind="course" data-id="' + id + '">Acheter la formation</button>' +
          '<button class="btn ghost block" data-act="later" data-id="' + id + '">' + (S.later.indexOf(id) !== -1 ? "Dans ma liste ✓" : "À regarder plus tard") + '</button>') +
      '<div class="guarantee"><svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg><span><strong>Satisfait ou remboursé sous 7 jours.</strong> Paiement sécurisé : carte, PayPal, Apple Pay, Google Pay.</span></div></aside></div></div>';
  }
  function nextLesson(id) { var c = course(id), d = doneList(id); for (var i = 0; i < c.lessons.length; i++) if (d.indexOf(i) === -1) return i; return 0; }

  function vAbout() {
    return '<section class="block view"><div class="wrap about-grid"><div class="portrait">' + heroMonogram().replace('class="monogram"', 'style="color:#F3F1EA"') + '</div><div style="display:grid;gap:18px">' +
      '<span class="eyebrow">Qui est derrière l\'agence</span><h2 style="font-size:clamp(26px,3.6vw,40px)">Une agence qui enseigne ce qu\'elle pratique chaque jour.</h2>' +
      '<p class="lead">New Elite Agency accompagne marques et entrepreneurs sur leur stratégie, leur communication et leur présence en ligne. L\'Academy transmet exactement ces méthodes, sans théorie inutile.</p>' +
      '<p class="muted">Ma mission : donner à chaque étudiant les compétences et la discipline qui font la différence, et une communauté qui tire vers le haut. <em>(Texte de présentation à personnaliser.)</em></p>' +
      '<div class="steps"><div><h3>Comprendre</h3><p>Des vidéos courtes et des e-books concrets.</p></div><div><h3>Valider</h3><p>Un quiz à chaque étape, une note minimale.</p></div><div><h3>Appliquer</h3><p>Des exercices sur votre propre projet.</p></div><div><h3>Progresser</h3><p>Des niveaux, un classement, un certificat.</p></div></div></div></div></section>';
  }
  function vFaq() {
    var q = [["Comment fonctionnent les formations vidéo ?", "Un prix unique donne accès à toute la formation. Chaque vidéo se débloque quand la précédente est réellement regardée et son quiz validé."], ["Et les e-books ?", "Chaque e-book a son prix, avec un pack réduit par catégorie. Après achat, vous pouvez le lire en ligne et le télécharger."], ["Quels moyens de paiement ?", "Carte bancaire, PayPal, Apple Pay et Google Pay. Les formations vidéo peuvent se payer en 3 fois."], ["Puis-je être remboursé ?", "Oui, sous 7 jours après l'achat."], ["Comment gagner des points ?", "Vidéos terminées, e-books lus, réponses jugées utiles sur le forum, régularité et défis de la semaine."], ["Qui peut répondre sur le forum ?", "L'équipe et les 5 premiers du classement. Tout le monde peut poser des questions et voter « utile »."], ["Ma progression est-elle visible ?", "Oui, par défaut. Vous pouvez afficher un pseudo à la place de votre nom dans votre profil."]];
    return '<section class="block view"><div class="wrap" style="max-width:820px"><div class="head"><span class="eyebrow">FAQ</span><h2>Questions fréquentes</h2></div>' + q.map(function (f) { return '<details class="faq"><summary>' + f[0] + '</summary><p>' + f[1] + '</p></details>'; }).join("") + '</div></section>';
  }
  function vContact() {
    return '<section class="block view"><div class="wrap about-grid"><div style="display:grid;gap:16px;align-content:start"><span class="eyebrow">Contact</span><h2 style="font-size:clamp(26px,3.6vw,40px)">Une question avant de commencer ?</h2><p class="lead">Écrivez-nous, réponse sous 24 h.</p><p><a href="https://www.instagram.com/newelite_agency/" target="_blank" rel="noopener">@newelite_agency</a> sur Instagram</p></div>' +
      '<form class="card form" id="contactForm" novalidate><div class="field"><label for="c-name">Nom</label><input id="c-name" required></div><div class="field"><label for="c-mail">E-mail</label><input id="c-mail" type="email" required></div>' +
      '<div class="field full"><label for="c-subj">Sujet</label><select id="c-subj"><option>Choisir une formation</option><option>Paiement ou facture</option><option>Partenariat</option><option>Autre</option></select></div><div class="field full"><label for="c-msg">Message</label><textarea id="c-msg"></textarea></div>' +
      '<p class="notice err full" id="c-err" hidden></p><p class="notice ok full" id="c-ok" hidden></p><div class="full"><button class="btn" type="submit">Envoyer</button></div></form></div></section>';
  }
  function vLegal(kind) {
    var n = { cgv: "Conditions générales de vente", cgu: "Conditions d'utilisation", confidentialite: "Politique de confidentialité" }[kind];
    var parts = { cgv: ["Objet et prix", "Paiement et paiement en plusieurs fois", "Droit de rétractation et remboursement sous 7 jours", "Accès aux contenus", "Factures et TVA"], cgu: ["Compte et sécurité", "Règles du forum et modération", "Propriété des contenus", "Filigrane et usage personnel", "Suspension de compte"], confidentialite: ["Données collectées", "Affichage de la progression aux autres étudiants", "Durée de conservation", "Export et suppression de vos données", "Contact du responsable"] }[kind];
    return '<section class="block view"><div class="wrap" style="max-width:820px"><div class="head"><span class="eyebrow">Légal</span><h2>' + n + '</h2><p class="notice gold">Squelette de la page : le texte définitif sera rédigé et relu par un juriste.</p></div><ol style="display:grid;gap:10px;padding-left:20px">' + parts.map(function (p) { return '<li><strong>' + p + '</strong><p class="muted small">À rédiger.</p></li>'; }).join("") + '</ol></div></section>';
  }
  function vVerify() {
    return '<section class="block view"><div class="wrap" style="max-width:640px;display:grid;gap:18px"><span class="eyebrow">Authenticité</span><h2>Vérifier un certificat</h2><p class="muted">Saisissez le numéro inscrit sur le certificat.</p>' +
      '<div class="row"><input class="input" id="certNo" placeholder="NE-CERT-2026-000184" style="flex:1;min-width:0"><button class="btn" data-act="verify">Vérifier</button></div><div id="certRes"></div></div></section>';
  }
  function v404() {
    return '<section class="wrap err view"><span class="code">404</span><h2>Page introuvable</h2><p class="muted">Cette page n\'existe pas ou a été déplacée.</p><a class="btn" href="#accueil">Retour à l\'accueil</a></section>';
  }

  /* ================= Connexion + accueil 3 écrans ================= */
  function vLogin() {
    return '<section class="block view"><div class="wrap" style="max-width:460px"><div class="card form" style="grid-template-columns:1fr"><div style="display:grid;justify-items:center;gap:10px;text-align:center"><svg viewBox="0 0 64 64" width="56" height="56">' + logoSvg() + '</svg><span class="eyebrow both">Espace membre</span><h2 style="font-size:26px">Connexion</h2></div>' +
      '<div class="field"><label for="l-mail">E-mail</label><input id="l-mail" type="email" value="ama@exemple.com" autocomplete="username"></div><div class="field"><label for="l-pw">Mot de passe</label><input id="l-pw" type="password" value="elite2026" autocomplete="current-password"></div>' +
      '<button class="btn gold block" data-act="login" data-role="student">Se connecter</button><button class="btn ghost block" data-act="login" data-role="admin">Connexion administrateur (démo)</button>' +
      '<div class="row" style="justify-content:space-between"><button class="link" data-act="forgot">Mot de passe oublié</button><button class="link" data-act="login" data-role="student" data-new="1">Créer un compte</button></div>' +
      '<p class="notice gold small">Démo : les identifiants sont préremplis. Dans la version finale, la connexion admin demande un code de vérification en deux étapes.</p></div></div></section>';
  }
  var onb = 0;
  function onboarding() {
    var screens = [
      ["Bienvenue dans l'élite", "Chaque formation se débloque vidéo par vidéo. Regardez vraiment, validez le quiz, passez à la suite. Les e-books se lisent dans l'ordre, en ligne ou hors ligne."],
      ["Gravissez les 5 niveaux", "Vos points vous font passer d'Aspirant à Élite, avec des réductions et des privilèges à chaque palier. Le classement de la semaine et du mois récompense les plus réguliers par un code promo."],
      ["Une communauté exigeante", "Posez vos questions sur le forum. L'équipe et le top 5 du classement y répondent ; vos votes « utile » font gagner des points aux meilleures réponses."]
    ];
    var s = screens[onb];
    openModal('<div style="display:grid;justify-items:center;gap:14px;text-align:center">' + medal(onb === 0 ? 0 : onb === 1 ? 2 : 4, 84) + '<span class="eyebrow both">Étape ' + (onb + 1) + ' sur 3</span><h2>' + s[0] + '</h2><p class="muted">' + s[1] + '</p>' +
      '<div class="dots">' + [0, 1, 2].map(function (i) { return '<i class="' + (i <= onb ? "on" : "") + '"></i>'; }).join("") + '</div>' +
      '<label class="small" style="display:flex;gap:8px;align-items:flex-start;text-align:left' + (onb === 2 ? "" : ";display:none") + '"><input type="checkbox" id="consent" checked style="accent-color:var(--gold);margin-top:5px"> J\'accepte que ma progression soit visible des autres étudiants (modifiable à tout moment).</label>' +
      '<button class="btn gold" data-act="onb">' + (onb < 2 ? "Suivant" : "Commencer") + '</button></div>');
  }

  /* ================= Espace étudiant ================= */
  function shell(active, inner) {
    var lv = myLevel(), p = points(), nx = LEVELS[lv + 1];
    var items = S.role === "admin"
      ? [["admin", "Vue d'ensemble", "chart"], ["admin-contenus", "Contenus", "upload"], ["admin-promos", "Codes promo", "tag"], ["admin-users", "Utilisateurs", "users"], ["admin-annonces", "Annonces", "mega"], ["espace", "Aperçu étudiant", "user"]]
      : [["espace", "Tableau de bord", "home"], ["mes-formations", "Mes formations", "play"], ["bibliotheque", "Bibliothèque", "book"], ["classement", "Classement", "rank"], ["forum", "Forum", "forum"], ["profil", "Mon profil", "user"]];
    var nav = items.map(function (x) { return '<a href="#' + x[0] + '" class="' + (x[0] === active ? "on" : "") + '">' + icon(x[2]) + x[1] + '</a>'; }).join("");
    var name = S.role === "admin" ? "Administrateur" : (S.usePseudo ? S.pseudo : "Ama Mensah");
    return '<div class="app view"><aside class="side"><div class="who"><span class="avatar">' + (S.role === "admin" ? "NE" : initials(name)) + '</span><div><strong>' + esc(name) + '</strong><span>' + (S.role === "admin" ? "Accès complet · 2FA" : LEVELS[lv].name + " · #" + myRank()) + '</span></div></div>' +
      '<nav aria-label="Espace">' + nav + '</nav>' +
      (S.role === "admin" ? "" : '<div class="lvl"><div class="row" style="justify-content:space-between"><b>' + LEVELS[lv].name.toUpperCase() + '</b>' + stairs(lv + 1) + '</div><span class="small num">' + p.toLocaleString("fr-FR") + ' pts' + (nx ? " · " + (nx.min - p).toLocaleString("fr-FR") + " avant " + nx.name : "") + '</span><div class="bar"><i style="width:' + (nx ? Math.round((p - LEVELS[lv].min) / (nx.min - LEVELS[lv].min) * 100) : 100) + '%"></i></div></div>') +
      '<div class="bottom"><a class="link" href="#accueil" style="color:var(--night-text)">← Site public</a><button data-act="reset">Réinitialiser la démo</button><button data-act="logout">Se déconnecter</button></div></aside>' +
      '<div class="main"><nav class="tabs-m" aria-label="Espace">' + items.map(function (x) { return '<a href="#' + x[0] + '" class="' + (x[0] === active ? "on" : "") + '">' + x[1] + '</a>'; }).join("") + '<a href="#" data-act="logout">Déconnexion</a></nav>' + inner + '</div></div>';
  }
  function courseRow(c) {
    var p = pct(c.id), n = doneList(c.id).length;
    return '<div class="card my-row"><span class="mini">' + cat(c.cat).g + '</span><div style="min-width:0"><h3>' + c.title + '</h3><p class="sub">' + n + ' / ' + c.lessons.length + ' vidéos · ' + p + ' %</p><div class="bar" style="margin-top:8px"><i style="width:' + p + '%"></i></div></div>' +
      '<div class="row">' + (p === 100 ? '<a class="btn sm gold" href="#profil">Certificat</a>' : '<a class="btn sm" href="#v-' + c.id + '-' + nextLesson(c.id) + '">Continuer</a>') + '</div></div>';
  }
  function vDashboard() {
    var lv = myLevel(), p = points(), nx = LEVELS[lv + 1], lc = course(S.last.c), li = S.last.i;
    var lockedEb = EBOOKS.filter(function (e) { return e.price > 0 && S.ownedEb.indexOf(e.id) === -1; }).slice(0, 4);
    var challengeDone = Math.min(3, (S.weekDone || 1));
    return shell("espace",
      '<div class="main-head"><div><span class="eyebrow">Tableau de bord</span><h1 style="margin-top:8px">Bonjour ' + esc(S.usePseudo ? S.pseudo : "Ama") + '.</h1><p>Rang #' + myRank() + ' au classement général cette semaine.</p></div><a class="btn ghost sm" href="#catalogue">Explorer le catalogue</a></div>' +
      '<div class="level-card">' + medal(lv, 96) + '<div><span class="eyebrow">Niveau ' + (lv + 1) + ' sur 5</span><h2 style="margin-top:6px">' + LEVELS[lv].name.toUpperCase() + '</h2><span class="small num" style="color:var(--night-text)">' + p.toLocaleString("fr-FR") + ' points' + (nx ? ' · encore ' + (nx.min - p).toLocaleString("fr-FR") + ' pour ' + nx.name : "") + '</span>' +
      '<div class="bar"><i style="width:' + (nx ? Math.round((p - LEVELS[lv].min) / (nx.min - LEVELS[lv].min) * 100) : 100) + '%"></i></div><ul>' + LEVELS[lv].perks.map(function (x) { return "<li>" + x + "</li>"; }).join("") + '</ul></div></div>' +
      '<div class="card panel resume"><div><span class="eyebrow">Reprendre</span><h2 style="font-size:20px;margin-top:6px">' + lc.lessons[li].t + '</h2><p class="small muted">' + lc.title + ' · vidéo ' + (li + 1) + ' sur ' + lc.lessons.length + '</p></div><a class="btn gold" href="#v-' + lc.id + '-' + li + '">Reprendre la lecture</a></div>' +
      '<div class="grid2"><div class="card panel"><div class="panel-h"><h2>Défi de la semaine</h2><span class="chip gold">+150 pts</span></div><p>Terminez 3 vidéos avant dimanche.</p><div class="row">' + stairs(challengeDone + 1) + '<span class="small num">' + challengeDone + ' / 3</span></div></div>' +
      '<div class="card panel"><div class="panel-h"><h2>À regarder plus tard</h2></div>' + (S.later.length ? S.later.map(function (id) { var c = course(id); return '<a href="#f-' + id + '" class="row" style="text-decoration:none;justify-content:space-between"><span>' + c.title + '</span><span class="link">Voir</span></a>'; }).join("") : '<p class="muted small">Ajoutez des formations depuis le catalogue.</p>') + '</div></div>' +
      '<div><div class="panel-h" style="margin-bottom:12px"><h2 style="font-size:20px">Mes formations</h2><a class="link" href="#mes-formations">Tout voir</a></div><div class="my">' + S.owned.map(function (id) { return courseRow(course(id)); }).join("") + '</div></div>' +
      '<div><div class="panel-h" style="margin-bottom:12px"><h2 style="font-size:20px">À débloquer</h2><a class="link" href="#ebooks">Catalogue e-books</a></div><div class="books">' + lockedEb.map(bookCard).join("") + '</div></div>' +
      '<div class="card panel"><div class="panel-h"><h2>Historique des achats</h2><span class="small muted">Factures envoyées par e-mail</span></div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Achat</th><th>Paiement</th><th>Facture</th><th class="r">Montant TTC</th></tr></thead><tbody>' +
      S.purchases.slice().reverse().map(function (x) { return '<tr><td>' + new Date(x.d).toLocaleDateString("fr-FR") + '</td><td>' + esc(x.what) + '</td><td>' + x.how + '</td><td>' + x.inv + '</td><td class="r">' + EUR.format(x.amt) + '</td></tr>'; }).join("") + '</tbody></table></div></div>');
  }
  function vMyCourses() {
    var other = COURSES.filter(function (c) { return !owns(c.id); });
    return shell("mes-formations", '<div class="main-head"><div><span class="eyebrow">Mes formations</span><h1 style="margin-top:8px">Vos parcours</h1></div></div>' +
      '<div class="my">' + S.owned.map(function (id) { return courseRow(course(id)); }).join("") + '</div>' +
      '<div><h2 style="font-size:20px;margin-bottom:12px">Disponibles à l\'achat</h2><div class="my">' + other.map(function (c) { return '<div class="card my-row"><span class="mini">' + cat(c.cat).g + '</span><div><h3>' + c.title + '</h3><p class="sub">' + c.lessons.length + ' vidéos · ' + hm(mins(c)) + ' · ' + c.level + '</p></div><div class="row"><span class="chip">🔒 ' + eur(c.price) + '</span><a class="btn sm ghost" href="#f-' + c.id + '">Voir</a></div></div>'; }).join("") + '</div></div>');
  }
  function vLibrary() {
    return shell("bibliotheque", '<div class="main-head"><div><span class="eyebrow">Bibliothèque</span><h1 style="margin-top:8px">Vos e-books</h1><p>Un e-book acheté rapporte ses points une fois lu.</p></div></div>' +
      CATS.map(function (c) { var list = EBOOKS.filter(function (e) { return e.cat === c.id; }); return '<div><h2 style="font-size:18px;margin-bottom:12px">' + c.name + '</h2><div class="books">' + list.map(bookCard).join("") + '</div></div>'; }).join(""));
  }

