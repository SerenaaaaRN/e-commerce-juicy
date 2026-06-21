package service

import (
	"context"
	"fmt"
	"log"

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
		log.Println("⚠️ RESEND_API_KEY is not set. Email services will fallback to mock stdout logging mode.")
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
		log.Printf("[Email Mock] Sending Order Confirmation to %s (%s). Subject: %s", customerName, customerEmail, subject)
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
		log.Printf("⚠️ Failed to send order confirmation email via Resend: %v", err)
	} else {
		log.Printf("✓ Order confirmation email sent to %s", customerEmail)
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
		log.Printf("[Email Mock] Sending Admin Alert to %s. Subject: %s", s.adminAlertEmail, subject)
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
		log.Printf("⚠️ Failed to send admin order alert email via Resend: %v", err)
	} else {
		log.Printf("✓ Admin order alert email sent")
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
		log.Printf("[Email Mock] Sending Shipping Update to %s (%s). Subject: %s", customerName, customerEmail, subject)
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
		log.Printf("⚠️ Failed to send shipping update email via Resend: %v", err)
	} else {
		log.Printf("✓ Shipping update email sent to %s", customerEmail)
	}
}

func strOrDash(s *string) string {
	if s == nil {
		return "-"
	}
	return *s
}
