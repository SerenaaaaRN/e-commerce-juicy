package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AnalyticsHandler struct {
	srv AnalyticsService
}

// NewAnalyticsHandler membuat instance baru dari AnalyticsHandler.
func NewAnalyticsHandler(srv AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{srv: srv}
}

// GetOverview mengambil ringkasan statistik performa bisnis Juicy.
func (h *AnalyticsHandler) GetOverview(c *gin.Context) {
	data, err := h.srv.GetOverview(c.Request.Context())
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, data)
}

// GetOrdersChart mengambil data historis pesanan untuk grafik analitik.
func (h *AnalyticsHandler) GetOrdersChart(c *gin.Context) {
	data, err := h.srv.GetOrdersChart(c.Request.Context())
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, data)
}
