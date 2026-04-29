import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://xyfx-hog3-y19r.n7e.xano.io/api:";

// PATCH /api/organization - Update organization data
export async function PATCH(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Parse request body
    const body = await request.json();

    // First, get the user's organization ID
    const userResponse = await fetch(`${API_BASE_URL}XhMFC5Oj/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();
    const organizationId = userData.organizations_id;

    if (!organizationId) {
      return NextResponse.json(
        { error: "No organization associated with this user" },
        { status: 400 }
      );
    }

    // Validate and prepare update data
    const allowedFields = ["name", "website", "industry", "company_size", "business_model", "logo_image", "street_address", "city", "state", "zip_code", "country"];
    const updateData: Record<string, any> = {
      organizations_id: organizationId, // Include organizations_id in the request
    };

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Check if we have any fields to update besides organizations_id
    if (Object.keys(updateData).length === 1) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update organization data in backend
    const response = await fetch(
      `${API_BASE_URL}XhMFC5Oj/organizations/${organizationId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to update organization data" },
        { status: response.status }
      );
    }

    const updatedOrganization = await response.json();
    return NextResponse.json(updatedOrganization);
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
