import { NextResponse } from "next/server";

import { request } from "@/utils/request-client";
import type { AuthErrorResponse } from "@/utils/types/server-response.type";
import { stringifyResponseErrorStatusCode } from "@/utils/helpers/server-helper";

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
    const errorStatus = response.error?.status;

    return NextResponse.json(
      {
        error: stringifyResponseErrorStatusCode(
          errorStatus || 600,
          response.error?.data
        ),
      },
      { status: errorStatus || 500 }
    );
  }
  return NextResponse.json(response.data);
}
