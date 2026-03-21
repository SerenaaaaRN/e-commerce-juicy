package handler

import (
	"errors"
	"net/http"

	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AdminHandler struct {
	srv    AdminService
	config *config.Config
}

func NewAdminHandler(srv AdminService, cfg *config.Config) *AdminHandler {
	return &AdminHandler{
		srv:    srv,
		config: cfg,
	}
}

func (h *AdminHandler) Login(c *gin.Context) {
	var req dto.AdminLoginRequest
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

	resp, refreshToken, err := h.srv.Login(c.Request.Context(), req)
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"message": err.Error(),
			},
		})
		return
	}

	secure := h.config.AppEnv == "production"
	c.SetCookie(
		"refresh_token",
		refreshToken,
		h.config.JWTAdminRefreshExpiryDays*24*3600,
		"/",
		"",
		secure,
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    resp,
	})
}

func (h *AdminHandler) Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Refresh token is missing",
				"code":    "UNAUTHORIZED",
			},
		})
		return
	}

	resp, newRefreshToken, err := h.srv.Refresh(c.Request.Context(), refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid refresh token",
				"code":    "UNAUTHORIZED",
			},
		})
		return
	}

	secure := h.config.AppEnv == "production"
	c.SetCookie(
		"refresh_token",
		newRefreshToken,
		h.config.JWTAdminRefreshExpiryDays*24*3600,
		"/",
		"",
		secure,
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    resp,
	})
}

func (h *AdminHandler) Logout(c *gin.Context) {

	secure := h.config.AppEnv == "production"
	c.SetCookie(
		"refresh_token",
		"",
		-1,
		"/",
		"",
		secure,
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Successfully logged out",
	})
}

func (h *AdminHandler) GetProfile(c *gin.Context) {
	adminIDVal, exists := c.Get("admin_id")
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

	adminID := adminIDVal.(uuid.UUID)
	profile, err := h.srv.GetAdminByID(c.Request.Context(), adminID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Admin profile not found",
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
