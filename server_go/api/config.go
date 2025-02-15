package api

import "github.com/AndrewKozinsky/postamat/storage"

type APIConfig struct {
	// Port
	BindAddr    string `toml:"bind_addr"`
	LoggerLevel string `toml:"logger_level"`
	Storage     *storage.StorageConfig
}

func NewConfig() *APIConfig {
	return &APIConfig{
		BindAddr:    ":8000",
		LoggerLevel: "info",
		Storage:     storage.NewStorageConfig(),
	}
}
