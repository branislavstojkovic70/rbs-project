import React, { useState } from 'react';
import { createACL } from '../services/api';
import { ACL } from '../types';

const ACLForm: React.FC = () => {
  const [acl, setACL] = useState<ACL>({ object: '', relation: '', user: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setACL({ ...acl, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createACL(acl);
      alert('ACL created: ' + JSON.stringify(response));
    } catch (error) {
      alert('Error creating ACL: ' + error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="object" placeholder="Object" onChange={handleChange} />
      <input type="text" name="relation" placeholder="Relation" onChange={handleChange} />
      <input type="text" name="user" placeholder="User" onChange={handleChange} />
      <button type="submit">Create ACL</button>
    </form>
  );
};

export default ACLForm;
