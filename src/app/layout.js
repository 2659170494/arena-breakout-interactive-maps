import localFont from '@next/font/local'
import './globals.css'
import 'leaflet/dist/leaflet.css';

export const metadata = {
  title: 'Arena Breakout Interactive Map',
  description: 'An interactive map of the Arena Breakout game.',
}

const coolvetica = localFont({
  src: [
    {
      path: '../../public/fonts/coolvetica.otf',
      weight: '600'
    }
  ],
  variable: '--font-coolvetica'
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${coolvetica.variable} + min-h-[100svh] flex flex-col bg-city bg-no-repeat bg-cover`}>
        {children}
      </body>
    </html>
  )
}
