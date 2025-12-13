import axios from 'axios';

/**
 * Calls the Backend API to generate content.
 * @param {string} systemPrompt The system instruction.
 * @param {string} userQuery The user's query.
 * @returns {Promise<string>} The generated text.
 */
export const callGeminiAPI = async (systemPrompt, userQuery) => {
  try {
    // We now call our OWN backend, which holds the key securely
    const { data } = await axios.post('/ai/generate', {
      systemPrompt,
      userQuery
    });
    return data.text;
  } catch (error) {
    console.error("Error calling AI Backend:", error);
    throw error;
  }
};