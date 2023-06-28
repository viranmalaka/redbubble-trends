import { RedResults } from "../../../../utils/RebResults";
import createDBConnection from "../../../../utils/db-connections";
import { getDate } from "../../../../utils/utils";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await createDBConnection();

  try {
    const data = await RedResults.findOne({ date: params["date"] });

    if (!data) {
      return new NextResponse("Not found", { status: 400 });
    }
    const previousDays = Array(10)
      .fill({})
      .map((_, index) => {
        return getDate(
          new Date(params.date).getTime() - 86400000 * (index + 1)
        );
      });

    const previousDaysData = await RedResults.find({
      date: { $in: previousDays },
    });
    const previousDaysDataByDate = previousDaysData.reduce((pre, cur) => {
      pre[cur.date] = cur.data;
      return pre;
    }, {});

    console.log(data);
    const result = Object.keys(data.data)
      .filter((key) => data.data[key] !== "error")
      .map((key) => {
        return {
          key,
          count: data.data[key],
          previous: Object.keys(previousDaysDataByDate).map(
            (day) =>
              previousDaysDataByDate[day] && previousDaysDataByDate[day][key]
          ),
        };
      });

    result.sort((a, b) => a.count - b.count);

    return NextResponse.json({
      data: result.map((x, index) => ({ ...x, index })),
    });
  } catch (err) {
    console.log({ err });
    return new NextResponse({ status: 400 }).json({ error: true, err });
  }
}
