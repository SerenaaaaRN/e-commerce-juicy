package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ReviewHandler struct {
	srv ReviewService
}

// NewReviewHandler membuat instance baru dari ReviewHandler.
func NewReviewHandler(srv ReviewService) *ReviewHandler {
	return &ReviewHandler{srv: srv}
}

// SubmitReview mengirimkan ulasan baru untuk produk yang telah dibeli.
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
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Product not found",
					"code":    "PRODUCT_NOT_FOUND",
				},
			})
			return
		}
		if errors.Is(err, service.ErrOrderNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Order not found",
					"code":    "ORDER_NOT_FOUND",
				},
			})
			return
		}
		if errors.Is(err, service.ErrOrderNotDelivered) {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"error": gin.H{
					"message": "You can only review products from delivered orders",
					"code":    "ORDER_NOT_DELIVERED",
				},
			})
			return
		}
		if errors.Is(err, service.ErrNotPurchased) {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"error": gin.H{
					"message": "You can only review products you have purchased in this order",
					"code":    "NOT_PURCHASED",
				},
			})
			return
		}
		if errors.Is(err, service.ErrAlreadyReviewed) {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"error": gin.H{
					"message": "You have already reviewed this product for this order",
					"code":    "ALREADY_REVIEWED",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	createdJSON(c, resp)
}

// GetProductReviews mengambil daftar ulasan produk yang telah dipublikasikan.
func (h *ReviewHandler) GetProductReviews(c *gin.Context) {
	slug := c.Param("slug")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "5"))

	reviews, total, err := h.srv.GetProductReviews(c.Request.Context(), slug, page, perPage)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Product not found",
					"code":    "PRODUCT_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	totalPages := (int(total) + perPage - 1) / perPage
	if totalPages == 0 {
		totalPages = 1
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    reviews,
		"meta": gin.H{
			"total":       total,
			"page":        page,
			"per_page":    perPage,
			"total_pages": totalPages,
		},
	})
}

// ListAllReviews mengambil daftar semua ulasan masuk untuk moderasi (untuk admin).
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

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))

	reviews, total, err := h.srv.ListAllReviews(c.Request.Context(), productID, published, page, perPage)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	totalPages := (int(total) + perPage - 1) / perPage
	if totalPages == 0 {
		totalPages = 1
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    reviews,
		"meta": gin.H{
			"total":       total,
			"page":        page,
			"per_page":    perPage,
			"total_pages": totalPages,
		},
	})
}

// UpdateReviewPublishStatus memperbarui status publikasi ulasan (untuk admin).
func (h *ReviewHandler) UpdateReviewPublishStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid review ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	var req dto.ReviewPublishRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, "")
		return
	}

	err = h.srv.UpdateReviewPublishStatus(c.Request.Context(), id, req.IsPublished)
	if err != nil {
		if errors.Is(err, service.ErrReviewNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Review not found",
					"code":    "REVIEW_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Review publish status updated successfully")
}

// DeleteReview menghapus ulasan produk secara permanen (untuk admin).
func (h *ReviewHandler) DeleteReview(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid review ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	err = h.srv.DeleteReview(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrReviewNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Review not found",
					"code":    "REVIEW_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Review deleted successfully")
}
