import { useState } from 'react';

function OrgSwitcher() {
  const [activeOrg, setActiveOrg] = useState('Acme Corp');

  const organizations = [
    'Acme Corp',
    'DevTech',
    'Design Hub'
  ];

  return (
    <select value={activeOrg} onChange={(e) => setActiveOrg(e.target.value)}>
      {organizations.map((org) => (
        <option key={org} value={org}>
          {org}
        </option>
      ))}
    </select>
  );
}

export default OrgSwitcher;
