import { RedResults } from "../../../utils/RebResults";
import { NextResponse } from "next/server";
import createDBConnection from "../../../utils/db-connections";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  await createDBConnection();
  try {
    const data = await RedResults.find({ date });
    return NextResponse.json(data[0]);
  } catch (err) {
    return new NextResponse({ status: 400 }).json({ err, error: true });
  }
}

export async function POST(req) {
  await createDBConnection();
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  try {
    const data = await RedResults.findOneAndUpdate(
      { date },
      { data: await req.json(), date },
      { upsert: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json(data);
  } catch (err) {
    return new NextResponse({ status: 400 }).json({ err, error: true });
  }
}
