import { NormalizedLandmark, NormalizedLandmarkList } from '@mediapipe/hands';

function getCoordinates(landmark: NormalizedLandmark): number[] {
  return [landmark.x, landmark.y, landmark.z];
}

function vectorSubtract(vec1: number[], vec2: number[]): number[] {
  return vec1.map((v, i) => v - vec2[i]);
}

function magnitude(vec: number[]): number {
  return Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0));
}

function dotProduct(vec1: number[], vec2: number[]): number {
  return vec1.reduce((acc, v, i) => acc + v * vec2[i], 0);
}

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  return dotProduct(vec1, vec2) / (magnitude(vec1) * magnitude(vec2));
}

function euclideanDistance(coord1: number[], coord2: number[]): number {
  return Math.sqrt(coord1.reduce((acc, v, i) => acc + Math.pow(v - coord2[i], 2), 0));
}

function determineHandOrientation(landmark0: NormalizedLandmark, landmark9: NormalizedLandmark): string {
  const [x0, y0] = getCoordinates(landmark0);
  const [x9, y9] = getCoordinates(landmark9);

  const xd = x9 - x0;
  const yd = y9 - y0;

  if (xd > 0 && -2 <= yd / xd && yd / xd <= -0.05) return "Right";
  if (xd < 0 && 0.05 <= yd / xd && yd / xd <= 2) return "Left";
  return "None";
}

function isFingerClosed(base: NormalizedLandmark, knuckle: NormalizedLandmark, joint: NormalizedLandmark, tip: NormalizedLandmark): boolean {
  const baseCoords = getCoordinates(base);
  return euclideanDistance(getCoordinates(tip), baseCoords) <
    1.2 * euclideanDistance(getCoordinates(knuckle), baseCoords) &&
    euclideanDistance(getCoordinates(tip), baseCoords) <
    euclideanDistance(getCoordinates(joint), baseCoords);
}
function isThumbPointerExtended(thumb: NormalizedLandmark[], pointer: NormalizedLandmark[]): boolean {
  const vecThumb = vectorSubtract(getCoordinates(thumb[0]), getCoordinates(thumb[1]));
  if (vecThumb[1] / Math.abs(vecThumb[0]) < .75) return false;

  const vecPointer = pointer.map((p, i, arr) =>
    (i < arr.length - 1 ? vectorSubtract(getCoordinates(p), getCoordinates(arr[i + 1])) : [0, 0, 0]));
  const pointerStraight = cosineSimilarity(vecPointer[0], vecPointer[1]) > 0.95 &&
    cosineSimilarity(vecPointer[1], vecPointer[2]) > 0.95;
  const thumbPointerOrthogonal = cosineSimilarity(vecThumb, vecPointer[0]) < 0.85;

  return pointerStraight && thumbPointerOrthogonal;
}

function getGesture(lmList: NormalizedLandmarkList): string {
  if (!lmList || lmList.length === 0) return "None";

  const thumbExtended = isThumbPointerExtended([lmList[2], lmList[3]], [lmList[5], lmList[6], lmList[7], lmList[8]]);
  if (!thumbExtended) return "None";

  const closedFingers = [9, 13, 17].every(i => isFingerClosed(lmList[0], lmList[i], lmList[i + 2], lmList[i + 3]));
  if (!closedFingers) return "None";

  return determineHandOrientation(lmList[0], lmList[9]);
}

export { getGesture };