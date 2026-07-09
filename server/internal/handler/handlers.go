package handler

type Handlers struct {
	Admin     *AdminHandler
	Customer  *CustomerHandler
	Address   *AddressHandler
	Category  *CategoryHandler
	Product   *ProductHandler
	Cart      *CartHandler
	Order     *OrderHandler
	Review    *ReviewHandler
	Wishlist  *WishlistHandler
	Analytics *AnalyticsHandler
}
