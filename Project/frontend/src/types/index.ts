export interface ACL {
    object: string;
    relation: string;
    user: string;
  }
  
  export interface Namespace {
    namespace: string;
    relations: {
      [key: string]: Relation;
    };
  }
  
  export interface Relation {
    union: Array<{ [key: string]: any }>;
  }
  