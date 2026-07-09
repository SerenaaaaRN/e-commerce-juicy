package handler

import (
	"errors"
	"net/http"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
)

type CategoryHandler struct {
	srv CategoryService
}

func NewCategoryHandler(srv CategoryService) *CategoryHandler {
	return &CategoryHandler{srv: srv}
}

func (h *CategoryHandler) ListActiveCategories(c *gin.Context) {
	categories, err := h.srv.ListActiveCategories(c.Request.Context())
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, categories)
}

func (h *CategoryHandler) ListAllCategories(c *gin.Context) {
	categories, err := h.srv.ListAllCategories(c.Request.Context())
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, categories)
}

func (h *CategoryHandler) GetCategoryByID(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	category, err := h.srv.GetCategoryByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrCategoryNotFound) {
			errJSON(c, http.StatusNotFound, "Category not found", "CATEGORY_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, category)
}

func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var req dto.CategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	category, err := h.srv.CreateCategory(c.Request.Context(), req)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	createdJSON(c, category)
}

func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	var req dto.CategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	category, err := h.srv.UpdateCategory(c.Request.Context(), id, req)
	if err != nil {
		if errors.Is(err, service.ErrCategoryNotFound) {
			errJSON(c, http.StatusNotFound, "Category not found", "CATEGORY_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, category)
}

func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	err := h.srv.DeleteCategory(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrCategoryNotFound) {
			errJSON(c, http.StatusNotFound, "Category not found", "CATEGORY_NOT_FOUND")
			return
		}
		if errors.Is(err, service.ErrCategoryHasProducts) {
			errJSON(c, http.StatusConflict, "Cannot delete category: products are still assigned to it", "CATEGORY_HAS_PRODUCTS")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Category deleted successfully")
}
