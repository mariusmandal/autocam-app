<template>
  <div align="left">
    <b class="uppercase">{{ name }}</b>
    <small class="float-right">{{ prefixValue }}{{ value }}</small>
    <v-slider dense :min="min" :max="max" @change="change"></v-slider>
  </div>
</template>

<script>
import ArduinoHelper from "../plugins/vue-arduino-helper";

export default {
  props: {
    name: String,
    min: Number,
    max: Number,
    prefixValue: String,
    setting: String,
  },
  data: function () {
    return {
      value: 0,
    };
  },
  methods: {
    change: function (value) {
      this.value = value;
      ArduinoHelper.send(this.setting, this.value);
    },
  },
};
</script>

<style scoped>
.uppercase {
  text-transform: uppercase;
}
</style>