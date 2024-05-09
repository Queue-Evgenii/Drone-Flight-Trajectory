/**
 * Function that calculate next point of the movement.
 * @param {{timestamp: timestamp, speed: number, direction: number}} el The moving params.
 * @param {number} time Time that the object is moving.
 * @param {number} prevX Previous x axis value of the movement.
 * @param {number} prevY Previous y axis value of the movement.
 * @returns {{x: number, y: number}} Next point of the movement.
 */
const calculatePosition = (el, time, prevX, prevY) => {
  return {
      x: (el.speed) * time * Math.cos(el.direction * Math.PI / 180) + prevX,
      y: (el.speed) * time * Math.sin(el.direction * Math.PI / 180) + prevY,
  };
}

/**
 * Function that returns the array of movement points.
 * @param {{timestamp: timestamp, speed: number, direction: number}[]} flightData Raw moving params array.
 * @returns {{top: number, left: number}[]} Top means y axis value; left means x axis value.
 */
const getPointsWithoutOffset = (flightData) => {
  const array = [];

  for (let i = 0; i < flightData.length; ++i) {
      const { x, y } = calculatePosition(
                          flightData[i],
                          i ? flightData[i].timestamp - flightData[i - 1].timestamp : 0,
                          i ? array[i - 1].top : 0,
                          i ? array[i - 1].left : 0
                      );
      array.push({ top: x, left: y });
  }

  return array;
}

/**
 * Function that returns the array of movement points with offset.
 * @param {{timestamp: timestamp, speed: number, direction: number}[]} flightData Raw moving params array.
 * @param {Element} scene Root visualization element.
 * @returns {{top: number, left: number}[]} Top means y axis value; left means x axis value.
 */
export const getPointsWithOffset = (flightData, scene) => {
  const array = getPointsWithoutOffset(flightData);

  let offsetX = Math.max(...(array.map(point => Math.abs(point.left))));
  let offsetY = Math.max(...(array.map(point => Math.abs(point.top))));
  offsetX += offsetX * 0.1;
  offsetY += offsetY * 0.1;

  const aхіsXSize = scene.clientWidth / 2, axisYSize = scene.clientHeight / 2;

  const centeredPoints = array.map(point => ({
      top: axisYSize - axisYSize * point.top / offsetY,
      left: aхіsXSize + aхіsXSize * point.left / offsetX,
  }));
  return centeredPoints;
}

/**
 * Function that returns the css properties array (Top, left, transform: rotate).
 * @param {{timestamp: timestamp, speed: number, direction: number}[]} flightData Raw moving params array.
 * @param {{top: number, left: number}[]} points Array of movement points. Top means y axis value; left means x axis value.
 * @returns {{top: string, left: string, transform: string}}
 */
export const getAnimationFrames = (flightData, points) => {
  return points.map((el, i) => {
      return {
          top: el.top + "px",
          left: el.left + "px",
          transform: `rotate(${flightData[i].direction}deg)`
      }
  });
}