export interface HomeActivity {
  id: string;
  type: 'trade' | 'scoring' | 'match';
  time: string; // e.g. 'il y a 2h'
  description: string;
  details?: string;
}

export interface HomeTrade {
  id: string;
  date: string;
  teamA: string;
  playersA: string[];
  teamB: string;
  playersB: string[];
}
