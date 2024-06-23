import axios from 'axios';
import { ACL, Namespace } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8080', // postavite vašu baznu URL adresu
});

export const createACL = async (acl: ACL) => {
  const response = await api.post('/acl', acl);
  return response.data;
};

export const checkACL = async (object: string, relation: string, user: string) => {
  const response = await api.get('/acl/check', {
    params: { object, relation, user },
  });
  return response.data;
};

export const createNamespace = async (namespace: Namespace) => {
  const response = await api.post('/namespace', namespace);
  return response.data;
};
