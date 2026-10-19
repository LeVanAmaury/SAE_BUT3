<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useAuth } from './composables/useAuth.js';

const router = useRouter();
const { currentUser, logout } = useAuth();

function handleLogout() {
  logout();
  router.push('/login');
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950"
  >
    <!-- Navigation Header -->
    <header
      class="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Brand -->
          <div class="flex items-center gap-8">
            <RouterLink to="/" class="flex items-center gap-3 group">
              <div
                class="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform"
              >
                CA
              </div>
              <div class="flex flex-col">
                <span class="font-extrabold text-lg tracking-wider text-white"
                  >CODE<span class="text-cyan-400">ARENA</span></span
                >
                <span
                  class="text-[10px] uppercase font-mono tracking-widest text-slate-400 -mt-1"
                  >Tactical 2D</span
                >
              </div>
            </RouterLink>

            <!-- Nav Links -->
            <nav class="hidden md:flex items-center gap-1">
              <RouterLink
                to="/"
                class="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                active-class="text-cyan-400 bg-slate-900/90 font-semibold"
              >
                Accueil
              </RouterLink>
              <RouterLink
                to="/arena"
                class="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                active-class="text-cyan-400 bg-slate-900/90 font-semibold"
              >
                Ar&egrave;ne
              </RouterLink>
            </nav>
          </div>

          <!-- Auth Actions -->
          <div class="flex items-center gap-3">
            <template v-if="currentUser">
              <span class="text-sm font-medium text-slate-300 hidden sm:inline">
                Pilote :
                <span class="text-cyan-400 font-semibold">{{
                  currentUser.username
                }}</span>
              </span>
              <button
                @click="handleLogout"
                class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-800/50 transition-all"
              >
                D&eacute;connexion
              </button>
            </template>
            <template v-else>
              <RouterLink
                to="/login"
                id="nav-login"
                class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
              >
                Connexion
              </RouterLink>
              <RouterLink
                to="/register"
                id="nav-register"
                class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-md shadow-cyan-500/20 transition-all"
              >
                Inscription
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer
      class="border-t border-slate-900 bg-slate-950/60 py-6 text-xs text-slate-500 text-center"
    >
      <div
        class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div>
          &copy; 2026 CodeArena &bull; SA&Eacute; BUT3 Informatique &bull; Tous
          droits r&eacute;serv&eacute;s
        </div>
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1.5 text-slate-400">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            PostgreSQL: Pr&ecirc;t
          </span>
          <span class="flex items-center gap-1.5 text-slate-400">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            Docker Sandbox: S&eacute;curis&eacute;e
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>
