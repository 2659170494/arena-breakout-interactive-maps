'use client'
import React, { useEffect, useState } from "react";
import L from "leaflet";
import NextImage from "next/image";
import Link from "next/link";

let map;
const MapContainer = ({
  imageSrc,
}) => {

  const [mapLoaded, setMapLoaded] = useState(false);

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
      var imageBounds = [
        [0, 0],
        [imageHeight, imageWidth]
      ];

      L.imageOverlay(imageSrc, MaxMapMBounds, { className: "image-map" }).addTo(map);

      map.on("click", function (e) {
        var coord = e.latlng;
        var lat = coord.lat;
        var lng = coord.lng;
        console.log(`latitude: ${lat} and longitude: ${lng} === [${lat} , ${lng} ]`);
      });
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
    </div>
  );
};

export default MapContainer;
