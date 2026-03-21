package service

import (
	"context"
	"errors"
	"log"
	"sync"
)

var (
	ErrWorkerPoolClosed = errors.New("worker pool is closed")
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
	for {
		select {
		case task, ok := <-w.tasks:
			if !ok {
				return
			}
			w.execute(task)
		default:
			return
		}
	}
}

func (w *BackgroundWorker) execute(task func(ctx context.Context)) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("[BackgroundWorker] PANIC RECOVERED: %v", r)
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
		close(w.tasks)
		log.Println("[BackgroundWorker] Draining active and queued jobs...")
		w.wg.Wait()
		log.Println("[BackgroundWorker] All background jobs finished.")
	})
}
