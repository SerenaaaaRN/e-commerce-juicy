package dto

type AnalyticsOverview struct {
	Orders   AnalyticsOrders   `json:"orders"`
	Revenue  AnalyticsRevenue  `json:"revenue"`
	Customers AnalyticsCustomers `json:"customers"`
	Products AnalyticsProducts `json:"products"`
}

type AnalyticsOrders struct {
	Total       int64 `json:"total"`
	Pending     int64 `json:"pending"`
	Processing  int64 `json:"processing"`
	ThisMonth   int64 `json:"this_month"`
}

type AnalyticsRevenue struct {
	Total     float64 `json:"total"`
	ThisMonth float64 `json:"this_month"`
}

type AnalyticsCustomers struct {
	Total        int64 `json:"total"`
	NewThisMonth int64 `json:"new_this_month"`
}

type AnalyticsProducts struct {
	Total      int64 `json:"total"`
	OutOfStock int64 `json:"out_of_stock"`
}

type OrdersChartItem struct {
	Month      string  `json:"month"`
	OrderCount int     `json:"order_count"`
	Revenue    float64 `json:"revenue"`
}
