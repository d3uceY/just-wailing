
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Download, Plus, Trash2, File, Pencil } from "lucide-react"
import { SaveTextFile, SelectFolderAndListFiles, ReadFile, DeleteFile } from './../wailsjs/go/main/App'
import { useState, useEffect } from "react"

export default function App() {
  const [writtenText, setWrittenText] = useState({
    title: "",
    content: ""
  })
  const [lastSavedDir, setlastSavedDir] = useState(null)
  const [fileEntries, setFileEnteries] = useState(null);
  const [test, setTest] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);


  const updateFileTitle = (e) => {
    setWrittenText((prev) => ({ ...prev, title: e.target.value }))
  }


  // edit text file
  const editFile = async (path) => {
    return await ReadFile(path).then((data) => {
      setTest(data)
      setWrittenText({
        title: data.fileName,
        content: data.fileContent,
      })
    })
  }

  // select target directory
  const selectDirectory = async (isExisting) => {
    return SelectFolderAndListFiles(isExisting)
      .then((res) => {
        setFileEnteries(res)
      })
  }

  // delete file
  const deleteFile = async (path) => {
    await DeleteFile(path);
    selectDirectory(true)
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  }

  // handle delete confirmation
  const handleDeleteClick = (filePath) => {
    setFileToDelete(filePath);
    setDeleteDialogOpen(true);
  }

  const updateFileContent = (e) => {
    setWrittenText((prev) => ({ ...prev, content: e.target.value }))
  }

// saves the text file
  const saveTextFile = () => {
    selectDirectory(true);
    SaveTextFile(writtenText.content, writtenText.title)
  }


  // on application load, last selected directory is fetched
  useEffect(() => {
    selectDirectory(true);
  }, [fileEntries])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-muted-foreground mt-1">Upload, edit, and download text files</p>
        </div>
      </header>
      {/* {JSON.stringify(test)} */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 !pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - File List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="w-5 h-5" />
                  Files
                </CardTitle>
                <CardDescription>Your stored text files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* File List Items */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {fileEntries && fileEntries.map((file, index) => (
                    <div key={index} className="w-full p-3 rounded-md bg-muted hover:bg-muted/80 transition flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.fileSize} bytes</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editFile(file.filePath)} className="p-1.5 hover:bg-background rounded transition">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(file.filePath)} className="p-1.5 hover:bg-background rounded transition text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {!fileEntries && (
                    <p className="text-sm text-muted-foreground text-center py-4">No files loaded</p>
                  )}
                </div>

                {/* File Actions */}
                <div className="pt-4 border-t border-border space-y-2">
                  <Button
                    onClick={() => selectDirectory(false)}
                    className="w-full bg-transparent"
                    variant="outline"
                    size="sm">
                    <File className="w-4 h-4 mr-2" />
                    Open File Directory
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Name Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  New File
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">File Name</label>
                  <Input value={writtenText.title} onChange={updateFileTitle} name="fileName" placeholder="Enter file name (e.g., myfile)" type="text" />
                </div>
              </CardContent>
            </Card>

            {/* Text Editor */}
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Editor</CardTitle>
                <CardDescription>Edit or view your text file content</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <Textarea
                  name="fileContent"
                  onChange={updateFileContent}
                  value={writtenText.content}
                  placeholder="Paste or type your text content here..."
                  className="flex-1 min-h-64 font-mono resize-none"
                />
              </CardContent>
            </Card>

            {/* Save & Download Actions */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => saveTextFile()}>
                <Download className="w-4 h-4 mr-2" />
                Save & Download
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the file from your directory.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteFile(fileToDelete)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
