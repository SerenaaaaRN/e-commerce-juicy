package handler

import (
	"errors"
	"net/http"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CategoryHandler struct {
	srv CategoryService
}

// NewCategoryHandler membuat instance baru dari CategoryHandler.
func NewCategoryHandler(srv CategoryService) *CategoryHandler {
	return &CategoryHandler{srv: srv}
}

// ListActiveCategories mengambil daftar kategori yang aktif untuk ditampilkan di toko.
func (h *CategoryHandler) ListActiveCategories(c *gin.Context) {
	categories, err := h.srv.ListActiveCategories(c.Request.Context())
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, categories)
}

// ListAllCategories mengambil semua daftar kategori untuk kebutuhan admin.
func (h *CategoryHandler) ListAllCategories(c *gin.Context) {
	categories, err := h.srv.ListAllCategories(c.Request.Context())
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, categories)
}

// GetCategoryByID mengambil detail informasi kategori berdasarkan ID.
func (h *CategoryHandler) GetCategoryByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid category ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	category, err := h.srv.GetCategoryByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrCategoryNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Category not found",
					"code":    "CATEGORY_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, category)
}

// CreateCategory membuat kategori produk baru.
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

// UpdateCategory memperbarui data kategori produk yang sudah ada.
func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid category ID format",
				"code":    "BAD_REQUEST",
			},
		})
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
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Category not found",
					"code":    "CATEGORY_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, category)
}

// DeleteCategory menghapus kategori produk jika tidak memiliki keterkaitan produk.
func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid category ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	err = h.srv.DeleteCategory(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrCategoryNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Category not found",
					"code":    "CATEGORY_NOT_FOUND",
				},
			})
			return
		}
		if errors.Is(err, service.ErrCategoryHasProducts) {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Cannot delete category: products are still assigned to it",
					"code":    "CATEGORY_HAS_PRODUCTS",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Category deleted successfully")
}
