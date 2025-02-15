package storage

type StorageConfig struct {
	DatabaseURI string `toml:"database_uri"`
}

func NewStorageConfig() *StorageConfig {
	return &StorageConfig{}
}
