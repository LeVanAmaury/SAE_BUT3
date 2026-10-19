# Spécifications UI & Wireframes - CodeArena

Ce document consigne les spécifications structurelles et les wireframes des écrans principaux de la plateforme CodeArena.

---

## 1. Vue d'ensemble de l'arborescence UI

```text
                  +-------------------------+
                  |  Barre de navigation    |
                  |  (Logo, Liens, Auth)    |
                  +------------+------------+
                               |
        +----------------------+----------------------+
        |                      |                      |
+-------v-------+      +-------v-------+      +-------v-------+
|  Accueil (/)  |      | Connexion     |      | Inscription   |
|  Hero, Cartes |      | (/login)      |      | (/register)   |
|  Classes CTA  |      +-------+-------+      +-------+-------+
+---------------+              |                      |
                               | (JWT Valide)         | (Succès)
                               v                      v
                       +---------------+      +-------+-------+
                       | Arène 2D      |      | Redirection   |
                       | (/arena)      |      | vers /login   |
                       | [Protégée]    |      +---------------+
                       +---------------+
```

---

## 2. Wireframes des Écrans

### Écran 1 : Accueil (`/`)
```text
+--------------------------------------------------------------------------+
| [CA] CODEARENA (Tactical 2D)        Accueil    Arène        [Connexion] [S'inscrire] |
+--------------------------------------------------------------------------+
|                                                                          |
|                           [ Saison 1 • Arène 2D ]                        |
|                                                                          |
|                           PROGRAMMEZ VOS BOTS.                           |
|                            DOMINEZ L'ARÈNE.                              |
|                                                                          |
|       Déployez vos algorithmes de combat dans une arène 2D temps réel.   |
|                                                                          |
|               [ Entrer dans l'Arène ]      [ Créer un compte ]           |
|                                                                          |
|  +--------------------+  +--------------------+  +--------------------+  |
|  | ⚔ 3 Classes        |  | ⚙ Sandbox Docker   |  | 🏆 Progression      |  |
|  | Guerrier, Tank,    |  | Exécution isolée   |  | Missions tactiques |  |
|  | Sniper tactiques.  |  | sans réseau.       |  | et rang ELO.       |  |
|  +--------------------+  +--------------------+  +--------------------+  |
|                                                                          |
+--------------------------------------------------------------------------+
| © 2026 CodeArena • BUT3                   ● PostgreSQL: Prêt  ● Docker: Prêt |
+--------------------------------------------------------------------------+
```

### Écran 2 : Formulaire de Connexion (`/login`)
```text
+--------------------------------------------------------------------------+
| [CA] CODEARENA (Tactical 2D)        Accueil    Arène        [Connexion] [S'inscrire] |
+--------------------------------------------------------------------------+
|                                                                          |
|                         +-----------------------+                        |
|                         |         [ >_ ]        |                        |
|                         |  Connexion CodeArena  |                        |
|                         |                       |                        |
|                         | [! Message Erreur/OK] |                        |
|                         |                       |                        |
|                         | NOM D'UTILISATEUR     |                        |
|                         | [ testplayer        ] |                        |
|                         |                       |                        |
|                         | MOT DE PASSE          |                        |
|                         | [ ••••••••••••••••  ] |                        |
|                         |                       |                        |
|                         | [   SE CONNECTER   ]  |                        |
|                         |                       |                        |
|                         | Pas de compte ?       |                        |
|                         | S'inscrire            |                        |
|                         +-----------------------+                        |
|                                                                          |
+--------------------------------------------------------------------------+
```

### Écran 3 : Formulaire d'Inscription (`/register`)
```text
+--------------------------------------------------------------------------+
| [CA] CODEARENA (Tactical 2D)        Accueil    Arène        [Connexion] [S'inscrire] |
+--------------------------------------------------------------------------+
|                                                                          |
|                         +-----------------------+                        |
|                         |         [ 🛡 ]        |                        |
|                         |  Créer un compte      |                        |
|                         |                       |                        |
|                         | NOM D'UTILISATEUR     |                        |
|                         | [ CyberPilot42      ] |                        |
|                         |                       |                        |
|                         | ADRESSE EMAIL         |                        |
|                         | [ pilote@codearena.io]|                        |
|                         |                       |                        |
|                         | MOT DE PASSE          |                        |
|                         | [ (min. 6 car.)     ] |                        |
|                         |                       |                        |
|                         | CONFIRMER MOT DE PASSE|                        |
|                         | [ ••••••••••••••••  ] |                        |
|                         |                       |                        |
|                         | [    S'INSCRIRE    ]  |                        |
|                         |                       |                        |
|                         | Déjà un compte ?      |                        |
|                         | Se connecter          |                        |
|                         +-----------------------+                        |
|                                                                          |
+--------------------------------------------------------------------------+
```

### Écran 4 : Arène Tactique 2D (`/arena` - Protégée)
```text
+--------------------------------------------------------------------------+
| [CA] CODEARENA                      Accueil    Arène   Pilote : CyberPilot42 [Déconnexion]|
+--------------------------------------------------------------------------+
| [ Grille Canvas 2D ]                  | [ Panneau d'arbitrage & Métriques ]
|                                       |
|  +---------------------------------+  | Statut Combat : EN ATTENTE
|  | .  .  .  .  .  .  .  .  .  .  . |  |
|  | .  [Bot A (Bleu)] ->            |  | BOT 1 : Alpha-Guerrier
|  | .                               |  | Santé : [██████████] 100/100
|  | .                  <- [Bot B]   |  | Bouclier : 25 pts
|  | .                               |  |
|  | .  .  .  .  .  .  .  .  .  .  . |  | BOT 2 : Omega-Tank
|  +---------------------------------+  | Santé : [██████████████] 150/150
|                                       | Bouclier : 60 pts
|                                       |
| [ Journal des événements en direct ]  | [ Commandes & Replay ]
| > 00:00.000 Initialisation arène 2D   | [ Lancer ] [ Pause ] [ Reset ]
| > 00:00.012 Sandbox Docker prête...   | Vitesse : [ 60 ticks/s ]
+--------------------------------------------------------------------------+
```
