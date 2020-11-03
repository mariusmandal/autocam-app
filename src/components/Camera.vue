<template>
  <div class="mb-3" align="center">
    <v-icon style="font-size: 1.5em" :class="{ active }">mdi-camera</v-icon>
  </div>
</template>

<script>
import ArduinoHelper from "../plugins/vue-arduino-helper";

export default {
  props: {
    id: Number,
  },
  data: function () {
    return {
      active: false
    };
  },
  methods: {
    setActive( status ) {
      this.active = status;
    }
  },
  mounted() {
    ArduinoHelper.on("arduino.cut", (event, data) => {
      this.setActive( this.id == data.input);
    });
  },
};
</script>

<style scoped>
.v-icon.active {
  color: #ff0000 !important;
}
</style>