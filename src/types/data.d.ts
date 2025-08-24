declare module "../../data/players.json" {
  interface Player {
    id: string;
    name: string;
    position: string;
    category: string;
    rating: number;
    club: string;
    nationality: string;
  }

  interface PlayersData {
    players: Player[];
  }

  const data: PlayersData;
  export default data;
}

declare module "../../data/formations.json" {
  interface Formation {
    id: string;
    name: string;
    shape: string;
    description: string;
    positions: Array<{
      position: string;
      x: number;
      y: number;
      category: string;
    }>;
  }

  interface FormationsData {
    formations: Formation[];
  }

  const data: FormationsData;
  export default data;
}
