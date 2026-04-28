package service

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	ErrCategoryNotFound    = errors.New("CATEGORY_NOT_FOUND")
	ErrCategoryHasProducts = errors.New("CATEGORY_HAS_PRODUCTS")
)

type categoryService struct {
	repo CategoryRepository
	db   *gorm.DB
}

func NewCategoryService(repo CategoryRepository, db *gorm.DB) *categoryService {
	return &categoryService{repo: repo, db: db}
}

func (s *categoryService) ListActiveCategories(ctx context.Context) ([]dto.CategoryTreeResponse, error) {
	categories, err := s.repo.FindAllActive(ctx)
	if err != nil {
		return nil, err
	}

	type CategoryCount struct {
		CategoryID uuid.UUID
		Count      int64
	}
	var counts []CategoryCount
	err = s.db.WithContext(ctx).Model(&model.Product{}).
		Where("is_available = ?", true).
		Select("category_id, COUNT(*) as count").
		Group("category_id").
		Scan(&counts).Error
	if err != nil {
		log.Printf("Warning: failed to query product counts for categories: %v", err)
	}

	countMap := make(map[uuid.UUID]int64)
	for _, c := range counts {
		countMap[c.CategoryID] = c.Count
	}

	// Maps for tree construction
	nodesMap := make(map[uuid.UUID][]model.Category)
	categoriesMap := make(map[uuid.UUID]model.Category)
	var roots []model.Category

	for _, cat := range categories {
		categoriesMap[cat.ID] = cat
		if cat.ParentID == nil {
			roots = append(roots, cat)
		} else {
			nodesMap[*cat.ParentID] = append(nodesMap[*cat.ParentID], cat)
		}
	}

	var buildNode func(catID uuid.UUID) dto.CategoryTreeResponse
	buildNode = func(catID uuid.UUID) dto.CategoryTreeResponse {
		cat := categoriesMap[catID]
		node := dto.CategoryTreeResponse{
			ID:           cat.ID,
			Name:         cat.Name,
			Slug:         cat.Slug,
			Description:  cat.Description,
			DisplayOrder: cat.DisplayOrder,
			IsActive:     cat.IsActive,
			ParentID:     cat.ParentID,
			ProductCount: countMap[cat.ID],
			Children:     []dto.CategoryTreeResponse{},
		}

		children := nodesMap[cat.ID]
		for _, child := range children {
			childNode := buildNode(child.ID)
			node.Children = append(node.Children, childNode)
			node.ProductCount += childNode.ProductCount
		}

		return node
	}

	var rootNodes []dto.CategoryTreeResponse
	for _, root := range roots {
		rootNodes = append(rootNodes, buildNode(root.ID))
	}

	if rootNodes == nil {
		return []dto.CategoryTreeResponse{}, nil
	}

	return rootNodes, nil
}

func (s *categoryService) ListAllCategories(ctx context.Context) ([]model.Category, error) {
	return s.repo.FindAll(ctx)
}

func (s *categoryService) GetCategoryByID(ctx context.Context, id uuid.UUID) (*model.Category, error) {
	cat, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrCategoryNotFound
	}
	return cat, nil
}

func (s *categoryService) CreateCategory(ctx context.Context, req dto.CategoryRequest) (*model.Category, error) {
	category := &model.Category{
		Name:         req.Name,
		Slug:         req.Slug,
		Description:  req.Description,
		DisplayOrder: req.DisplayOrder,
		IsActive:     req.IsActive,
		ParentID:     req.ParentID,
	}

	err := s.repo.Create(ctx, category)
	if err != nil {
		return nil, err
	}
	return category, nil
}

func (s *categoryService) UpdateCategory(ctx context.Context, id uuid.UUID, req dto.CategoryRequest) (*model.Category, error) {
	cat, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrCategoryNotFound
	}

	cat.Name = req.Name
	cat.Slug = req.Slug
	cat.Description = req.Description
	cat.DisplayOrder = req.DisplayOrder
	cat.IsActive = req.IsActive
	cat.ParentID = req.ParentID
	cat.UpdatedAt = time.Now()

	err = s.repo.Update(ctx, cat)
	if err != nil {
		return nil, err
	}
	return cat, nil
}

func (s *categoryService) DeleteCategory(ctx context.Context, id uuid.UUID) error {
	_, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return ErrCategoryNotFound
	}

	var count int64
	if err := s.db.WithContext(ctx).Model(&model.Product{}).Where("category_id = ?", id).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return ErrCategoryHasProducts
	}

	return s.repo.Delete(ctx, id)
}
