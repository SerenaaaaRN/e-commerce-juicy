package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/SerenaaaaRN/juicy/internal/app"
	"github.com/SerenaaaaRN/juicy/internal/config"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		slog.Error("config", "error", err)
		os.Exit(1)
	}

	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	a, err := app.New(cfg)
	if err != nil {
		slog.Error("app", "error", err)
		os.Exit(1)
	}

	go func() {
		slog.Info("started", "port", cfg.AppPort, "mode", cfg.AppEnv)
		if err := a.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server", "error", err)
			os.Exit(1)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	slog.Info("shutting down...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := a.Shutdown(ctx); err != nil {
		slog.Error("shutdown", "error", err)
	}
	a.Worker.Shutdown()
	slog.Info("terminated")
}
