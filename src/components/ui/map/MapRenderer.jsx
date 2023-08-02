'use client'
import React, { useEffect, useState } from "react";
import L from "leaflet";
import NextImage from "next/image";
import Link from "next/link";
import LayersControl from "./LayersControl";

let map;

const PMC_SPAWN_MARKER = L.icon({
  iconUrl: '/svg/markers/pmc_spawn.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

const IMPOSTOR_SPAWN_MARKER = L.icon({
  iconUrl: '/svg/markers/impostor_spawn.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

const SAFE_BOX_MARKER = L.icon({
  iconUrl: '/svg/markers/safe_box.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

const EXIT_MARKER = L.icon({
  iconUrl: '/svg/markers/exit.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

const BOSS_MARKER = L.icon({
  iconUrl: '/svg/markers/boss.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const KEY_MARKER = L.icon({
  iconUrl: '/svg/markers/key.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const MARKERS = {
  'PMC Spawn': PMC_SPAWN_MARKER,
  'Impostor Spawn': IMPOSTOR_SPAWN_MARKER,
  'Safe Box': SAFE_BOX_MARKER,
  'Exit': EXIT_MARKER,
  'Key': KEY_MARKER,
  'Boss Spawn': BOSS_MARKER,
}


const MapContainer = ({
  imageSrc,
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [lastClickedPosition, setLastClickedPosition] = useState(null);
  const [visibleLayers, setVisibleLayers] = useState({
    'PMC Spawn': true,
    'Impostor Spawn': true,
    'Safe Box': true,
    'Exit': true,
    'Key': true,
    'Boss Spawn': true,
  });
  const [layers, setLayers] = useState(null);
  const [addingMarker, setAddingMarker] = useState(false);

  const buildMap = () => {
    const image = new Image()
    image.src = imageSrc;
    image.onload = function () {
      2048
      1024
      const imageWidth = 2048;
      const imageHeight = 1024;

      const MaxMapMBounds = [
        [0, 0],
        [imageHeight, imageWidth]
      ];

      map = L.map("map", {
        crs: L.CRS.Simple,
        maxBounds: MaxMapMBounds,
        maxBoundsViscosity: 0.0,
        maxZoom: 3,
        zoomControl: false,
      }).setView([imageHeight / 2, imageWidth / 2]);

      map.attributionControl.remove();
      map.fitBounds(
        [[0, 0], [imageHeight, imageWidth]],
      );
      map.on("zoomanim", function (e) {
        console.log(e)
      })

      L.imageOverlay(imageSrc, MaxMapMBounds, { className: "image-map" }).addTo(map);

      map.on("click", function (e) {
        var coord = e.latlng;
        var lat = coord.lat;
        var lng = coord.lng;
        setLastClickedPosition([lat, lng]);
      });

      // Create layers
      const pmc_spawn_layer = L.layerGroup();
      const impostor_spawn_layer = L.layerGroup();
      const safe_box_layer = L.layerGroup();
      const exit_layer = L.layerGroup();
      const key_layer = L.layerGroup();
      const boss_spawn_layer = L.layerGroup();

      // Store layers
      setLayers({
        'PMC Spawn': pmc_spawn_layer,
        'Impostor Spawn': impostor_spawn_layer,
        'Safe Box': safe_box_layer,
        'Exit': exit_layer,
        'Key': key_layer,
        'Boss Spawn': boss_spawn_layer,
      })

      // Add test markers
      const pmc_spawn = L.marker([388.60974512743627, 539.3828475336322], { icon: PMC_SPAWN_MARKER }).addTo(pmc_spawn_layer);
      L.circle([388.60974512743627, 539.3828475336322], { radius: 1, color: "red" }).addTo(map);
      pmc_spawn.on("click", function (e) {
        if (pmc_spawn.options.opacity === 0.5) {
          pmc_spawn.setOpacity(1);
        } else {
          pmc_spawn.setOpacity(0.5);
        }
      });

      // Add markers to layers
      L.marker([527.4280359820091, 655.5777927321669], { icon: IMPOSTOR_SPAWN_MARKER }).addTo(impostor_spawn_layer);
      L.marker([414.97241379310344, 1003.8033674963397], { icon: SAFE_BOX_MARKER }).addTo(safe_box_layer);
      L.marker([692.9292353823089, 482.0913616398243], { icon: EXIT_MARKER }).addTo(exit_layer);

      const distance = Math.sqrt(Math.pow(820.9865067466267 - 757.4751124437781, 2) + Math.pow(1001.1625841184388 - 987.1417227456259, 2))

      L.circle([820.9865067466267, 1001.1625841184388], { radius: distance, color: "red" }).addTo(boss_spawn_layer);
      L.marker([820.9865067466267, 1001.1625841184388], { icon: BOSS_MARKER }).addTo(boss_spawn_layer);
      L.marker([561.9844827586207, 857.0429384849124], { icon: KEY_MARKER }).addTo(key_layer);

      // Add layers to map
      pmc_spawn_layer.addTo(map);
      impostor_spawn_layer.addTo(map);
      safe_box_layer.addTo(map);
      exit_layer.addTo(map);
      key_layer.addTo(map);
      boss_spawn_layer.addTo(map);

      setMapLoaded(true);
    }
    return map;
  };

  useEffect(() => {
    buildMap();
    return () => {
      map.off();
      map.remove();
    };
  }, []);

  const toggleLayer = (layerName) => {
    setVisibleLayers({
      ...visibleLayers,
      [layerName]: !visibleLayers[layerName]
    })
    if (layers[layerName]) {
      if (map.hasLayer(layers[layerName])) {
        map.removeLayer(layers[layerName])
      } else {
        map.addLayer(layers[layerName])
      }
    }
  }

  const initializeAddMarker = () => {
    setLastClickedPosition(null);
    setAddingMarker(true);
  }

  const addMarker = ({ type }) => {
    if (lastClickedPosition) {
      const marker = L.marker(lastClickedPosition, { icon: MARKERS[type] }).addTo(map);
      setLastClickedPosition(null);
    }
  }

  return (
    <div className="relative h-[100svh]">
      {
        !mapLoaded &&
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <NextImage width={50} height={50} src="/svg/spinner.svg" className="mx-auto" />
          <p className="mt-3 text-white font-semibold font-coolvetica text-2xl">
            Loading map...
          </p>
        </div>
      }
      {
        mapLoaded && (
          <>
            <Link href="/" className="z-[1001] absolute left-3 top-3 flex gap-2 items-center px-3 rounded-md text-white text-xl font-semibold py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-all duration-300">
              <NextImage width={32} height={32} src="/svg/back.svg" />
              <p>All Maps</p>
            </Link>
            <div className="z-[1001] absolute top-12 bg-white rounded-xl">
              {
                lastClickedPosition && <p>Lat: {lastClickedPosition[0]} Lng: {lastClickedPosition[1]}</p>
              }
            </div>
            <div className="z-[1001] absolute top-3 right-3 w-full max-w-[210px]">
              <LayersControl
                toggleLayer={toggleLayer}
                layers={visibleLayers}
              />
              <button className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md text-center text-white font-semibold">
                Add Marker
              </button>
            </div>
          </>
        )
      }
      <div
        id="map"
        style={
          {
            height: "calc(100svh)",
            width: "100%",
            visibility: mapLoaded ? "visible" : "hidden"
          }
        }
      ></div>
    </div >
  );
};

export default MapContainer;
