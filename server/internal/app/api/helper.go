package api

import (
	"net/http"

	"github.com/sirupsen/logrus"
)

func (api *API) configureLoggerField() error {
	log_level, err := logrus.ParseLevel(api.config.LoggerLevel)
	if err != nil {
		return err
	}

	api.logger.SetLevel(log_level)
	return nil
}

func (api *API) cofigureRouterField() {
	api.router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, World!"))
	}).Methods("GET")
}
