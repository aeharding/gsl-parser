export class GslError extends Error {
  name = "GslError";
  cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (typeof cause !== "string") this.cause = cause;
  }
}

/**
 * This is usually thrown if you provide invalid coordinates.
 * Make sure your report is in the contiguous United States
 * if from rucsoundings.noaa.gov
 */
export class CoordinatesGslError extends GslError {
  name = "CoordinatesGslError";
  cause?: unknown;

  constructor() {
    super("Invalid GSL file (suspect invalid lat/lon coordinates)");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
