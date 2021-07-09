<template>
  <main>
    <div id="map"></div>
    <div id="legend">
      <strong>Legend: </strong>
      <div class="legend-block" id="ten-min"></div>
      <span class="label">10 Minute Walk</span>
      <div class="legend-block" id="twenty-min"></div>
      <span class="label">20 Minute Walk</span>
      <div class="legend-block" id="thirty-min"></div>
      <span class="label">30 Minute Walk</span>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { eventBus } from "../main";

export default {
  name: "MapboxMap",
  data() {
    // Set initial data, this.createMap() configures event listeners that update data based on user interaction
    return {
      center: [-77.0147, 38.9101], // DC coordinates from Wikipedia
      zoom: 10,
      accessToken:
        "pk.eyJ1IjoiZHJib3llciIsImEiOiJja2szY2pmd2ExOXZoMm9ueWw0a2RsMm44In0.EncRKaho5hg9lAVTMSjrMA",
    };
  },
  mounted() {
    // create the map after the component is mounted
    this.createMap();
  },
  methods: {
    createMap() {
      // instantiate map.  this method runs once after the vue component is mounted to the dom
      this.map = new mapboxgl.Map({
        accessToken: this.accessToken,
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        minzoom: 5,
        center: this.center, // use initial data as default
        zoom: this.zoom,
      });

      this.map.addControl(
        new MapboxGeocoder({
          accessToken: this.accessToken,
          mapboxgl,
        })
      );

      this.map.on("load", () => {
        this.map.addSource("station-isochrone", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        this.map.addLayer({
          id: "isochrone-line",
          type: "line",
          source: "station-isochrone",
          paint: {
            "line-color": ["get", "color"],
            "line-opacity": ["get", "opacity"],
            "line-width": 2,
          },
        });
        this.map.addLayer({
          id: "isochrone-fill",
          type: "fill",
          source: "station-isochrone",
          paint: {
            "fill-color": ["get", "fillColor"],
            "fill-opacity": ["get", "fillOpacity"],
          },
        });

        eventBus.$on("station-picker-changed", (stationName) => {
          const stationFilename = stationName
            .replace(/[ /]/g, "_")
            .toLowerCase();

          // first set the isochrone on the map
          this.map
            .getSource("station-isochrone")
            .setData(`./data/isochrones/${stationFilename}.json`);

          // then set the bounds for the map to the isochrone
          axios.get(`data/isochrones/${stationFilename}.json`).then((resp) => {
            const bounds = new mapboxgl.LngLatBounds();
            const feature = resp.data.features[0];

            feature.geometry.coordinates.forEach((lngLat) => {
              bounds.extend(lngLat);
            });

            this.map.fitBounds(bounds);
          });
        });
      });
    },
  },
};
</script>

<style scoped>
#map {
  height: 600px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid darkgrey;
}

.text-container {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  margin: 0 auto; /* center text container */
}

#legend {
  padding: 1em 0;
}

#legend .legend-block {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: -0.2em;
  margin-left: 0.5em;
  margin-right: 0.25em;
}

#legend .label {
  /* padding-left: 0.5em; */
  padding-right: 0.5em;
}

#ten-min {
  background-color: #6abf4054;
  border: 1px #6abf40 solid;
}

#twenty-min {
  background-color: #bfaa4054;
  border: 1px #bfaa40 solid;
}

#thirty-min {
  background-color: #bf404054;
  border: 1px #bf4040 solid;
}
</style>
