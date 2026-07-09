package handler

import (
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SuccessResponse struct {
	Success bool           `json:"success"`
	Data    interface{}    `json:"data,omitempty"`
	Message string         `json:"message,omitempty"`
	Meta    *PaginationMeta `json:"meta,omitempty"`
}

type PaginationMeta struct {
	Page       int   `json:"page"`
	PerPage    int   `json:"per_page"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}

type ErrorPayload struct {
	Message string `json:"message"`
	Code    string `json:"code"`
	Details string `json:"details,omitempty"`
}

type ErrorResponse struct {
	Success bool         `json:"success"`
	Error   ErrorPayload `json:"error"`
}

func okJSON(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, SuccessResponse{
		Success: true,
		Data:    data,
	})
}

func okMessageJSON(c *gin.Context, message string) {
	c.JSON(http.StatusOK, SuccessResponse{
		Success: true,
		Message: message,
	})
}

func createdJSON(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, SuccessResponse{
		Success: true,
		Data:    data,
	})
}

func errJSON(c *gin.Context, status int, message string, code string) {
	c.JSON(status, ErrorResponse{
		Success: false,
		Error: ErrorPayload{
			Message: message,
			Code:    code,
		},
	})
}

func validationErrJSON(c *gin.Context, details string) {
	c.JSON(http.StatusUnprocessableEntity, ErrorResponse{
		Success: false,
		Error: ErrorPayload{
			Message: "Validation error",
			Code:    "VALIDATION_ERROR",
			Details: details,
		},
	})
}

func okPaginatedJSON(c *gin.Context, data interface{}, meta PaginationMeta) {
	c.JSON(http.StatusOK, SuccessResponse{
		Success: true,
		Data:    data,
		Meta:    &meta,
	})
}

func parseUUIDParam(c *gin.Context, name string) (uuid.UUID, bool) {
	idStr := c.Param(name)
	id, err := uuid.Parse(idStr)
	if err != nil {
		errJSON(c, http.StatusBadRequest, "Invalid ID format", "BAD_REQUEST")
		return uuid.Nil, false
	}
	return id, true
}

func parsePaginationParams(c *gin.Context) (page, perPage int) {
	page, _ = strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ = strconv.Atoi(c.DefaultQuery("per_page", "10"))
	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = 10
	}
	return
}

func calcTotalPages(total int64, perPage int) int {
	return int(math.Ceil(float64(total) / float64(perPage)))
}
