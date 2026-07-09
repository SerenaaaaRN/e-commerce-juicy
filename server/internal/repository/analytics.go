package repository

import (
	"context"
	"time"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"gorm.io/gorm"
)

type analyticsRepo struct {
	db *gorm.DB
}

func NewAnalyticsRepository(db *gorm.DB) *analyticsRepo {
	return &analyticsRepo{db: db}
}

func (r *analyticsRepo) GetOverview(ctx context.Context) (*dto.AnalyticsOverview, error) {
	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	db := r.db.WithContext(ctx)

	var ordersTotal, ordersPending, ordersProcessing, ordersThisMonth int64
	if err := db.Model(&model.Order{}).Count(&ordersTotal).Error; err != nil {
		return nil, err
	}
	if err := db.Model(&model.Order{}).Where("status = ?", string(model.OrderStatusPending)).Count(&ordersPending).Error; err != nil {
		return nil, err
	}
	if err := db.Model(&model.Order{}).Where("status = ?", "processing").Count(&ordersProcessing).Error; err != nil {
		return nil, err
	}
	if err := db.Model(&model.Order{}).Where("created_at >= ?", startOfMonth).Count(&ordersThisMonth).Error; err != nil {
		return nil, err
	}

	var revenueTotal, revenueThisMonth float64
	var totalRev *float64
	if err := db.Model(&model.Order{}).
		Select("SUM(total)").
		Where("payment_status = ?", string(model.PaymentStatusPaid)).
		Scan(&totalRev).Error; err != nil {
		return nil, err
	}
	if totalRev != nil {
		revenueTotal = *totalRev
	}

	var monthRev *float64
	if err := db.Model(&model.Order{}).
		Select("SUM(total)").
		Where("payment_status = ? AND created_at >= ?", string(model.PaymentStatusPaid), startOfMonth).
		Scan(&monthRev).Error; err != nil {
		return nil, err
	}
	if monthRev != nil {
		revenueThisMonth = *monthRev
	}

	var customersTotal, customersThisMonth int64
	if err := db.Model(&model.Customer{}).Count(&customersTotal).Error; err != nil {
		return nil, err
	}
	if err := db.Model(&model.Customer{}).Where("created_at >= ?", startOfMonth).Count(&customersThisMonth).Error; err != nil {
		return nil, err
	}

	var productsTotal, productsOutOfStock int64
	if err := db.Model(&model.Product{}).Count(&productsTotal).Error; err != nil {
		return nil, err
	}
	if err := db.Model(&model.Product{}).
		Where("id NOT IN (SELECT DISTINCT product_id FROM product_variants WHERE stock > 0 AND is_active = ?)", true).
		Count(&productsOutOfStock).Error; err != nil {
		return nil, err
	}

	return &dto.AnalyticsOverview{
		Orders: dto.AnalyticsOrders{
			Total:      ordersTotal,
			Pending:    ordersPending,
			Processing: ordersProcessing,
			ThisMonth:  ordersThisMonth,
		},
		Revenue: dto.AnalyticsRevenue{
			Total:     revenueTotal,
			ThisMonth: revenueThisMonth,
		},
		Customers: dto.AnalyticsCustomers{
			Total:        customersTotal,
			NewThisMonth: customersThisMonth,
		},
		Products: dto.AnalyticsProducts{
			Total:      productsTotal,
			OutOfStock: productsOutOfStock,
		},
	}, nil
}

func (r *analyticsRepo) GetOrdersChart(ctx context.Context) ([]dto.OrdersChartItem, error) {
	type MonthlyData struct {
		Month      string  `gorm:"column:month"`
		OrderCount int     `gorm:"column:order_count"`
		Revenue    float64 `gorm:"column:revenue"`
	}

	var rawData []MonthlyData
	err := r.db.WithContext(ctx).Model(&model.Order{}).
		Select("TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as order_count, SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END) as revenue").
		Where("created_at >= ?", time.Now().AddDate(0, -6, 0)).
		Group("TO_CHAR(created_at, 'YYYY-MM')").
		Order("month ASC").
		Scan(&rawData).Error
	if err != nil {
		return nil, err
	}

	result := make([]dto.OrdersChartItem, len(rawData))
	for i, d := range rawData {
		result[i] = dto.OrdersChartItem{
			Month:      d.Month,
			OrderCount: d.OrderCount,
			Revenue:    d.Revenue,
		}
	}

	return result, nil
}
