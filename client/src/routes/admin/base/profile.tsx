import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import AdminLayout from "@/layouts/admin-layout";
import { useGetProfile } from "@/hooks/server/supabase/useGetProfile";
import { useUpdateProfile } from "@/hooks/server/supabase/useUpdateProfile";
import { useGetProfileImages } from "@/hooks/server/supabase/useProfileImages";
import { useDeleteProfileImage } from "@/hooks/server/supabase/useDeleteProfileImage";
import { useUpdateProfileImage } from "@/hooks/server/supabase/useUpdateProfileImage";
import { useUploadProfileImage } from "@/hooks/server/supabase/useUploadProfileImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/base/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const [mode, setMode] = useState<"profile" | "images">("profile");
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetProfile();
  const updateMutation = useUpdateProfile({
    onSuccess: () => {
      toast.success("Profile updated successfully!", {
        position: "top-center",
        richColors: true,
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`, {
        position: "top-center",
        richColors: true,
      });
    },
  });
  const [description, setDescription] = useState("");
  const [words, setWords] = useState<Array<string>>([]);
  useEffect(() => {
    if (profile?.description) setDescription(profile.description);
    if (profile?.words) setWords(profile.words);
  }, [profile?.description, profile?.words]);
  const {
    data: imagesData = [],
    isLoading: imagesLoading,
    error: imagesError,
  } = useGetProfileImages();
  const deleteMutation = useDeleteProfileImage({
    onError: (error: Error) => {
      toast.error(`Failed to delete image: ${error.message}`, {
        position: "top-center",
        richColors: true,
      });
    },
  });
  const updateImageMutation = useUpdateProfileImage({
    onSuccess: () => {
      toast.success("Profile image updated successfully!", {
        position: "top-center",
        richColors: true,
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile image: ${error.message}`, {
        position: "top-center",
        richColors: true,
      });
    },
  });
  const uploadMutation = useUploadProfileImage({
    onSuccess: (url: string) => {
      // Optionally set as selected image after upload
      setSelectedImage(url);
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload image: ${error.message}`, {
        position: "top-center",
        richColors: true,
      });
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (profile?.profile_image_url) {
      setSelectedImage(profile.profile_image_url);
    }
  }, [profile?.profile_image_url]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ description, words });
  };

  const handleWordChange = (idx: number, value: string) => {
    setWords((prev) => prev.map((w, i) => (i === idx ? value : w)));
  };

  const addWord = () => setWords((prev) => [...prev, ""]);

  const handleDelete = (url: string) => {
    console.log("handleDelete called with URL:", url);
    const filename = url.split("/").pop();
    console.log("Extracted filename for deletion:", filename);

    if (!filename) {
      console.error("No filename extracted from URL:", url);
      return;
    }

    setImageToDelete(url);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (imageToDelete) {
      console.log("confirmDelete called with imageToDelete:", imageToDelete);
      const filename = imageToDelete.split("/").pop();
      console.log("Extracted filename for deletion:", filename);

      // Check if this is a Vite dev server URL instead of actual filename
      if (filename && filename.includes("5173")) {
        console.error(
          "ERROR: Vite dev server URL detected instead of filename!",
        );
        console.error("Expected filename:", filename);
        console.error("Actual received:", imageToDelete);
        // Don't proceed with invalid filename
        setDeleteDialogOpen(false);
        setImageToDelete(null);
        return;
      }

      if (filename) {
        deleteMutation.mutate(filename);
      }
    }
    setDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  const handleSelectImage = (url: string) => {
    setSelectedImage(url);
  };

  const handleSaveImage = () => {
    if (selectedImage) {
      updateImageMutation.mutate({ profile_image_url: selectedImage });
      setIsModalOpen(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center mb-4">
        <label className="mr-3 font-medium">View:</label>
        <Switch
          checked={mode === "images"}
          onCheckedChange={(checked) => setMode(checked ? "images" : "profile")}
        />
        <span className="ml-3 text-sm font-medium">
          {mode === "profile" ? "Profile" : "Images"}
        </span>
      </div>

      {mode === "profile" && (
        <div>
          {profileLoading && <p>Loading profile...</p>}
          {profileError && (
            <p className="text-red-500">Error loading profile</p>
          )}
          {profile && (
            <>
              {/* Current profile image with edit button */}
              <div className="flex items-center mb-4">
                {profile.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-lg mr-4 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg mr-4 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    Edit Image
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Select Profile Image</DialogTitle>
                    </DialogHeader>
                    {imagesLoading && <p>Loading images...</p>}
                    {imagesError && (
                      <p className="text-red-500">Error loading images</p>
                    )}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {/* Show current profile image if it exists and isn't in the images array */}
                      {profile?.profile_image_url &&
                        !imagesData.includes(profile.profile_image_url) && (
                          <div
                            className={`cursor-pointer rounded border-2 ${
                              selectedImage === profile.profile_image_url
                                ? "border-blue-500"
                                : "border-transparent"
                            }`}
                            onClick={() =>
                              handleSelectImage(profile.profile_image_url!)
                            }
                          >
                            <img
                              src={profile.profile_image_url}
                              alt="Current profile"
                              className="w-full aspect-square object-cover rounded-lg"
                            />
                            <p className="text-xs text-center mt-1">Current</p>
                          </div>
                        )}
                      {imagesData.map((url: string) => (
                        <div
                          key={url}
                          className={`cursor-pointer rounded border-2 ${
                            selectedImage === url
                              ? "border-blue-500"
                              : "border-transparent"
                          }`}
                          onClick={() => handleSelectImage(url)}
                        >
                          <img
                            src={url}
                            alt="profile"
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={handleSaveImage}
                        disabled={
                          !selectedImage || updateImageMutation.isPending
                        }
                      >
                        {updateImageMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label
                    className="block font-medium mb-1"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Words</label>
                  {words.map((word, idx) => (
                    <Input
                      key={idx}
                      type="text"
                      name="words"
                      value={word}
                      onChange={(e) => handleWordChange(idx, e.target.value)}
                      className="mb-2"
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addWord}
                    className="mb-2"
                  >
                    Add Word
                  </Button>
                </div>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </>
          )}
        </div>
      )}

      {mode === "images" && (
        <div>
          {/* Upload Section */}
          <div className="mb-6">
            <input
              type="file"
              id="image-upload"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              onClick={() => document.getElementById("image-upload")?.click()}
              disabled={uploadMutation.isPending}
              className="mb-4"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload New Image"}
            </Button>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-3 gap-4">
            {imagesLoading && <p>Loading images...</p>}
            {imagesError && (
              <p className="text-red-500">Error loading images</p>
            )}
            {imagesData.map((url: string) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt="profile"
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => handleDelete(url)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the image from your profile. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setImageToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
