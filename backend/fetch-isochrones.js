'use strict';
const pAll = require('p-all');
const mbxIsochrone = require('@mapbox/mapbox-sdk/services/isochrone');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const path = require('path');

/**
 * Transforms the station name to one that matches the filename
 * @param {string} originalStationName 
 * @returns {string}
 */
function transformStationName(originalStationName) {
  return originalStationName
    .replace(/[ \/]/g, '_')
    .toLowerCase();
}

(async () => {
  const isochroneService = mbxIsochrone({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });
  const stationsFilePath = path.join(__dirname, '../public/data', 'stations.json');
  const stationGeoJSON = JSON.parse(readFileSync(stationsFilePath, 'utf-8'));
  const stations = stationGeoJSON.features;

  const isochroneReqs = stations.map((station) => {
    return () => isochroneService.getContours({
      profile: 'walking',
      coordinates: station.geometry.coordinates,
      minutes: [10, 20, 30],
      polygons: true
    }).send();
  });

  const isochroneResults = await pAll(isochroneReqs, { concurrency: 10 });

  // ensure data directory exists
  mkdirSync(path.join(__dirname, '../public/data/isochrones'), { recursive: true });
  isochroneResults.forEach((isochroneResult, idx) => {
    const stationName = transformStationName(stations[idx].properties.Name);
    writeFileSync(path.join(__dirname, '../public/data/isochrones', `${stationName}.json`), JSON.stringify(isochroneResult.body));
  });
  console.log("Wrote all isochrone geojson files");
})();
