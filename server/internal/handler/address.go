package handler

import (
	"errors"
	"net/http"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
)

type AddressHandler struct {
	srv AddressService
}

func NewAddressHandler(srv AddressService) *AddressHandler {
	return &AddressHandler{srv: srv}
}

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

func (h *AddressHandler) GetAddressByID(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	address, err := h.srv.GetAddressByID(c.Request.Context(), id, customerID)
	if err != nil {
		if errors.Is(err, service.ErrAddressNotFound) {
			errJSON(c, http.StatusNotFound, "Address not found", "ADDRESS_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, address)
}

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

func (h *AddressHandler) UpdateAddress(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	id, ok := parseUUIDParam(c, "id")
	if !ok {
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
			errJSON(c, http.StatusNotFound, "Address not found", "ADDRESS_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, address)
}

func (h *AddressHandler) DeleteAddress(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	err := h.srv.DeleteAddress(c.Request.Context(), id, customerID)
	if err != nil {
		if errors.Is(err, service.ErrAddressNotFound) {
			errJSON(c, http.StatusNotFound, "Address not found", "ADDRESS_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Address deleted successfully")
}

func (h *AddressHandler) SetDefaultAddress(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	err := h.srv.SetDefaultAddress(c.Request.Context(), id, customerID)
	if err != nil {
		if errors.Is(err, service.ErrAddressNotFound) {
			errJSON(c, http.StatusNotFound, "Address not found", "ADDRESS_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Address set as default successfully")
}
