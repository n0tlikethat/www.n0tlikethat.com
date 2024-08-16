<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';

interface Command {
  command: string | string[];
  function: (...args: string[]) => Promise<string> | string;
  help_text: string;
  hideFromHelp?: boolean;
}

const props = defineProps<{
  commands: Command[];
  banner?: string;
  user?: string;
  hostname?: string;
}>();

const output = ref<string[]>([]);
const input = ref('');
const terminalRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const terminalContentRef = ref<HTMLDivElement | null>(null);
const commandHistory = ref<string[]>([]);
const historyIndex = ref(-1);

const prompt = computed(() => {
  const user = props.user || 'guest';
  const hostname = props.hostname || 'localhost';
  return `${user}@${hostname}:~$ `;
});

const defaultCommands: Command[] = [
  {
    command: ['help', '?'],
    function: (command?: string) => {
      if (command) {
        const foundCommand = [...defaultCommands, ...props.commands].find(cmd => 
          (Array.isArray(cmd.command) ? cmd.command.includes(command) : cmd.command === command)
        );
        return foundCommand ? foundCommand.help_text : `Command not found: ${command}`;
      }
      return `Available commands: ${[...defaultCommands, ...props.commands]
        .filter(cmd => !cmd.hideFromHelp)
        .flatMap(cmd => Array.isArray(cmd.command) ? cmd.command : [cmd.command])
        .sort()
        .join(', ')}`;
    },
    help_text: 'Display help information for commands'
  },
  {
    command: 'clear',
    function: () => {
      output.value = [];
      if (props.banner) {
        output.value.push(props.banner);
      }
      return '';
    },
    help_text: 'Clear the terminal screen'
  },
  {
    command: 'banner',
    function: () => {
      return props.banner || "";
    },
    help_text: 'Display the terminal banner'
  }
];

const allCommands = [...defaultCommands, ...props.commands];

const executeCommand = async () => {
  const [cmd, ...args] = input.value.trim().split(' ');
  output.value.push(`${prompt.value}${input.value}`);
  
  const foundCommand = allCommands.find(command => 
    Array.isArray(command.command) ? command.command.includes(cmd) : command.command === cmd
  );
  if (foundCommand) {
    const result = foundCommand.function(...args);
    if (result instanceof Promise) {
      input.value = '';
      const res = await result;
      output.value.push(res);
    } else {
      output.value.push(result);
    }
  } else if (cmd !== '') {
    output.value.push(`Command not found: ${cmd}`);
  }

  commandHistory.value.push(input.value);
  historyIndex.value = commandHistory.value.length;
  input.value = '';
  nextTick(() => {
    scrollToBottom();
  });
};

const scrollToBottom = () => {
  if (terminalRef.value) {
    const container = terminalRef.value;
    container.scrollTop = container.scrollHeight;
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (historyIndex.value > 0) {
      historyIndex.value--;
      input.value = commandHistory.value[historyIndex.value];
    }
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++;
      input.value = commandHistory.value[historyIndex.value];
    } else {
      historyIndex.value = commandHistory.value.length;
      input.value = '';
    }
  }
};

onMounted(() => {
  if (props.banner) {
    output.value.push(props.banner);
  }
  if (inputRef.value) {
    inputRef.value.focus();
    inputRef.value.select();
  }
  scrollToBottom();
});

watch(output, () => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<template>
  <v-card class="terminal" ref="terminalRef" elevation="10">
    <v-card-text class="terminal-content" ref="terminalContentRef">
      <div class="terminal-output">
        <pre v-for="(line, index) in output" :key="index" v-html="line"></pre>
      </div>
      <div class="terminal-input">
        <pre class="prompt">{{ prompt }}</pre>
        <v-text-field
          v-model="input"
          @keydown="handleKeyDown"
          @keyup.enter="executeCommand"
          dense
          solo
          ref="inputRef"
          class="terminal-input-field"
          autofocus
          hide-details
          variant="plain"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        ></v-text-field>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.terminal,
.terminal-content,
.terminal-output,
.terminal-input,
.prompt,
.terminal-input-field {
  font-family: monospace, monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #33ff00;
}

.terminal {
  background-color: #2b2b2b;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.terminal-content {
  display: flex;
  flex-direction: column;
  padding: 8px;
  overflow-y: auto;
  flex-grow: 1;
  max-height: 100%;
  scroll-behavior: smooth;
}

.terminal-output pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.terminal-input {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  background-color: #2b2b2b;
}

.prompt {
  white-space: nowrap;
  padding-right: 2px;
}

.terminal-input-field {
  background-color: transparent !important;
  color: #33ff00 !important;
  margin-left: 0;
  padding-left: 6px;
  flex-grow: 1;
}

.terminal-input-field ::v-deep(.v-field__input) {
  color: #33ff00 !important;
  caret-color: #33ff00 !important;
  padding: 0 !important;
  min-height: 0 !important;
  font-size: 14px !important;
}

.terminal-input-field ::v-deep(.v-field__outline) {
  display: none;
}

.terminal-input-field ::v-deep(.v-field__field) {
  padding-bottom: 0 !important;
}
</style>