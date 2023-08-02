import Image from "next/image"
import Link from "next/link"

const maps = [
  {
    path: 'valley',
    img: '/img/valley-portrait.webp',
    name: 'Valley',
  },
  {
    path: 'northridge',
    img: '/img/northridge-portrait.webp',
    name: 'Northridge',
  },
  {
    path: 'farm',
    img: '/img/farm-portrait.webp',
    name: 'Farm',
  },
  {
    path: 'armory',
    img: '/img/armory-portrait.webp',
    name: 'Armory',
  },
]

export default function Home() {
  return (
    <main className="grow flex flex-col items-center justify-center w-full gap-10 py-4">
      <h1 className="text-white font-semibold font-coolvetica text-3xl md:text-4xl">
        Arena Breakout
        <span className="hidden sm:inline">{" "}</span>
        <br className="sm:hidden" />
        Interactive Maps
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 place-content-center gap-x-8 gap-y-12 px-8 max-w-7xl">
        {maps.map((map) => (
          <Link href={`/map/${map.path}`} key={map.path} className="group">
            <Image src={map.img} alt={map.name} width={600} height={900} className="w-full scale-100 group-hover:scale-105 transition-all duration-300 aspect-[2/3]" />
            <p className="mt-5 text-white font-semibold text-2xl">
              {map.name}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
