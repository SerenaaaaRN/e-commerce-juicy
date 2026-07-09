package handler

import (
	"errors"
	"net/http"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
)

type CustomerHandler struct {
	srv CustomerService
}

func NewCustomerHandler(srv CustomerService) *CustomerHandler {
	return &CustomerHandler{srv: srv}
}

func (h *CustomerHandler) Register(c *gin.Context) {
	var req dto.CustomerRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	resp, err := h.srv.Register(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrEmailTaken) {
			errJSON(c, http.StatusConflict, "Email is already registered", "EMAIL_TAKEN")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	createdJSON(c, resp)
}

func (h *CustomerHandler) Login(c *gin.Context) {
	var req dto.CustomerLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	resp, err := h.srv.Login(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			errJSON(c, http.StatusUnauthorized, "Invalid email or password", "INVALID_CREDENTIALS")
			return
		}
		if errors.Is(err, service.ErrInactiveUser) {
			errJSON(c, http.StatusForbidden, "Your account has been deactivated", "USER_INACTIVE")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, resp)
}

func (h *CustomerHandler) GetProfile(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	profile, err := h.srv.GetProfile(c.Request.Context(), customerID)
	if err != nil {
		errJSON(c, http.StatusNotFound, "Customer profile not found", "NOT_FOUND")
		return
	}

	okJSON(c, profile)
}

func (h *CustomerHandler) UpdateProfile(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	var req dto.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	profile, err := h.srv.UpdateProfile(c.Request.Context(), customerID, req)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, profile)
}

func (h *CustomerHandler) ChangePassword(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	var req dto.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	err := h.srv.ChangePassword(c.Request.Context(), customerID, req)
	if err != nil {
		if errors.Is(err, service.ErrWrongPassword) {
			errJSON(c, http.StatusUnauthorized, "Current password is incorrect", "WRONG_PASSWORD")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Password updated successfully")
}

func (h *CustomerHandler) ListCustomers(c *gin.Context) {
	page, perPage := parsePaginationParams(c)
	search := c.Query("search")

	customers, total, err := h.srv.ListCustomers(c.Request.Context(), page, perPage, search)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okPaginatedJSON(c, customers, PaginationMeta{
		Page:       page,
		PerPage:    perPage,
		Total:      total,
		TotalPages: calcTotalPages(total, perPage),
	})
}

func (h *CustomerHandler) GetCustomerDetail(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	profile, err := h.srv.GetCustomerDetail(c.Request.Context(), id)
	if err != nil {
		errJSON(c, http.StatusNotFound, "Customer not found", "NOT_FOUND")
		return
	}

	okJSON(c, profile)
}

func (h *CustomerHandler) UpdateCustomerStatus(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	var req struct {
		IsActive *bool `json:"is_active" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	err := h.srv.UpdateCustomerStatus(c.Request.Context(), id, *req.IsActive)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Customer status updated successfully")
}
