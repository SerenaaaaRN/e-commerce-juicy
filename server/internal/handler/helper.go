package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func getCustomerID(c *gin.Context) (uuid.UUID, bool) {
	idVal, exists := c.Get("customer_id")
	if !exists {
		errJSON(c, http.StatusUnauthorized, "Unauthorized context", "UNAUTHORIZED")
		return uuid.Nil, false
	}
	return idVal.(uuid.UUID), true
}

func getAdminID(c *gin.Context) (uuid.UUID, bool) {
	idVal, exists := c.Get("admin_id")
	if !exists {
		errJSON(c, http.StatusUnauthorized, "Unauthorized context", "UNAUTHORIZED")
		return uuid.Nil, false
	}
	return idVal.(uuid.UUID), true
}
