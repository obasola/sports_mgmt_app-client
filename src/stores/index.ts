// src/infrastructure/store/index.ts
import { createPinia } from "pinia";
import { useCombineScoreStore } from "./combineScore";
import { useDraftPickStore } from "./draftPick";
import { usePlayerStore } from "./player";
import { usePlayerAwardStore } from "./playerAward";
import { useScheduleStore } from "./schedule";
import { useTeamStore } from "./team";

const pinia = createPinia();

export {
  usePlayerStore,
  useTeamStore,
  usePlayerAwardStore,
  useDraftPickStore,
  useCombineScoreStore,
  useScheduleStore
};

export default pinia;
