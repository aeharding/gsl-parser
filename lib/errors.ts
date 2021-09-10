export class GslError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * This is usually thrown if you provide invalid coordinates.
 * Make sure your report is in the contiguous United States
 * if from rucsoundings.noaa.gov
 */
export class CoordinatesGslError extends GslError {
  name = "CoordinatesGslError";

  constructor() {
    super("Invalid GSL file (suspect invalid lat/lon coordinates)");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
