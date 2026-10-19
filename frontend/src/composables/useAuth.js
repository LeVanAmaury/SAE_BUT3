import { ref, computed } from 'vue';

const token = ref(null);
const currentUser = ref(null);

// Initialiser l'état depuis le stockage local
initAuth();

export function decodeJwt(tokenStr) {
  if (!tokenStr || typeof tokenStr !== 'string') return null;
  const parts = tokenStr.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenValid(tokenStr) {
  if (!tokenStr) return false;
  const payload = decodeJwt(tokenStr);
  if (!payload || !payload.exp) return false;

  // exp est en secondes, Date.now() est en millisecondes
  const isExpired = payload.exp * 1000 <= Date.now();
  return !isExpired;
}

export function initAuth() {
  const storedToken = localStorage.getItem('codearena_token');
  const storedUser = localStorage.getItem('codearena_user');

  if (storedToken && isTokenValid(storedToken)) {
    token.value = storedToken;
    if (storedUser) {
      try {
        currentUser.value = JSON.parse(storedUser);
      } catch {
        currentUser.value = null;
      }
    }
  } else {
    // Si le token est absent ou expiré, nettoyer
    clearSession();
  }
}

function clearSession() {
  token.value = null;
  currentUser.value = null;
  localStorage.removeItem('codearena_token');
  localStorage.removeItem('codearena_user');
}

// Synchronisation multi-onglets
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'codearena_token' || event.key === 'codearena_user') {
      initAuth();
    }
  });
}

export function useAuth() {
  const isAuthenticated = computed(() => isTokenValid(token.value));

  async function login(identifier, password) {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de la connexion.');
    }

    token.value = data.token;
    currentUser.value = data.user;
    localStorage.setItem('codearena_token', data.token);
    localStorage.setItem('codearena_user', JSON.stringify(data.user));

    return data;
  }

  async function register(username, email, password) {
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Erreur lors de l'inscription.");
    }

    return data;
  }

  function logout() {
    clearSession();
  }

  return {
    token,
    currentUser,
    isAuthenticated,
    isTokenValid,
    initAuth,
    login,
    register,
    logout,
  };
}
