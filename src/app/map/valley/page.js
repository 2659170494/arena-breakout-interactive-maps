import dynamic from "next/dynamic"

const MapRenderer = dynamic(() => import('@/components/ui/map/MapRenderer'), { ssr: false })

const MARKERS_DATA = {
  "PMC Spawn": [[677, 488], [333, 526], [535, 808], [295, 1488], [697, 1564], [717, 1247], [377, 1213], [759, 740]],
  "Impostor Spawn": [],
  "Safe Box": [[422.375, 970], [825, 1002]],
  "Exit": [[289, 1488], [691, 1572], [673, 491], [327, 530], [291, 787], [313, 1000], [661, 1165], [375, 1217]],
  "Key": [[412, 560], [346, 735], [820, 996], [431.5, 1030.5], [412.5, 999], [560.5, 1055.5], [499.5, 1304.5], [678.5, 1188]],
  "Boss Spawn": []
}

const src = 'https://cdn.discordapp.com/attachments/789169114686029906/1136119647545065504/valley.webp'
export default function ValleyMap() {
  return (
    <main className="relative grow w-full">
      <MapRenderer imageSrc={src} markers={MARKERS_DATA} />
    </main>
  )
}
