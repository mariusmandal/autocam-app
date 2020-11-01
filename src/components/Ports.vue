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
import electron from 'electron';

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
      electron.ipcRenderer.send('SERIALPORT.SELECTED', selected);
    },
    focus: function () {
      console.log("time to load at least!");
      electron.ipcRenderer.send('SERIALPORT.LIST.GET');
    },
  },
};

electron.ipcRenderer.on('PORTS.LIST.DONE', (event, list) => {
  console.log('Serial ports: ', list);
  list.forEach(port => {
    all_ports.push(port.path);
  });
});

export default portComponent;
</script>