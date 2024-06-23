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

	fmt.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))

}
