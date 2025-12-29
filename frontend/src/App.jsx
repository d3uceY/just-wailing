"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Upload, Download, Plus, Trash2, File } from "lucide-react"

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Text File Manager</h1>
          <p className="text-muted-foreground mt-1">Upload, edit, and download text files</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
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
                  <button className="w-full text-left p-3 rounded-md bg-muted hover:bg-muted/80 transition">
                    <p className="font-medium text-foreground text-sm">document.txt</p>
                    <p className="text-xs text-muted-foreground">2.4 KB</p>
                  </button>
                  <button className="w-full text-left p-3 rounded-md bg-muted hover:bg-muted/80 transition">
                    <p className="font-medium text-foreground text-sm">notes.txt</p>
                    <p className="text-xs text-muted-foreground">1.1 KB</p>
                  </button>
                  <button className="w-full text-left p-3 rounded-md bg-muted hover:bg-muted/80 transition">
                    <p className="font-medium text-foreground text-sm">readme.txt</p>
                    <p className="text-xs text-muted-foreground">3.7 KB</p>
                  </button>
                </div>

                {/* File Actions */}
                <div className="pt-4 border-t border-border space-y-2">
                  <Button className="w-full bg-transparent" variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive w-full bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
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
                  <Input placeholder="Enter file name (e.g., myfile.txt)" type="text" />
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
                  placeholder="Paste or type your text content here..."
                  className="flex-1 min-h-64 font-mono resize-none"
                />
              </CardContent>
            </Card>

            {/* Save & Download Actions */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline">Cancel</Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Save & Download
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
