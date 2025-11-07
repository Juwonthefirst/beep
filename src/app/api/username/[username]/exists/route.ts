import { NextResponse } from "next/server";

import { request } from "@/utils/request-client";
import type { AuthErrorResponse } from "@/utils/types/server-response.types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const response = await request<{ exists: boolean }, AuthErrorResponse>({
    method: "get",
    path: `/users/username/${username}/exists/`,
  });

  if ("error" in response) {
    const errorMessage =
      typeof response.error === "string"
        ? response.error
        : response.error?.data?.error;
    const errorStatus =
      typeof response.error === "string" ? 600 : response.error?.status;

    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
  return NextResponse.json(response.data);
}
