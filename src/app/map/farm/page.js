import dynamic from "next/dynamic"
const MapRenderer = dynamic(() => import('@/components/ui/map/MapRenderer'), { ssr: false })


const src = 'https://cdn.discordapp.com/attachments/789169114686029906/1136119600182984794/farm.webp'
export default function FarmMap() {
  return (
    <main className="relative grow w-full">
      <MapRenderer imageSrc={src} />
    </main>
  )
}
