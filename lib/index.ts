// Documentation: https://rucsoundings.noaa.gov/raob_format.html

import { CoordinatesGslError, GslError } from "./errors.js";

export interface Rap {
  stationId: string;
  headerLine: string;
  type: string;
  date: string;
  cin: number;
  cape: number;
  windUnits: WindUnits;
  lat: number;
  lon: number;
  sonde: Sonde;

  data: RapDatum[];
}

export interface RapDatum {
  pressure: number;
  height: number;
  temp: number;
  dewpt: number;
  windDir: number;
  windSpd: number;
  hhmm?: number;
  bearing?: number;
  range?: number;
}

export enum WindUnits {
  KT = "kt",
  MS = "ms",
}

export enum Sonde {
  TypeA = 10,
  TypeC = 11,
  SpaceDataCorp = 12,
}

export * from "./errors.js";

export default function parseReports(asciiReports: string): Rap[] {
  const rawReports = asciiReports.split(/(\n[\s]*\n)/).filter((r) => r.trim());

  const parsedReports = rawReports.map(parseReport).filter(notEmpty);

  if (!parsedReports.length) throw new GslError("Malformed GSL file");

  return parsedReports;
}

function parseReport(asciiReport: string): Rap | undefined {
  const lines = asciiReport.split("\n");

  const headerLine = lines.shift();
  const dateLine = lines.shift();
  const capeCinLine = lines.shift();

  if (!headerLine || !dateLine || !capeCinLine) return;

  const { type, date } = parseDateLine(dateLine);

  const { cape, cin } = parseCapeCinLine(capeCinLine);

  const data = parseLines(lines);

  if (data.data.length === 1 && data.data[0].dewpt === 997259)
    throw new CoordinatesGslError();

  return { headerLine, date, type, cape, cin, ...data };
}

function parseCapeCinLine(capeCinLine: string): { cape: number; cin: number } {
  const parsed = capeCinLine.split(/[ ]+/).filter((s) => s !== "");

  return { cape: +parsed[1], cin: +parsed[3] };
}

function parseDateLine(dateLine: string): { type: string; date: string } {
  const parsed = dateLine.split(/[ ]+/).filter((s) => s !== "");

  try {
    var date = new Date(
      Date.UTC(+parsed[4], getMonth(parsed[3]), +parsed[2], +parsed[1])
    ).toISOString();
  } catch (error) {
    throw new GslError("Failed to parse date line", error);
  }

  return {
    type: parsed[0],
    date,
  };
}

function getMonth(mon: string): number {
  return new Date(Date.parse(mon + " 1, 2012")).getMonth();
}

enum RapLineTypes {
  Identification = 1,
  SoundingCheck = 2,
  StationID = 3,
  MandatoryLevel = 4,
  SignificantLevel = 5,
  WindLevel = 6, // GTS or merged data only
  TropopauseLevel = 7, // GTS or merged data only
  MaximumWindLevel = 8, // GTS or merged data only
  SurfaceLevel = 9,
}

function parseLines(lines: string[]) {
  const parsedLines = lines.map((l) => l.split(/[ ]+/).filter((s) => s !== ""));

  const identificationLine = parsedLines.find(
    (l) => +l[0] === RapLineTypes.Identification
  );
  const stationIdLine = parsedLines.find(
    (l) => +l[0] === RapLineTypes.StationID
  );

  if (!identificationLine || !stationIdLine)
    throw new GslError("Could not find identification lines for report");

  const identificationData = parseIdentificationLine(identificationLine);
  const stationIdData = parseStationIdLine(stationIdLine);

  const dataLines = parsedLines.filter(
    (l) =>
      +l[0] === RapLineTypes.MandatoryLevel ||
      +l[0] === RapLineTypes.SignificantLevel ||
      +l[0] === RapLineTypes.SurfaceLevel
  );

  const data = parseDataLines(dataLines);

  return { ...identificationData, ...stationIdData, data };
}

interface RapIdentification {
  wban: number;
  wmo: number;
  lat: number;
  lon: number;
  elev: number;
  rtime: number;
}

function parseIdentificationLine(line: string[]): RapIdentification {
  // Sometimes there is no space between lat and lon.
  // For example: 34.50-135.50 or -25.00-135.00
  // So it need to get parsed out manually.
  if (isNaN(+line[3])) {
    const split = line[3].split("-");
    const lastPart = split.pop();
    const firstPart = split.join("-");
    line.splice(3, 1, firstPart, `-${lastPart}`);
  }

  const [_, wban, wmo, lat, lon, elev, rtime] = line;

  return parseToNumber({
    wban,
    wmo,
    lat,
    lon,
    elev,
    rtime,
  });
}

interface RapStationId {
  stationId: string;
  sonde: Sonde;
  windUnits: WindUnits;
}

function parseStationIdLine([
  _,
  stationId,
  sonde,
  windUnits,
]: string[]): RapStationId {
  return {
    stationId,
    sonde: +sonde,
    windUnits: windUnits as WindUnits,
  };
}

function parseDataLines(parsedDataLines: string[][]): RapDatum[] {
  return parsedDataLines.map(parseDataLine).filter(filterInvalidDataLine);
}

function parseDataLine([
  _,
  pressure,
  height,
  temp,
  dewpt,
  windDir,
  windSpd,
]: string[]): RapDatum {
  return parseToNumber({
    pressure,
    height,
    temp,
    dewpt,
    windDir,
    windSpd,
  });
}

function parseToNumber<K>(
  data: Record<keyof K, string>
): Record<keyof K, number> {
  const ret = {} as Record<keyof K, number>;

  Object.keys(data).forEach((key) => {
    ret[key as keyof K] = +data[key as keyof K];
  });

  return ret;
}

// 99999 is a test data line (invalid)
function filterInvalidDataLine(dataLine: RapDatum): boolean {
  return dataLine.height !== 99999;
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
