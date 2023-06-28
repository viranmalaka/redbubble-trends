import { RedResults } from "../../../../utils/RebResults";
import { NextResponse } from "next/server";
import createDBConnection from "../../../../utils/db-connections";

export async function POST(request, { params: { date }, body }) {
  await createDBConnection();

  try {
    const data = await RedResults.findOneAndUpdate(
      { date },
      { data: await requrest.json(), date },
      { upsert: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json(data);
  } catch (err) {
    return new NextResponse({ status: 400 }).json({ err, error: true });
  }
}
