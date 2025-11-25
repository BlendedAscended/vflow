import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
