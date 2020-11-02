<template>
  <v-select
    label="PORT"
    class="mt-6"
    dense
    outlined
    :items="items"
    @change="portSelect"
    @focus="focus"
  >
  </v-select>
</template>

<script>
import ArduinoHelper from "../plugins/vue-arduino-helper"

const all_ports = [];

const portComponent = {
  data: () => {
    return {
      items: all_ports,
    };
  },
  methods: {
    portSelect: function (selected) {
      console.log("Select port:", selected);
      ArduinoHelper.send('serialport.selected', selected);
    },
    focus: function () {
      console.log("time to load at least!");
      ArduinoHelper.send('serialport.list.get');
    },
  },
};

ArduinoHelper.on('serialport.list.done', (event, list) => {
  console.log('Serial ports: ', list);
  list.forEach(port => {
    all_ports.push(port.path);
  });
});

export default portComponent;
</script>