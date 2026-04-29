import { NextRequest, NextResponse } from "next/server";

const XANO_BILLING_BASE = "https://xyfx-hog3-y19r.n7e.xano.io/api:oO2bgH5A";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startingAfter = searchParams.get("starting_after");

    const url = new URL(`${XANO_BILLING_BASE}/list_invoices`);
    if (startingAfter) {
      url.searchParams.set("starting_after", startingAfter);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Xano API error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch invoices" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Invoices fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
