package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AnalyticsHandler struct {
	srv AnalyticsService
}

func NewAnalyticsHandler(srv AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{srv: srv}
}

func (h *AnalyticsHandler) GetOverview(c *gin.Context) {
	data, err := h.srv.GetOverview(c.Request.Context())
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
		"data":    data,
	})
}

func (h *AnalyticsHandler) GetOrdersChart(c *gin.Context) {
	data, err := h.srv.GetOrdersChart(c.Request.Context())
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
		"data":    data,
	})
}
