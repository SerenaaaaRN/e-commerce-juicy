package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CustomerHandler struct {
	srv CustomerService
}

// NewCustomerHandler membuat instance baru dari CustomerHandler.
func NewCustomerHandler(srv CustomerService) *CustomerHandler {
	return &CustomerHandler{srv: srv}
}

// Register menangani registrasi akun customer baru.
func (h *CustomerHandler) Register(c *gin.Context) {
	var req dto.CustomerRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	resp, err := h.srv.Register(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrEmailTaken) {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Email is already registered",
					"code":    "EMAIL_TAKEN",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	createdJSON(c, resp)
}

// Login menangani proses autentikasi admin dan memberikan token akses serta refresh cookie.
func (h *CustomerHandler) Login(c *gin.Context) {
	var req dto.CustomerLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	resp, err := h.srv.Login(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Invalid email or password",
					"code":    "INVALID_CREDENTIALS",
				},
			})
			return
		}
		if errors.Is(err, service.ErrInactiveUser) {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Your account has been deactivated",
					"code":    "USER_INACTIVE",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, resp)
}

// GetProfile mengambil data profil admin yang sedang login berdasarkan ID.
func (h *CustomerHandler) GetProfile(c *gin.Context) {
	customerID, ok := getCustomerID(c)
	if !ok {
		return
	}
	profile, err := h.srv.GetProfile(c.Request.Context(), customerID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Customer profile not found",
				"code":    "NOT_FOUND",
			},
		})
		return
	}

	okJSON(c, profile)
}

// UpdateProfile memperbarui informasi profil customer.
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

// ChangePassword memproses perubahan kata sandi untuk customer yang sedang login.
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
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Current password is incorrect",
					"code":    "WRONG_PASSWORD",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Password updated successfully")
}

// ListCustomers mengambil daftar customer dengan fitur pencarian dan paginasi (untuk admin).
func (h *CustomerHandler) ListCustomers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))
	search := c.Query("search")

	customers, total, err := h.srv.ListCustomers(c.Request.Context(), page, perPage, search)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	totalPages := (int(total) + perPage - 1) / perPage
	if totalPages == 0 {
		totalPages = 1
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    customers,
		"meta": gin.H{
			"total":       total,
			"page":        page,
			"per_page":    perPage,
			"total_pages": totalPages,
		},
	})
}

// GetCustomerDetail mengambil detail profil customer secara lengkap (untuk admin).
func (h *CustomerHandler) GetCustomerDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid customer ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	profile, err := h.srv.GetCustomerDetail(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Customer not found",
				"code":    "NOT_FOUND",
			},
		})
		return
	}

	okJSON(c, profile)
}

// UpdateCustomerStatus memperbarui status aktif/nonaktif akun customer (untuk admin).
func (h *CustomerHandler) UpdateCustomerStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid customer ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	var req struct {
		IsActive *bool `json:"is_active" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, "")
		return
	}

	err = h.srv.UpdateCustomerStatus(c.Request.Context(), id, *req.IsActive)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Customer status updated successfully")
}
