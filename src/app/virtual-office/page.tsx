import Navigation from '../../components/Navigation';
import VirtualOffice from '../../components/VirtualOffice';

export const metadata = {
    title: 'Virtual Office — Verbaflow',
    description:
        'Live floor of the Verbaflow virtual agency. Watch agents and humans collaborate in real time across the Command Center, Design Studio, Engine Room and Client Suite.',
};

export default function VirtualOfficePage() {
    return (
        <div>
            <Navigation />
            <VirtualOffice />
        </div>
    );
}
