package service

import (
	"context"
	"time"

	"golang.org/x/sync/errgroup"
	"gorm.io/gorm"
	"github.com/SerenaaaaRN/juicy/internal/model"
)

type analyticsService struct {
	db *gorm.DB
}

func NewAnalyticsService(db *gorm.DB) *analyticsService {
	return &analyticsService{db: db}
}

func (s *analyticsService) GetOverview(ctx context.Context) (map[string]interface{}, error) {
	g, ctx := errgroup.WithContext(ctx)

	// Time boundaries
	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	var (
		ordersTotal, ordersPending, ordersProcessing, ordersThisMonth int64
		revenueTotal, revenueThisMonth                                 float64
		customersTotal, customersThisMonth                             int64
		productsTotal, productsOutOfStock                             int64
	)

	// 1. Concurrent Orders Overview
	g.Go(func() error {
		db := s.db.WithContext(ctx)
		if err := db.Model(&model.Order{}).Count(&ordersTotal).Error; err != nil {
			return err
		}
		if err := db.Model(&model.Order{}).Where("status = ?", "pending").Count(&ordersPending).Error; err != nil {
			return err
		}
		if err := db.Model(&model.Order{}).Where("status = ?", "processing").Count(&ordersProcessing).Error; err != nil {
			return err
		}
		if err := db.Model(&model.Order{}).Where("created_at >= ?", startOfMonth).Count(&ordersThisMonth).Error; err != nil {
			return err
		}
		return nil
	})

	// 2. Concurrent Revenue Overview
	g.Go(func() error {
		db := s.db.WithContext(ctx)
		// Total Revenue (where payment_status = 'paid')
		var totalRev *float64
		err := db.Model(&model.Order{}).
			Select("SUM(total)").
			Where("payment_status = ?", "paid").
			Scan(&totalRev).Error
		if err != nil {
			return err
		}
		if totalRev != nil {
			revenueTotal = *totalRev
		}

		// Revenue this month
		var monthRev *float64
		err = db.Model(&model.Order{}).
			Select("SUM(total)").
			Where("payment_status = ? AND created_at >= ?", "paid", startOfMonth).
			Scan(&monthRev).Error
		if err != nil {
			return err
		}
		if monthRev != nil {
			revenueThisMonth = *monthRev
		}

		return nil
	})

	// 3. Concurrent Customers Overview
	g.Go(func() error {
		db := s.db.WithContext(ctx)
		if err := db.Model(&model.Customer{}).Count(&customersTotal).Error; err != nil {
			return err
		}
		if err := db.Model(&model.Customer{}).Where("created_at >= ?", startOfMonth).Count(&customersThisMonth).Error; err != nil {
			return err
		}
		return nil
	})

	// 4. Concurrent Products Overview
	g.Go(func() error {
		db := s.db.WithContext(ctx)
		if err := db.Model(&model.Product{}).Count(&productsTotal).Error; err != nil {
			return err
		}
		// Count products where all active variants have 0 stock
		err := db.Model(&model.Product{}).
			Where("id NOT IN (SELECT DISTINCT product_id FROM product_variants WHERE stock > 0 AND is_active = ?)", true).
			Count(&productsOutOfStock).Error
		return err
	})

	// Wait for all goroutines to complete
	if err := g.Wait(); err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"orders": map[string]interface{}{
			"total":      ordersTotal,
			"pending":    ordersPending,
			"processing": ordersProcessing,
			"this_month": ordersThisMonth,
		},
		"revenue": map[string]interface{}{
			"total":      revenueTotal,
			"this_month": revenueThisMonth,
		},
		"customers": map[string]interface{}{
			"total":          customersTotal,
			"new_this_month": customersThisMonth,
		},
		"products": map[string]interface{}{
			"total":        productsTotal,
			"out_of_stock": productsOutOfStock,
		},
	}, nil
}

func (s *analyticsService) GetOrdersChart(ctx context.Context) ([]map[string]interface{}, error) {
	// Last 6 months order counts + revenue grouped by month
	type MonthlyData struct {
		Month      string  `gorm:"column:month"`
		OrderCount int     `gorm:"column:order_count"`
		Revenue    float64 `gorm:"column:revenue"`
	}

	var rawData []MonthlyData
	// Query to group orders by YYYY-MM
	err := s.db.WithContext(ctx).Model(&model.Order{}).
		Select("TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as order_count, SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END) as revenue").
		Where("created_at >= ?", time.Now().AddDate(0, -6, 0)).
		Group("TO_CHAR(created_at, 'YYYY-MM')").
		Order("month ASC").
		Scan(&rawData).Error
	if err != nil {
		return nil, err
	}

	result := make([]map[string]interface{}, len(rawData))
	for i, d := range rawData {
		result[i] = map[string]interface{}{
			"month":       d.Month,
			"order_count": d.OrderCount,
			"revenue":     d.Revenue,
		}
	}

	return result, nil
}
