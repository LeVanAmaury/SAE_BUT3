<script setup>
import { ref, onMounted } from 'vue';

const canvasRef = ref(null);
const isRunning = ref(false);
const tickRate = ref(60);

const bots = ref([
  {
    id: 1,
    name: 'Alpha-Guerrier',
    class: 'Guerrier',
    hp: 100,
    maxHp: 100,
    shield: 25,
    color: '#38bdf8',
  },
  {
    id: 2,
    name: 'Omega-Tank',
    class: 'Tank',
    hp: 150,
    maxHp: 150,
    shield: 60,
    color: '#a855f7',
  },
]);

const logs = ref([
  {
    time: '00:00.000',
    text: "Initialisation de l'arène tactique CodeArena 2D...",
  },
  {
    time: '00:00.012',
    text: 'Chargement des scripts de combat dans la sandbox Docker...',
  },
  {
    time: '00:00.045',
    text: "Bots prêts au combat. En attente du coup d'envoi.",
  },
]);

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Draw grid & initial tactical board
  drawArena(ctx, canvas.width, canvas.height);
});

function drawArena(ctx, width, height) {
  // Clear
  ctx.fillStyle = '#0b1120';
  ctx.fillRect(0, 0, width, height);

  // Tactical Grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  const gridSize = 40;

  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw demo bot A
  ctx.save();
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(160, 200, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Direction indicator A
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(160, 200);
  ctx.lineTo(190, 200);
  ctx.stroke();

  // Draw demo bot B
  ctx.save();
  ctx.fillStyle = '#a855f7';
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(640, 200, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Direction indicator B
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(640, 200);
  ctx.lineTo(610, 200);
  ctx.stroke();
}

function toggleMatch() {
  isRunning.value = !isRunning.value;
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    text: isRunning.value ? 'Combat démarré.' : 'Combat mis en pause.',
  });
}

function resetMatch() {
  isRunning.value = false;
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    text: 'Arène réinitialisée aux positions initiales.',
  });
}
</script>

<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800"
    >
      <div>
        <h1
          class="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3"
        >
          <span class="inline-block w-3 h-3 rounded-full bg-cyan-400"></span>
          Ar&egrave;ne de Combat 2D
        </h1>
        <p class="text-sm text-slate-400 mt-1">
          Visualisation temps r&eacute;el des affrontements algorithmiques
        </p>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-3">
        <button
          id="btn-arena-toggle"
          @click="toggleMatch"
          class="px-4 py-2 rounded-lg font-semibold text-sm transition-all"
          :class="
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
          "
        >
          {{ isRunning ? '&#10074;&#10074; Pause' : '&#9654; D&eacute;marrer' }}
        </button>
        <button
          id="btn-arena-reset"
          @click="resetMatch"
          class="px-4 py-2 rounded-lg font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
        >
          &#8635; R&eacute;initialiser
        </button>
      </div>
    </div>

    <!-- Arena Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Canvas Area (2 cols) -->
      <div
        class="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col items-center"
      >
        <canvas
          ref="canvasRef"
          width="800"
          height="450"
          id="arena-canvas"
          class="w-full max-w-full h-auto rounded-lg border border-slate-800/80 shadow-inner bg-slate-950"
        ></canvas>

        <div
          class="w-full flex items-center justify-between text-xs text-slate-400 mt-3 px-1"
        >
          <span>Dimensions: 800 x 450 px</span>
          <span class="flex items-center gap-1.5">
            <span
              class="w-2 h-2 rounded-full"
              :class="
                isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
              "
            ></span>
            {{ isRunning ? "En cours d'exécution (60 FPS)" : 'En attente' }}
          </span>
        </div>
      </div>

      <!-- Status Panel (1 col) -->
      <div class="space-y-4">
        <!-- Bot Cards -->
        <div
          class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4"
        >
          <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400">
            Bots engag&eacute;s
          </h2>

          <div
            v-for="bot in bots"
            :key="bot.id"
            class="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2"
          >
            <div class="flex items-center justify-between">
              <span
                class="font-bold text-sm text-white"
                :style="{ color: bot.color }"
                >{{ bot.name }}</span
              >
              <span
                class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium"
                >{{ bot.class }}</span
              >
            </div>

            <!-- Health Bar -->
            <div class="space-y-1">
              <div class="flex justify-between text-xs text-slate-400">
                <span>Sant&eacute;</span>
                <span>{{ bot.hp }} / {{ bot.maxHp }}</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  class="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  :style="{ width: `${(bot.hp / bot.maxHp) * 100}%` }"
                ></div>
              </div>
            </div>

            <!-- Shield Bar -->
            <div class="space-y-1">
              <div class="flex justify-between text-xs text-slate-400">
                <span>Bouclier</span>
                <span>{{ bot.shield }}%</span>
              </div>
              <div
                class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"
              >
                <div
                  class="bg-cyan-400 h-full rounded-full transition-all duration-300"
                  :style="{ width: `${bot.shield}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Terminal Logs -->
        <div
          class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl space-y-2"
        >
          <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400">
            Journal de combat
          </h2>
          <div
            class="bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-300 h-44 overflow-y-auto space-y-1.5 border border-slate-800/80"
          >
            <div
              v-for="(log, idx) in logs"
              :key="idx"
              class="flex gap-2 leading-relaxed"
            >
              <span class="text-cyan-500 select-none">[{{ log.time }}]</span>
              <span>{{ log.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
