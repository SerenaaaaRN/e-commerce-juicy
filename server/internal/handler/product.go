package handler

import (
	"errors"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"strings"
)

type ProductHandler struct {
	srv ProductService
}

// NewProductHandler membuat instance baru dari ProductHandler.
func NewProductHandler(srv ProductService) *ProductHandler {
	return &ProductHandler{srv: srv}
}

// ListProducts mengambil daftar produk dengan berbagai opsi filter, pencarian, dan paginasi.
func (h *ProductHandler) ListProducts(c *gin.Context) {
	category := c.Query("category")
	featuredStr := c.Query("featured")
	tag := c.Query("tag")
	sort := c.Query("sort")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "12"))

	featured := false
	if featuredStr == "true" {
		featured = true
	}

	includeUnavailable := false
	if c.Query("admin") == "true" {
		includeUnavailable = true
	}

	var sizes []string
	if sizesStr := c.Query("sizes"); sizesStr != "" {
		for _, s := range strings.Split(sizesStr, ",") {
			if trimmed := strings.TrimSpace(s); trimmed != "" {
				sizes = append(sizes, trimmed)
			}
		}
	}
	search := c.Query("search")

	products, total, err := h.srv.ListProducts(c.Request.Context(), category, featured, tag, sort, page, perPage, includeUnavailable, sizes, search)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	totalPages := (int(total) + perPage - 1) / perPage
	if totalPages == 0 {
		totalPages = 1
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    products,
		"meta": gin.H{
			"total":       total,
			"page":        page,
			"per_page":    perPage,
			"total_pages": totalPages,
		},
	})
}

// GetProductBySlug mengambil rincian detail produk berdasarkan slug.
func (h *ProductHandler) GetProductBySlug(c *gin.Context) {
	slug := c.Param("slug")
	product, err := h.srv.GetProductBySlug(c.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Product not found",
					"code":    "PRODUCT_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, product)
}

// GetProductByID mengambil rincian detail produk berdasarkan ID.
func (h *ProductHandler) GetProductByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid product ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	product, err := h.srv.GetProductByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Product not found",
					"code":    "PRODUCT_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, product)
}

// CreateProduct membuat data produk baru.
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var req struct {
		CategoryID     uuid.UUID `json:"category_id" binding:"required"`
		Name           string    `json:"name" binding:"required"`
		Slug           string    `json:"slug" binding:"required"`
		Description    *string   `json:"description" binding:"omitempty"`
		Price          float64   `json:"price" binding:"required,gt=0"`
		CompareAtPrice *float64  `json:"compare_at_price" binding:"omitempty,gt=0"`
		IsAvailable    bool      `json:"is_available"`
		IsFeatured     bool      `json:"is_featured"`
		Tags           []string  `json:"tags"`
		DisplayOrder   int       `json:"display_order"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	product := &model.Product{
		CategoryID:     req.CategoryID,
		Name:           req.Name,
		Slug:           req.Slug,
		Description:    req.Description,
		Price:          req.Price,
		CompareAtPrice: req.CompareAtPrice,
		IsAvailable:    req.IsAvailable,
		IsFeatured:     req.IsFeatured,
		Tags:           req.Tags,
		DisplayOrder:   req.DisplayOrder,
	}

	created, err := h.srv.CreateProduct(c.Request.Context(), product)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	createdJSON(c, created)
}

// UpdateProduct memperbarui informasi produk yang sudah ada.
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid product ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	var req struct {
		CategoryID     uuid.UUID `json:"category_id" binding:"required"`
		Name           string    `json:"name" binding:"required"`
		Slug           string    `json:"slug" binding:"required"`
		Description    *string   `json:"description" binding:"omitempty"`
		Price          float64   `json:"price" binding:"required,gt=0"`
		CompareAtPrice *float64  `json:"compare_at_price" binding:"omitempty,gt=0"`
		IsAvailable    bool      `json:"is_available"`
		IsFeatured     bool      `json:"is_featured"`
		Tags           []string  `json:"tags"`
		DisplayOrder   int       `json:"display_order"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	product := &model.Product{
		CategoryID:     req.CategoryID,
		Name:           req.Name,
		Slug:           req.Slug,
		Description:    req.Description,
		Price:          req.Price,
		CompareAtPrice: req.CompareAtPrice,
		IsAvailable:    req.IsAvailable,
		IsFeatured:     req.IsFeatured,
		Tags:           req.Tags,
		DisplayOrder:   req.DisplayOrder,
	}

	updated, err := h.srv.UpdateProduct(c.Request.Context(), id, product)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Product not found",
					"code":    "PRODUCT_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, updated)
}

// DeleteProduct menghapus produk beserta seluruh aset gambarnya.
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid product ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	err = h.srv.DeleteProduct(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Product not found",
					"code":    "PRODUCT_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Product deleted successfully")
}

