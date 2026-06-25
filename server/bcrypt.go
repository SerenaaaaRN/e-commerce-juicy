//go:build ignore

package main

import (
	"fmt"
	"os"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("╔══════════════════════════════════════╗")
		fmt.Println("║  Encode:  go run bcrypt.go <password>")
		fmt.Println("║  Verify:  go run bcrypt.go <password> <hash>")
		fmt.Println("╚══════════════════════════════════════╝")
		return
	}

	if len(os.Args) == 2 {
		// Mode: Encode — generate bcrypt hash
		password := os.Args[1]
		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		fmt.Println(string(hash))
		return
	}

	if len(os.Args) == 3 {
		// Mode: Verify — cocokkan password dengan hash
		password := os.Args[1]
		hash := os.Args[2]

		err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
		if err == nil {
			fmt.Println("Cocok")
		} else {
			fmt.Println("Tidak cocok")
		}
		return
	}
}
