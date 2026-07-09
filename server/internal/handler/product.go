package handler

import (
	"errors"
	"net/http"
	"strings"

	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/SerenaaaaRN/juicy/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProductHandler struct {
	srv ProductService
}

func NewProductHandler(srv ProductService) *ProductHandler {
	return &ProductHandler{srv: srv}
}

func (h *ProductHandler) ListProducts(c *gin.Context) {
	page, perPage := parsePaginationParams(c)

	var sizes []string
	if sizesStr := c.Query("sizes"); sizesStr != "" {
		for _, s := range strings.Split(sizesStr, ",") {
			if trimmed := strings.TrimSpace(s); trimmed != "" {
				sizes = append(sizes, trimmed)
			}
		}
	}

	filter := dto.ProductFilter{
		CategorySlug:       c.Query("category"),
		FeaturedOnly:       c.Query("featured") == "true",
		Tag:                c.Query("tag"),
		Sort:               c.Query("sort"),
		Page:               page,
		PerPage:            perPage,
		IncludeUnavailable: c.Query("admin") == "true",
		Sizes:              sizes,
		Search:             c.Query("search"),
	}

	products, total, err := h.srv.ListProducts(c.Request.Context(), filter)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okPaginatedJSON(c, products, PaginationMeta{
		Page:       page,
		PerPage:    perPage,
		Total:      total,
		TotalPages: calcTotalPages(total, perPage),
	})
}

func (h *ProductHandler) GetProductBySlug(c *gin.Context) {
	slug := c.Param("slug")
	product, err := h.srv.GetProductBySlug(c.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			errJSON(c, http.StatusNotFound, "Product not found", "PRODUCT_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, product)
}

func (h *ProductHandler) GetProductByID(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	product, err := h.srv.GetProductByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			errJSON(c, http.StatusNotFound, "Product not found", "PRODUCT_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, product)
}

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

func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
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
			errJSON(c, http.StatusNotFound, "Product not found", "PRODUCT_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, updated)
}

func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	err := h.srv.DeleteProduct(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			errJSON(c, http.StatusNotFound, "Product not found", "PRODUCT_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Product deleted successfully")
}

func (h *ProductHandler) AddProductImages(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	form, err := c.MultipartForm()
	if err != nil {
		errJSON(c, http.StatusBadRequest, "Failed to parse multipart form", "BAD_REQUEST")
		return
	}

	files := form.File["images"]
	if len(files) == 0 {
		files = form.File["image"]
	}

	if len(files) == 0 {
		errJSON(c, http.StatusBadRequest, "No images provided", "BAD_REQUEST")
		return
	}

	err = h.srv.AddProductImages(c.Request.Context(), id, files)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			errJSON(c, http.StatusNotFound, "Product not found", "PRODUCT_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	updatedProduct, err := h.srv.GetProductByID(c.Request.Context(), id)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "Images uploaded but failed to load updated product details", "INTERNAL_ERROR")
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Success: true,
		Message: "Product images uploaded successfully",
		Data:    updatedProduct,
	})
}

func (h *ProductHandler) AddProductImageUrl(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	var req dto.AddProductImageUrlRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errJSON(c, http.StatusBadRequest, "Invalid request payload. Image URL must be a valid absolute HTTP/HTTPS URL.", "BAD_REQUEST")
		return
	}

	err := h.srv.AddProductImageUrl(c.Request.Context(), id, req.ImageURL)
	if err != nil {
		if errors.Is(err, service.ErrProductNotFound) {
			errJSON(c, http.StatusNotFound, "Product not found", "PRODUCT_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	updatedProduct, err := h.srv.GetProductByID(c.Request.Context(), id)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "Image URL added but failed to load updated product details", "INTERNAL_ERROR")
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Success: true,
		Message: "Product image URL added successfully",
		Data:    updatedProduct,
	})
}

func (h *ProductHandler) DeleteProductImage(c *gin.Context) {
	productID, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	imageID, ok := parseUUIDParam(c, "imageId")
	if !ok {
		return
	}

	err := h.srv.DeleteProductImage(c.Request.Context(), productID, imageID)
	if err != nil {
		if errors.Is(err, service.ErrImageNotFound) {
			errJSON(c, http.StatusNotFound, "Product image not found", "IMAGE_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Product image deleted successfully")
}

func (h *ProductHandler) SetPrimaryProductImage(c *gin.Context) {
	productID, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	imageID, ok := parseUUIDParam(c, "imageId")
	if !ok {
		return
	}

	err := h.srv.SetPrimaryProductImage(c.Request.Context(), productID, imageID)
	if err != nil {
		if errors.Is(err, service.ErrImageNotFound) {
			errJSON(c, http.StatusNotFound, "Product image not found", "IMAGE_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Product image set as primary successfully")
}

func (h *ProductHandler) GetProductVariants(c *gin.Context) {
	productID, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	variants, err := h.srv.GetProductVariants(c.Request.Context(), productID)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, variants)
}

func (h *ProductHandler) AddProductVariant(c *gin.Context) {
	productID, ok := parseUUIDParam(c, "id")
	if !ok {
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
			errJSON(c, http.StatusNotFound, "Product not found", "PRODUCT_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	createdJSON(c, variant)
}

func (h *ProductHandler) UpdateProductVariant(c *gin.Context) {
	productID, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	variantID, ok := parseUUIDParam(c, "variantId")
	if !ok {
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
			errJSON(c, http.StatusNotFound, "Variant not found", "VARIANT_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okJSON(c, variant)
}

func (h *ProductHandler) DeleteProductVariant(c *gin.Context) {
	productID, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}

	variantID, ok := parseUUIDParam(c, "variantId")
	if !ok {
		return
	}

	err := h.srv.DeleteProductVariant(c.Request.Context(), productID, variantID)
	if err != nil {
		if errors.Is(err, service.ErrVariantNotFound) {
			errJSON(c, http.StatusNotFound, "Variant not found", "VARIANT_NOT_FOUND")
			return
		}
		errJSON(c, http.StatusInternalServerError, err.Error(), "INTERNAL_ERROR")
		return
	}

	okMessageJSON(c, "Product variant deleted successfully")
}
