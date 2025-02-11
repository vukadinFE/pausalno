import type { FeeType } from "./enums";

export type TData = {
  firma: string;
  akontacijaRacun: string;
  akontacijaBroj: string;
  zdravstvoRacun: string;
  zdravstvoBroj: string;
  pioRacun: string;
  pioBroj: string;
  nezaposlenostRacun: string;
  nezaposlenostBroj: string;
  osnovica: number;
};

export type TState = {
  [FeeType.AKONTACIJA_POREZA]: boolean;
  [FeeType.ZDRAVSTVO]: boolean;
  [FeeType.PIO]: boolean;
  [FeeType.NEZAPOSLENOST]: boolean;
};
