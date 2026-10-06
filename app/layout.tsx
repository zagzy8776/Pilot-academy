import './globals.css';
import type { Metadata, Viewport } from 'next';
export const metadata: Metadata = {
  title: 'Meridian Aviation Academy | Elite Flight Crew Training & Recruitment',
  description: 'Flight crew training and recruitment for cabin crew, pilots and ground operations professionals, aligned to EASA, FAA and ICAO safety standards.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0a2342' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
