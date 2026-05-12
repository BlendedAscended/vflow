import Navigation from '../../components/Navigation';
import AgencySplitLayout from '../../components/agency/AgencySplitLayout';
import AgencyProjectsStrip from '../../components/agency/AgencyProjectsStrip';
import Footer from '../../components/Footer';

import registry from '../../components/agency-prototypes/registry';
import ProtoFrame from '../../components/agency-prototypes/ProtoFrame';
import ProtoNav from '../../components/agency-prototypes/ProtoNav';

export default function AgencyPage() {
  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      <Navigation />

      {/* Domain showcases */}
      <AgencySplitLayout />

      {/* Project cards */}
      <AgencyProjectsStrip />

      {/* Interactive prototypes gallery */}
      <section
        style={{
          position: 'relative',
          padding: '64px 24px',
          background: '#0F1923',
          minHeight: '80vh',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: '#6B7280' }}
          >
            Prototype Lab
          </p>
          <h2
            className="text-3xl lg:text-4xl font-extrabold mb-2"
            style={{ color: '#FFFFFF' }}
          >
            Interactive Previews
          </h2>
          <p className="text-base mb-8 max-w-xl" style={{ color: '#9CA3AF' }}>
            Each prototype is a live, self-contained component. Click the nav to jump between them.
          </p>
          <ProtoNav items={registry} />
          <div style={{ marginTop: '2rem' }}>
            {registry.map((entry) => (
              <ProtoFrame
                key={entry.id}
                id={entry.id}
                label={entry.label}
                index={entry.index}
                wrapperClass={entry.wrapperClass}
              >
                <entry.component />
              </ProtoFrame>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
