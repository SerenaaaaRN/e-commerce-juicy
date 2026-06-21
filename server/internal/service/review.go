package service

import (
	"context"
	"errors"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
)

var (
	ErrNotPurchased      = errors.New("NOT_PURCHASED")
	ErrOrderNotDelivered = errors.New("ORDER_NOT_DELIVERED")
	ErrAlreadyReviewed   = errors.New("ALREADY_REVIEWED")
	ErrReviewNotFound    = errors.New("REVIEW_NOT_FOUND")
	ErrOrderNotFound     = errors.New("ORDER_NOT_FOUND")
)

type reviewService struct {
	repo         ReviewRepository
	orderRepo    OrderRepository
	productRepo  ProductRepository
	customerRepo CustomerRepository
}

func NewReviewService(
	repo ReviewRepository,
	orderRepo OrderRepository,
	productRepo ProductRepository,
	customerRepo CustomerRepository,
) *reviewService {
	return &reviewService{
		repo:         repo,
		orderRepo:    orderRepo,
		productRepo:  productRepo,
		customerRepo: customerRepo,
	}
}

func (s *reviewService) SubmitReview(ctx context.Context, customerID uuid.UUID, req dto.CreateReviewRequest) (*dto.ReviewResponse, error) {

	_, err := s.productRepo.FindByID(ctx, req.ProductID)
	if err != nil {
		return nil, ErrProductNotFound
	}

	order, err := s.orderRepo.FindByID(ctx, req.OrderID)
	if err != nil || order.CustomerID != customerID {
		return nil, ErrOrderNotFound
	}

	if order.Status != string(model.OrderStatusDelivered) {
		return nil, ErrOrderNotDelivered
	}

	purchased, err := s.orderRepo.IsProductReviewable(ctx, customerID, req.ProductID, req.OrderID)
	if err != nil || !purchased {
		return nil, ErrNotPurchased
	}

	exists, err := s.repo.Exists(ctx, customerID, req.ProductID, req.OrderID)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, ErrAlreadyReviewed
	}

	review := &model.Review{
		ProductID:   req.ProductID,
		CustomerID:  customerID,
		OrderID:     req.OrderID,
		Rating:      req.Rating,
		Body:        req.Body,
		IsPublished: true,
	}

	err = s.repo.Create(ctx, review)
	if err != nil {
		return nil, err
	}

	return &dto.ReviewResponse{
		ID:        review.ID,
		Rating:    review.Rating,
		Body:      review.Body,
		CreatedAt: review.CreatedAt,
	}, nil
}

func (s *reviewService) GetProductReviews(ctx context.Context, productSlug string, page, perPage int) ([]dto.ProductReviewResponse, int64, error) {
	product, err := s.productRepo.FindBySlug(ctx, productSlug)
	if err != nil {
		return nil, 0, ErrProductNotFound
	}

	reviews, total, err := s.repo.FindByProductID(ctx, product.ID, page, perPage)
	if err != nil {
		return nil, 0, err
	}

	res := make([]dto.ProductReviewResponse, len(reviews))
	for i, r := range reviews {
		res[i] = dto.ProductReviewResponse{
			ID:           r.ID,
			Rating:       r.Rating,
			Body:         r.Body,
			CustomerName: r.Customer.FullName,
			CreatedAt:    r.CreatedAt,
		}
	}

	return res, total, nil
}

func (s *reviewService) ListAllReviews(
	ctx context.Context,
	productID *uuid.UUID,
	published *bool,
	page, perPage int,
) ([]dto.AdminReviewResponse, int64, error) {
	reviews, total, err := s.repo.FindAll(ctx, productID, published, page, perPage)
	if err != nil {
		return nil, 0, err
	}

	res := make([]dto.AdminReviewResponse, len(reviews))
	for i, r := range reviews {
		res[i] = dto.AdminReviewResponse{
			ID:            r.ID,
			ProductID:     r.ProductID,
			ProductName:   r.Product.Name,
			CustomerID:    r.CustomerID,
			CustomerName:  r.Customer.FullName,
			CustomerEmail: r.Customer.Email,
			Rating:        r.Rating,
			Body:          r.Body,
			IsPublished:   r.IsPublished,
			CreatedAt:     r.CreatedAt,
		}
	}

	return res, total, nil
}

func (s *reviewService) UpdateReviewPublishStatus(ctx context.Context, id uuid.UUID, isPublished bool) error {
	_, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return ErrReviewNotFound
	}
	return s.repo.UpdatePublishStatus(ctx, id, isPublished)
}

func (s *reviewService) DeleteReview(ctx context.Context, id uuid.UUID) error {
	_, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return ErrReviewNotFound
	}
	return s.repo.Delete(ctx, id)
}
