interface ISettings {
  relays?: {
    [id: number]: {
      conditions: {
        [name: string]: ICondition
      }
    }
  }
}

interface ICondition {
  enabled: boolean;
  value: number | null;
}