// AddProductImages mengunggah beberapa file gambar baru untuk produk.
func (h *ProductHandler) AddProductImages(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid product ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Failed to parse multipart form",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	files := form.File["images"]
	if len(files) == 0 {

		files = form.File["image"]
	}

	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "No images provided",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	tempDir := "./tmp_uploads"
	if err := os.MkdirAll(tempDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Failed to create temp uploads directory",
			},
		})
		return
	}

	var tempFilePaths []string
	for _, file := range files {
		tempPath := filepath.Join(tempDir, uuid.New().String()+filepath.Ext(file.Filename))
		if err := c.SaveUploadedFile(file, tempPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Failed to save file temporarily",
				},
			})
			return
		}
		tempFilePaths = append(tempFilePaths, tempPath)
	}

	err = h.srv.AddProductImages(c.Request.Context(), id, tempFilePaths)

	for _, path := range tempFilePaths {
		os.Remove(path)
	}

	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Product not found",
					"code":    "PRODUCT_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	updatedProduct, err := h.srv.GetProductByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Images uploaded but failed to load updated product details",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Product images uploaded successfully",
		"data":    updatedProduct,
	})
}

// AddProductImageUrl menambahkan gambar produk baru melalui URL eksternal.
func (h *ProductHandler) AddProductImageUrl(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid product ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	var req dto.AddProductImageUrlRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid request payload. Image URL must be a valid absolute HTTP/HTTPS URL.",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	err = h.srv.AddProductImageUrl(c.Request.Context(), id, req.ImageURL)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Product not found",
					"code":    "PRODUCT_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	updatedProduct, err := h.srv.GetProductByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Image URL added but failed to load updated product details",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Product image URL added successfully",
		"data":    updatedProduct,
	})
}

// DeleteProductImage menghapus aset gambar spesifik dari produk.
func (h *ProductHandler) DeleteProductImage(c *gin.Context) {
	productIDStr := c.Param("id")
	productID, err := uuid.Parse(productIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid product ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	imageIDStr := c.Param("imageId")
	imageID, err := uuid.Parse(imageIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid image ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	err = h.srv.DeleteProductImage(c.Request.Context(), productID, imageID)
	if err != nil {
		if errors.Is(err, service.ErrImageNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Product image not found",
					"code":    "IMAGE_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Product image deleted successfully")
}

// SetPrimaryProductImage menentukan gambar utama yang akan ditampilkan untuk produk.
func (h *ProductHandler) SetPrimaryProductImage(c *gin.Context) {
	productIDStr := c.Param("id")
	productID, err := uuid.Parse(productIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid product ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	imageIDStr := c.Param("imageId")
	imageID, err := uuid.Parse(imageIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid image ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	err = h.srv.SetPrimaryProductImage(c.Request.Context(), productID, imageID)
	if err != nil {
		if errors.Is(err, service.ErrImageNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Product image not found",
					"code":    "IMAGE_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Product image set as primary successfully")
}

// GetProductVariants mengambil semua varian ukuran/warna milik produk.
func (h *ProductHandler) GetProductVariants(c *gin.Context) {
	productIDStr := c.Param("id")
	productID, err := uuid.Parse(productIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid product ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	variants, err := h.srv.GetProductVariants(c.Request.Context(), productID)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, variants)
}

// AddProductVariant menambahkan varian baru untuk produk.
func (h *ProductHandler) AddProductVariant(c *gin.Context) {
	productIDStr := c.Param("id")
	productID, err := uuid.Parse(productIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid product ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	var req dto.ProductVariantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	variant, err := h.srv.AddProductVariant(c.Request.Context(), productID, req)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Product not found",
					"code":    "PRODUCT_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	createdJSON(c, variant)
}

// UpdateProductVariant memperbarui data varian produk.
func (h *ProductHandler) UpdateProductVariant(c *gin.Context) {
	productIDStr := c.Param("id")
	productID, err := uuid.Parse(productIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid product ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	variantIDStr := c.Param("variantId")
	variantID, err := uuid.Parse(variantIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid variant ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	var req dto.ProductVariantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validationErrJSON(c, err.Error())
		return
	}

	variant, err := h.srv.UpdateProductVariant(c.Request.Context(), productID, variantID, req)
	if err != nil {
		if errors.Is(err, service.ErrVariantNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Variant not found",
					"code":    "VARIANT_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, variant)
}

// DeleteProductVariant menonaktifkan varian produk (soft-delete).
func (h *ProductHandler) DeleteProductVariant(c *gin.Context) {
	productIDStr := c.Param("id")
	productID, err := uuid.Parse(productIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid product ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	variantIDStr := c.Param("variantId")
	variantID, err := uuid.Parse(variantIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message": "Invalid variant ID format",
				"code":    "BAD_REQUEST",
			},
		})
		return
	}

	err = h.srv.DeleteProductVariant(c.Request.Context(), productID, variantID)
	if err != nil {
		if errors.Is(err, service.ErrVariantNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"message": "Variant not found",
					"code":    "VARIANT_NOT_FOUND",
				},
			})
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Product variant deleted successfully")
}
