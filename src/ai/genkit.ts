import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI(
    {
      apiKey: "AIzaSyDwY7HO7bdOYuyFnMfbMg2sDblSYhgkTr0"
    }
  )],
  model: 'googleai/gemini-2.5-flash',
  
});
