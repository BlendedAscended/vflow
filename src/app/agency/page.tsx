'use client';

import registry from '../../components/agency-prototypes/registry';
import ProtoFrame from '../../components/agency-prototypes/ProtoFrame';
import ProtoNav from '../../components/agency-prototypes/ProtoNav';
import Navigation from '../../components/Navigation';

export default function AgencyPage() {
  return (
    <>
      <Navigation />
      <ProtoNav items={registry} />
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
    </>
  );
}
