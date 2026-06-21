package handler

import (
	"errors"
	"net/http"

	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	srv    AdminService
	config *config.Config
}

// NewAdminHandler membuat instance baru dari AdminHandler.
func NewAdminHandler(srv AdminService, cfg *config.Config) *AdminHandler {
	return &AdminHandler{
		srv:    srv,
		config: cfg,
	}
}

// Login menangani proses autentikasi admin dan memberikan token akses serta refresh cookie.
func (h *AdminHandler) Login(c *gin.Context) {
	var req dto.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
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
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
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

	okJSON(c, resp)
}

// Refresh menangani pembaruan token akses admin menggunakan refresh token dari cookie.
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

	okJSON(c, resp)
}

// Logout menangani proses keluar sistem admin dengan menghapus cookie refresh token.
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

	okMessageJSON(c, "Successfully logged out")
}

// GetProfile mengambil data profil admin yang sedang login berdasarkan ID.
func (h *AdminHandler) GetProfile(c *gin.Context) {
	adminID, ok := getAdminID(c)
	if !ok {
		return
	}
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

	okJSON(c, profile)
}
