package repository

import (
	"github.com/SerenaaaaRN/juicy/internal/service"
)

var (
	_ service.AdminRepository      = (*adminRepo)(nil)
	_ service.CustomerRepository   = (*customerRepo)(nil)
	_ service.AddressRepository    = (*addressRepo)(nil)
	_ service.CategoryRepository   = (*categoryRepo)(nil)
	_ service.ProductRepository    = (*productRepo)(nil)
	_ service.CartRepository       = (*cartRepo)(nil)
	_ service.OrderRepository      = (*orderRepo)(nil)
	_ service.WishlistRepository   = (*wishlistRepo)(nil)
	_ service.ReviewRepository     = (*reviewRepo)(nil)
	_ service.AnalyticsRepository  = (*analyticsRepo)(nil)
)
