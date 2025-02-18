package routes

type RouteUrlsTypeI struct {
	auth RouteUrlsAuthI
}

type RouteUrlsAuthI struct {
	registerAdmin string
}

var RouteUrls = RouteUrlsTypeI{
	auth: RouteUrlsAuthI{
		registerAdmin: "POST /admin/register",
	},
}
