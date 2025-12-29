import { NextResponse } from "next/server";

import { request } from "@/utils/request-client";
import type { ErrorResponse } from "@/utils/types/server-response.type";
import { getORfetchAccessToken } from "@/utils/helpers/server-helper";
import { stringifyResponseErrorStatusCode } from "@/utils/helpers/client-helper";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const { searchParams } = new URL(req.url);
  const accessToken = await getORfetchAccessToken();
  const response = await request<unknown, ErrorResponse>({
    method: "get",
    path: path.join("/") + "/?" + searchParams.toString(),
    config: {
      headers: {
        Authorization: `Bearer ${accessToken || ""}`,
      },
    },
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
