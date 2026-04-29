import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/subscription/check
 * Check subscription status for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get auth token from request headers
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Call Xano backend to check subscription
    const response = await fetch(
      "https://xyfx-hog3-y19r.n7e.xano.io/api:_ouDj2fG/check_subscription",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Xano API error:", errorText);
      return NextResponse.json(
        { error: "Failed to check subscription" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
