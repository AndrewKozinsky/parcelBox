package main

import (
	"fmt"
	"github.com/AndrewKozinsky/postamat/api"
	"log"

	"github.com/BurntSushi/toml"
)

var configPath = "configs/api.toml"

func main() {
	// Create a new configuration file with default values
	apiConfig := api.NewConfig()

	// Rewrite setting object with default values from configuration file
	_, err := toml.DecodeFile(configPath, apiConfig)
	if err != nil {
		log.Println("Error reading config file. Using default values")
	}
	fmt.Println(apiConfig)

	server := api.NewAPI(apiConfig)
	log.Fatal(server.StartAPI())
}
