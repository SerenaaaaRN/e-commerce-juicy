package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
)

type AddressHandler struct {
	srv AddressService
}

func NewAddressHandler(srv AddressService) *AddressHandler {
	return &AddressHandler{srv: srv}
}

func (h *AddressHandler) GetAddresses(c *gin.Context) {
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
	addresses, err := h.srv.GetAddresses(c.Request.Context(), customerID)
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
		"data":    addresses,
	})
}

func (h *AddressHandler) GetAddressByID(c *gin.Context) {
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
		"data":    address,
	})
}

func (h *AddressHandler) CreateAddress(c *gin.Context) {
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
	var req dto.AddressRequest
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

	address, err := h.srv.CreateAddress(c.Request.Context(), customerID, req)
	if err != nil {
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
		"data":    address,
	})
}

func (h *AddressHandler) UpdateAddress(c *gin.Context) {
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
				"message": "Invalid address ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	var req dto.AddressRequest
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
		"data":    address,
	})
}

func (h *AddressHandler) DeleteAddress(c *gin.Context) {
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
		"message": "Address deleted successfully",
	})
}

func (h *AddressHandler) SetDefaultAddress(c *gin.Context) {
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
		"message": "Address set as default successfully",
	})
}
