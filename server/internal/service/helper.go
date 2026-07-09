package service

import (
	"github.com/SerenaaaaRN/juicy/internal/dto"
	"github.com/SerenaaaaRN/juicy/internal/model"
)

func getPrimaryImageURL(images []model.ProductImage) string {
	for _, img := range images {
		if img.IsPrimary {
			return img.ImageURL
		}
	}
	if len(images) > 0 {
		return images[0].ImageURL
	}
	return ""
}

func toImageResponses(images []model.ProductImage) []dto.ProductImageResponse {
	res := make([]dto.ProductImageResponse, len(images))
	for i, img := range images {
		res[i] = dto.ProductImageResponse{
			ID:           img.ID,
			ImageURL:     img.ImageURL,
			AltText:      img.AltText,
			IsPrimary:    img.IsPrimary,
			DisplayOrder: img.DisplayOrder,
		}
	}
	return res
}

func toVariantResponses(variants []model.ProductVariant) []dto.ProductVariantResponse {
	res := make([]dto.ProductVariantResponse, len(variants))
	for i, v := range variants {
		res[i] = dto.ProductVariantResponse{
			ID:              v.ID,
			Size:            v.Size,
			Color:           v.Color,
			Stock:           v.Stock,
			AdditionalPrice: v.AdditionalPrice,
			IsActive:        v.IsActive,
		}
	}
	return res
}
