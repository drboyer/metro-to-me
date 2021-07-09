<template>
  <div id="app">
    <h1 class="title">🚇 MetroTo.me</h1>
    <StationPicker />
    <MapboxMap />
  </div>
</template>

<script>
import StationPicker from "./components/StationPicker.vue";
import MapboxMap from "./components/MapboxMap.vue";

export default {
  name: "app",
  components: {
    MapboxMap,
    StationPicker,
  },
};
</script>

<style>
#app {
  font-family: "Noto Sans TC", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1em;
}
</style>
