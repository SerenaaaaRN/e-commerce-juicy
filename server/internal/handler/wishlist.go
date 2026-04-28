package handler

import (
	"errors"
	"net/http"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type WishlistHandler struct {
	srv WishlistService
}

func NewWishlistHandler(srv WishlistService) *WishlistHandler {
	return &WishlistHandler{srv: srv}
}

func (h *WishlistHandler) GetWishlist(c *gin.Context) {
	customerIDVal, exists := c.Get("customer_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"message": "Unauthorized", "code": "UNAUTHORIZED"}})
		return
	}
	customerID := customerIDVal.(uuid.UUID)

	items, err := h.srv.GetWishlist(c.Request.Context(), customerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"message": err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": items})
}

func (h *WishlistHandler) CheckWishlist(c *gin.Context) {
	customerIDVal, exists := c.Get("customer_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"message": "Unauthorized", "code": "UNAUTHORIZED"}})
		return
	}
	customerID := customerIDVal.(uuid.UUID)

	variantID, err := uuid.Parse(c.Param("variantId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"message": "Invalid variant ID", "code": "BAD_REQUEST"}})
		return
	}

	inWishlist, err := h.srv.CheckWishlist(c.Request.Context(), customerID, variantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"message": err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": dto.WishlistCheckResponse{InWishlist: inWishlist}})
}

func (h *WishlistHandler) AddToWishlist(c *gin.Context) {
	customerIDVal, exists := c.Get("customer_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"message": "Unauthorized", "code": "UNAUTHORIZED"}})
		return
	}
	customerID := customerIDVal.(uuid.UUID)

	var req dto.AddWishlistItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"success": false, "error": gin.H{"message": "Validation error", "code": "VALIDATION_ERROR", "details": err.Error()}})
		return
	}

	err := h.srv.AddToWishlist(c.Request.Context(), customerID, req.VariantID)
	if err != nil {
		if errors.Is(err, service.ErrWishlistItemExists) {
			c.JSON(http.StatusConflict, gin.H{"success": false, "error": gin.H{"message": "Item already in wishlist", "code": "ALREADY_IN_WISHLIST"}})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"message": err.Error()}})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Added to wishlist"})
}

func (h *WishlistHandler) RemoveFromWishlist(c *gin.Context) {
	customerIDVal, exists := c.Get("customer_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"message": "Unauthorized", "code": "UNAUTHORIZED"}})
		return
	}
	customerID := customerIDVal.(uuid.UUID)

	variantID, err := uuid.Parse(c.Param("variantId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"message": "Invalid variant ID", "code": "BAD_REQUEST"}})
		return
	}

	err = h.srv.RemoveFromWishlist(c.Request.Context(), customerID, variantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"message": err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Removed from wishlist"})
}
