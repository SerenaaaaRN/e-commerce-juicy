package model

// OrderStatus merepresentasikan status dari sebuah pesanan.
type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "pending"
	OrderStatusConfirmed OrderStatus = "confirmed"
	OrderStatusShipped   OrderStatus = "shipped"
	OrderStatusDelivered OrderStatus = "delivered"
	OrderStatusCancelled OrderStatus = "cancelled"
)

// PaymentStatus merepresentasikan status pembayaran sebuah pesanan.
type PaymentStatus string

const (
	PaymentStatusUnpaid PaymentStatus = "unpaid"
	PaymentStatusPaid   PaymentStatus = "paid"
	PaymentStatusFailed PaymentStatus = "failed"
	PaymentStatusRefund PaymentStatus = "refunded"
)
