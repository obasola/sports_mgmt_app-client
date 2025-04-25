<template>
  <div class="draft-tracker-container" style="background-color: black; color: white; min-height: 100vh; padding: 20px;">
    <h1 class="text-center mb-4">Track the Draft</h1>
    <h3 class="text-center mb-5">
      <strong>Select Your Team(s)</strong> + Select Round
      <select v-model="currentRound" class="rounded ml-2 px-2 py-1 text-black">
        <option v-for="round in 7" :key="round" :value="round">{{ round }}</option>
      </select>
    </h3>

    <div style="display: flex; flex-direction: row; justify-content: space-between;">
      <!-- Left side container for conferences -->
      <div style="padding-left: 0.5em; width: 50%;">
        <div style="display: flex; flex-direction: row; gap: 0.9em;">

          <!-- AFC Teams Container -->
          <div style="width: 48%;">
            <div class="conference-container rounded p-3 mb-4">
              <div
                class="conference-header bg-primary text-white p-2 rounded mb-3 d-flex align-items-center justify-content-center">
                <div class="conference-logo mr-2 bg-white text-primary">AFC</div>
              </div>

              <div class="teams-grid">
                <!-- AFC Teams in alphabetical order -->
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('BAL') }" @click="toggleTeamSelection('BAL')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.BAL }">BAL</div>
                  <img src="@/assets/images/afc/Ravens.avif" alt="Ravens" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('BUF') }" @click="toggleTeamSelection('BUF')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.BUF }">BUF</div>
                  <img src="@/assets/images/afc/Bills.avif" alt="Ravens" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('CIN') }" @click="toggleTeamSelection('CIN')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.CIN }">CIN</div>
                  <img src="@/assets/images/afc/Bengals.avif" alt="Bengals" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('CLE') }" @click="toggleTeamSelection('CLE')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.CLE }">CLE</div>
                  <img src="@/assets/images/afc/Browns.avif" alt="Browns" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('DEN') }" @click="toggleTeamSelection('DEN')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.DEN }">DEN</div>
                  <img src="@/assets/images/afc/Broncos.avif" alt="Broncos" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('HOU') }" @click="toggleTeamSelection('HOU')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.HOU }">HOU</div>
                  <img src="@/assets/images/afc/Texans.avif" alt="Texans" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('IND') }" @click="toggleTeamSelection('IND')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.IND }">IND</div>
                  <img src="@/assets/images/afc/Colts.avif" alt="Colts" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('JAX') }" @click="toggleTeamSelection('JAX')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.JAX }">JAX</div>
                  <img src="@/assets/images/afc/Jaguars.avif" alt="Jaguars" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('KC') }" @click="toggleTeamSelection('KC')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.KC }">KC</div>
                  <img src="@/assets/images/afc/Chiefs.avif" alt="Chiefs" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('LAC') }" @click="toggleTeamSelection('LAC')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.LAC }">LAC</div>
                  <img src="@/assets/images/afc/Chargers.webp" alt="Ravens" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('LV') }" @click="toggleTeamSelection('LV')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.LV }">LV</div>
                  <img src="@/assets/images/afc/Raiders.avif" alt="Raiders" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('MIA') }" @click="toggleTeamSelection('MIA')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.MIA }">MIA</div>
                  <img src="@/assets/images/afc/Dolphins.avif" alt="Dolphins" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('NE') }" @click="toggleTeamSelection('NE')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.NE }">NE</div>
                  <img src="@/assets/images/afc/Patriots.avif" alt="Patriots" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('NYJ') }" @click="toggleTeamSelection('NYJ')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.NYJ }">NYJ</div>
                  <img src="@/assets/images/afc/Jets.avif" alt="Jets" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('PIT') }" @click="toggleTeamSelection('PIT')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.PIT }">PIT</div>
                  <img src="@/assets/images/afc/Steelers.avif" alt="Steelers" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('TEN') }" @click="toggleTeamSelection('TEN')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.TEN }">TEN</div>
                  <img src="@/assets/images/afc/Titans.avif" alt="Titans" class="team-logo-img" />
                </div>
              </div>
            </div>
          </div>

          <!-- NFC Teams Container -->
          <div style="width: 48%;">
            <div class="conference-container rounded p-3 mb-4">
              <div
                class="conference-header bg-primary text-white p-2 rounded mb-3 d-flex align-items-center justify-content-center">
                <div class="conference-logo mr-2 bg-white text-primary">NFC</div>
                
              </div>

              <div class="teams-grid">
                <!-- NFC Teams in alphabetical order -->
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('ARI') }" @click="toggleTeamSelection('ARI')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.ARI }">ARI</div>
                  <img src="@/assets/images/nfc/Cardinals.avif" alt="Cardinals" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('ATL') }" @click="toggleTeamSelection('ATL')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.ATL }">ATL</div>
                  <img src="@/assets/images/nfc/Falcons.avif" alt="Falcons" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('CAR') }" @click="toggleTeamSelection('CAR')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.CAR }">CAR</div>
                  <img src="@/assets/images/nfc/Panthers.avif" alt="Panthers" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('CHI') }" @click="toggleTeamSelection('CHI')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.CHI }">CHI</div>
                  <img src="@/assets/images/nfc/Bears.avif" alt="Bears" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('DAL') }" @click="toggleTeamSelection('DAL')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.DAL }">DAL</div>
                  <img src="@/assets/images/nfc/Cowboys.avif" alt="Cowboys" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('DET') }" @click="toggleTeamSelection('DET')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.DET }">DET</div>
                  <img src="@/assets/images/nfc/Lions.avif" alt="Lions" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('GB') }" @click="toggleTeamSelection('GB')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.GB }">GB</div>
                  <img src="@/assets/images/nfc/Packers.avif" alt="Packers" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('LAR') }" @click="toggleTeamSelection('LAR')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.LAR }">LAR</div>
                  <img src="@/assets/images/nfc/Rams.avif" alt="Rams" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('MIN') }" @click="toggleTeamSelection('MIN')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.MIN }">MIN</div>
                  <img src="@/assets/images/nfc/Vikings.avif" alt="Vikings" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('NO') }" @click="toggleTeamSelection('NO')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.NO }">NO</div>
                  <img src="@/assets/images/nfc/Saints.avif" alt="Saints" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('NYG') }" @click="toggleTeamSelection('NYG')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.NYG }">NYG</div>
                  <img src="@/assets/images/nfc/Giants.avif" alt="Giants" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('PHI') }" @click="toggleTeamSelection('PHI')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.PHI }">PHI</div>
                  <img src="@/assets/images/nfc/Eagles.avif" alt="Eagles" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('SEA') }" @click="toggleTeamSelection('SEA')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.SEA }">SEA</div>
                  <img src="@/assets/images/nfc/Seahawks.avif" alt="Seahawks" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('SF') }" @click="toggleTeamSelection('SF')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.SF }">SF</div>
                  <img src="@/assets/images/nfc/49ers.avif" alt="49ers" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('TB') }" @click="toggleTeamSelection('TB')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.TB }">TB</div>
                  <img src="@/assets/images/nfc/Buccaneers.avif" alt="Buccaneers" class="team-logo-img" />
                </div>
                <div class="team-item d-flex align-items-center justify-content-center p-2 rounded border"
                  :class="{ 'selected': selectedTeams.includes('WAS') }" @click="toggleTeamSelection('WAS')">
                  <div class="team-image" :style="{ backgroundColor: teamColors.WAS }">WAS</div>
                  <img src="@/assets/images/nfc/Washington.avif" alt="Washington" class="team-logo-img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side container for draft settings -->
      <div style="width: 45%; padding-right: 0.5em;">
        <div class="draft-settings rounded p-3">
          <div
            class="settings-header bg-secondary text-white p-2 rounded mb-3 d-flex align-items-center justify-content-center">
            <h5 class="mb-0">Draft Settings</h5>
          </div>

          <div class="mb-3">
            <p class="mb-2">Select Draft Speed</p>

            <div class="d-flex flex-column">
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="draftSpeed" id="slowSpeed" value="slow">
                <label class="form-check-label" for="slowSpeed">
                  Slow
                </label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="draftSpeed" id="normalSpeed" value="normal" checked>
                <label class="form-check-label" for="normalSpeed">
                  Normal
                </label>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="radio" name="draftSpeed" id="fastSpeed" value="fast">
                <label class="form-check-label" for="fastSpeed">
                  Fast
                </label>
              </div>
            </div>
          </div>

          <button class="btn btn-success mt-3" style="width: 95%;" @click="submitTeamSelection">
            Enter Solo Draft
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'TeamSelectionView',
  setup() {
    const router = useRouter();

    // We'll use abbreviated team codes as IDs for simplicity
    const selectedTeams = ref<string[]>([]);
    const currentRound = ref<number>(1);

    // Team colors mapping
    const teamColors = {
      ARI: '#97233F', ATL: '#A71930', BAL: '#241773', BUF: '#00338D',
      CAR: '#0085CA', CHI: '#0B162A', CIN: '#FB4F14', CLE: '#FF3C00',
      DAL: '#002244', DEN: '#FB4F14', DET: '#0076B6', GB: '#203731',
      HOU: '#03202F', IND: '#002C5F', JAX: '#006778', KC: '#E31837',
      LAC: '#0080C6', LAR: '#003594', LV: '#000000', MIA: '#008E97',
      MIN: '#4F2683', NE: '#002244', NO: '#D3BC8D', NYG: '#0B2265',
      NYJ: '#125740', PHI: '#004C54', PIT: '#FFB612', SF: '#AA0000',
      SEA: '#002244', TB: '#D50A0A', TEN: '#0C2340', WAS: '#773141'
    };

    const toggleTeamSelection = (teamCode: string) => {
      const index = selectedTeams.value.indexOf(teamCode);
      if (index === -1) {
        selectedTeams.value.push(teamCode);
      } else {
        selectedTeams.value.splice(index, 1);
      }
    };

    const submitTeamSelection = () => {
      // Save selection to localStorage for persistence
      localStorage.setItem('selectedTeams', JSON.stringify(selectedTeams.value));
      localStorage.setItem('currentRound', currentRound.value.toString());

      // Navigate to draft tracker
      router.push('/draft-tracker');
    };

    return {
      selectedTeams,
      currentRound,
      teamColors,
      toggleTeamSelection,
      submitTeamSelection
    };
  }
});
</script>

<style scoped>
.conference-container,
.draft-settings {
  background-color: #222;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  height: 100%;
  border-radius: 10px;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.team-item {
  cursor: pointer;
  transition: all 0.2s;
  background-color: #333;
  height: 50px;
  width: 100%;
  border-radius: 8px;
}

.team-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.team-item.selected {
  background-color: #28a745;
  color: white;
}

.team-image {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  font-size: 0.75rem;
}

.conference-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-weight: bold;
}

.form-check-input {
  background-color: #333;
  border-color: #666;
}

.form-check-input:checked {
  background-color: #28a745;
  border-color: #28a745;
}

.settings-header {
  border-radius: 8px;
}

.team-logo-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-left: 10px;
}

.team-item {
  cursor: pointer;
  transition: all 0.2s;
  background-color: #333;
  height: 50px;
  width: 100%;
  border-radius: 8px;
  display: flex;
  justify-content: flex-start;
  /* Align items to the left side */
  align-items: center;
  padding: 0 10px;
}
</style>