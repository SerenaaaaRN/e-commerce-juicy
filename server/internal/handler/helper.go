package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// getCustomerID extracts the customer ID from the context and handles the unauthorized response if missing.
func getCustomerID(c *gin.Context) (uuid.UUID, bool) {
	idVal, exists := c.Get("customer_id")
	if !exists {
		errJSON(c, http.StatusUnauthorized, "Unauthorized context", "UNAUTHORIZED")
		return uuid.Nil, false
	}
	return idVal.(uuid.UUID), true
}

// getAdminID extracts the admin ID from the context and handles the unauthorized response if missing.
func getAdminID(c *gin.Context) (uuid.UUID, bool) {
	idVal, exists := c.Get("admin_id")
	if !exists {
		errJSON(c, http.StatusUnauthorized, "Unauthorized context", "UNAUTHORIZED")
		return uuid.Nil, false
	}
	return idVal.(uuid.UUID), true
}

// okJSON sends a 200 OK response with the standard success envelope.
func okJSON(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
	})
}

// okMessageJSON sends a 200 OK response with a success message instead of data.
func okMessageJSON(c *gin.Context, message string) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": message,
	})
}

// createdJSON sends a 201 Created response with the standard success envelope.
func createdJSON(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    data,
	})
}

// errJSON sends an error response with the specified HTTP status, message, and error code.
func errJSON(c *gin.Context, status int, message string, code string) {
	c.JSON(status, gin.H{
		"success": false,
		"error": gin.H{
			"message": message,
			"code":    code,
		},
	})
}

// validationErrJSON sends a 422 Unprocessable Entity response for request validation failures.
func validationErrJSON(c *gin.Context, details string) {
	c.JSON(http.StatusUnprocessableEntity, gin.H{
		"success": false,
		"error": gin.H{
			"message": "Validation error",
			"code":    "VALIDATION_ERROR",
			"details": details,
		},
	})
}
