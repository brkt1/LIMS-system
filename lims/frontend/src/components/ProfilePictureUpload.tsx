import { Camera, Upload, X, User } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

interface ProfilePictureUploadProps {
  currentPicture?: string;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentPicture,
  onUpload,
  onDelete,
  loading = false,
  disabled = false,
  error = null,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Clear preview when currentPicture changes (indicating successful upload)
  useEffect(() => {
    if (currentPicture && preview) {
      setPreview(null);
    }
  }, [currentPicture, preview]);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Create preview using FileReader with data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result && result.startsWith("data:")) {
        setPreview(result);
      }
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      await onUpload(file);
      // Preview will be cleared by useEffect when currentPicture updates
    } catch (error) {
      console.error("Upload failed:", error);
      setPreview(null);
    }
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    if (!disabled && !loading) {
      fileInputRef.current?.click();
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && !loading) {
      if (confirm("Are you sure you want to delete your profile picture?")) {
        await onDelete();
        setPreview(null);
      }
    }
  };

  // Show preview while uploading, then server image after upload
  const displayPicture = preview || currentPicture;

  return (
    <div className="relative">
      <div
        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden cursor-pointer transition-all duration-200 ${
          disabled || loading
            ? "cursor-not-allowed opacity-50"
            : "hover:ring-4 hover:ring-primary-200 dark:hover:ring-primary-800"
        } ${dragOver ? "ring-4 ring-primary-300 dark:ring-primary-700" : ""}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {displayPicture ? (
          <img
            src={displayPicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 dark:text-gray-400" />
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!disabled && !loading && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
            <Camera className="w-4 h-4 sm:w-6 sm:h-6 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
          </div>
        )}

        {displayPicture && !disabled && !loading && (
          <button
            onClick={handleDelete}
            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || loading}
      />

      {!disabled && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
            Tap to upload
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            PNG, JPG up to 5MB
          </p>
          {error && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
