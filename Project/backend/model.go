package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "github.com/syndtr/goleveldb/leveldb"
    "github.com/hashicorp/consul/api"
)

type ACL struct {
    Object   string `json:"object"`
    Relation string `json:"relation"`
    User     string `json:"user"`
}

type Namespace struct {
    Namespace string                `json:"namespace"`
    Relations map[string]Relation `json:"relations"`
}

type Relation struct {
    Union []map[string]interface{} `json:"union"`
}

var (
    db *leveldb.DB
    consulClient *api.Client
)

func initDB(leveldbDir string) error {
    var err error
    db, err = leveldb.OpenFile(leveldbDir, nil)
    return err
}

func closeDB() {
    db.Close()
}

func initConsul() error {
    var err error
    consulConfig := api.DefaultConfig()
    consulClient, err = api.NewClient(consulConfig)
    return err
}

func createACLEntry(object, relation, user string) error {
    key := fmt.Sprintf("%s#%s@%s", object, relation, user)
    return db.Put([]byte(key), []byte{}, nil)
}

func handleACL(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    var acl ACL
    err := json.NewDecoder(r.Body).Decode(&acl)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    err = createACLEntry(acl.Object, acl.Relation, acl.User)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    switch acl.Relation {
    case "owner":
        err = createACLEntry(acl.Object, "editor", acl.User)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        err = createACLEntry(acl.Object, "viewer", acl.User)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
    case "editor":
        err = createACLEntry(acl.Object, "viewer", acl.User)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(acl)
}

func handleACLCheck(w http.ResponseWriter, r *http.Request) {
    object := r.URL.Query().Get("object")
    relation := r.URL.Query().Get("relation")
    user := r.URL.Query().Get("user")

    key := fmt.Sprintf("%s#%s@%s", object, relation, user)
    _, err := db.Get([]byte(key), nil)
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]bool{"authorized": true})
}

func handleNamespace(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    var namespace Namespace
    err := json.NewDecoder(r.Body).Decode(&namespace)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    data, err := json.Marshal(namespace)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    kv := consulClient.KV()
    p := &api.KVPair{Key: namespace.Namespace, Value: data}
    _, err = kv.Put(p, nil)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
}