<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();
const identifier = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

async function handleLogin() {
  errorMessage.value = '';
  successMessage.value = '';

  if (!identifier.value || !password.value) {
    errorMessage.value =
      'Veuillez renseigner votre identifiant et mot de passe.';
    return;
  }

  isLoading.value = true;
  try {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: identifier.value,
        password: password.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de la connexion.');
    }

    // Save token
    localStorage.setItem('codearena_token', data.token);
    localStorage.setItem('codearena_user', JSON.stringify(data.user));
    successMessage.value = 'Connexion réussie ! Redirection...';

    setTimeout(() => {
      router.push('/arena');
    }, 1000);
  } catch (err) {
    errorMessage.value = err.message || 'Impossible de joindre le serveur.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-md w-full space-y-8 bg-slate-900/80 backdrop-blur border border-slate-800 p-8 rounded-2xl shadow-2xl"
    >
      <!-- Header -->
      <div class="text-center space-y-2">
        <div
          class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-extrabold text-2xl shadow-inner mb-2"
        >
          &gt;_
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-white">
          Connexion &agrave; CodeArena
        </h2>
        <p class="text-sm text-slate-400">
          Entrez vos identifiants pour acc&eacute;der &agrave; votre poste de
          pilotage
        </p>
      </div>

      <!-- Feedback Alerts -->
      <div
        v-if="errorMessage"
        id="login-error-alert"
        class="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2"
      >
        <span class="font-bold">&#9888;</span>
        <span>{{ errorMessage }}</span>
      </div>

      <div
        v-if="successMessage"
        id="login-success-alert"
        class="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2"
      >
        <span class="font-bold">&#10004;</span>
        <span>{{ successMessage }}</span>
      </div>

      <!-- Form -->
      <form class="space-y-5" @submit.prevent="handleLogin">
        <div>
          <label
            for="identifier"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Nom d'utilisateur ou Email
          </label>
          <input
            id="identifier"
            v-model="identifier"
            type="text"
            required
            placeholder="testplayer ou pilote@codearena.io"
            class="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label
              for="password"
              class="block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Mot de passe
            </label>
          </div>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            class="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
          />
        </div>

        <button
          id="btn-login-submit"
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 rounded-lg font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20"
        >
          {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>
      </form>

      <!-- Footer Link -->
      <div
        class="text-center text-sm text-slate-400 pt-2 border-t border-slate-800/80"
      >
        Pas encore de compte ?
        <RouterLink
          to="/register"
          class="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 ml-1"
        >
          S'inscrire
        </RouterLink>
      </div>
    </div>
  </div>
</template>
