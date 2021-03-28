'use strict';
/* Saves all metro stations as a GeoJSON file */
const got = require('got');
const { writeFileSync } = require('fs');
const path = require('path');

(async () => {
  const body = await got.get('https://api.wmata.com/Rail.svc/json/jStations', { headers: {
    api_key: process.env.WMATA_API_KEY
  }}).json();

  const features = body.Stations.map((station) => {
    const Lines = [
      station.LineCode1,
      station.LineCode2,
      station.LineCode3,
      station.LineCode4
    ].filter((lc) => (lc !== null));
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [station.Lon, station.Lat]
      },
      properties: {
        Code: station.code,
        Name: station.Name,
        Lines
      }
    }
  });
  
  const outPath = path.join(__dirname, '../public/data', 'stations.json');
  writeFileSync(outPath, JSON.stringify({ type: 'FeatureCollection', features }));
  console.log(`Wrote stations file to ${outPath}`);
})();