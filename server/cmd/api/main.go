package main

import (
	"fmt"
	"log"

	"github.com/AndrewKozinsky/postamat/internal/app/api"
	"github.com/BurntSushi/toml"
)

var configPath = "configs/api.toml"

func main() {
	// Создать новый объект конфигурации АПИ с настройками по умолчанию
	apiConfig := api.NewConfig()

	// Перезаписать объект настроек по умолчанию значениями из файла конфигурации
	_, err := toml.DecodeFile(configPath, apiConfig)
	if err != nil {
		log.Println("Error reading config file. Using default values")
	}
	fmt.Println(apiConfig)

	server := api.NewAPI(apiConfig)
	log.Fatal(server.StartAPI())
}
