package handler

import (
	"errors"
	"net/http"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AddressHandler struct {
	srv AddressService
}

// NewAddressHandler membuat instance baru dari AddressHandler.
func NewAddressHandler(srv AddressService) *AddressHandler {
	return &AddressHandler{srv: srv}
}

// GetAddresses menangani pengambilan semua daftar alamat milik customer yang sedang login.
func (h *AddressHandler) GetAddresses(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	addresses, err := h.srv.GetAddresses(c.Request.Context(), customerID)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, addresses)
}

// GetAddressByID menangani pengambilan detail alamat spesifik berdasarkan ID.
func (h *AddressHandler) GetAddressByID(c *gin.Context) {
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
				"message": "Invalid address ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	address, err := h.srv.GetAddressByID(c.Request.Context(), id, customerID)
	if err != nil {
		if errors.Is(err, service.ErrAddressNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Address not found",
					"code":    "ADDRESS_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, address)
}

// CreateAddress menangani pembuatan alamat pengiriman baru untuk customer.
func (h *AddressHandler) CreateAddress(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	var req dto.AddressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	address, err := h.srv.CreateAddress(c.Request.Context(), customerID, req)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	createdJSON(c, address)
}

// UpdateAddress menangani pembaruan data alamat pengiriman customer.
func (h *AddressHandler) UpdateAddress(c *gin.Context) {
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
				"message": "Invalid address ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	var req dto.AddressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	address, err := h.srv.UpdateAddress(c.Request.Context(), id, customerID, req)
	if err != nil {
		if errors.Is(err, service.ErrAddressNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Address not found",
					"code":    "ADDRESS_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, address)
}

// DeleteAddress menangani penghapusan alamat pengiriman customer.
func (h *AddressHandler) DeleteAddress(c *gin.Context) {
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
				"message": "Invalid address ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	err = h.srv.DeleteAddress(c.Request.Context(), id, customerID)
	if err != nil {
		if errors.Is(err, service.ErrAddressNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Address not found",
					"code":    "ADDRESS_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Address deleted successfully")
}

// SetDefaultAddress mengubah alamat pengiriman tertentu menjadi alamat utama (default).
func (h *AddressHandler) SetDefaultAddress(c *gin.Context) {
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
				"message": "Invalid address ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	err = h.srv.SetDefaultAddress(c.Request.Context(), id, customerID)
	if err != nil {
		if errors.Is(err, service.ErrAddressNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Address not found",
					"code":    "ADDRESS_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Address set as default successfully")
}
