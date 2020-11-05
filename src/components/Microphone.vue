<template>
  <div align="center">
    <Camera :id="mic.id" :active="false" />
    <v-icon style="font-size: 5em" :class="{ active: mic.active }"
      >mdi-microphone</v-icon
    >
    <p>{{ mic.name }}</p>

    <v-progress-circular
      :rotate="360"
      :size="55"
      :width="15"
      :value="getLevel()"
      color="teal"
    >
      {{ getLevel() }}
    </v-progress-circular>
  </div>
</template>

<script>
import ArduinoHelper from "../plugins/vue-arduino-helper";
import Camera from "./Camera";

export default {
  components: {
    Camera,
  },
  props: {
    mic: Object,
  },
  data: function () {
    return {
      level: 10,
    };
  },
  methods: {
    setLevel: function (level) {
      this.level = level;
    },
    getLevel() {
      return this.level;
    },
  },
  mounted() {
    ArduinoHelper.on("arduino.levels", (level, levelData) => {
      this.setLevel(
        Math.ceil(
          (100 / parseInt(levelData["samples"])) *
            parseInt(levelData["INP" + this.mic.id])
        )
      );
    });
  },
};
</script>