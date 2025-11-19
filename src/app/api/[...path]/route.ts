import { NextResponse } from "next/server";

import { request } from "@/utils/request-client";
import type { AuthErrorResponse } from "@/utils/types/server-response.type";
import { getORfetchAccessToken } from "@/utils/helpers/server-helper";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const accessToken = await getORfetchAccessToken();
  const response = await request<unknown, AuthErrorResponse>({
    method: "get",
    path: path.join("/") + "/",
    config: {
      headers: {
        Authorization: `Bearer ${accessToken || ""}`,
      },
    },
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
