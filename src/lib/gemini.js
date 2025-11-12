/**
 * A safe fetch wrapper with exponential backoff for retries.
 * @param {string} url The URL to fetch.
 * @param {object} options The fetch options (method, headers, body).
 * @param {number} retries Number of retries left.
 * @param {number} delay Current delay in ms.
 * @returns {Promise<object>} The JSON response.
 */
const safeFetch = async (url, options, retries = 3, delay = 1000) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        // Throttled, retry with backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return safeFetch(url, options, retries - 1, delay * 2);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return safeFetch(url, options, retries - 1, delay * 2);
    }
    console.error("Fetch failed after retries:", error);
    throw error;
  }
};

/**
 * Calls the Gemini API to generate content.
 * @param {string} systemPrompt The system instruction.
 * @param {string} userQuery The user's query.
 * @returns {Promise<string>} The generated text.
 */
export const callGeminiAPI = async (systemPrompt, userQuery) => {
  const apiKey = ""; // Per instructions, API key is handled by the environment
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
  };

  try {
    const result = await safeFetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const candidate = result.candidates?.[0];
    if (candidate && candidate.content?.parts?.[0]?.text) {
      return candidate.content.parts[0].text;
    } else {
      console.error("Unexpected API response structure:", result);
      throw new Error("Invalid response from Gemini API.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};