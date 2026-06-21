package repository

import (
	"context"
	"strings"

	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type customerRepo struct {
	db *gorm.DB
}

func NewCustomerRepository(db *gorm.DB) *customerRepo {
	return &customerRepo{db: db}
}

func (r *customerRepo) FindByEmail(ctx context.Context, email string) (*model.Customer, error) {
	var customer model.Customer
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&customer).Error
	if err != nil {
		return nil, err
	}
	return &customer, nil
}

func (r *customerRepo) FindByID(ctx context.Context, id uuid.UUID) (*model.Customer, error) {
	var customer model.Customer
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&customer).Error
	if err != nil {
		return nil, err
	}
	return &customer, nil
}

func (r *customerRepo) Create(ctx context.Context, customer *model.Customer) error {
	return r.db.WithContext(ctx).Create(customer).Error
}

func (r *customerRepo) Update(ctx context.Context, customer *model.Customer) error {
	return r.db.WithContext(ctx).Save(customer).Error
}

func (r *customerRepo) FindAll(ctx context.Context, page, perPage int, search string) ([]model.Customer, int64, error) {
	var customers []model.Customer
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Customer{})
	if search != "" {
		s := "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(full_name) LIKE ? OR LOWER(email) LIKE ?", s, s)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * perPage
	err = query.Offset(offset).Limit(perPage).Order("created_at desc").Find(&customers).Error
	if err != nil {
		return nil, 0, err
	}

	return customers, total, nil
}

func (r *customerRepo) UpdateStatus(ctx context.Context, id uuid.UUID, isActive bool) error {
	return r.db.WithContext(ctx).Model(&model.Customer{}).Where("id = ?", id).Update("is_active", isActive).Error
}

func (r *customerRepo) GetStats(ctx context.Context, customerIDs []uuid.UUID) (map[uuid.UUID]model.CustomerStats, error) {
	type StatsResult struct {
		CustomerID uuid.UUID `gorm:"column:customer_id"`
		OrderCount int       `gorm:"column:order_count"`
		TotalSpent float64   `gorm:"column:total_spent"`
	}

	var results []StatsResult
	err := r.db.WithContext(ctx).Table("orders").
		Select("customer_id, COUNT(*) as order_count, SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END) as total_spent").
		Where("customer_id IN ?", customerIDs).
		Group("customer_id").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	statsMap := make(map[uuid.UUID]model.CustomerStats)

	for _, id := range customerIDs {
		statsMap[id] = model.CustomerStats{
			CustomerID: id,
			OrderCount: 0,
			TotalSpent: 0.0,
		}
	}

	for _, res := range results {
		statsMap[res.CustomerID] = model.CustomerStats{
			CustomerID: res.CustomerID,
			OrderCount: res.OrderCount,
			TotalSpent: res.TotalSpent,
		}
	}

	return statsMap, nil
}

func (r *customerRepo) GetOrderHistory(ctx context.Context, customerID uuid.UUID) ([]model.Order, error) {
	var orders []model.Order
	err := r.db.WithContext(ctx).
		Where("customer_id = ?", customerID).
		Order("created_at DESC").
		Find(&orders).Error
	if err != nil {
		return nil, err
	}
	return orders, nil
}
