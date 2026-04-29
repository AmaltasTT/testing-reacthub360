import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://xyfx-hog3-y19r.n7e.xano.io/api:";

// POST /api/onboarding - Save onboarding data
export async function POST(request: NextRequest) {
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

    // First, get the user data from /me to get organization ID
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

    // Prepare organization update data with all onboarding fields
    const organizationUpdateData: Record<string, any> = {
      organizations_id: organizationId,
      onboarding_completed: true, // Mark onboarding as complete
    };

    // Add all onboarding fields to organization update
    if (body.companyName) {
      organizationUpdateData.name = body.companyName;
    }

    if (body.businessModel) {
      organizationUpdateData.business_model = body.businessModel;
    }

    if (body.industry) {
      // If industry is "other", use the custom value, otherwise use the selected value
      organizationUpdateData.industry =
        body.industry === "other" ? body.industryOther : body.industry;
    }

    if (body.companySize) {
      organizationUpdateData.company_size = body.companySize;
    }

    if (body.websiteUrl) {
      organizationUpdateData.website = body.websiteUrl;
    }

    // Add business address fields
    if (body.street_address !== undefined) {
      organizationUpdateData.street_address = body.street_address;
    }

    if (body.city !== undefined) {
      organizationUpdateData.city = body.city;
    }

    if (body.state !== undefined) {
      organizationUpdateData.state = body.state;
    }

    if (body.zip_code !== undefined) {
      organizationUpdateData.zip_code = body.zip_code;
    }

    if (body.country !== undefined) {
      organizationUpdateData.country = body.country;
    }

    // Update organization data using the organization ID
    const orgResponse = await fetch(
      `${API_BASE_URL}XhMFC5Oj/organizations/${organizationId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(organizationUpdateData),
      }
    );

    if (!orgResponse.ok) {
      const errorData = await orgResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to update organization data" },
        { status: orgResponse.status }
      );
    }

    const updatedOrganization = await orgResponse.json();
    return NextResponse.json({ success: true, data: updatedOrganization });
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
