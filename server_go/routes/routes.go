package routes

import (
	authRoutes "github.com/AndrewKozinsky/postamat/routes/auth"
	"net/http"
)

type Routes struct {
}

func (routes *Routes) SetUp() {
	authRouter := &authRoutes.AuthRoutes{}

	http.HandleFunc(RouteUrls.auth.registerAdmin, authRouter.RegisterAdmin)
}
