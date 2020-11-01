<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-icon class="shrink mr-2" transition="scale-transition" width="40"
          >mdi-video</v-icon
        >

        <h2>Autocam</h2>
      </div>

      <v-spacer></v-spacer>
      <Ports />
    </v-app-bar>

    <v-main>
      <v-container fluid v-if="arduino_ready">
        <v-row style="height: calc(100vh - 1rem - 64px;">
          <v-col cols="10">
            <v-container fluid class="ma-0 pa-0">
              <v-row>
                <v-col v-for="mic in microphones" :key="mic.id">
                  <Microphone :mic="mic" />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="2" class="settings">
            <v-container fluid class="ma-0 pa-0">
              <v-row>
                <v-col class="microphones">
                  <v-icon style="vertical-align: top" @click="addMic"
                    >mdi-microphone-plus</v-icon
                  >
                  <span class="separator">/</span>
                  <v-icon
                    style="vertical-align: bottom; margin-bottom: -0.1em"
                    @click="removeMic"
                    >mdi-microphone-minus</v-icon
                  >
                </v-col>
              </v-row>
              <v-row class="mt-4">
                <v-col id="settingsHeader">
                  <b>INNSTILLINGER</b>
                </v-col>
              </v-row>
              
              <v-row class="mt-4">
                <v-col>
                  <SettingSlider name="Gain" :min="0" :max="4" />
                </v-col>
              </v-row>
              
              <v-row class="mt-3">
                <v-col>
                  <SettingSlider name="Threshold" :min="0" :max="20" />
                </v-col>
              </v-row>

              <v-row class="mt-3">
                <v-col>
                  <SettingSlider name="Total-kamera" :min="1" :max="8" prefixValue="Input " />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else>
        <h1>Velg port</h1>
        <p>Før du kan starte, må du velge arduino-porten oppe til høyre</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
#settingsHeader {
  background: #1eb980;
  color: #fff;
}
.settings {
  border-left: 2px solid #1eb980;
  text-align: center;
}
.settings .microphones .v-icon {
  font-size: 3em;
}
.settings .microphones .separator {
  font-size: 7em;
  line-height: 0.8em;
  color: #045d56;
}
</style>

<script>
import Microphone from "./components/Microphone";
import Ports from "./components/Ports";
import SettingSlider from './components/SettingSlider';
import electron from "electron";

export default {
  name: "App",

  components: {
    Ports,
    Microphone,
    SettingSlider
  },

  data: () => {
    return {
      arduino_ready: true,
      microphones: [
        { id: 1, name: "Mikrofon 1" },
        { id: 2, name: "Mikrofon 2" },
        { id: 3, name: "Mikrofon 3" },
        { id: 4, name: "Mikrofon 4" },
      ],
    };
  },
  methods: {
    addMic() {
      if (this.microphones.length > 3) {
        return alert("Beklager, kan ikke legge til flere mikrofoner.");
      }
      this.microphones.push({
        id: this.microphones.length + 1,
        name: "Mikrofon " + (this.microphones.length + 1),
      });
    },
    removeMic() {
      if (this.microphones.length < 3) {
        return alert("Beklager, må ha minst to mikrofoner");
      }
      this.microphones.pop();
    },
  },
  mounted() {
    electron.ipcRenderer.on("arduino.ready", (event, state) => {
      this.arduino_ready = state;
    });
  },
};
</script>
