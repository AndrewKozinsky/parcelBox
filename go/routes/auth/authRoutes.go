package authRoutes

import (
	"errors"
	"fmt"
	"github.com/AndrewKozinsky/postamat/webHelpers"
	"log"
	"net/http"
)

type Person struct {
	Name string
	Age  int
}

type AuthRoutes struct{}

// Register a user as an administrator
func (ar AuthRoutes) RegisterAdmin(w http.ResponseWriter, r *http.Request) {
	var person Person

	err := webHelpers.DecodeJSONBody(w, r, &person)
	if err != nil {
		var mr *webHelpers.MalformedRequest
		if errors.As(err, &mr) {
			http.Error(w, mr.Msg, mr.Status)
		} else {
			log.Print(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	fmt.Fprintf(w, "Person: %+v", person)

	//r.Body.Read(make([]byte, 1))
	w.Write([]byte("Register admin"))
}
