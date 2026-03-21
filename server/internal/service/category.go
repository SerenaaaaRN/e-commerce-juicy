package service

import (
	"context"
	"errors"
	"time"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/google/uuid"
)

var (
	ErrCategoryNotFound = errors.New("CATEGORY_NOT_FOUND")
)

type categoryService struct {
	repo CategoryRepository
}

func NewCategoryService(repo CategoryRepository) *categoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) ListActiveCategories(ctx context.Context) ([]model.Category, error) {
	return s.repo.FindAllActive(ctx)
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
	return s.repo.Delete(ctx, id)
}
