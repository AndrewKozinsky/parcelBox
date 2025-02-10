package api

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
)

type API struct {
	config *APIConfig
	logger *logrus.Logger
	router *mux.Router
}

func NewAPI(config *APIConfig) *API {
	return &API{
		config: config,
		logger: logrus.New(),
		router: mux.NewRouter(),
	}
}

func (api *API) StartAPI() error {
	// Этот метод задаёт уровень логирования, который задан в настройке конфигурации
	if err := api.configureLoggerField(); err != nil {
		return err
	}

	api.logger.Info("Starting api server at port:", api.config.BindAddr)

	api.cofigureRouterField()

	return http.ListenAndServe(api.config.BindAddr, api.router)
}
