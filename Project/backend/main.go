package main

import (
    "fmt"
    "log"
    "net/http"
    "os"
    "path/filepath"
    "github.com/joho/godotenv"
)

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file")
    }

    leveldbDir := os.Getenv("LEVELDB_DIR")
    if leveldbDir == "" {
        leveldbDir = "leveldb-data"
    }

    dbPath := filepath.Join(leveldbDir)
    err = initDB(dbPath)
    if err != nil {
        log.Fatalf("Failed to connect to LevelDB: %v", err)
    }
    defer closeDB()
    fmt.Println("Connected to LevelDB")

    err = initConsul()
    if err != nil {
        log.Fatalf("Failed to connect to Consul: %v", err)
    }
    fmt.Println("Connected to Consul")

    http.HandleFunc("/acl", handleACL)
    http.HandleFunc("/acl/check", handleACLCheck)
    http.HandleFunc("/namespace", handleNamespace)

    http.HandleFunc("/cors", func(w http.ResponseWriter, r *http.Request) {
        enableCors(&w)
        if r.Method == "OPTIONS" {
            return
        }
    })

    fmt.Println("Server is running on port 8080")
    log.Fatal(http.ListenAndServe(":8080", corsMiddleware(http.DefaultServeMux)))
}

func enableCors(w *http.ResponseWriter) {
    (*w).Header().Set("Access-Control-Allow-Origin", "*")
    (*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
    (*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        enableCors(&w)
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        next.ServeHTTP(w, r)
    })
}
