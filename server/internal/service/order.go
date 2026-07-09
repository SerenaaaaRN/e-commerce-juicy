package service

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"log/slog"
	"math/big"
	"time"

	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
)

type orderService struct {
	repo         OrderRepository
	cartRepo     CartRepository
	addressRepo  AddressRepository
	productRepo  ProductRepository
	customerRepo CustomerRepository
	emailService *EmailService
	worker       *BackgroundWorker
	config       *config.Config
}

func NewOrderService(
	repo OrderRepository,
	cartRepo CartRepository,
	addressRepo AddressRepository,
	productRepo ProductRepository,
	customerRepo CustomerRepository,
	emailService *EmailService,
	worker *BackgroundWorker,
	cfg *config.Config,
) *orderService {
	return &orderService{
		repo:         repo,
		cartRepo:     cartRepo,
		addressRepo:  addressRepo,
		productRepo:  productRepo,
		customerRepo: customerRepo,
		emailService: emailService,
		worker:       worker,
		config:       cfg,
	}
}

func (s *orderService) Checkout(ctx context.Context, customerID uuid.UUID, req dto.CheckoutRequest) (*dto.OrderCheckoutResponse, error) {
	address, err := s.addressRepo.FindByID(ctx, req.AddressID)
	if err != nil {
		return nil, fmt.Errorf("checkout find address: %w", err)
	}
	if address.CustomerID != customerID {
		return nil, ErrAddressNotFound
	}

	cartItems, err := s.cartRepo.FindByCustomerID(ctx, customerID)
	if err != nil {
		return nil, fmt.Errorf("checkout find cart items: %w", err)
	}

	if len(cartItems) == 0 {
		return nil, ErrCartEmpty
	}

	var orderItems []model.OrderItem
	var subtotal float64 = 0

	for _, item := range cartItems {
		product, err := s.productRepo.FindByID(ctx, item.Variant.ProductID)
		if err != nil {
			return nil, fmt.Errorf("failed to fetch product for variant: %w", err)
		}

		primaryImg := getPrimaryImageURL(product.Images)

		unitPrice := product.Price + item.Variant.AdditionalPrice
		subtotal += unitPrice * float64(item.Quantity)

		var imgURL *string
		if primaryImg != "" {
			imgURL = &primaryImg
		}

		vID := item.VariantID
		orderItems = append(orderItems, model.OrderItem{
			VariantID:    &vID,
			ProductName:  product.Name,
			VariantSize:  item.Variant.Size,
			VariantColor: item.Variant.Color,
			ImageURL:     imgURL,
			Quantity:     item.Quantity,
			UnitPrice:    unitPrice,
		})
	}

	shippingFee := s.config.DefaultShippingFee
	total := subtotal + shippingFee

	dateStr := time.Now().Format("060102")
	orderNumber := fmt.Sprintf("JUICY-%s-%s", dateStr, generateRandomAlphanumeric(6))

	order := &model.Order{
		CustomerID:    customerID,
		AddressID:     &req.AddressID,
		OrderNumber:   orderNumber,
		Status:        string(model.OrderStatusPending),
		Subtotal:      subtotal,
		ShippingFee:   shippingFee,
		Total:         total,
		PaymentStatus: string(model.PaymentStatusUnpaid),
		PaymentMethod: &req.PaymentMethod,
		Notes:         req.Notes,
	}

	err = s.repo.Create(ctx, order, orderItems)
	if err != nil {
		if errors.Is(err, ErrOutOfStock) {
			return nil, ErrOutOfStock
		}
		return nil, fmt.Errorf("checkout create order: %w", err)
	}

	customer, err := s.customerRepo.FindByID(ctx, customerID)
	if err == nil && customer != nil {
		_ = s.worker.Submit(func(workerCtx context.Context) {
			s.emailService.SendOrderConfirmation(workerCtx, customer.Email, customer.FullName, order)
			s.emailService.SendAdminOrderAlert(workerCtx, order)
		})
	}

	return &dto.OrderCheckoutResponse{
		ID:          order.ID,
		OrderNumber: order.OrderNumber,
		Status:      order.Status,
		Total:       order.Total,
	}, nil
}

func (s *orderService) GetCustomerOrders(ctx context.Context, customerID uuid.UUID, page, perPage int) ([]dto.OrderResponse, int64, error) {
	orders, total, err := s.repo.FindByCustomerID(ctx, customerID, page, perPage)
	if err != nil {
		return nil, 0, err
	}

	res := make([]dto.OrderResponse, len(orders))
	for i, order := range orders {
		res[i] = dto.OrderResponse{
			ID:          order.ID,
			OrderNumber: order.OrderNumber,
			Status:      order.Status,
			Total:       order.Total,
			ItemCount:   len(order.Items),
			CreatedAt:   order.CreatedAt,
		}
	}

	return res, total, nil
}

func (s *orderService) GetCustomerOrderDetail(ctx context.Context, orderNumber string, customerID uuid.UUID) (*dto.OrderDetailResponse, error) {
	order, err := s.repo.FindByOrderNumberAndCustomerID(ctx, orderNumber, customerID)
	if err != nil {
		return nil, ErrOrderNotFound
	}

	if order.CustomerID != customerID {
		return nil, ErrOrderNotFound
	}

	variantProductMap := s.resolveVariantProductIDs(ctx, order.Items)
	return mapToOrderDetailResponse(order, variantProductMap), nil
}

