package main

type Directory struct {
	Dir string
}

// this function gets the last saved dir
func (a *App) GetLastSavedDir() (string, error) {
    var dir string
    err := DB.QueryRow("SELECT dir FROM last_dir_tb LIMIT 1").Scan(&dir)
    if err != nil {
        return "", err
    }
    return dir, nil
}


// this function stores the latest file directory to the database
func (a *App) UpdateLastDir(dir string) error {
    // Try to update first
    result, err := DB.Exec(
        "UPDATE last_dir_tb SET dir = ? WHERE id = 1",
        dir,
    )
    if err != nil {
        return err
    }

    // Check if any row was updated
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return err
    }

    // If no rows were updated, insert a new one
    if rowsAffected == 0 {
        _, err = DB.Exec(
            "INSERT INTO last_dir_tb (id, dir) VALUES (1, ?)",
            dir,
        )
        return err
    }

    return nil
}