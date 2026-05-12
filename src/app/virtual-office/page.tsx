import Navigation from '../../components/Navigation';
import IsoFloor from '../../components/agency-prototypes/proto-05-iso-floor';

export const metadata = {
    title: 'Virtual Office — Verbaflow',
    description:
        'Live interactive isometric floor of the Verbaflow virtual agency. Watch agents and humans collaborate in real time across the Command Center, Design Studio, Engine Room and Client Suite.',
};

export default function VirtualOfficePage() {
    return (
        <div>
            <Navigation />
            <IsoFloor />
        </div>
    );
}
