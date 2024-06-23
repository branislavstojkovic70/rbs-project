import React from 'react';
import ACLForm from './components/ACLForm';
import ACLCheck from './components/ACLCheck';
import NamespaceForm from './components/NamespaceForm';

const App: React.FC = () => {
  return (
    <div>
      <h1>ACL Management</h1>
      <ACLForm />
      <h1>Check ACL</h1>
      <ACLCheck />
      <h1>Namespace Management</h1>
      <NamespaceForm />
    </div>
  );
};

export default App;
