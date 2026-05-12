import Navigation from '../../components/Navigation';
import AgencySplitLayout from '../../components/agency/AgencySplitLayout';

export default function AgencyPage() {
  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      <Navigation />
      <AgencySplitLayout />
    </div>
  );
}
