'use client'
import React, { useEffect, useState } from "react";
import L from "leaflet";
import NextImage from "next/image";
import Link from "next/link";
import LayersControl from "./LayersControl";
import ImportMapModal from "./modals/ImportMapModal";
import SelectNewMarkerType from "./modals/SelectNewMarkerType";
import { importLayers, clearLayers, MARKERS } from "@/app/utils/map-utils";

let map;
let exportedMessageTimeoutId = null;
/* 

const MARKERS = {
  'PMC Spawn': [
    {
      id: 1,
      position: [0, 0],
      exits: [1, 2, 3]
    }
  ],
  'Impostor Spawn': [
    {
      id: 1,
      position: [0, 0],
      exits: [1, 2, 3]
    }
  ],
  'Safe Box': [
    {
      id: 1,
      position: [0, 0],
      requiredKey: 1 | null,
      floor: 1,
    }
  ],
  'Exit': [
    {
      id: 1,
      position: [0, 0],
      requiredKey: 1 | null,
      impostor_requirements: {
        delay: 0,
        probability: 100,  
      },
      pmc_requirements: {
        delay: 0,
        probability: 100,
        item: {
          name: 'Koen',
          ammount: 5000
        }
      }
    }
  ],
  'Key': [
    {
      id: 1,
      position: [0, 0],
      name: 'Key',
      floor: 1,
    }
  ],
  'Boss Spawn': [
    {
      id: 1,
      position: [0, 0],
      radius: 1,
      floor: 1,
      info: {
        name: 'Reshala',
        armor-tier:{
          helmet: 3,
          body: 3,
        },
        weapon: 'AK-74N',
        ammo: 'BP',
        item: 'Sable',
        bots-weapons: ['AK', 'Fal', 'M4', 'AK-74N'],
      }
      }
*/

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
  const [markersData, setMarkersData] = useState(markers);
  /* FOR LAYERS */
  const [visibleLayers, setVisibleLayers] = useState({
    'PMC Spawn': true,
    'Impostor Spawn': true,
    'Safe Box': true,
    'Exit': true,
    'Key': true,
    'Boss Spawn': true,
  });
  const [layers, setLayers] = useState(null);

  /* IMPORT EXPORT  */
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportedMessage, setShowExportedMessage] = useState(false);

  /* FOR NEW MARKERS */
  const [editMap, setEditMap] = useState(false);
  const [positionMarker, setPositionMarker] = useState(null);
  const [newMarkerType, setNewMarkerType] = useState(null)
  const [newMarkerPosition, setNewMarkerPosition] = useState(null)
  const [showSelectMarkerTypeModal, setShowSelectMarkerTypeModal] = useState(false);

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

      const positionMarker = L.marker([0, 0], { icon: MARKERS["New Marker"] });
      positionMarker.on('click', () => {
        setShowSelectMarkerTypeModal(true);
      })
      setPositionMarker(positionMarker);

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
      const locked_safe_box_layer = L.layerGroup();

      // Store layers
      const layers = {
        'PMC Spawn': pmc_spawn_layer,
        'Impostor Spawn': impostor_spawn_layer,
        'Safe Box': safe_box_layer,
        'Exit': exit_layer,
        'Key': key_layer,
        'Boss Spawn': boss_spawn_layer,
        'Locked Safe Box': locked_safe_box_layer,
      }
      setLayers(layers)

      // Import layers
      importLayers(layers, markersData)

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
    setVisibleLayers({
      'PMC Spawn': true,
      'Impostor Spawn': true,
      'Safe Box': true,
      'Exit': true,
      'Key': true,
      'Boss Spawn': true,
    })
  }, [editMap])

  useEffect(() => {
    if (editMap) {
      if (lastClickedPosition) {
        //add if not exists on map
        if (!map.hasLayer(positionMarker)) {
          positionMarker.addTo(map);
        }
        if (positionMarker.options.icon.options.iconUrl === MARKERS["New Marker"].options.iconUrl) {
          positionMarker.setLatLng(lastClickedPosition);
        }
      }
    } else {
      if (positionMarker) {
        positionMarker.remove();
      }
    }
  }, [editMap, lastClickedPosition, positionMarker])

  useEffect(() => {
    if (layers) {
      Object.keys(layers).forEach(layerName => {
        if (visibleLayers[layerName] && !map.hasLayer(layers[layerName])) {
          map.addLayer(layers[layerName])
        } else if (!visibleLayers[layerName] && map.hasLayer(layers[layerName])) {
          map.removeLayer(layers[layerName])
        }
      })
    }
  }, [layers, visibleLayers])

  const toggleLayer = (layerName) => {
    setVisibleLayers({
      ...visibleLayers,
      [layerName]: !visibleLayers[layerName]
    })
  }
  const handleExportMap = () => {
    navigator.clipboard.writeText(JSON.stringify(markersData));
    setShowExportedMessage(true);

    if (exportedMessageTimeoutId === null) {
      exportedMessageTimeoutId = setTimeout(() => {
        setShowExportedMessage(false);
        exportedMessageTimeoutId = null;
      }, [2000])
    }
  }

  const handleImportMap = (value) => {
    try {
      const data = JSON.parse(value);
      setMarkersData(data);
      setShowImportModal(false);
      importLayers(layers, data)
    } catch (e) {
      console.log(e)
    }
  }

  const handleClickEditButton = () => {
    setLastClickedPosition(null);
    setEditMap(!editMap);
  }

  const handleSelectNewMarkerType = (type) => {
    setNewMarkerType(type);
    setShowSelectMarkerTypeModal(false);
    setNewMarkerPosition(lastClickedPosition);
    positionMarker.remove();
    layers[type].addLayer(L.marker(lastClickedPosition, { icon: MARKERS[type] }));

    let newMarker;
    if (type == 'Boss Spawn') {
      map.off('click')

      const circle = L.circle(lastClickedPosition, { radius: 1, color: "red" }).addTo(layers[type]);
      const handleMouseMove = (e) => {
        const distance = Math.sqrt(Math.pow(e.latlng.lat - lastClickedPosition[0], 2) + Math.pow(e.latlng.lng - lastClickedPosition[1], 2))
        circle.setRadius(distance)
      }

      const handleClick = (e) => {
        const distance = Math.sqrt(Math.pow(e.latlng.lat - lastClickedPosition[0], 2) + Math.pow(e.latlng.lng - lastClickedPosition[1], 2))
        circle.setRadius(distance)
        const center = circle.getLatLng();
        const radius = circle.getRadius();
        newMarker = {
          center: [center.lat, center.lng],
          radius: radius,
        }

        setMarkersData((prev) => {
          return {
            ...prev,
            [type]: [
              ...prev[type],
              newMarker
            ]
          }
        })

        map.off('click', handleClick)
        map.off('mousemove', handleMouseMove)
        map.on("click", function (e) {
          var coord = e.latlng;
          var lat = coord.lat;
          var lng = coord.lng;
          setLastClickedPosition([lat, lng]);
        });
      }
      map.on('mousemove', handleMouseMove)
      map.on('click', handleClick)
    } else {
      newMarker = lastClickedPosition;

      setMarkersData((prev) => {
        return {
          ...prev,
          [type]: [
            ...prev[type],
            newMarker
          ]
        }
      })
    }

  }

  const handleClearMap = () => {
    clearLayers(layers);
    setMarkersData({
      'PMC Spawn': [],
      'Impostor Spawn': [],
      'Safe Box': [],
      'Exit': [],
      'Key': [],
      'Boss Spawn': [],
    })
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
              <NextImage width={32} height={32} src="/svg/map.svg" alt='' />
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
            </div>
            {
              showImportModal &&
              <ImportMapModal handleCloseModal={setShowImportModal} handleImportMap={handleImportMap} />
            }
            {
              showSelectMarkerTypeModal &&
              <SelectNewMarkerType
                handleCloseModal={setShowSelectMarkerTypeModal}
                handleSelect={handleSelectNewMarkerType}
              />
            }
            <div className={`z-[1001] absolute left-3 bottom-3 flex gap-2 ${!mapLoaded ? 'hidden' : ''}`}>
              <div className="relative">
                {
                  showExportedMessage &&
                  <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%_+_10px)] text-[#333] font-semibold text-sm bg-white px-2 rounded-md">
                    Copied!
                  </p>
                }
                <button
                  onClick={handleExportMap}
                  className="flex gap-2 text-white py-1 px-3 font-semibold bg-[#00000055] hover:bg-[#000000aa] transition-all duration-200 rounded-md"
                >
                  <NextImage width={22} height={22} src="/svg/export.svg" alt='export icon' />
                  <p>Export</p>
                </button>
              </div>
              <button
                onClick={() => setShowImportModal(true)}
                disabled={!mapLoaded}
                className="flex gap-2 text-white py-1 px-3 font-semibold bg-[#00000055] hover:bg-[#000000aa] transition-all duration-200 rounded-md"
              >
                <NextImage width={22} height={22} src="/svg/import.svg" alt='import icon' />
                <p>Import</p>
              </button>
              <button
                onClick={handleClearMap}
                disabled={!mapLoaded}
                className="flex gap-2 text-white py-1 px-3 font-semibold bg-[#00000055] hover:bg-[#000000aa] transition-all duration-200 rounded-md"
              >
                <NextImage width={22} height={22} src="/svg/clear.svg" alt='clear icon' />
                Clear Map
              </button>
              <button
                onClick={handleClickEditButton}
                disabled={!mapLoaded}
                className="flex gap-2 text-white py-1 px-3 font-semibold bg-[#00000055] hover:bg-[#000000aa] transition-all duration-200 rounded-md"
              >
                <NextImage width={22} height={22} src={editMap ? '/svg/save.svg' : '/svg/edit.svg'} alt="save icon" />
                {
                  editMap ? 'Save Map' : 'Edit Map'
                }
              </button>
            </div>
          </>
        )
      }
      <div
        id="map"
        style={
          {
            cursor: 'crosshair',
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
