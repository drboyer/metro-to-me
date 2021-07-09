<template>
  <div id="selector-ui">
    Walking distances from
    <select
      v-if="stations"
      v-model="selectedStationName"
      @change="emitPickerEvent($event)"
    >
      <option v-for="station in stations" v-bind:key="station">
        {{ station }}
      </option>
    </select>
    Station:
  </div>
</template>

<script>
import { eventBus, stationData } from "../main";

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
};
</script>

<style scoped>
#selector-ui {
  padding-bottom: 1em;
}
</style>
