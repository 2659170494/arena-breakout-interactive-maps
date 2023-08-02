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
  iconAnchor: [19, 38],
});

const MARKERS = {
  'PMC Spawn': PMC_SPAWN_MARKER,
  'Impostor Spawn': IMPOSTOR_SPAWN_MARKER,
  'Safe Box': SAFE_BOX_MARKER,
  'Exit': EXIT_MARKER,
  'Key': KEY_MARKER,
  'Boss Spawn': BOSS_MARKER,
}

const LAYERS_ICONS = [
  {
    name: 'PMC Spawn',
    img: '/svg/pmc-spawn.svg'
  },
  {
    name: 'Impostor Spawn',
    img: '/svg/impostor-spawn.svg'
  },
  {
    name: 'Safe Box',
    img: '/svg/safe-box.svg'
  },
  {
    name: 'Exit',
    img: '/svg/exit.svg'
  },
  {
    name: 'Key',
    img: '/svg/key.svg'
  },
  {
    name: 'Boss Spawn',
    img: '/svg/boss-spawn.svg'
  },
]


const MapContainer = ({
  imageSrc,
  markers = {
    'PMC Spawn': [],
    'Impostor Spawn': [],
    'Safe Box': [],
    'Exit': [],
    'Key': [],
    'Boss Spawn': [],
  }
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
  const [newMarkerType, setNewMarkerType] = useState(null);
  const [newMarker, setNewMarker] = useState(null);
  const [markersData, setMarkersData] = useState(markers);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importMapValue, setImportMapValue] = useState('');

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

      markers['PMC Spawn'].forEach(marker => {
        L.marker(marker, { icon: PMC_SPAWN_MARKER }).addTo(pmc_spawn_layer);
      })

      markers['Impostor Spawn'].forEach(marker => {
        L.marker(marker, { icon: IMPOSTOR_SPAWN_MARKER }).addTo(impostor_spawn_layer);
      })

      markers['Safe Box'].forEach(marker => {
        L.marker(marker, { icon: SAFE_BOX_MARKER }).addTo(safe_box_layer);
      })

      markers['Exit'].forEach(marker => {
        L.marker(marker, { icon: EXIT_MARKER }).addTo(exit_layer);
      })

      markers['Key'].forEach(marker => {
        L.marker(marker, { icon: KEY_MARKER }).addTo(key_layer);
      })

      markers['Boss Spawn'].forEach(marker => {
        L.marker(marker.center, { icon: BOSS_MARKER }).addTo(boss_spawn_layer);
        L.circle(marker.center, { radius: marker.radius, color: "red" }).addTo(boss_spawn_layer);
      })

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

  useEffect(() => {
    if (addingMarker && newMarkerType) {
      if (lastClickedPosition) {
        if (newMarker == null) {
          setNewMarker(L.marker(lastClickedPosition, { icon: MARKERS[newMarkerType] }).addTo(map));
        } else {
          if (newMarker.options.icon.options.iconUrl !== MARKERS[newMarkerType].options.iconUrl) {
            newMarker.setIcon(MARKERS[newMarkerType])
          } else {
            newMarker.setLatLng(lastClickedPosition);
          }
        }
      }
    } else {
      if (newMarker != null) {
        newMarker.remove();
        setNewMarker(null);
      }
    }
  }, [addingMarker, lastClickedPosition, newMarkerType])

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

  const handleConfirmMarker = () => {
    if (newMarker) {
      const layerName = newMarkerType;
      const markerPosition = newMarker.getLatLng();
      const markerData = structuredClone(markersData[layerName]);
      if (layerName === 'Boss Spawn') {
        markerData.push({
          center: [markerPosition.lat, markerPosition.lng],
          radius: 1
        });
      } else {
        markerData.push([markerPosition.lat, markerPosition.lng]);
      }

      L.marker(markerPosition, { icon: MARKERS[layerName] }).addTo(layers[layerName]);

      setMarkersData({
        ...markersData,
        [layerName]: markerData
      })
      setAddingMarker(false);
      setNewMarkerType(null);
      setLastClickedPosition(null);
    }
  }

  const handleExportMap = () => {
    navigator.clipboard.writeText(JSON.stringify(markersData));
  }

  const handleImportMap = () => {
    try {
      const data = JSON.parse(importMapValue);
      console.log(data)
      setMarkersData(data);
      setShowImportModal(false);
      layers['PMC Spawn'].clearLayers();
      layers['Impostor Spawn'].clearLayers();
      layers['Safe Box'].clearLayers();
      layers['Exit'].clearLayers();
      layers['Key'].clearLayers();
      layers['Boss Spawn'].clearLayers();

      data['PMC Spawn'].forEach(marker => {
        L.marker(marker, { icon: PMC_SPAWN_MARKER }).addTo(layers['PMC Spawn']);
      })

      data['Impostor Spawn'].forEach(marker => {
        L.marker(marker, { icon: IMPOSTOR_SPAWN_MARKER }).addTo(layers['Impostor Spawn']);
      })

      data['Safe Box'].forEach(marker => {
        L.marker(marker, { icon: SAFE_BOX_MARKER }).addTo(layers['Safe Box']);
      })

      data['Exit'].forEach(marker => {
        L.marker(marker, { icon: EXIT_MARKER }).addTo(layers['Exit']);
      })

      data['Key'].forEach(marker => {
        L.marker(marker, { icon: KEY_MARKER }).addTo(layers['Key']);
      })

      data['Boss Spawn'].forEach(marker => {
        L.marker(marker.center, { icon: BOSS_MARKER }).addTo(layers['Boss Spawn']);
        L.circle(marker.center, { radius: marker.radius, color: "red" }).addTo(layers['Boss Spawn']);
      })

    } catch (e) {
      console.log(e)
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
                collapse={addingMarker}
              />
              <button
                onClick={initializeAddMarker}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md text-center text-white font-semibold"
              >
                Add Marker
              </button>
              {
                addingMarker &&
                <div className="w-full bg-white rounded-md py-2 px-3">
                  <h2 className="text-center font-semibold text-[#333]">
                    Select marker type
                  </h2>
                  <div className="grid grid-cols-3">
                    {
                      LAYERS_ICONS.map((layer, index) => (
                        <button
                          className={`flex items-center justify-center w-full h-full py-2 rounded-md transition-all duration-200 ${newMarkerType === layer.name ? "bg-blue-100" : "hover:bg-neutral-200  active:bg-neutral-300"} `}
                          key={index}
                          onClick={() => setNewMarkerType(layer.name)}
                          disabled={newMarkerType === layer.name}
                        >
                          <NextImage width={30} height={30} src={layer.img} className="aspec-square max-h-7" />
                        </button>
                      ))
                    }
                  </div>
                </div>
              }
              {
                newMarkerType && lastClickedPosition &&
                <button
                  onClick={handleConfirmMarker}
                  className="w-full py-2 px-3 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-md text-center text-white font-semibold"
                >
                  Confirm Marker
                </button>
              }
            </div>
            {
              showImportModal &&
              <div
                id="import-modal"
                className="z-[1002] absolute flex items-center justify-center w-full h-full bg-black bg-opacity-25"
                onClick={(e) => {
                  if (e.target.id === "import-modal") {
                    setShowImportModal(false)
                  }
                }}
              >
                <div className="flex flex-col justify-center p-3 gap-3 w-full max-w-[300px] h-full max-h-[350px] bg-white rounded-lg">
                  <h2>
                    Import Map
                  </h2>
                  <textarea className="p-3 grow" placeholder="Paste JSON" value={importMapValue} onChange={e => setImportMapValue(e.target.value)} />
                  <button
                    onClick={handleImportMap}
                    className="flex justify-center items-center gap-2 w-full py-1 px-3 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-md text-center text-white font-semibold"
                  >
                    <NextImage width={22} height={22} src="/svg/import.svg" />
                    <p>Import</p>
                  </button>
                </div>
              </div>
            }
            <div className="z-[1001] absolute left-3 bottom-3 flex gap-2">
              <button
                onClick={handleExportMap}
                className="flex gap-2 text-white py-1 px-3 font-semibold bg-[#00000000] hover:bg-[#000000aa] transition-all duration-200 rounded-md"
              >
                <NextImage width={22} height={22} src="/svg/export.svg" />
                <p>Export</p>
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex gap-2 text-white py-1 px-3 font-semibold bg-[#00000000] hover:bg-[#000000aa] transition-all duration-200 rounded-md"
              >
                <NextImage width={22} height={22} src="/svg/import.svg" />
                <p>Import</p>
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
