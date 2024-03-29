import { Roboto } from 'next/font/google'
import './globals.css'
import { UserMsg } from './cmps/UserMsg'

const roboto = Roboto({ subsets: ['latin'],  weight: ['400','500','700'] })

export const metadata = {
  title: 'SQMail',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {children}
        <UserMsg/>
        </body>
    </html>
  )
}
