import { ref } from 'vue';

const API_KEY = '710e3f9d62bda20086d4c44085b67999';
const BASE_URL = 'https://v1.american-football.api-sports.io/';

interface Game {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  status: {
    short: string;
    long: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  league: {
    id: number;
    name: string;
    season: string;
    logo: string;
  };
  scores: {
    home: {
      quarter_1: number | null;
      quarter_2: number | null;
      quarter_3: number | null;
      quarter_4: number | null;
      overtime: number | null;
      total: number | null;
    };
    away: {
      quarter_1: number | null;
      quarter_2: number | null;
      quarter_3: number | null;
      quarter_4: number | null;
      overtime: number | null;
      total: number | null;
    };
  };
  venue: {
    name: string | null;
    city: string | null;
  };
}

export function useTopGamesOfWeek() {
  const games: Ref<Game[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTopGames = async () => {
    loading.value = true;
    error.value = null;

    try {
      // const today = new Date().toISOString().split('T')[0];
      const url = `${BASE_URL}games?season=2024&league=1`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'v1.american-football.api-sports.io',
          'x-rapidapi-key': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: any = await response.json();

      games.value = data.response.map((item: any) => ({
        id: item.game.id,
        date: item.game.date.date,
        time: item.game.date.time,
        timestamp: item.game.date.timestamp,
        status: {
          short: item.game.status.short,
          long: item.game.status.long,
        },
        teams: {
          home: {
            id: item.teams.home.id,
            name: item.teams.home.name,
            logo: item.teams.home.logo,
          },
          away: {
            id: item.teams.away.id,
            name: item.teams.away.name,
            logo: item.teams.away.logo,
          },
        },
        league: {
          id: item.league.id,
          name: item.league.name,
          season: item.league.season,
          logo: item.league.logo,
        },
        scores: {
          home: {
            quarter_1: item.scores.home.quarter_1,
            quarter_2: item.scores.home.quarter_2,
            quarter_3: item.scores.home.quarter_3,
            quarter_4: item.scores.home.quarter_4,
            overtime: item.scores.home.overtime,
            total: item.scores.home.total,
          },
          away: {
            quarter_1: item.scores.away.quarter_1,
            quarter_2: item.scores.away.quarter_2,
            quarter_3: item.scores.away.quarter_3,
            quarter_4: item.scores.away.quarter_4,
            overtime: item.scores.away.overtime,
            total: item.scores.away.total,
          },
        },
        venue: {
          name: item.game.venue.name,
          city: item.game.venue.city,
        },
      }));

      // Remove games before today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      games.value = games.value.filter(game => new Date(game.date) >= today);

      // Sort games by timestamp (most recent first)
      games.value.sort((a, b) => a.timestamp - b.timestamp);
    } catch (err) {
      console.error('Error fetching top games:', err);
      error.value = 'Failed to fetch top games. Please try again later.';
    } finally {
      loading.value = false;
    }
  };

  return {
    games,
    loading,
    error,
    fetchTopGames
  };
}
