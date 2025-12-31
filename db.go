package main

import (
	"database/sql"

	_ "modernc.org/sqlite"
)

// to install sqlite, use cli command <<< go get modernc.org/sqlite >>>

var DB *sql.DB

func InitDB(path string) error {
	var err error
	DB, err = sql.Open("sqlite", path)
	if err != nil {
		return err
	}

	// Test connection
	return DB.Ping()
}


func createTables() {
	query := `
	CREATE TABLE IF NOT EXISTS last_dir_tb (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		dir TEXT NULL,
	);
	`
	_, err := DB.Exec(query)
	if err != nil {
		panic(err)
	}
}