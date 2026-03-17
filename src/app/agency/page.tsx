import Navigation from '../../components/Navigation';
import AgencySplitLayout from '../../components/agency/AgencySplitLayout';

export default function AgencyPage() {
  return (
    <div style={{ background: '#0F172A', minHeight: '100vh' }}>
      <Navigation />
      <AgencySplitLayout />
    </div>
  );
}
