<template>
  <div id="selector-ui">
    Walking distances from
    <vSelect
      class="selector-dropdown"
      v-if="stations"
      :options="stations"
      v-model="selectedStationName"
      @input="emitPickerEvent"
      placeholder="Hello"
    >
    </vSelect>
    Station:
  </div>
</template>

<script>
import { eventBus, stationData } from "../main";
import "vue-select/dist/vue-select.css";

export default {
  name: "StationPicker",
  data: () => {
    return {
      stations: [],
      selectedStationName: {},
    };
  },
  async created() {
    eventBus.$on("station-mapping-ready", () => {
      this.stations = Object.keys(stationData.stationMapping);
    });
  },
  methods: {
    emitPickerEvent() {
      eventBus.$emit("station-picker-changed", this.selectedStationName);
    },
  },
  components: {
    vSelect: () => import("vue-select"),
  },
};
</script>

<style scoped>
#selector-ui {
  padding-bottom: 1em;
}

.selector-dropdown {
  width: 24em;
  display: inline-block;
  vertical-align: middle;
}
</style>
