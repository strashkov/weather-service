import { QueryTypes } from "sequelize";
import { sequelize } from "../../app/sequelize.js";

export enum AggregationType {
  "none" = 1,
  "5m" = 5,
  "30m" = 30,
  "1h" = 60,
}

export async function findWeather({
  city,
  from,
  to,
  aggregation,
}: {
  city: string;
  from: string;
  to: string;
  aggregation: AggregationType;
}): Promise<
  {
    city: string;
    datetime: string;
    weather: {
      temperature: number;
      windSpeed: number;
      pressureSurfaceLevel: number;
    };
  }[]
> {
  const groups = await sequelize.query<{
    datetime: Date;
    city: string;
    temperature: number;
    windSpeed: number;
    pressureSurfaceLevel: number;
  }>(
    `
SELECT
	to_timestamp(floor(extract(epoch FROM "datetime") / 60 / :interval) * 60 * :interval) AS "datetime",
	"city",
	AVG("temperature") AS "temperature",
	AVG("windSpeed") AS "windSpeed",
	AVG("pressureSurfaceLevel") AS "pressureSurfaceLevel"
FROM
	"weather"
WHERE
	"city" = :city
	AND("datetime" >= :from
		AND "datetime" <= :to)
GROUP BY
	floor(extract(epoch FROM "datetime") / 60 / :interval),
	"city"
ORDER BY
	1;`,
    {
      replacements: {
        city,
        from,
        to,
        interval: AggregationType[aggregation],
      },
      type: QueryTypes.SELECT,
    },
  );

  return groups.map(
    ({ city, datetime, temperature, windSpeed, pressureSurfaceLevel }) => ({
      city,
      datetime: datetime.toISOString(),
      weather: {
        temperature,
        windSpeed,
        pressureSurfaceLevel,
      },
    }),
  );
}
