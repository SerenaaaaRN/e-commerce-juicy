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

func NewCustomerHandler(srv CustomerService) *CustomerHandler {
	return &CustomerHandler{srv: srv}
}

func (h *CustomerHandler) Register(c *gin.Context) {
	var req dto.CustomerRegisterRequest
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

func (h *CustomerHandler) Login(c *gin.Context) {
	var req dto.CustomerLoginRequest
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
		"data":    resp,
	})
}

func (h *CustomerHandler) GetProfile(c *gin.Context) {
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

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    profile,
	})
}

func (h *CustomerHandler) UpdateProfile(c *gin.Context) {
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
	var req dto.UpdateProfileRequest
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

	profile, err := h.srv.UpdateProfile(c.Request.Context(), customerID, req)
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
		"data":    profile,
	})
}

func (h *CustomerHandler) ChangePassword(c *gin.Context) {
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
	var req dto.ChangePasswordRequest
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
		"message": "Password updated successfully",
	})
}

func (h *CustomerHandler) ListCustomers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))
	search := c.Query("search")

	customers, total, err := h.srv.ListCustomers(c.Request.Context(), page, perPage, search)
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
		"data":    customers,
		"meta": gin.H{
			"total":    total,
			"page":     page,
			"per_page": perPage,
		},
	})
}

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

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    profile,
	})
}

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
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Validation error",
				"code":    "VALIDATION_ERROR",
			},
		})
		return
	}

	err = h.srv.UpdateCustomerStatus(c.Request.Context(), id, *req.IsActive)
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
		"message": "Customer status updated successfully",
	})
}
