package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
)

type CartHandler struct {
	srv CartService
}

func NewCartHandler(srv CartService) *CartHandler {
	return &CartHandler{srv: srv}
}

func (h *CartHandler) GetCart(c *gin.Context) {
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
	cart, err := h.srv.GetCart(c.Request.Context(), customerID)
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
		"data":    cart,
	})
}

func (h *CartHandler) AddCartItem(c *gin.Context) {
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
	var req dto.AddCartItemRequest
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

	err := h.srv.AddCartItem(c.Request.Context(), customerID, req)
	if err != nil {
		if errors.Is(err, service.ErrVariantNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Variant not found or inactive",
					"code":    "VARIANT_NOT_FOUND",
				},
			})
			return
		}
		if errors.Is(err, service.ErrInsufficientStock) {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Insufficient variant stock",
					"code":    "INSUFFICIENT_STOCK",
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
		"message": "Item added to cart successfully",
	})
}

func (h *CartHandler) UpdateCartItemQuantity(c *gin.Context) {
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
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid cart item ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	var req dto.UpdateCartItemQuantityRequest
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

	err = h.srv.UpdateCartItemQuantity(c.Request.Context(), id, customerID, req)
	if err != nil {
		if errors.Is(err, service.ErrInsufficientStock) {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Insufficient variant stock",
					"code":    "INSUFFICIENT_STOCK",
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
		"message": "Cart item quantity updated successfully",
	})
}

func (h *CartHandler) RemoveCartItem(c *gin.Context) {
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
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid cart item ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	err = h.srv.RemoveCartItem(c.Request.Context(), id, customerID)
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
		"message": "Item removed from cart successfully",
	})
}

func (h *CartHandler) ClearCart(c *gin.Context) {
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
	err := h.srv.ClearCart(c.Request.Context(), customerID)
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
		"message": "Cart cleared successfully",
	})
}
