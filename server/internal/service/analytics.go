package service

import (
	"context"

	"github.com/SerenaaaaRN/juicy/internal/dto"
)

type analyticsService struct {
	repo AnalyticsRepository
}

func NewAnalyticsService(repo AnalyticsRepository) *analyticsService {
	return &analyticsService{repo: repo}
}

func (s *analyticsService) GetOverview(ctx context.Context) (*dto.AnalyticsOverview, error) {
	return s.repo.GetOverview(ctx)
}

func (s *analyticsService) GetOrdersChart(ctx context.Context) ([]dto.OrdersChartItem, error) {
	return s.repo.GetOrdersChart(ctx)
}