func (s *orderService) CancelOrder(ctx context.Context, orderNumber string, customerID uuid.UUID) error {
	order, err := s.repo.FindByOrderNumberAndCustomerID(ctx, orderNumber, customerID)
	if err != nil {
		return ErrOrderNotFound
	}

	if order.CustomerID != customerID {
		return ErrOrderNotFound
	}

	if order.Status != string(model.OrderStatusPending) && order.Status != string(model.OrderStatusConfirmed) {
		return ErrCannotCancelOrder
	}

	return s.repo.CancelOrder(ctx, order.ID)
}

func (s *orderService) CompleteOrder(ctx context.Context, orderNumber string, customerID uuid.UUID) error {
	order, err := s.repo.FindByOrderNumberAndCustomerID(ctx, orderNumber, customerID)
	if err != nil {
		return ErrOrderNotFound
	}

	if order.CustomerID != customerID {
		return ErrOrderNotFound
	}

	return s.repo.CompleteOrderTx(ctx, order.ID)
}

func (s *orderService) ListAllOrders(ctx context.Context, status string, paymentStatus string, search string, page, perPage int) ([]dto.AdminOrderResponse, int64, error) {
	orders, total, err := s.repo.FindAll(ctx, status, paymentStatus, search, page, perPage)
	if err != nil {
		return nil, 0, err
	}

	res := make([]dto.AdminOrderResponse, len(orders))
	for i, order := range orders {
		res[i] = dto.AdminOrderResponse{
			ID:            order.ID,
			OrderNumber:   order.OrderNumber,
			CustomerName:  order.Customer.FullName,
			CustomerEmail: order.Customer.Email,
			Status:        order.Status,
			PaymentStatus: order.PaymentStatus,
			Total:         order.Total,
			ItemCount:     len(order.Items),
			CreatedAt:     order.CreatedAt,
		}
	}

	return res, total, nil
}

func (s *orderService) GetOrderDetail(ctx context.Context, id uuid.UUID) (*dto.OrderDetailResponse, error) {
	order, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrOrderNotFound
	}

	variantProductMap := s.resolveVariantProductIDs(ctx, order.Items)
	return mapToOrderDetailResponse(order, variantProductMap), nil
}

func (s *orderService) UpdateOrderStatus(ctx context.Context, id uuid.UUID, status string) error {
	order, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return ErrOrderNotFound
	}

	err = s.repo.UpdateStatus(ctx, id, status)
	if err != nil {
		return err
	}

	if status == string(model.OrderStatusShipped) {
		_ = s.worker.Submit(func(workerCtx context.Context) {
			s.emailService.SendShippingUpdate(workerCtx, order.Customer.Email, order.Customer.FullName, order)
		})
	}

	return nil
}

func (s *orderService) UpdateOrderPaymentStatus(ctx context.Context, id uuid.UUID, paymentStatus string) error {
	_, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return ErrOrderNotFound
	}

	return s.repo.UpdatePaymentStatus(ctx, id, paymentStatus)
}

func mapToOrderDetailResponse(order *model.Order, variantProductMap map[uuid.UUID]uuid.UUID) *dto.OrderDetailResponse {
	itemsRes := make([]dto.OrderItemResponse, len(order.Items))
	for i, item := range order.Items {
		var pID *uuid.UUID
		if item.VariantID != nil {
			if prodID, ok := variantProductMap[*item.VariantID]; ok {
				pID = &prodID
			}
		}

		itemsRes[i] = dto.OrderItemResponse{
			ProductID:    pID,
			ProductName:  item.ProductName,
			VariantSize:  item.VariantSize,
			VariantColor: item.VariantColor,
			ImageURL:     item.ImageURL,
			Quantity:     item.Quantity,
			UnitPrice:    item.UnitPrice,
			Subtotal:     item.UnitPrice * float64(item.Quantity),
		}
	}

	addr := order.Address

	return &dto.OrderDetailResponse{
		ID:            order.ID,
		OrderNumber:   order.OrderNumber,
		Status:        order.Status,
		PaymentStatus: order.PaymentStatus,
		Subtotal:      order.Subtotal,
		ShippingFee:   order.ShippingFee,
		Total:         order.Total,
		Notes:         order.Notes,
		ShippedAt:     order.ShippedAt,
		DeliveredAt:   order.DeliveredAt,
		Address: dto.OrderAddressInfo{
			RecipientName: addr.RecipientName,
			Phone:         addr.Phone,
			AddressLine:   addr.AddressLine,
			City:          addr.City,
			Province:      addr.Province,
			PostalCode:    addr.PostalCode,
		},
		Items:     itemsRes,
		CreatedAt: order.CreatedAt,
	}
}

func (s *orderService) resolveVariantProductIDs(ctx context.Context, items []model.OrderItem) map[uuid.UUID]uuid.UUID {
	var variantIDs []uuid.UUID
	for _, item := range items {
		if item.VariantID != nil {
			variantIDs = append(variantIDs, *item.VariantID)
		}
	}
	if len(variantIDs) == 0 {
		return nil
	}
	result, err := s.productRepo.FindVariantsByIDs(ctx, variantIDs)
	if err != nil {
		slog.Warn("Failed to resolve variant product IDs", "error", err)
		return nil
	}
	return result
}

func generateRandomAlphanumeric(length int) string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	for i := range b {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			b[i] = charset[time.Now().UnixNano()%int64(len(charset))]
			continue
		}
		b[i] = charset[n.Int64()]
	}
	return string(b)
}
