package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
)

type ReviewHandler struct {
	srv ReviewService
}

func NewReviewHandler(srv ReviewService) *ReviewHandler {
	return &ReviewHandler{srv: srv}
}

func (h *ReviewHandler) SubmitReview(c *gin.Context) {
	customerIDVal, exists := c.Get("customer_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Unauthorized context",
				"code":    "UNAUTHORIZED",
			},
		})
		return
	}

	customerID := customerIDVal.(uuid.UUID)
	var req dto.CreateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Validation error",
				"code":    "VALIDATION_ERROR",
				"details": err.Error(),
			},
		})
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"message": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    resp,
	})
}

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
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"message": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    reviews,
		"meta": gin.H{
			"total":    total,
			"page":     page,
			"per_page": perPage,
		},
	})
}

// Admin review routes

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
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"message": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    reviews,
		"meta": gin.H{
			"total":    total,
			"page":     page,
			"per_page": perPage,
		},
	})
}

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
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Validation error",
				"code":    "VALIDATION_ERROR",
			},
		})
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"message": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Review publish status updated successfully",
	})
}

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
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"message": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Review deleted successfully",
	})
}
