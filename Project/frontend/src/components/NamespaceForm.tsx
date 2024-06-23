import React, { useState } from 'react';
import { createNamespace } from '../services/api';
import { Namespace } from '../types';

const NamespaceForm: React.FC = () => {
  const [namespace, setNamespace] = useState<Namespace>({
    namespace: '',
    relations: {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNamespace({ ...namespace, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createNamespace(namespace);
      alert('Namespace created: ' + JSON.stringify(response));
    } catch (error) {
      alert('Error creating namespace: ' + error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="namespace" placeholder="Namespace" onChange={handleChange} />
      {/* Additional inputs for relations can be added here */}
      <button type="submit">Create Namespace</button>
    </form>
  );
};

export default NamespaceForm;
