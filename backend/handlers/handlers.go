package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	openapi_types "github.com/oapi-codegen/runtime/types"
	"github.com/pnir0001/test_antigravity/backend/api"
	"github.com/pnir0001/test_antigravity/backend/models"
	"gorm.io/gorm"
)

type Server struct {
	DB *gorm.DB
}

// Ensure Server implements api.ServerInterface
var _ api.ServerInterface = (*Server)(nil)

func (s *Server) ListMemos(ctx echo.Context) error {
	var memos []models.Memo
	if err := s.DB.Find(&memos).Error; err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	var response []api.Memo
	for _, m := range memos {
		response = append(response, api.Memo{
			Id:        m.ID,
			Title:     m.Title,
			Content:   m.Content,
			CreatedAt: m.CreatedAt,
			UpdatedAt: m.UpdatedAt,
		})
	}

	return ctx.JSON(http.StatusOK, response)
}

func (s *Server) CreateMemo(ctx echo.Context) error {
	var req api.CreateMemoRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	memo := models.Memo{
		Title:   req.Title,
		Content: req.Content,
	}

	if err := s.DB.Create(&memo).Error; err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	response := api.Memo{
		Id:        memo.ID,
		Title:     memo.Title,
		Content:   memo.Content,
		CreatedAt: memo.CreatedAt,
		UpdatedAt: memo.UpdatedAt,
	}

	return ctx.JSON(http.StatusCreated, response)
}

func (s *Server) GetMemo(ctx echo.Context, id openapi_types.UUID) error {
	var memo models.Memo
	if err := s.DB.First(&memo, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return ctx.JSON(http.StatusNotFound, map[string]string{"error": "Memo not found"})
		}
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	response := api.Memo{
		Id:        memo.ID,
		Title:     memo.Title,
		Content:   memo.Content,
		CreatedAt: memo.CreatedAt,
		UpdatedAt: memo.UpdatedAt,
	}

	return ctx.JSON(http.StatusOK, response)
}

func (s *Server) UpdateMemo(ctx echo.Context, id openapi_types.UUID) error {
	var req api.UpdateMemoRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	var memo models.Memo
	if err := s.DB.First(&memo, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return ctx.JSON(http.StatusNotFound, map[string]string{"error": "Memo not found"})
		}
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	memo.Title = req.Title
	memo.Content = req.Content

	if err := s.DB.Save(&memo).Error; err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	response := api.Memo{
		Id:        memo.ID,
		Title:     memo.Title,
		Content:   memo.Content,
		CreatedAt: memo.CreatedAt,
		UpdatedAt: memo.UpdatedAt,
	}

	return ctx.JSON(http.StatusOK, response)
}

func (s *Server) DeleteMemo(ctx echo.Context, id openapi_types.UUID) error {
	result := s.DB.Delete(&models.Memo{}, "id = ?", id)
	if result.Error != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": result.Error.Error()})
	}
	if result.RowsAffected == 0 {
		return ctx.JSON(http.StatusNotFound, map[string]string{"error": "Memo not found"})
	}

	return ctx.NoContent(http.StatusNoContent)
}
