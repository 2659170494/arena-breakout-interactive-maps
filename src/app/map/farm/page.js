import dynamic from "next/dynamic"
const MapRenderer = dynamic(() => import('@/components/ui/map/MapRenderer'), { ssr: false })

const MARKERS_DATA = {
  "PMC Spawn": [[427, 458], [318, 578], [345, 762], [586, 676], [517, 1532], [509, 1372], [732, 1515], [701, 1393], [770, 1270]],
  "Impostor Spawn": [],
  "Safe Box": [[438, 600], [372.375, 756.625], [642, 869], [442.25, 946.75], [451.75, 959.75], [442.5, 962.25], [454.75, 1009.5], [537.5, 1387]],
  "Exit": [[376, 433], [314, 570], [525, 725], [367, 1071], [626.375, 1018.875], [754, 1313], [494, 1682], [729, 1540]],
  "Key": [[435, 601], [368.125, 757.75], [447.875, 957], [451, 1007], [680, 867.5], [608, 979], [536, 1381], [685, 1355.5], [687, 1551]],
  "Boss Spawn": []
}

const src = 'https://cdn.discordapp.com/attachments/789169114686029906/1136119600182984794/farm.webp'
export default function FarmMap() {
  return (
    <main className="relative grow w-full">
      <MapRenderer imageSrc={src} markers={MARKERS_DATA} />
    </main>
  )
}
