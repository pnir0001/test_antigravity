package db

import (
	"fmt"
	"os"
	"time"

	"github.com/pnir0001/test_antigravity/backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Init() (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", "postgres"),
		getEnv("DB_NAME", "memo_db"),
		getEnv("DB_PORT", "5432"),
	)

	var db *gorm.DB
	var err error

	// Retry connection with exponential backoff
	maxRetries := 10
	for i := 0; i < maxRetries; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		
		if i < maxRetries-1 {
			waitTime := (i + 1) * 2 // 2, 4, 6, 8... seconds
			fmt.Printf("Failed to connect to database (attempt %d/%d), retrying in %d seconds...\n", i+1, maxRetries, waitTime)
			time.Sleep(time.Duration(waitTime) * time.Second)
		}
	}

	if err != nil {
		return nil, err
	}

	// Auto Migrate
	err = db.AutoMigrate(&models.Memo{})
	if err != nil {
		return nil, err
	}

	return db, nil
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
