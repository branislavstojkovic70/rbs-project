import React, { useState } from 'react';
import { checkACL } from '../services/api';

const ACLCheck: React.FC = () => {
  const [object, setObject] = useState<string>('');
  const [relation, setRelation] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateInput = (input: string): boolean => {
    const regex = /^[a-zA-Z0-9_:]+$/;
    return regex.test(input);
  };

  const validateRelation = (input: string): boolean => {
    const allowedRelations = ['owner', 'editor', 'viewer'];
    return allowedRelations.includes(input);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput(object) || !validateInput(user)) {
      setError('Invalid input: only alphanumeric characters and underscores are allowed for Object and User.');
      return;
    }

    if (!validateRelation(relation)) {
      setError('Invalid relation: allowed values are "owner", "editor", "viewer".');
      return;
    }

    setError(null);

    try {
      const response = await checkACL(object, relation, user);
      setAuthorized(response.authorized);
    } catch (error) {
      setAuthorized(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Object" 
        value={object} 
        onChange={(e) => setObject(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Relation" 
        value={relation} 
        onChange={(e) => setRelation(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="User" 
        value={user} 
        onChange={(e) => setUser(e.target.value)} 
      />
      <button type="submit">Check ACL</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {authorized !== null && <p>{authorized ? 'Authorized' : 'Unauthorized'}</p>}
    </form>
  );
};

export default ACLCheck;
