import axios from "axios";
import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

export const eventBus = new Vue();
export const stationData = new Vue({
  data() {
    return {
      stationMapping: {},
    };
  },
  async created() {
    const stationsResp = await axios.get("/data/stations.json");
    if (stationsResp.status === 200) {
      stationsResp.data.features.map((feature) => {
        this.stationMapping[feature.properties.Name] = {
          coordinates: feature.geometry.coordinates,
        };
      });
    }

    eventBus.$emit("station-mapping-ready", true);
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
