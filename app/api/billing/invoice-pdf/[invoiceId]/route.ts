import { NextRequest, NextResponse } from "next/server";

const XANO_BILLING_BASE = "https://xyfx-hog3-y19r.n7e.xano.io/api:oO2bgH5A";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const { invoiceId } = await params;

    const response = await fetch(
      `${XANO_BILLING_BASE}/get_invoice_pdf/${invoiceId}`,
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
        { error: "Failed to get invoice PDF" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Invoice PDF error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
