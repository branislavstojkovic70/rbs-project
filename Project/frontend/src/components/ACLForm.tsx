import React, { useState } from 'react';
import { createACL } from '../services/api';
import { ACL } from '../types';

const ACLForm: React.FC = () => {
  const [acl, setACL] = useState<ACL>({ object: '', relation: '', user: '' });
  const [error, setError] = useState<string | null>(null);

  const validateInput = (input: string): boolean => {
    const regex = /^[a-zA-Z0-9:_]+$/;
    return regex.test(input);
  };

  const validateRelation = (input: string): boolean => {
    const allowedRelations = ['owner', 'editor', 'viewer'];
    return allowedRelations.includes(input);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setACL({ ...acl, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { object, relation, user } = acl;

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
      const response = await createACL(acl);
      alert('ACL created: ' + JSON.stringify(response));
    } catch (error) {
      alert('Error creating ACL: ' + error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="object" 
        placeholder="Object" 
        onChange={handleChange} 
      />
      <input 
        type="text" 
        name="relation" 
        placeholder="Relation" 
        onChange={handleChange} 
      />
      <input 
        type="text" 
        name="user" 
        placeholder="User" 
        onChange={handleChange} 
      />
      <button type="submit">Create ACL</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default ACLForm;
