import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import { VapiProvider } from '../../components/VapiContext';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Verbaflow Agency — Enterprise AI & Data Solutions',
  description:
    'Cross-industry AI engineering and data architecture across healthcare, finance, cloud infrastructure, and AI/ML. Production systems that work.',
  keywords:
    'AI engineering, data architecture, healthcare AI, finance AI, cloud infrastructure, MLOps, Verbaflow',
};

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <VapiProvider>
      <div className={playfair.variable}>{children}</div>
    </VapiProvider>
  );
}
