import { RedResults } from "../../../utils/RebResults";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const data = await RedResults.find(params);
    return NextResponse.json(data);
  } catch (err) {
    return new NextResponse({ status: 400 }).json({ err, error: true });
  }
}
