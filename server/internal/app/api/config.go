package api

type APIConfig struct {
	// Port
	BindAddr    string `toml:"bind_addr"`
	LoggerLevel string `toml:"logger_level"`
}

func NewConfig() *APIConfig {
	return &APIConfig{
		BindAddr:    ":8000",
		LoggerLevel: "info",
	}
}
