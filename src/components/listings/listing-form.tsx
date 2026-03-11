"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { CATEGORIES } from "@/lib/constants";
import { Loader2, X, Plus } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ListingFormProps {
  initialData?: {
    title: string;
    description: string;
    location: string;
    price: number;
    images: string[];
    category: string;
    duration?: string;
    maxGuests?: number;
  };
  onSubmit: (data: { title: string; description: string; location: string; price: number; images: string[]; category: string; duration?: string; maxGuests?: number }) => Promise<void>;
  submitLabel?: string;
}

export function ListingForm({
  initialData,
  onSubmit,
  submitLabel = "Create Listing",
}: ListingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialData?.images || []);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    price: initialData?.price?.toString() || "",
    category: initialData?.category || CATEGORIES[0],
    duration: initialData?.duration || "",
    maxGuests: initialData?.maxGuests?.toString() || "",
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalImages = previewUrls.length + files.length;
    if (totalImages > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    // Validate each file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type. Only JPEG, PNG, and WebP are allowed`);
        continue;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large. Maximum size is 5MB`);
        continue;
      }

      validFiles.push(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    // Check if it's an existing image or a new upload
    if (index < existingImages.length) {
      // Remove from existing images
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove from new uploads
      const newFileIndex = index - existingImages.length;
      setSelectedFiles(prev => prev.filter((_, i) => i !== newFileIndex));
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) {
      return existingImages;
    }

    setIsUploading(true);
    const uploadToast = toast.loading(`Uploading ${selectedFiles.length} image(s)...`);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formDataToSend = new FormData();
        formDataToSend.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataToSend,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }

        uploadedUrls.push(data.url);
        toast.loading(`Uploading ${i + 1}/${selectedFiles.length} image(s)...`, { id: uploadToast });
      }

      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`, { id: uploadToast });
      return [...existingImages, ...uploadedUrls];
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload images", {
        id: uploadToast,
      });
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (formData.title.length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (formData.description.length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Location is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (previewUrls.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsLoading(true);

    try {
      // Upload new images if any
      const allImageUrls = await uploadImages();
      if (allImageUrls.length === 0) {
        setIsLoading(false);
        return;
      }

      await onSubmit({
        ...formData,
        images: allImageUrls,
        price: parseFloat(formData.price),
        maxGuests: formData.maxGuests ? parseInt(formData.maxGuests) : undefined,
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Sunset Safari in Serengeti"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your travel experience in detail..."
              required
              rows={6}
              maxLength={2000}
            />
            <p className="text-xs text-gray-500">
              {formData.description.length}/2000 characters
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Serengeti National Park, Tanzania"
              required
            />
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price (LKR) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <NativeSelect
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>

          {/* Multiple Images Upload */}
          <div className="space-y-2">
            <Label htmlFor="images">
              Images <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">({previewUrls.length}/10)</span>
            </Label>
            
            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Cover
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add More Button */}
              {previewUrls.length < 10 && (
                <div
                  className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <Plus className="h-8 w-8 mx-auto text-gray-400 mb-1" />
                    <p className="text-xs text-gray-600">Add Image</p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              multiple
              className="hidden"
              id="images"
            />
            
            <p className="text-xs text-gray-500">
              JPEG, PNG, or WebP (max 5MB each). First image will be the cover photo.
            </p>
          </div>

          {/* Duration and Max Guests Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (optional)</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 4 hours, 2 days"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxGuests">Max Guests (optional)</Label>
              <Input
                id="maxGuests"
                name="maxGuests"
                type="number"
                min="1"
                value={formData.maxGuests}
                onChange={handleChange}
                placeholder="e.g., 10"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="flex-1"
              size="lg"
            >
              {isLoading || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? "Uploading images..." : "Submitting..."}
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
