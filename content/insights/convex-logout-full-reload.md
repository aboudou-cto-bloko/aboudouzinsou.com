---
title: "Logout Convex : pourquoi il faut un full reload"
date: 2026-04-29
topic: convex
order: 4
tags: [convex, auth, session, bug]
related:
  - convex-internal-vs-public
  - f01-regle-balance
status: published
---

# Logout Convex : pourquoi il faut un full reload

```typescript
// Ce qu'on fait naturellement
await authClient.signOut();
router.push("/login");
```

Ça marche. L'utilisateur arrive sur `/login`. Le cookie est supprimé.

Mais si tu vas inspecter le réseau ou que tu poses un `console.log` sur tes queries Convex — elles tournent encore. Pendant quelques secondes, l'ancien cache Convex est toujours actif.

Dans la plupart des apps ça ne pose pas de problème visible. Mais sur des données sensibles — commandes, soldes, infos personnelles — tu risques d'afficher des données de l'ancienne session à l'utilisateur suivant qui se connecte sur le même appareil.

---

La cause : Convex garde un cache en mémoire côté client. `router.push()` ne le vide pas. Seul un rechargement complet de la page le vide.

```typescript
// Le fix
await authClient.signOut();
window.location.href = "/login"; // full reload — pas router.push
```

Une ligne de différence. Comportement fondamentalement différent.

`router.push` : navigation côté client, cache intact.
`window.location.href` : rechargement complet, tout repart de zéro.

Pour une app avec des données financières ou personnelles — c'est non négociable.
