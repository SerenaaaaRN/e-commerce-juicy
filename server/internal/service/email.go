package service

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/SerenaaaaRN/juicy/internal/model"
	"github.com/resend/resend-go/v2"
)

type EmailService struct {
	client          *resend.Client
	fromEmail       string
	adminAlertEmail string
	mock            bool
}

func NewEmailService(cfg *config.Config) *EmailService {
	if cfg.ResendAPIKey == "" {
		slog.Warn("RESEND_API_KEY not set, using mock email mode")
		return &EmailService{mock: true}
	}

	client := resend.NewClient(cfg.ResendAPIKey)
	return &EmailService{
		client:          client,
		fromEmail:       cfg.ResendFromEmail,
		adminAlertEmail: cfg.AdminAlertEmail,
		mock:            false,
	}
}

func (s *EmailService) SendOrderConfirmation(ctx context.Context, customerEmail, customerName string, order *model.Order) {
	subject := fmt.Sprintf("Thank you for your order %s", order.OrderNumber)

	htmlContent := fmt.Sprintf(`
		<h1>Juicy Storefront</h1>
		<p>Hi %s,</p>
		<p>We've received your order <strong>%s</strong>!</p>
		<p>Status: %s</p>
		<p>Total: Rp %.2f</p>
		<p>We are preparing your items and will notify you when it ships.</p>
	`, customerName, order.OrderNumber, order.Status, order.Total)

	if s.mock {
		slog.Debug("Email mock sending order confirmation", "customer", customerEmail, "subject", subject)
		return
	}

	params := &resend.SendEmailRequest{
		From:    s.fromEmail,
		To:      []string{customerEmail},
		Subject: subject,
		Html:    htmlContent,
	}

	_, err := s.client.Emails.SendWithContext(ctx, params)
	if err != nil {
		slog.Error("Failed to send order confirmation email", "error", err, "customer", customerEmail)
	} else {
		slog.Info("Order confirmation email sent", "customer", customerEmail)
	}
}

func (s *EmailService) SendAdminOrderAlert(ctx context.Context, order *model.Order) {
	subject := fmt.Sprintf("[NEW ORDER] %s", order.OrderNumber)

	htmlContent := fmt.Sprintf(`
		<h1>New Order Received</h1>
		<p>Order Number: <strong>%s</strong></p>
		<p>Total: Rp %.2f</p>
		<p>Payment Method: %s</p>
		<p>Notes: %s</p>
	`, order.OrderNumber, order.Total, strOrDash(order.PaymentMethod), strOrDash(order.Notes))

	if s.mock {
		slog.Debug("Email mock sending admin alert", "admin_email", s.adminAlertEmail, "subject", subject)
		return
	}

	params := &resend.SendEmailRequest{
		From:    s.fromEmail,
		To:      []string{s.adminAlertEmail},
		Subject: subject,
		Html:    htmlContent,
	}

	_, err := s.client.Emails.SendWithContext(ctx, params)
	if err != nil {
		slog.Error("Failed to send admin alert email", "error", err)
	} else {
		slog.Info("Admin alert email sent")
	}
}

func (s *EmailService) SendShippingUpdate(ctx context.Context, customerEmail, customerName string, order *model.Order) {
	subject := fmt.Sprintf("Your order %s has shipped!", order.OrderNumber)

	htmlContent := fmt.Sprintf(`
		<h1>Juicy Storefront</h1>
		<p>Hi %s,</p>
		<p>Great news! Your order <strong>%s</strong> has been shipped.</p>
		<p>You can trace its progress in your profile history.</p>
	`, customerName, order.OrderNumber)

	if s.mock {
		slog.Debug("Email mock sending shipping update", "customer", customerEmail, "subject", subject)
		return
	}

	params := &resend.SendEmailRequest{
		From:    s.fromEmail,
		To:      []string{customerEmail},
		Subject: subject,
		Html:    htmlContent,
	}

	_, err := s.client.Emails.SendWithContext(ctx, params)
	if err != nil {
		slog.Error("Failed to send shipping update email", "error", err, "customer", customerEmail)
	} else {
		slog.Info("Shipping update email sent", "customer", customerEmail)
	}
}

func strOrDash(s *string) string {
	if s == nil {
		return "-"
	}
	return *s
}
