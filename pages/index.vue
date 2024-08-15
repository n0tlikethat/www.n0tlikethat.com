<template>
  <TerminalWrapper 
    :commands="commands" 
    :banner="banner" 
    :user="user" 
    :hostname="hostname"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const commands = [
  {
    command: 'whoami',
    function: () => user.value,
    help_text: 'Display the current user'
  },
  {
    command: 'hostname',
    function: () => hostname.value,
    help_text: 'Display the current hostname'
  },
  {
    command: 'date',
    function: () => new Date().toLocaleString(),
    help_text: 'Display the current date and time'
  },
  {
    command: 'fortune',
    function: () => {
      const fortunes = [
        "You will have a great day!",
        "A surprise awaits you.",
        "Your code will compile without errors today.",
        "You will find the bug that's been eluding you.",
        "A pull request will be merged in your favor."
      ];
      return fortunes[Math.floor(Math.random() * fortunes.length)];
    },
    help_text: 'Display a random fortune'
  },
  {
    command: 'echo',
    function: (...args: string[]) => args.join(' '),
    help_text: 'Display a line of text',
    hideFromHelp: true,
  },
  {
    command: 'about',
    function: () => "n0tlikethat brings cutting edge automation to the bug bounty space.",
    help_text: 'Display information about n0tlikethat'
  },
  {
    command: ['links', 'socials'],
    function: () => "HackerOne: hackerone.com/n0tlikethat\nBugCrowd: bugcrowd.com/n0tlikethat\nTwitter: @AidanMatzko",
    help_text: 'Display links to n0tlikethat profiles',
  },
  {
    command: 'contact',
    function: () => "Reach out to me on Twitter @AidanMatzko or contact aidan@n0tlikethat.com",
    help_text: 'Display contact information'
  },
  {
    command: ['fetch', 'wget', 'curl'],
    function: () => {
      const htmlResponses = [
        "<html><body><h1>404 - Page Not Found</h1><p>Oops! Looks like you've stumbled upon the void. Don't worry, it's cozy here.</p></body></html>",
        "<html><body><blink>Welcome to 1996!</blink><marquee>This website is under construction</marquee></body></html>",
        "<html><body><h1>Congratulations!</h1><p>You're the 1,000,000th visitor! Click here to claim your prize: <a href='#'>Definitely Not a Rickroll</a></p></body></html>",
        "<html><body><h1>Error 418 - I'm a teapot</h1><p>I refuse to brew coffee because I'm a teapot. RFC 2324 compliant.</p></body></html>"
      ];
      return htmlResponses[Math.floor(Math.random() * htmlResponses.length)];
    },
    help_text: 'Fetch a random (and humorous) HTML page',
    hideFromHelp: true,
  },
  {
    command: 'sudo',
    function: () => {
      return `
   /\\_/\\
  ( o.o )
   > ^ <

  No sudo for you, human!
      `;
    },
    help_text: 'Attempt to use sudo (with feline consequences)',
    hideFromHelp: true,
  },
];

import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize();
const isMobile = computed(() => width.value < 1200);

const asciiArt = `
                ,a8888a,              88  88  88                             88                                
              ,8P"'  \`"Y8,     ,d     88  ""  88                      ,d     88                         ,d     
             ,8P        Y8,    88     88      88                      88     88                         88     
8b,dPPYba,   88          88  MM88MMM  88  88  88   ,d8   ,adPPYba,  MM88MMM  88,dPPYba,   ,adPPYYba,  MM88MMM  
88P'   \`"8a  88          88    88     88  88  88 ,a8"   a8P_____88    88     88P'    "8a  ""     \`Y8    88     
88       88  \`8b        d8'    88     88  88  8888[     8PP"""""""    88     88       88  ,adPPPPP88    88     
88       88   \`8ba,  ,ad8'     88,    88  88  88\`"Yba,  "8b,   ,aa    88,    88       88  88,    ,88    88,    
88       88     "Y8888P"       "Y888  88  88  88   \`Y8a  \`"Ybbd8"'    "Y888  88       88  \`"8bbdP"Y8    "Y888

`;

const n0tlikethat_banner = computed(() => isMobile.value ? "" : asciiArt);

const banner = computed(() => `${n0tlikethat_banner.value}Welcome to the n0tlikethat terminal. Type "help" to see available commands.`);

const user = ref('guest');
const hostname = ref('localhost');
</script>