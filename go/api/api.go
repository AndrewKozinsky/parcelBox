package api

import (
	"github.com/AndrewKozinsky/postamat/routes"
	"net/http"

	"github.com/AndrewKozinsky/postamat/storage"
	"github.com/sirupsen/logrus"
)

type API struct {
	config  *APIConfig
	logger  *logrus.Logger
	storage *storage.Storage
}

func NewAPI(config *APIConfig) *API {
	return &API{
		config: config,
		logger: logrus.New(),
	}
}

func (api *API) StartAPI() error {
	// This method set logging method. It takes the value from configuration settings.
	if err := api.configureLoggerField(); err != nil {
		return err
	}

	api.logger.Info("Starting api server at localhost:", api.config.BindAddr)

	router := &routes.Routes{}
	router.SetUp()

	if err := api.configureStorageField(); err != nil {
		return err
	}

	return http.ListenAndServe(api.config.BindAddr, nil)
}
