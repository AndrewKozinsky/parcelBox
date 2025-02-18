package storage

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq" // In order to init() function will work
)

type Storage struct {
	config *StorageConfig
	// DataBase FileDescriptor
	db *sql.DB
}

func NewStorage(config *StorageConfig) *Storage {
	return &Storage{
		config: config,
	}
}

func (storage Storage) Open() error {
	db, err := sql.Open("postgres", storage.config.DatabaseURI)
	if err != nil {
		log.Fatal("Can't open the connecting to the database")
		return err
	}

	if err := db.Ping(); err != nil {
		log.Fatal("Can't connect to the database")
		return err
	}

	storage.db = db
	return nil
}

func (storage Storage) Close() {
	storage.db.Close()
}
