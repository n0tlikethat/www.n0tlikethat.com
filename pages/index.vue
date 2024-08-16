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
    function: (arg: string) => {
      if (arg) {
        return `Do you mean \`sethostname\`?`;
      }
      return hostname.value;
    },
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
    function: () => [
      "HackerOne: hackerone.com/n0tlikethat",
      "BugCrowd: bugcrowd.com/n0tlikethat",
      "Twitter: @AidanMatzko",
      "LinkedIn: linkedin.com/in/aidan-matzko",
      "Email: hi@n0tlikethat.com"
    ].join("\n"),
    help_text: 'Display links to n0tlikethat profiles',
  },
  {
    command: 'contact',
    function: () => "Reach out to me on Twitter @AidanMatzko or contact hi@n0tlikethat.com",
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
    function: (arg: string) => {
      if (arg === '-l') {
        return `User may run the following commands on this host:
    (ALL) NOPASSWD: /bin/su`;
      }
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
  {
    command: 'su',
    function: (arg1: string) => {
      if (arg1 !== 'root') {
        return 'Authentication failed';
      }
      user.value = 'root';
      return `Password: 
Authentication successful`;
    },
    help_text: 'Switch to superuser',
    hideFromHelp: true,
  },
  {
    command: 'sethostname',
    function: (newHostname: string) => {
      if (!newHostname) {
        return 'Usage: sethostname <new_hostname>';
      }
      hostname.value = newHostname;
      return `Hostname changed to: ${newHostname}`;
    },
    help_text: 'Change the system hostname',
    hideFromHelp: true,
  },
  {
    command: '🏈',
    function: async () => {
      const { games, loading, error, fetchTopGames } = useTopGamesOfWeek();

      await fetchTopGames();

      while (loading.value) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (error.value) {
        console.error('Error fetching games:', error.value);
        return "Sorry, there was an error fetching the games. Please try again later.";
      }
      
      if (games.value.length === 0) {
        return "No games found for this week.";
      }

      // Limit to 5 games
      const topGames = games.value.slice(0, 5);

      // Format the output for each game
      const formattedGames = topGames.map(game => `${game.league.name} - ${game.date} ${game.time}
${game.teams.away.name} vs ${game.teams.home.name}
Status: ${game.status.long}
Venue: ${game.venue.name}, ${game.venue.city}
`).join('\n');

      return formattedGames;
    },
    help_text: 'Display top American football games of the week',
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