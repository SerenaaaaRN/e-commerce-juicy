package handler

import (
	"errors"
	"net/http"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CartHandler struct {
	srv CartService
}

// NewCartHandler membuat instance baru dari CartHandler.
func NewCartHandler(srv CartService) *CartHandler {
	return &CartHandler{srv: srv}
}

// GetCart mengambil isi keranjang belanja customer beserta total harganya.
func (h *CartHandler) GetCart(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	cart, err := h.srv.GetCart(c.Request.Context(), customerID)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, cart)
}

// AddCartItem menambahkan item produk ke keranjang belanja customer.
func (h *CartHandler) AddCartItem(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	var req dto.AddCartItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
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
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Item added to cart successfully")
}

// UpdateCartItemQuantity memperbarui kuantitas item produk di keranjang belanja.
func (h *CartHandler) UpdateCartItemQuantity(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
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
		validationErrJSON(c, err.Error())
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
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Cart item quantity updated successfully")
}

// RemoveCartItem menghapus satu item produk dari keranjang belanja.
func (h *CartHandler) RemoveCartItem(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
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
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Item removed from cart successfully")
}

// ClearCart mengosongkan seluruh isi keranjang belanja customer.
func (h *CartHandler) ClearCart(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	err := h.srv.ClearCart(c.Request.Context(), customerID)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Cart cleared successfully")
}
