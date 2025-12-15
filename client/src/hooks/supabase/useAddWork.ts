import { useMutation, useQueryClient } from "@tanstack/react-query";

/* ----------------------------------------
   Types (match API body exactly)
---------------------------------------- */

export type AddWorkInput = {
  id?: string;
  name: string;
  description: string;
  project_link: string;
  beta: boolean;
  directory: boolean;
  icon_file_base64?: string;
  icon_filename?: string;
};

type AddWorkSuccess = {
  success: true;
  work: {
    id: string;
    name: string;
    description: string;
    project_link: string;
    beta: boolean;
    directory: boolean;
    icon_image_url: string | null;
    created_at: string;
    updated_at: string;
  };
};

type AddWorkError = {
  success: false;
  error: unknown;
};

type AddWorkResponse = AddWorkSuccess | AddWorkError;

/* ----------------------------------------
   Fetcher
---------------------------------------- */

async function addWorkRequest(
  serverUrl: string,
  body: AddWorkInput,
): Promise<AddWorkSuccess> {
  const res = await fetch(`${serverUrl}/api/supabase/add-work`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to add work");
  }

  const json: AddWorkResponse = await res.json();

  if (!json.success) {
    throw new Error(
      typeof json.error === "string" ? json.error : "Failed to add work",
    );
  }

  return json;
}

/* ----------------------------------------
   Hook
---------------------------------------- */

export function useAddWork(serverUrl: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AddWorkInput) => addWorkRequest(serverUrl, body),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["works"] });
    },
  });
}
