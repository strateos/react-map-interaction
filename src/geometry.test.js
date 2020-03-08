import { clamp, distance } from './geometry';

describe("geometry", () => {
  describe("clamp", () => {
    test('returns the value if within the range otherwise the closest bound', () => {
      expect(clamp(0, 5, 4)).toBe(4);
      expect(clamp(0, -1, 4)).toBe(0);
      expect(clamp(0, 0, 4)).toBe(0);
      expect(clamp(0, 4, 4)).toBe(4);
    });

    test('returns NaN on bad inputs', () => {
      expect(clamp(undefined, 0, 10)).toBe(NaN);
      expect(clamp(0, "hello", 10)).toBe(NaN);
      expect(clamp(0, 1, {})).toBe(NaN);
    });
  });

  describe("distance", () => {
    test("computes distance between two 2D points", () => {
      expect(distance({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
      expect(distance({ x: 0, y: 1 }, { x: 0, y: 0 })).toBeGreaterThan(0);
    })
  })
});
