import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/subscription/select-plan
 * Select a subscription plan for the authenticated user
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { plan_id } = body;

    if (!plan_id) {
      return NextResponse.json(
        { error: "plan_id is required" },
        { status: 400 }
      );
    }

    // Call Xano backend to select plan
    const response = await fetch(
      "https://xyfx-hog3-y19r.n7e.xano.io/api:_ouDj2fG/select_plan",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan_id }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Xano API error:", errorText);
      return NextResponse.json(
        { error: "Failed to select plan" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Plan selection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
