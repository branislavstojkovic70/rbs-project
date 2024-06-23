package main

import (
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