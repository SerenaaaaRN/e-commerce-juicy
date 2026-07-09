package handler

import (
	"errors"
	"net/http"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/repository"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
)

type OrderHandler struct {
	srv OrderService
}

func NewOrderHandler(srv OrderService) *OrderHandler {
	return &OrderHandler{srv: srv}
}

func (h *OrderHandler) Checkout(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	var req dto.CheckoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	resp, err := h.srv.Checkout(c.Request.Context(), customerID, req)
	if err != nil {
		if errors.Is(err, service.ErrAddressNotFound) {
			errJSON(c, http.StatusNotFound, "Delivery address not found", "ADDRESS_NOT_FOUND")
			return
		}
		if errors.Is(err, service.ErrCartEmpty) {
			errJSON(c, http.StatusBadRequest, "Cannot checkout with an empty cart", "CART_EMPTY")
			return
		}
		if errors.Is(err, repository.ErrOutOfStock) {
			errJSON(c, http.StatusConflict, "One or more items in your cart are out of stock", "OUT_OF_STOCK")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	createdJSON(c, resp)
}

func (h *OrderHandler) GetCustomerOrders(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	page, perPage := parsePaginationParams(c)

	orders, total, err := h.srv.GetCustomerOrders(c.Request.Context(), customerID, page, perPage)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okPaginatedJSON(c, orders, PaginationMeta{
		Page:       page,
		PerPage:    perPage,
		Total:      total,
		TotalPages: calcTotalPages(total, perPage),
	})
}

func (h *OrderHandler) GetCustomerOrderDetail(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	orderNumber := c.Param("orderNumber")

	order, err := h.srv.GetCustomerOrderDetail(c.Request.Context(), orderNumber, customerID)
	if err != nil {
		if errors.Is(err, service.ErrOrderNotFound) {
			errJSON(c, http.StatusNotFound, "Order not found", "ORDER_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, order)
}

func (h *OrderHandler) CancelOrder(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	orderNumber := c.Param("orderNumber")

	err := h.srv.CancelOrder(c.Request.Context(), orderNumber, customerID)
	if err != nil {
		if errors.Is(err, service.ErrOrderNotFound) {
			errJSON(c, http.StatusNotFound, "Order not found", "ORDER_NOT_FOUND")
			return
		}
		if errors.Is(err, service.ErrCannotCancelOrder) {
			errJSON(c, http.StatusConflict, "Order cannot be cancelled in its current status", "CANNOT_CANCEL_ORDER")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Order cancelled successfully")
}

func (h *OrderHandler) CompleteOrder(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	orderNumber := c.Param("orderNumber")

	err := h.srv.CompleteOrder(c.Request.Context(), orderNumber, customerID)
	if err != nil {
		if errors.Is(err, service.ErrOrderNotFound) {
			errJSON(c, http.StatusNotFound, "Order not found", "ORDER_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Order completed successfully")
}

func (h *OrderHandler) ListAllOrders(c *gin.Context) {
	status := c.Query("status")
	paymentStatus := c.Query("payment_status")
	search := c.Query("search")
	page, perPage := parsePaginationParams(c)

	orders, total, err := h.srv.ListAllOrders(c.Request.Context(), status, paymentStatus, search, page, perPage)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okPaginatedJSON(c, orders, PaginationMeta{
		Page:       page,
		PerPage:    perPage,
		Total:      total,
		TotalPages: calcTotalPages(total, perPage),
	})
}

func (h *OrderHandler) GetOrderDetail(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	order, err := h.srv.GetOrderDetail(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrOrderNotFound) {
			errJSON(c, http.StatusNotFound, "Order not found", "ORDER_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, order)
}

func (h *OrderHandler) UpdateOrderStatus(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	var req dto.OrderStatusUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, "")
		return
	}

	err := h.srv.UpdateOrderStatus(c.Request.Context(), id, req.Status)
	if err != nil {
		if errors.Is(err, service.ErrOrderNotFound) {
			errJSON(c, http.StatusNotFound, "Order not found", "ORDER_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Order status updated successfully")
}

func (h *OrderHandler) UpdateOrderPaymentStatus(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	var req dto.OrderPaymentUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, "")
		return
	}

	err := h.srv.UpdateOrderPaymentStatus(c.Request.Context(), id, req.PaymentStatus)
	if err != nil {
		if errors.Is(err, service.ErrOrderNotFound) {
			errJSON(c, http.StatusNotFound, "Order not found", "ORDER_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Order payment status updated successfully")
}
