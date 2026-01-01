package main

type Directory struct {
	Dir string
}

func (a *App) GetLastSavedDir() (string, error) {
    var dir string
    err := DB.QueryRow("SELECT dir FROM last_dir_tb LIMIT 1").Scan(&dir)
    if err != nil {
        return "", err
    }
    return dir, nil
}

func (a *App) UpdateLastDir(dir string) error {
	_, err := DB.Exec(
		"UPDATE last_dir_tb SET dir = ?",
		dir,
	)
	return err
}
