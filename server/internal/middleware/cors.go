package middleware

import (
	"net/http"
	"strings"

	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/gin-gonic/gin"
)

func CORS(cfg *config.Config) gin.HandlerFunc {
	var allowedOrigins []string
	if cfg.AllowedOrigins != "" {
		parts := strings.Split(cfg.AllowedOrigins, ",")
		for _, part := range parts {
			trimmed := strings.TrimSpace(part)
			if trimmed != "" {
				allowedOrigins = append(allowedOrigins, trimmed)
			}
		}
	}

	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" {
			allowed := false
			for _, allowedOrigin := range allowedOrigins {
				if allowedOrigin == origin || allowedOrigin == "*" {
					allowed = true
					break
				}
			}

			if allowed {
				c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
				c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			}
		}

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, Cookie")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
