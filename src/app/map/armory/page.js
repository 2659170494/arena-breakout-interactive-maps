import dynamic from "next/dynamic"
const MapRenderer = dynamic(() => import('@/components/ui/map/MapRenderer'), { ssr: false })

const src = 'https://cdn.discordapp.com/attachments/789169114686029906/1136119566670504026/armory.webp'
export default function ArmoryMap() {
  return (
    <main className="relative grow w-full">
      <MapRenderer imageSrc={src} />
    </main>
  )
}
