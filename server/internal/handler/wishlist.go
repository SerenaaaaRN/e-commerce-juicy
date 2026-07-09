package handler

import (
	"errors"
	"net/http"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
)

type WishlistHandler struct {
	srv WishlistService
}

func NewWishlistHandler(srv WishlistService) *WishlistHandler {
	return &WishlistHandler{srv: srv}
}

func (h *WishlistHandler) GetWishlist(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}

	items, err := h.srv.GetWishlist(c.Request.Context(), customerID)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, items)
}

func (h *WishlistHandler) CheckWishlist(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}

	variantID, ok := parseUUIDParam(c, "variantId")
	if !ok {
		return
	}

	inWishlist, err := h.srv.CheckWishlist(c.Request.Context(), customerID, variantID)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, dto.WishlistCheckResponse{InWishlist: inWishlist})
}

func (h *WishlistHandler) AddToWishlist(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}

	var req dto.AddWishlistItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	err := h.srv.AddToWishlist(c.Request.Context(), customerID, req.VariantID)
	if err != nil {
		if errors.Is(err, service.ErrWishlistItemExists) {
			errJSON(c, http.StatusConflict, "Item already in wishlist", "ALREADY_IN_WISHLIST")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	c.JSON(http.StatusCreated, SuccessResponse{
		Success: true,
		Message: "Added to wishlist",
	})
}

func (h *WishlistHandler) RemoveFromWishlist(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}

	variantID, ok := parseUUIDParam(c, "variantId")
	if !ok {
		return
	}

	err := h.srv.RemoveFromWishlist(c.Request.Context(), customerID, variantID)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Removed from wishlist")
}
