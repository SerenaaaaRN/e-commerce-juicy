package service

import (
	"log"
	"sync"
)

type BackgroundWorker struct {
	wg sync.WaitGroup
}

func NewBackgroundWorker() *BackgroundWorker {
	return &BackgroundWorker{}
}

// Submit spawns a task in a new goroutine and registers it with the WaitGroup.
func (w *BackgroundWorker) Submit(task func()) {
	w.wg.Add(1)
	go func() {
		defer w.wg.Done()
		defer func() {
			if r := recover(); r != nil {
				log.Printf("[BackgroundWorker] PANIC RECOVERED: %v", r)
			}
		}()
		task()
	}()
}

// Shutdown blocks until all background tasks have finished.
func (w *BackgroundWorker) Shutdown() {
	log.Println("[BackgroundWorker] Draining active jobs...")
	w.wg.Wait()
	log.Println("[BackgroundWorker] All background jobs finished.")
}
