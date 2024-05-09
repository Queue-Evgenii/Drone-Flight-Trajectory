/**
 * Function that trying to fetch data and return Promise.
 * @param {string} url Url to the resource.
 * @returns {Promise<any>}
 */
export const fetchJSON = (url) => {
  return fetch(url).then(res => res.json());
}