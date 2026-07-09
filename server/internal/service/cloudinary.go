package service

import (
	"context"
	"errors"
	"log/slog"

	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryService struct {
	cld    *cloudinary.Cloudinary
	folder string
	mock   bool
}

func NewCloudinaryService(cfg *config.Config) *CloudinaryService {
	if cfg.CloudinaryCloudName == "" || cfg.CloudinaryAPIKey == "" || cfg.CloudinaryAPISecret == "" {
		slog.Warn("Cloudinary credentials not set, using mock mode")
		return &CloudinaryService{mock: true}
	}

	cld, err := cloudinary.NewFromParams(cfg.CloudinaryCloudName, cfg.CloudinaryAPIKey, cfg.CloudinaryAPISecret)
	if err != nil {
		slog.Warn("Failed to initialize Cloudinary client, falling back to mock mode", "error", err)
		return &CloudinaryService{mock: true}
	}

	return &CloudinaryService{
		cld:    cld,
		folder: cfg.CloudinaryUploadFolder,
		mock:   false,
	}
}

func (s *CloudinaryService) UploadImage(ctx context.Context, file interface{}) (string, string, error) {
	if s.mock {
		slog.Debug("Cloudinary mock uploading file, returning placeholder")
		return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600", "mock_cloudinary_public_id", nil
	}

	resp, err := s.cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: s.folder,
	})
	if err != nil {
		return "", "", err
	}

	return resp.SecureURL, resp.PublicID, nil
}

func (s *CloudinaryService) DeleteImage(ctx context.Context, publicID string) error {
	if s.mock {
		slog.Debug("Cloudinary mock deleting image", "public_id", publicID)
		return nil
	}

	if publicID == "" || publicID == "mock_cloudinary_public_id" || publicID == "external_url" {
		return nil
	}

	resp, err := s.cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID: publicID,
	})
	if err != nil {
		return err
	}

	if resp.Result != "ok" && resp.Result != "not found" {
		return errors.New("failed to delete image from cloudinary: " + resp.Result)
	}

	return nil
}
