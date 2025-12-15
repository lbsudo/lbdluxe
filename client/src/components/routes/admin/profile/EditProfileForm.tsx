import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpdateProfile } from "@/hooks/supabase/useUpdateProfile";

/* ----------------------------------------
   Helpers
---------------------------------------- */

function moveWord(words: string[], from: number, to: number) {
  if (to < 0 || to >= words.length) return words;

  const updated = [...words];
  const [moved] = updated.splice(from, 1);
  updated.splice(to, 0, moved);
  return updated;
}

/* ----------------------------------------
   Types
---------------------------------------- */

type Profile = {
  profile_image_url: string | null;
  description: string | null;
  words: string[];
};

type Props = {
  serverUrl: string;
  images: { name: string; url: string }[];
  profile?: Profile;
};

/* ----------------------------------------
   Component
---------------------------------------- */

export function EditProfileForm({ serverUrl, images, profile }: Props) {
  const updateProfile = useUpdateProfile(serverUrl);

  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [wordInput, setWordInput] = useState("");

  /* ----------------------------------------
     Prefill from profile (once)
  ---------------------------------------- */

  useEffect(() => {
    if (!profile) return;

    setSelectedImageUrl(profile.profile_image_url);
    setDescription(profile.description ?? "");
    setWords(profile.words ?? []);
  }, [profile]);

  return (
    <>
      {/* Image selector */}
      <h2 className="mt-6 mb-2 font-medium">Select profile image</h2>

      <div className="grid grid-cols-2 gap-4">
        {images.map((img) => {
          const isSelected = selectedImageUrl === img.url;

          return (
            <button
              key={img.name}
              type="button"
              onClick={() => setSelectedImageUrl(img.url)}
              className={`
                relative aspect-square overflow-hidden rounded-md border h-1/2 w-/12
                ${
                  isSelected
                    ? "ring-2 ring-primary"
                    : "hover:ring-2 hover:ring-muted-foreground"
                }
              `}
            >
              <img
                src={img.url}
                alt={img.name}
                className="h-full w-full object-cover"
              />

              {isSelected && (
                <span className="absolute bottom-2 right-2 rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Words */}
      <div className="mt-6">
        <label className="mb-1 block text-sm font-medium">Profile words</label>

        <div className="flex gap-2">
          <input
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = wordInput.trim();
                if (!value || words.includes(value)) return;
                setWords([...words, value]);
                setWordInput("");
              }
            }}
            placeholder="Type a word and press Enter"
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          />

          <button
            type="button"
            onClick={() => {
              const value = wordInput.trim();
              if (!value || words.includes(value)) return;
              setWords([...words, value]);
              setWordInput("");
            }}
            className="rounded-md bg-secondary px-3 py-2 text-sm"
          >
            Add
          </button>
        </div>

        {words.length > 0 && (
          <ul className="mt-3 space-y-2">
            {words.map((word, index) => (
              <li
                key={word}
                className="flex items-center justify-between rounded-md border bg-muted px-3 py-2 text-sm"
              >
                <span>{word}</span>

                <div className="flex gap-1">
                  <button
                    onClick={() => setWords(moveWord(words, index, index - 1))}
                    disabled={index === 0}
                  >
                    ↑
                  </button>

                  <button
                    onClick={() => setWords(moveWord(words, index, index + 1))}
                    disabled={index === words.length - 1}
                  >
                    ↓
                  </button>

                  <button
                    onClick={() =>
                      setWords(words.filter((_, i) => i !== index))
                    }
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="mb-1 block text-sm font-medium">
          Profile description
        </label>

        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {/* Save */}
      <div className="mt-6">
        <button
          disabled={updateProfile.isPending}
          onClick={() =>
            updateProfile.mutate(
              {
                profile_image_url: selectedImageUrl ?? undefined,
                description: description || undefined,
                words: words.length ? words : undefined,
              },
              {
                onSuccess: () => toast.success("Profile updated"),
                onError: (err) =>
                  toast.error(
                    err instanceof Error
                      ? err.message
                      : "Failed to update profile",
                  ),
              },
            )
          }
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          {updateProfile.isPending ? "Saving…" : "Save profile"}
        </button>
      </div>
    </>
  );
}
