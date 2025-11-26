"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Article } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { Upload, X, FileText, User, Tag, Layout, Type } from "lucide-react"
import { cn } from "@/lib/utils"

interface ArticleFormProps {
  initialData?: Article | null;
  onSubmit: (data: Omit<Article, 'id' | 'created_at' | 'published_at' | 'image_url' | 'updated_at' | 'slug' | 'excerpt'> & { imageFile?: File | null }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ArticleForm({ initialData, onSubmit, onCancel, isLoading }: ArticleFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [tags, setTags] = useState(initialData?.tags ? (Array.isArray(initialData.tags) ? initialData.tags.join(", ") : initialData.tags) : "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setAuthor(initialData.author || "");
      setCategory(initialData.category || "");
      setTags(initialData.tags ? (Array.isArray(initialData.tags) ? initialData.tags.join(", ") : initialData.tags) : "");
      setImageFile(null);
      setPreviewUrl(initialData.image_url || null);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTags = tags.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
    onSubmit({
      title,
      content,
      author,
      category,
      tags: parsedTags,
      imageFile,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
      <ScrollArea className="flex-grow pr-4 -mr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
          {/* Left Column: Main Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2 text-primary">
                <Type className="h-4 w-4" /> Judul Berita
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Masukkan judul berita yang menarik"
                className="text-lg font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="flex items-center gap-2 text-primary">
                <FileText className="h-4 w-4" /> Konten Berita
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                placeholder="Tulis isi berita di sini..."
                className="resize-none"
              />
            </div>
          </div>

          {/* Right Column: Meta & Image */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-primary">
                <Layout className="h-4 w-4" /> Gambar Utama
              </Label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:bg-muted/50 relative min-h-[200px] flex flex-col items-center justify-center",
                  previewUrl ? "border-primary/50" : "border-muted-foreground/25"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <Input
                  ref={fileInputRef}
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="relative w-full h-full min-h-[200px]">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-contain rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <div className="p-3 bg-muted rounded-full">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">Klik atau tarik gambar ke sini</p>
                    <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author" className="flex items-center gap-2 text-primary">
                  <User className="h-4 w-4" /> Penulis
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nama penulis"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2 text-primary">
                  <Tag className="h-4 w-4" /> Kategori
                </Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Misal: Pertandingan"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="flex items-center gap-2 text-primary">
                <Tag className="h-4 w-4" /> Tag
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Pisahkan dengan koma (contoh: voli, proliga, atlet)"
              />
              <p className="text-xs text-muted-foreground">
                Gunakan koma untuk memisahkan beberapa tag.
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="flex justify-end space-x-3 pt-4 border-t mt-auto">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? "Menyimpan..." : "Simpan Berita"}
        </Button>
      </div>
    </form>
  );
}
