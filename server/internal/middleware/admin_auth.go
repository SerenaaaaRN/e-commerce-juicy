package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/SerenaaaaRN/juicy/internal/service"
)

func AdminAuth(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Missing authorization token",
					"code":    "UNAUTHORIZED",
				},
			})
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Authorization header must be Bearer token",
					"code":    "UNAUTHORIZED",
				},
			})
			c.Abort()
			return
		}

		tokenStr := parts[1]
		claims := &service.AdminClaims{}

		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(cfg.JWTAdminSecret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Invalid or expired token",
					"code":    "UNAUTHORIZED",
				},
			})
			c.Abort()
			return
		}

		adminID, err := uuid.Parse(claims.AdminID)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Invalid credentials",
					"code":    "UNAUTHORIZED",
				},
			})
			c.Abort()
			return
		}

		c.Set("admin_id", adminID)
		c.Next()
	}
}
