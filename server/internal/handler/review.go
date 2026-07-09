package handler

import (
	"errors"
	"net/http"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ReviewHandler struct {
	srv ReviewService
}

func NewReviewHandler(srv ReviewService) *ReviewHandler {
	return &ReviewHandler{srv: srv}
}

func (h *ReviewHandler) SubmitReview(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	var req dto.CreateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	resp, err := h.srv.SubmitReview(c.Request.Context(), customerID, req)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			errJSON(c, http.StatusNotFound, "Product not found", "PRODUCT_NOT_FOUND")
			return
		}
		if errors.Is(err, service.ErrOrderNotFound) {
			errJSON(c, http.StatusNotFound, "Order not found", "ORDER_NOT_FOUND")
			return
		}
		if errors.Is(err, service.ErrOrderNotDelivered) {
			errJSON(c, http.StatusForbidden, "You can only review products from delivered orders", "ORDER_NOT_DELIVERED")
			return
		}
		if errors.Is(err, service.ErrNotPurchased) {
			errJSON(c, http.StatusForbidden, "You can only review products you have purchased in this order", "NOT_PURCHASED")
			return
		}
		if errors.Is(err, service.ErrAlreadyReviewed) {
			errJSON(c, http.StatusConflict, "You have already reviewed this product for this order", "ALREADY_REVIEWED")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	createdJSON(c, resp)
}

func (h *ReviewHandler) GetProductReviews(c *gin.Context) {
	slug := c.Param("slug")
	page, perPage := parsePaginationParams(c)

	reviews, total, err := h.srv.GetProductReviews(c.Request.Context(), slug, page, perPage)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			errJSON(c, http.StatusNotFound, "Product not found", "PRODUCT_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okPaginatedJSON(c, reviews, PaginationMeta{
		Page:       page,
		PerPage:    perPage,
		Total:      total,
		TotalPages: calcTotalPages(total, perPage),
	})
}

func (h *ReviewHandler) ListAllReviews(c *gin.Context) {
	var productID *uuid.UUID
	productIDStr := c.Query("product_id")
	if productIDStr != "" {
		pID, err := uuid.Parse(productIDStr)
		if err == nil {
			productID = &pID
		}
	}

	var published *bool
	publishedStr := c.Query("published")
	if publishedStr != "" {
		pub := false
		if publishedStr == "true" {
			pub = true
		}
		published = &pub
	}

	page, perPage := parsePaginationParams(c)

	reviews, total, err := h.srv.ListAllReviews(c.Request.Context(), productID, published, page, perPage)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okPaginatedJSON(c, reviews, PaginationMeta{
		Page:       page,
		PerPage:    perPage,
		Total:      total,
		TotalPages: calcTotalPages(total, perPage),
	})
}

func (h *ReviewHandler) UpdateReviewPublishStatus(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	var req dto.ReviewPublishRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, "")
		return
	}

	err := h.srv.UpdateReviewPublishStatus(c.Request.Context(), id, req.IsPublished)
	if err != nil {
		if errors.Is(err, service.ErrReviewNotFound) {
			errJSON(c, http.StatusNotFound, "Review not found", "REVIEW_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Review publish status updated successfully")
}

func (h *ReviewHandler) DeleteReview(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	err := h.srv.DeleteReview(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrReviewNotFound) {
			errJSON(c, http.StatusNotFound, "Review not found", "REVIEW_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Review deleted successfully")
}
