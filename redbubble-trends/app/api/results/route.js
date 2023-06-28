import { RedResults } from "../../../utils/RebResults";
import { NextResponse } from "next/server";
import createDBConnection from "../../../utils/db-connections";

export async function GET(request, { params }) {
  await createDBConnection();
  try {
    const data = await RedResults.find(params);
    return NextResponse.json(data);
  } catch (err) {
    return new NextResponse({ status: 400 }).json({ err, error: true });
  }
}
