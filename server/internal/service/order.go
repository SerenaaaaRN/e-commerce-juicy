package service

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	"time"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/SerenaaaaRN/juicy/internal/repository"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	ErrCartEmpty = errors.New("CART_EMPTY")
)

type orderService struct {
	repo         OrderRepository
	cartRepo     CartRepository
	addressRepo  AddressRepository
	productRepo  ProductRepository
	customerRepo CustomerRepository
	emailService *EmailService
	worker       *BackgroundWorker
	db           *gorm.DB
}

func NewOrderService(
	repo OrderRepository,
	cartRepo CartRepository,
	addressRepo AddressRepository,
	productRepo ProductRepository,
	customerRepo CustomerRepository,
	emailService *EmailService,
	worker *BackgroundWorker,
	db *gorm.DB,
) *orderService {
	return &orderService{
		repo:         repo,
		cartRepo:     cartRepo,
		addressRepo:  addressRepo,
		productRepo:  productRepo,
		customerRepo: customerRepo,
		emailService: emailService,
		worker:       worker,
		db:           db,
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

		primaryImg := ""
		for _, img := range product.Images {
			if img.IsPrimary {
				primaryImg = img.ImageURL
				break
			}
		}
		if primaryImg == "" && len(product.Images) > 0 {
			primaryImg = product.Images[0].ImageURL
		}

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

	var shippingFee float64 = 25000
	total := subtotal + shippingFee

	dateStr := time.Now().Format("20060102")
	orderNumber := fmt.Sprintf("JUICY-%s-%s", dateStr, generateRandomAlphanumeric(6))

	order := &model.Order{
		CustomerID:    customerID,
		AddressID:     &req.AddressID,
		OrderNumber:   orderNumber,
		Status:        "pending",
		Subtotal:      subtotal,
		ShippingFee:   shippingFee,
		Total:         total,
		PaymentStatus: "unpaid",
		PaymentMethod: &req.PaymentMethod,
		Notes:         req.Notes,
	}

	err = s.repo.Create(ctx, order, orderItems)
	if err != nil {
		if errors.Is(err, repository.ErrOutOfStock) {
			return nil, repository.ErrOutOfStock
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
	for i, o := range orders {
		var itemCount int64
		s.db.WithContext(ctx).Model(&model.OrderItem{}).Where("order_id = ?", o.ID).Count(&itemCount)

		res[i] = dto.OrderResponse{
			ID:          o.ID,
			OrderNumber: o.OrderNumber,
			Status:      o.Status,
			Total:       o.Total,
			ItemCount:   int(itemCount),
			CreatedAt:   o.CreatedAt,
		}
	}

	return res, total, nil
}

func (s *orderService) GetCustomerOrderDetail(ctx context.Context, orderNumber string, customerID uuid.UUID) (*dto.OrderDetailResponse, error) {
	order, err := s.repo.FindByOrderNumberAndCustomerID(ctx, orderNumber, customerID)
	if err != nil {
		return nil, ErrOrderNotFound
	}

	var address model.Address
	if order.AddressID != nil {
		s.db.WithContext(ctx).Where("id = ?", *order.AddressID).First(&address)
	}

	itemsRes := make([]dto.OrderItemResponse, len(order.Items))
	for i, item := range order.Items {
		itemsRes[i] = dto.OrderItemResponse{
			ProductName:  item.ProductName,
			VariantSize:  item.VariantSize,
			VariantColor: item.VariantColor,
			ImageURL:     item.ImageURL,
			Quantity:     item.Quantity,
			UnitPrice:    item.UnitPrice,
		}
	}

	return &dto.OrderDetailResponse{
		ID:            order.ID,
		OrderNumber:   order.OrderNumber,
		Status:        order.Status,
		PaymentStatus: order.PaymentStatus,
		Subtotal:      order.Subtotal,
		ShippingFee:   order.ShippingFee,
		Total:         order.Total,
		ShippedAt:     order.ShippedAt,
		Address: dto.OrderAddressInfo{
			RecipientName: address.RecipientName,
			Phone:         address.Phone,
			AddressLine:   address.AddressLine,
			City:          address.City,
			Province:      address.Province,
			PostalCode:    address.PostalCode,
		},
		Items:     itemsRes,
		CreatedAt: order.CreatedAt,
	}, nil
}

func (s *orderService) ListAllOrders(
	ctx context.Context,
	status string,
	paymentStatus string,
	search string,
	page, perPage int,
) ([]dto.AdminOrderResponse, int64, error) {
	orders, total, err := s.repo.FindAll(ctx, status, paymentStatus, search, page, perPage)
	if err != nil {
		return nil, 0, err
	}

	res := make([]dto.AdminOrderResponse, len(orders))
	for i, o := range orders {
		var itemCount int64
		s.db.WithContext(ctx).Model(&model.OrderItem{}).Where("order_id = ?", o.ID).Count(&itemCount)

		res[i] = dto.AdminOrderResponse{
			ID:            o.ID,
			OrderNumber:   o.OrderNumber,
			CustomerName:  o.Customer.FullName,
			CustomerEmail: o.Customer.Email,
			Status:        o.Status,
			PaymentStatus: o.PaymentStatus,
			Total:         o.Total,
			ItemCount:     int(itemCount),
			CreatedAt:     o.CreatedAt,
		}
	}

	return res, total, nil
}

func (s *orderService) GetOrderDetail(ctx context.Context, id uuid.UUID) (*dto.OrderDetailResponse, error) {
	order, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrOrderNotFound
	}

	itemsRes := make([]dto.OrderItemResponse, len(order.Items))
	for i, item := range order.Items {
		itemsRes[i] = dto.OrderItemResponse{
			ProductName:  item.ProductName,
			VariantSize:  item.VariantSize,
			VariantColor: item.VariantColor,
			ImageURL:     item.ImageURL,
			Quantity:     item.Quantity,
			UnitPrice:    item.UnitPrice,
		}
	}

	var addrInfo dto.OrderAddressInfo
	if order.Address != nil {
		addrInfo = dto.OrderAddressInfo{
			RecipientName: order.Address.RecipientName,
			Phone:         order.Address.Phone,
			AddressLine:   order.Address.AddressLine,
			City:          order.Address.City,
			Province:      order.Address.Province,
			PostalCode:    order.Address.PostalCode,
		}
	}

	return &dto.OrderDetailResponse{
		ID:            order.ID,
		OrderNumber:   order.OrderNumber,
		Status:        order.Status,
		PaymentStatus: order.PaymentStatus,
		Subtotal:      order.Subtotal,
		ShippingFee:   order.ShippingFee,
		Total:         order.Total,
		ShippedAt:     order.ShippedAt,
		Address:       addrInfo,
		Items:         itemsRes,
		CreatedAt:     order.CreatedAt,
	}, nil
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

	if status == "shipped" {
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

func generateRandomAlphanumeric(length int) string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	for i := range b {
		n, _ := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		b[i] = charset[n.Int64()]
	}
	return string(b)
}
