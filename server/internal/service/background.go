package service

import (
	"context"
	"log/slog"
	"sync"
)

type BackgroundWorker struct {
	tasks  chan func(ctx context.Context)
	wg     sync.WaitGroup
	ctx    context.Context
	cancel context.CancelFunc
	once   sync.Once
}

func NewBackgroundWorker(parentCtx context.Context, poolSize int, queueSize int) *BackgroundWorker {
	ctx, cancel := context.WithCancel(parentCtx)
	w := &BackgroundWorker{
		tasks:  make(chan func(ctx context.Context), queueSize),
		ctx:    ctx,
		cancel: cancel,
	}

	for i := 0; i < poolSize; i++ {
		w.wg.Add(1)
		go w.worker()
	}

	return w
}

func (w *BackgroundWorker) worker() {
	defer w.wg.Done()
	for {
		select {
		case <-w.ctx.Done():
			w.drainRemaining()
			return
		case task, ok := <-w.tasks:
			if !ok {
				return
			}
			w.execute(task)
		}
	}
}

func (w *BackgroundWorker) drainRemaining() {
	executed := 0
	for {
		select {
		case task, ok := <-w.tasks:
			if !ok {
				if executed > 0 {
					slog.Info("BackgroundWorker executed queued tasks during shutdown", "count", executed)
				}
				return
			}
			w.execute(task)
			executed++
		default:
			if executed > 0 {
				slog.Info("BackgroundWorker executed queued tasks during shutdown", "count", executed)
			}
			return
		}
	}
}

func (w *BackgroundWorker) execute(task func(ctx context.Context)) {
	defer func() {
		if r := recover(); r != nil {
			slog.Error("BackgroundWorker panic recovered", "recover", r)
		}
	}()
	task(w.ctx)
}

func (w *BackgroundWorker) Submit(task func(ctx context.Context)) error {
	select {
	case <-w.ctx.Done():
		return ErrWorkerPoolClosed
	case w.tasks <- task:
		return nil
	}
}

func (w *BackgroundWorker) Shutdown() {
	w.once.Do(func() {
		w.cancel()
		w.wg.Wait()
		slog.Info("BackgroundWorker stopped")
	})
}
