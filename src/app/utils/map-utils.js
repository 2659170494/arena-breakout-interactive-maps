export const PMC_SPAWN_MARKER = L.icon({
  iconUrl: '/svg/markers/pmc_spawn.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

export const IMPOSTOR_SPAWN_MARKER = L.icon({
  iconUrl: '/svg/markers/impostor_spawn.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

export const SAFE_BOX_MARKER = L.icon({
  iconUrl: '/svg/markers/safe_box.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

export const EXIT_MARKER = L.icon({
  iconUrl: '/svg/markers/exit.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

export const BOSS_MARKER = L.icon({
  iconUrl: '/svg/markers/boss.svg',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export const KEY_MARKER = L.icon({
  iconUrl: '/svg/markers/key.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

export const NEW_MARKER = L.icon({
  iconUrl: '/svg/markers/new_marker.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

export const LOCKED_SAFE_BOX_MARKER = L.icon({
  iconUrl: '/svg/markers/locked_safe_box.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

export const SHARED_EXIT_MARKER = L.icon({
  iconUrl: '/svg/markers/shared_spawn.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

export const MARKERS = {
  'PMC Spawn': PMC_SPAWN_MARKER,
  'Impostor Spawn': IMPOSTOR_SPAWN_MARKER,
  'Safe Box': SAFE_BOX_MARKER,
  'Exit': EXIT_MARKER,
  'Key': KEY_MARKER,
  'Boss Spawn': BOSS_MARKER,
  'Locked Safe Box': LOCKED_SAFE_BOX_MARKER,
  'Shared Exit': SHARED_EXIT_MARKER,
  'New Marker': NEW_MARKER,
}

export const clearLayers = (layers) => {
  layers['PMC Spawn'].clearLayers();
  layers['Impostor Spawn'].clearLayers();
  layers['Safe Box'].clearLayers();
  layers['Exit'].clearLayers();
  layers['Key'].clearLayers();
  layers['Boss Spawn'].clearLayers();
}

export const importLayers = (layers, data) => {

  clearLayers(layers);

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
}


export const addMarker = (layers, data) => {
}