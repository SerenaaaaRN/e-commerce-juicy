package dto

type AdminLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AdminResponse struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

type AdminLoginResponse struct {
	Token string        `json:"token"`
	Admin AdminResponse `json:"admin"`
}
