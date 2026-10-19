<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

async function handleRegister() {
  errorMessage.value = '';
  successMessage.value = '';

  if (
    !username.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = 'Tous les champs sont requis.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.';
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value =
      'Le mot de passe doit comporter au moins 6 caractères.';
    return;
  }

  isLoading.value = true;
  try {
    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erreur lors de l'inscription.");
    }

    successMessage.value =
      'Compte créé avec succès ! Redirection vers la page de connexion...';

    setTimeout(() => {
      router.push('/login');
    }, 1200);
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
          &#128737;
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-white">
          Cr&eacute;er un compte Pilote
        </h2>
        <p class="text-sm text-slate-400">
          Rejoignez l'ar&egrave;ne et commencez &agrave; coder vos bots de
          combat
        </p>
      </div>

      <!-- Feedback Alerts -->
      <div
        v-if="errorMessage"
        id="register-error-alert"
        class="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2"
      >
        <span class="font-bold">&#9888;</span>
        <span>{{ errorMessage }}</span>
      </div>

      <div
        v-if="successMessage"
        id="register-success-alert"
        class="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2"
      >
        <span class="font-bold">&#10004;</span>
        <span>{{ successMessage }}</span>
      </div>

      <!-- Form -->
      <form class="space-y-4" @submit.prevent="handleRegister">
        <div>
          <label
            for="reg-username"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Nom d'utilisateur
          </label>
          <input
            id="reg-username"
            v-model="username"
            type="text"
            required
            placeholder="CyberPilot42"
            class="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
          />
        </div>

        <div>
          <label
            for="reg-email"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Adresse Email
          </label>
          <input
            id="reg-email"
            v-model="email"
            type="email"
            required
            placeholder="pilote@codearena.io"
            class="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
          />
        </div>

        <div>
          <label
            for="reg-password"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Mot de passe
          </label>
          <input
            id="reg-password"
            v-model="password"
            type="password"
            required
            placeholder="Minimum 6 caractères"
            class="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
          />
        </div>

        <div>
          <label
            for="reg-confirm-password"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Confirmer le mot de passe
          </label>
          <input
            id="reg-confirm-password"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="Confirmez votre mot de passe"
            class="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
          />
        </div>

        <button
          id="btn-register-submit"
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 rounded-lg font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20 mt-2"
        >
          {{ isLoading ? 'Création du compte...' : "S'inscrire" }}
        </button>
      </form>

      <!-- Footer Link -->
      <div
        class="text-center text-sm text-slate-400 pt-2 border-t border-slate-800/80"
      >
        D&eacute;j&agrave; un compte ?
        <RouterLink
          to="/login"
          class="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 ml-1"
        >
          Se connecter
        </RouterLink>
      </div>
    </div>
  </div>
</template>
