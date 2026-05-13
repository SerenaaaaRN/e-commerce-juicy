package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/repository"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type OrderHandler struct {
	srv OrderService
}

func NewOrderHandler(srv OrderService) *OrderHandler {
	return &OrderHandler{srv: srv}
}

func (h *OrderHandler) Checkout(c *gin.Context) {
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
	var req dto.CheckoutRequest
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

	resp, err := h.srv.Checkout(c.Request.Context(), customerID, req)
	if err != nil {
		if errors.Is(err, service.ErrAddressNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Delivery address not found",
					"code":    "ADDRESS_NOT_FOUND",
				},
			})
			return
		}
		if errors.Is(err, service.ErrCartEmpty) {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Cannot checkout with an empty cart",
					"code":    "CART_EMPTY",
				},
			})
			return
		}
		if errors.Is(err, repository.ErrOutOfStock) {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"error": gin.H{
					"message": "One or more items in your cart are out of stock",
					"code":    "OUT_OF_STOCK",
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

func (h *OrderHandler) GetCustomerOrders(c *gin.Context) {
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
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))

	orders, total, err := h.srv.GetCustomerOrders(c.Request.Context(), customerID, page, perPage)
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
		"data":    orders,
		"meta": gin.H{
			"total":    total,
			"page":     page,
			"per_page": perPage,
		},
	})
}

func (h *OrderHandler) GetCustomerOrderDetail(c *gin.Context) {
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
	orderNumber := c.Param("orderNumber")

	order, err := h.srv.GetCustomerOrderDetail(c.Request.Context(), orderNumber, customerID)
	if err != nil {
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
		"data":    order,
	})
}

func (h *OrderHandler) CancelOrder(c *gin.Context) {
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
	orderNumber := c.Param("orderNumber")

	err := h.srv.CancelOrder(c.Request.Context(), orderNumber, customerID)
	if err != nil {
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
		if errors.Is(err, service.ErrCannotCancelOrder) {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Order cannot be cancelled in its current status",
					"code":    "CANNOT_CANCEL_ORDER",
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
		"message": "Order cancelled successfully",
	})
}

func (h *OrderHandler) CompleteOrder(c *gin.Context) {
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
	orderNumber := c.Param("orderNumber")

	err := h.srv.CompleteOrder(c.Request.Context(), orderNumber, customerID)
	if err != nil {
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
		"message": "Order completed successfully",
	})
}

func (h *OrderHandler) ListAllOrders(c *gin.Context) {
	status := c.Query("status")
	paymentStatus := c.Query("payment_status")
	search := c.Query("search")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))

	orders, total, err := h.srv.ListAllOrders(c.Request.Context(), status, paymentStatus, search, page, perPage)
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
		"data":    orders,
		"meta": gin.H{
			"total":    total,
			"page":     page,
			"per_page": perPage,
		},
	})
}

func (h *OrderHandler) GetOrderDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid order ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	order, err := h.srv.GetOrderDetail(c.Request.Context(), id)
	if err != nil {
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
		"data":    order,
	})
}

func (h *OrderHandler) UpdateOrderStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid order ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	var req dto.OrderStatusUpdateRequest
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

	err = h.srv.UpdateOrderStatus(c.Request.Context(), id, req.Status)
	if err != nil {
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
		"message": "Order status updated successfully",
	})
}

func (h *OrderHandler) UpdateOrderPaymentStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid order ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	var req dto.OrderPaymentUpdateRequest
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

	err = h.srv.UpdateOrderPaymentStatus(c.Request.Context(), id, req.PaymentStatus)
	if err != nil {
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
		"message": "Order payment status updated successfully",
	})
}
