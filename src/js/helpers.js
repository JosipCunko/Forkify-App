import { async } from 'regenerator-runtime';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const fetchCallback = uploadData ? fetchPromise : fetch(url);
    const response = await Promise.race([fetchCallback, timeout(10)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

/**fetches URL and returns a promise with data
 * @param URL
 */
export const getJSON = async function (url) {
  try {
    const response = await Promise.race([fetch(url), timeout(10)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const response = await Promise.race([fetchPromise, timeout(10)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};
