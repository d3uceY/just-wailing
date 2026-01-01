package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// FileInfo represents a file with its properties
type FileInfo struct {
	Name     string `json:"name"`
	FilePath string `json:"filePath"`
	Size     string `json:"fileSize"`
}

type FileData struct {
	FileTitle   string `json:"fileName"`
	FileContent string `json:"fileContent"`
}

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	appDir, err := getAppDataDir()
	if err != nil {
		panic(err)
	}

	dbPath := filepath.Join(appDir, "data.db")

	err = InitDB(dbPath)
	if err != nil {
		panic(err)
	}

	createTables()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello my nigga %s, It's show time!", name)
}

// get app data directory
func getAppDataDir() (string, error) {
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}

	appDir := filepath.Join(dir, "TeaXTea")
	err = os.MkdirAll(appDir, 0755)

	return appDir, err
}

// read a file
func (a *App) ReadFile(path string) (FileData, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return FileData{}, err
	}

	fileName := filepath.Base(path)
	content := string(data)

	return FileData{
		FileTitle:   fileName,
		FileContent: content,
	}, nil
}

// save a text file
func (a *App) SaveTextFile(content, title string) error {
	path, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Save text file",
		DefaultFilename: title + ".txt",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Text Files",
				Pattern:     "*.txt",
			},
		},
	})

	// User cancelled dialog
	if err != nil || path == "" {
		return err
	}

	return os.WriteFile(path, []byte(content), 0644)
}

// select directory of text files and send json data to frontend
// the getExisting bool is true, the function will try to
// retrieve the directory from the database, otherwise it will prompt the user to select a directory
func (a *App) SelectFolderAndListFiles(getExisting bool) ([]FileInfo, error) {
	var directory string

	if !getExisting {
		dir, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
			Title: "Select a folder to store TXT files",
			Filters: []runtime.FileFilter{
				{
					DisplayName: "Text Files",
					Pattern:     "*.txt",
				},
			},
		})
		if err != nil || dir == "" {
			return nil, err
		}
		err = a.UpdateLastDir(dir)

		if err != nil {
			return nil, err
		}

		directory = dir
	} else {
		savedDir, err := a.GetLastSavedDir()
		if err != nil {
			fmt.Println("failed to get saved dir:", err)
			return nil, err
		}

		// Check if any directory was saved
		if len(savedDir) == 0 {
			return nil, fmt.Errorf("no saved directory found, please select a folder first")
		}

		directory = savedDir
	}

	entries, err := os.ReadDir(directory)
	if err != nil {
		return nil, err
	}

	var files []FileInfo
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".txt") {
			info, err := entry.Info()
			if err != nil {
				continue
			}
			files = append(files, FileInfo{
				Name:     entry.Name(),
				FilePath: filepath.Join(directory, entry.Name()),
				Size:     fmt.Sprintf("%d", info.Size()),
			})
		}
	}

	return files, nil
}
