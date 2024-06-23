import React, { useState } from 'react';
import { checkACL } from '../services/api';

const ACLCheck: React.FC = () => {
  const [object, setObject] = useState('');
  const [relation, setRelation] = useState('');
  const [user, setUser] = useState('');
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await checkACL(object, relation, user);
      setAuthorized(response.authorized);
    } catch (error) {
      alert('Error checking ACL: ' + error);
      setAuthorized(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Object" value={object} onChange={(e) => setObject(e.target.value)} />
      <input type="text" placeholder="Relation" value={relation} onChange={(e) => setRelation(e.target.value)} />
      <input type="text" placeholder="User" value={user} onChange={(e) => setUser(e.target.value)} />
      <button type="submit">Check ACL</button>
      {authorized !== null && <p>{authorized ? 'Authorized' : 'Unauthorized'}</p>}
    </form>
  );
};

export default ACLCheck;
