import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ArenaView from '../views/ArenaView.vue';
import { isTokenValid, useAuth } from '../composables/useAuth.js';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/arena',
    name: 'Arena',
    component: ArenaView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Garde de navigation : Bloque l'accès aux pages internes si le jeton est absent ou expiré
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('codearena_token');
  const hasValidToken = isTokenValid(token);

  if (to.meta.requiresAuth && !hasValidToken) {
    const { logout } = useAuth();
    logout();
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if ((to.name === 'Login' || to.name === 'Register') && hasValidToken) {
    // Si l'utilisateur est déjà connecté avec un jeton valide, rediriger vers l'arène
    next({ name: 'Arena' });
  } else {
    next();
  }
});

export default router;

