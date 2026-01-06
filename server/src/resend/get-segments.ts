// server/src/resend/get-segments.ts
import type { Context } from "hono";
import type { Resend } from "resend";

type Env = {
  Variables: {
    resend: Resend;
  };
};

export const getSegments = async (c: Context<Env>) => {
  const resend = c.get("resend");

  if (!resend) {
    return c.json(
      { success: false, error: "Resend client not initialized" },
      500,
    );
  }

  try {
    console.log("Fetching segments from Resend API...");
    const { data, error } = await resend.segments.list();

    if (error) {
      console.error("Resend API error:", error);
      return c.json({ success: false, error: `Resend API error: ${error.message}` }, 400);
    }

    const segments = data?.data || [];
    console.log(`Successfully fetched ${segments.length} segments`);

    return c.json({ success: true, segments: segments }, 200);
  } catch (err: any) {
    console.error("Unexpected error fetching segments:", err);
    
    // Log more details about the error for debugging
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response text:", await err.response.text());
    }
    
    return c.json(
      { 
        success: false, 
        error: "Failed to fetch segments",
        details: err.message || "Unknown error"
      },
      500,
    );
  }
};