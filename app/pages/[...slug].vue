<script setup lang="ts">
useSeoMeta({
  title: '404 - Lost in Space'
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div
    class="relative min-h-screen overflow-hidden rounded-3xl text-white flex items-center justify-center px-6"
  >
    <!-- ANIMATED BACKGROUND -->
    <div class="absolute inset-0 animated-bg" />

    <!-- GLOW -->
    <div class="glow glow-1" />
    <div class="glow glow-2" />
    <div class="glow glow-3" />

    <!-- FLOATING SHAPES -->
    <div class="shape shape-1" />
    <div class="shape shape-2" />
    <div class="shape shape-3" />
    <div class="shape shape-4" />

    <!-- CONTENT -->
    <div
      class="relative z-10 max-w-2xl w-full text-center"
    >
      <!-- MASCOT -->
      <div class="mascot-wrap">
        <div class="mascot">
          <div class="eye eye-left" />
          <div class="eye eye-right" />
          <div class="mouth" />
        </div>
      </div>

      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full border-cyan-500/30 bg-cyan-500/10 backdrop-blur-xl text-cyan-300 text-sm mb-6"
      >
        ERROR 404
      </div>

      <h1 class="title">
        Lost in Cyberspace
      </h1>

      <p
        class="mt-5 text-gray-300 text-lg leading-relaxed"
      >
        The page you're looking for
        vanished into the neon void.
      </p>

      <div
        class="mt-10 flex items-center justify-center gap-4 flex-wrap"
      >
        <button
          @click="goBack"
          class="btn-secondary"
        >
          Go Back
        </button>

        <NuxtLink
          to="/"
          class="btn-primary"
        >
          Back to Dashboard
        </NuxtLink>
      </div>
    </div>

    <!-- GRID -->
    <div class="grid-overlay" />
  </div>
</template>

<style scoped>
.animated-bg{
  background:linear-gradient(-45deg,#020617,#0f172a,#111827,#000000);
  background-size:400% 400%;
  animation:bgMove 12s ease infinite;
}

@keyframes bgMove{
  0%{background-position:0% 50%;}
  50%{background-position:100% 50%;}
  100%{background-position:0% 50%;}
}

.glow{
  position:absolute;
  border-radius:999px;
  filter:blur(120px);
  opacity:.45;
}

.glow-1{
  width:300px;
  height:300px;
  background:#06b6d4;
  top:-80px;
  left:-80px;
}

.glow-2{
  width:400px;
  height:400px;
  background:#8b5cf6;
  bottom:-150px;
  right:-100px;
}

.glow-3{
  width:250px;
  height:250px;
  background:#0ea5e9;
  top:40%;
  left:50%;
}

.shape{
  position:absolute;
  border:1px solid rgba(255,255,255,.08);
  backdrop-filter:blur(12px);
  animation:float 8s ease-in-out infinite;
}

.shape-1{
  width:120px;
  height:120px;
  border-radius:24px;
  top:15%;
  left:10%;
  background:rgba(255,255,255,.03);
}

.shape-2{
  width:80px;
  height:80px;
  border-radius:999px;
  top:70%;
  left:20%;
  background:rgba(6,182,212,.08);
  animation-delay:1s;
}

.shape-3{
  width:140px;
  height:140px;
  border-radius:32px;
  right:10%;
  top:20%;
  background:rgba(139,92,246,.08);
  animation-delay:2s;
}

.shape-4{
  width:100px;
  height:100px;
  border-radius:999px;
  right:20%;
  bottom:10%;
  background:rgba(14,165,233,.08);
  animation-delay:3s;
}

@keyframes float{
  0%,100%{
    transform:translateY(0px) rotate(0deg);
  }
  50%{
    transform:translateY(-20px) rotate(8deg);
  }
}

.title{
  font-size:clamp(48px,8vw,88px);
  font-weight:900;
  line-height:1;
  letter-spacing:-.04em;
  background:linear-gradient(to right,#67e8f9,#a78bfa,#ffffff);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  text-shadow:0 0 30px rgba(103,232,249,.25);
}

.btn-primary{
  @apply inline-flex items-center justify-center h-14 px-7 rounded-2xl font-semibold transition-all duration-300;
  background:linear-gradient(to right,#06b6d4,#8b5cf6);
  box-shadow:0 0 25px rgba(139,92,246,.35);
}

.btn-primary:hover{
  transform:translateY(-2px) scale(1.02);
}

.btn-secondary{
  @apply h-14 px-7 rounded-2xl font-semibold border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300;
}

.btn-secondary:hover{
  background:rgba(255,255,255,.08);
}

.grid-overlay{
  position:absolute;
  inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size:40px 40px;
  mask-image:radial-gradient(circle at center,black,transparent 90%);
}

.mascot-wrap{
  display:flex;
  justify-content:center;
  margin-bottom:32px;
}

.mascot{
  width:120px;
  height:120px;
  border-radius:32px;
  position:relative;
  background:linear-gradient(135deg,#06b6d4,#8b5cf6);
  box-shadow:
    0 0 40px rgba(6,182,212,.45),
    0 0 80px rgba(139,92,246,.25);
  animation:float 5s ease-in-out infinite;
}

.eye{
  width:14px;
  height:14px;
  border-radius:999px;
  background:white;
  position:absolute;
  top:42px;
}

.eye-left{
  left:34px;
}

.eye-right{
  right:34px;
}

.mouth{
  width:42px;
  height:8px;
  border-radius:999px;
  background:white;
  position:absolute;
  bottom:32px;
  left:50%;
  transform:translateX(-50%);
}
</style>