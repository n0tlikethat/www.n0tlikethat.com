<template>
  <div class="computer-wrapper">
    <div class="monitor-frame">
      <div class="monitor-screen">
        <TerminalComponent 
          :commands="commands" 
          :banner="banner" 
          :user="user" 
          :hostname="hostname"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps<{
  commands: Array<any>;
  banner: string;
  user: string;
  hostname: string;
}>();

const { commands, banner, user, hostname } = toRefs(props);
</script>

<style scoped>
.computer-wrapper {
  background-color: #2B2B2B;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

.monitor-frame {
  background-color: #5E4B3B;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 
    inset 0 0 10px rgba(0, 0, 0, 0.7),
    0 0 25px rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 90vh;
  position: relative;
  overflow: hidden;
}

.monitor-screen {
  position: relative;
  overflow: hidden;
  background-color: #1A1A1A;
  height: 100%;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.monitor-frame::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(45deg, 
      rgba(94, 75, 59, 0.1), 
      rgba(107, 142, 35, 0.05), 
      rgba(210, 105, 30, 0.05)
    );
  pointer-events: none;
}

.monitor-screen::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(
      rgba(26, 26, 26, 0) 50%, 
      rgba(94, 75, 59, 0.1) 50%
    ),
    radial-gradient(
      circle at center,
      rgba(26, 26, 26, 0) 50%,
      rgba(94, 75, 59, 0.1) 100%
    );
  background-size: 100% 2px, 100% 100%;
  pointer-events: none;
  z-index: 1;
}

.monitor-frame::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 2%;
  right: 2%;
  height: 20px;
  background-color: #4A3B2B;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.monitor-frame::before {
  content: "";
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background-color: #CD853F;
  border-radius: 50%;
  box-shadow: -10px 0 0 #556B2F, 10px 0 0 #8B4513;
  z-index: 2;
}

@media (min-width: 768px) {
  .computer-wrapper {
    padding: 40px;
  }

  .monitor-frame {
    border-radius: 20px;
    padding: 40px;
    box-shadow: 
      inset 0 0 15px rgba(0, 0, 0, 0.7),
      0 0 50px rgba(0, 0, 0, 0.5);
    max-width: 1500px;
    aspect-ratio: 4 / 3;
    height: auto;
    max-height: 85vh;
  }

  .monitor-frame::after {
    left: 5%;
    right: 5%;
    height: 40px;
    border-radius: 0 0 20px 20px;
  }

  .monitor-frame::before {
    top: 15px;
    width: 12px;
    height: 12px;
    box-shadow: -20px 0 0 #556B2F, 20px 0 0 #8B4513;
  }
}
</style>
