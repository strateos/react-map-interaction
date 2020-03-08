import { expect } from 'chai';
import { clamp, distance } from './geometry';

describe("geometry", () => {
  describe("#clamp", () => {
    it("returns the value if within the range otherwise the closest bound", () => {
      expect(clamp(0, 5, 4)).to.equal(4);
      expect(clamp(0, -1, 4)).to.equal(0);
      expect(clamp(0, 0, 4)).to.equal(0);
      expect(clamp(0, 4, 4)).to.equal(4);
    });

    it('returns NaN on bad inputs', () => {
      expect(isNaN(clamp(undefined, 0, 10))).to.equal(true);
      expect(isNaN(clamp(0, "hello", 10))).to.equal(true);
      expect(isNaN(clamp(0, 1, {}))).to.equal(true);
    });
  });

  describe("#distance", () => {
    it("computes distance between two 2D points", () => {
      expect(distance({ x: 0, y: 0 }, { x: 0, y: 0 })).to.equal(0);
      expect(distance({ x: 0, y: 1 }, { x: 0, y: 0 })).to.be.greaterThan(0);
    });
  });
});
