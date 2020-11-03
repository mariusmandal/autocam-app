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
                <v-col>
                  <div align="center">
                    <Camera :id="getTotalId()" />
                    <v-icon style="font-size: 3em">mdi-account-group</v-icon>
                    <v-badge :content="getTotalId()"></v-badge>
                    <p>Total</p>
                  </div>
                </v-col>
              </v-row>

              <v-row class="mt-5">
                <v-col class="ml-8">
                  <b>VIDEOMIKSER</b>
                  <v-list>
                    <v-list-item>
                      <b>IP:</b> 192.168.1.1
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col class="mr-8">
                  <b>LOGG</b>
                  <v-list>
                    <v-list-item v-for="(line, index) in getLog()" :key="index">
                      <v-icon class="mr-2">mdi-{{ line.icon }}</v-icon> &nbsp;
                      {{ line.message }}
                    </v-list-item>
                  </v-list>
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
                  <SettingSlider
                    name="Gain"
                    setting="arduino.gain"
                    :min="0"
                    :max="4"
                  />
                </v-col>
              </v-row>

              <v-row class="mt-3">
                <v-col>
                  <SettingSlider
                    name="Threshold"
                    setting="arduino.threshold"
                    :min="0"
                    :max="20"
                  />
                </v-col>
              </v-row>

              <v-row class="mt-3">
                <v-col>
                  <SettingSlider
                    name="Total-kamera"
                    setting="arduino.total"
                    :min="1"
                    :max="8"
                    :current="getTotalId()"
                    prefixValue="Input "
                  />
                </v-col>
              </v-row>

              <v-spacer />

              <v-row>
                <v-col class="mt-8" align="right" @click="status">
                  <v-icon>mdi-magnify</v-icon>
                  status
                </v-col>
                <v-col class="mt-8" align="right" @click="restart">
                  restart <v-icon>mdi-restart</v-icon>
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
import Camera from "./components/Camera";
import Microphone from "./components/Microphone";
import Ports from "./components/Ports";
import SettingSlider from "./components/SettingSlider";
import ArduinoHelper from "./plugins/vue-arduino-helper";

const logHelper = [
  {
    trigger: 'arduino.gain',
    icon: 'microphone-settings',
    message: 'Satte gain til %data'
  },
  {
    trigger: 'arduino.threshold',
    icon: 'speedometer',
    message: 'Satte threshold til %data'
  },
  {
    trigger: 'arduino.total',
    icon: 'account-group',
    message: 'Satte total-kamera til input %data'
  },
  {
    trigger: 'arduino.restart',
    icon: 'restart',
    message: 'Ba arduino om å restarte'
  },
  {
    trigger: 'arduino.inputs',
    icon: 'microphone',
    message: 'Satte antall mikrofoner til %data'
  }
];

export default {
  name: "App",

  components: {
    Camera,
    Ports,
    Microphone,
    SettingSlider,
  },

  data: () => {
    return {
      arduino_ready: false,
      total_id: 4,
      microphones: [
        { id: 1, name: "Mikrofon 1", active: false },
        { id: 2, name: "Mikrofon 2", active: false },
        { id: 3, name: "Mikrofon 3", active: false },
      ],
      log_elements: [],
      max_log_elements: 6,
    };
  },
  methods: {
    getTotalId() {
      return this.total_id;
    },
    addMic() {
      if (this.microphones.length > 3) {
        return alert("Beklager, kan ikke legge til flere mikrofoner.");
      }
      this.microphones.push({
        id: this.microphones.length + 1,
        name: "Mikrofon " + (this.microphones.length + 1),
      });
      ArduinoHelper.send("arduino.inputs", this.microphones.length);
    },
    removeMic() {
      if (this.microphones.length < 3) {
        return alert("Beklager, må ha minst to mikrofoner");
      }
      this.microphones.pop();
      ArduinoHelper.send("arduino.inputs", this.microphones.length);
    },
    restart() {
      let sure = confirm("Er du sikker på at du vil restarte?");
      if (sure) {
        ArduinoHelper.send("arduino.restart");
        return true;
      }
      return false;
    },
    status() {
      ArduinoHelper.send("arduino.status");
    },
    getLog() {
      return this.log_elements;
    },
    log(icon, message) {
      this.log_elements.unshift({ icon, message });
      if (this.log_elements.length > this.max_log_elements) {
        this.log_elements = this.log_elements.slice(0, this.max_log_elements);
      }
    },
  },
  mounted() {
    ArduinoHelper.on("arduino.open", (event, state) => {
      this.arduino_ready = state;
    });

    ArduinoHelper.on("arduino.close", (event, state) => {
      this.arduino_ready = false;
    });

    ArduinoHelper.on("arduino.cut", (event, data) => {
      this.log("camera", data.input + ": " + data.reason);
    });

    logHelper.forEach( (action) => {
      ArduinoHelper.on(action.trigger, (event, data) => {
        this.log(action.icon, action.message.replace('%data', data));
      });
    });

    ArduinoHelper.on("arduino.total", (event, data) => {
      this.total_id = parseInt(data);
    });
  },
};
</script>
