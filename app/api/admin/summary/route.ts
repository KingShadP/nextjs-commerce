import { isAdminAuthenticated, verifyAdminApiToken } from "lib/admin-auth";
import { getAdminDashboardSummary } from "lib/admin-dashboard";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const hasToken = verifyAdminApiToken(req.headers.get("authorization"));
  const hasSession = await isAdminAuthenticated();

  if (!hasToken && !hasSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getAdminDashboardSummary());
}
