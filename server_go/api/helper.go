package api

import (
	"github.com/AndrewKozinsky/postamat/storage"
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

func (api *API) configureStorageField() error {
	appStorage := storage.NewStorage(api.config.Storage)
	if err := appStorage.Open(); err != nil {
		return err
	}

	api.storage = appStorage
	return nil
}
