import { RedResults } from "../../../utils/RebResults";
import createDBConnection from "../../../utils/db-connections";
import { NextResponse } from "next/server";

export async function GET() {
  await createDBConnection();

  try {
    const data = await RedResults.find({}, "date");
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.status(400).json({ error: true, err });
  }
}
