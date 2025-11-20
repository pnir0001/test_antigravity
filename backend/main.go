package main

import (
	"log"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/pnir0001/test_antigravity/backend/api"
	"github.com/pnir0001/test_antigravity/backend/db"
	"github.com/pnir0001/test_antigravity/backend/handlers"
)

func main() {
	// Initialize Database
	database, err := db.Init()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Initialize Echo
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Initialize Handlers
	server := &handlers.Server{DB: database}

	// Register Handlers under /api/v1
	g := e.Group("/api/v1")
	api.RegisterHandlers(g, server)

	// Start Server
	e.Logger.Fatal(e.Start(":8080"))
}
