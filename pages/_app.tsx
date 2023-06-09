import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import DarkModeToggle from '../components/DarkModeToggle'

import '../styles/DarkMode.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <>
      <DarkModeToggle />
      <Component {...pageProps} />

      <Analytics />
    </>
  )
}
export default MyApp
