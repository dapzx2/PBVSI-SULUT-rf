"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Article } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ArticleFormProps {
  initialData?: Article | null;
  onSubmit: (data: Omit<Article, 'id' | 'created_at' | 'published_at' | 'image_url'> & { imageFile?: File | null }) => void;
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

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setAuthor(initialData.author || "");
      setCategory(initialData.category || "");
      setTags(initialData.tags ? (Array.isArray(initialData.tags) ? initialData.tags.join(", ") : initialData.tags) : "");
      setImageFile(null); // Clear file input on edit
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTags = tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
    onSubmit({
      title,
      content,
      author,
      category,
      tags: parsedTags,
      imageFile, // Pass the file object up
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full">
      <ScrollArea className="flex-grow pr-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Judul</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="content">Konten</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows={10} />
          </div>
          <div>
            <Label htmlFor="imageUpload">Unggah Gambar Baru</Label>
            <Input id="imageUpload" type="file" accept="image/*" onChange={handleFileChange} />
            {imageFile && <p className="text-sm text-gray-500 mt-1">File dipilih: {imageFile.name}</p>}
            {initialData?.image_url && !imageFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Gambar saat ini:</p>
                <img src={initialData.image_url} alt="Current Article Image" className="max-h-40 object-contain" />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="author">Penulis</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="category">Kategori</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="tags">Tag (pisahkan dengan koma)</Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="contoh: olahraga, voli, berita" />
          </div>
        </div>
      </ScrollArea>
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Batal</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
