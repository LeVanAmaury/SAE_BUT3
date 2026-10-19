<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div
    class="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
  >
    <!-- Hero Section -->
    <div class="text-center space-y-8 my-8">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-700/50 shadow-inner"
      >
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        Saison 1 &bull; Ar&egrave;ne Tactique 2D
      </div>

      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
        Programmez vos bots.<br />
        <span
          class="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent"
        >
          Dominez l'ar&egrave;ne.
        </span>
      </h1>

      <p class="max-w-2xl mx-auto text-lg text-slate-300 leading-relaxed">
        D&eacute;ployez vos algorithmes de combat dans une ar&egrave;ne 2D temps
        r&eacute;el. Guerriers, Tanks, Snipers : concevez votre
        strat&eacute;gie, franchissez les missions tactiques et hissez-vous au
        sommet du classement.
      </p>

      <div class="flex flex-wrap justify-center gap-4 pt-4">
        <RouterLink
          to="/arena"
          id="hero-cta-arena"
          class="px-6 py-3 rounded-lg font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
        >
          Entrer dans l'Ar&egrave;ne
        </RouterLink>
        <RouterLink
          to="/register"
          id="hero-cta-register"
          class="px-6 py-3 rounded-lg font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 transition-all"
        >
          Cr&eacute;er un compte
        </RouterLink>
      </div>
    </div>

    <!-- Feature Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
      <div
        class="bg-slate-900/60 backdrop-blur border border-slate-800 hover:border-cyan-500/40 rounded-xl p-6 transition-all group"
      >
        <div
          class="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl mb-4 group-hover:scale-110 transition-transform"
        >
          &#9876;
        </div>
        <h3 class="text-xl font-bold text-white mb-2">
          3 Classes Strat&eacute;giques
        </h3>
        <p class="text-slate-400 text-sm leading-relaxed">
          Guerrier &eacute;quilibr&eacute;, Tank r&eacute;sistant avec bouclier
          lourd, ou Sniper &agrave; longue port&eacute;e. Chaque unit&eacute;
          dispose de caract&eacute;ristiques pr&eacute;cises.
        </p>
      </div>

      <div
        class="bg-slate-900/60 backdrop-blur border border-slate-800 hover:border-sky-500/40 rounded-xl p-6 transition-all group"
      >
        <div
          class="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-xl mb-4 group-hover:scale-110 transition-transform"
        >
          &#9881;
        </div>
        <h3 class="text-xl font-bold text-white mb-2">
          Ex&eacute;cution Sandbox&eacute;e
        </h3>
        <p class="text-slate-400 text-sm leading-relaxed">
          Vos scripts tournent dans des environnements Docker herm&eacute;tiques
          sans r&eacute;seau, avec des quotas stricts de CPU et de
          m&eacute;moire.
        </p>
      </div>

      <div
        class="bg-slate-900/60 backdrop-blur border border-slate-800 hover:border-indigo-500/40 rounded-xl p-6 transition-all group"
      >
        <div
          class="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xl mb-4 group-hover:scale-110 transition-transform"
        >
          &#127942;
        </div>
        <h3 class="text-xl font-bold text-white mb-2">
          Progression &amp; D&eacute;blocages
        </h3>
        <p class="text-slate-400 text-sm leading-relaxed">
          Accomplissez les missions du mode solo pour d&eacute;bloquer de
          nouvelles classes de robots et affronter les autres joueurs en match
          class&eacute;.
        </p>
      </div>
    </div>
  </div>
</template>
