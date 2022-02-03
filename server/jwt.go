package server

import (
	"fmt"
	"memos/api"
	"memos/common"
	"net/http"
	"strconv"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

var (
	userIdContextKey = "user-id"
)

func getUserIdContextKey() string {
	return userIdContextKey
}

// Purpose of this cookie is to store the user's id.
func setUserSession(c echo.Context, user *api.User) {
	sess, _ := session.Get("session", c)
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   1000 * 3600 * 24 * 30,
		HttpOnly: true,
	}
	sess.Values[userIdContextKey] = strconv.Itoa(user.Id)
	sess.Save(c.Request(), c.Response())
}

func removeUserSession(c echo.Context) {
	sess, _ := session.Get("session", c)
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   0,
		HttpOnly: true,
	}
	sess.Values[userIdContextKey] = nil
	sess.Save(c.Request(), c.Response())
}

// Use session instead of jwt in the initial version
func JWTMiddleware(us api.UserService, next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Skips auth, test
		if common.HasPrefixes(c.Path(), "/api/auth", "/api/test") {
			return next(c)
		}

		sess, err := session.Get("session", c)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "Missing session")
		}
		userId, err := strconv.Atoi(fmt.Sprintf("%v", sess.Values[userIdContextKey]))
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "Failed to malformatted user id in the session.")
		}

		// Even if there is no error, we still need to make sure the user still exists.
		principalFind := &api.UserFind{
			Id: &userId,
		}
		user, err := us.FindUser(principalFind)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("Server error to find user ID: %d", userId)).SetInternal(err)
		}
		if user == nil {
			return echo.NewHTTPError(http.StatusUnauthorized, fmt.Sprintf("Failed to find user ID: %d", userId))
		}

		// Stores principalID into context.
		c.Set(getUserIdContextKey(), userId)
		return next(c)
	}
}
