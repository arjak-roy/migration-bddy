'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized German language learning resource recommendations.
 *
 * - personalizeLanguageRecommendations - A function that handles the generation of recommendations.
 * - PersonalizeLanguageRecommendationsInput - The input type for the personalizeLanguageRecommendations function.
 * - PersonalizeLanguageRecommendationsOutput - The return type for the personalizeLanguageRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeLanguageRecommendationsInputSchema = z.object({
  proficiencyLevel: z.string().describe('The nurse\u0027s current German language proficiency level (e.g., A1, A2, B1, B2).'),
  areasOfWeakness: z.array(z.string()).describe('Specific areas where the nurse needs improvement (e.g., grammar, vocabulary, speaking, listening, writing).'),
  learningStyle: z.string().optional().describe('The nurse\u0027s preferred learning style (e.g., visual, auditory, kinesthetic, reading/writing).'),
  timeAvailability: z.string().optional().describe('How much time the nurse can dedicate to learning per week (e.g., 2-4 hours, 5-10 hours, 10+ hours).'),
});
export type PersonalizeLanguageRecommendationsInput = z.infer<typeof PersonalizeLanguageRecommendationsInputSchema>;

const ResourceSchema = z.object({
  name: z.string().describe('The name of the learning resource.'),
  description: z.string().describe('A brief description of the resource and why it\u0027s suitable.'),
  url: z.string().url().describe('The URL where the resource can be accessed.'),
  category: z.string().describe('The type of resource (e.g., app, textbook, online course, tutor, podcast).'),
  focusAreas: z.array(z.string()).describe('Which language skills or areas this resource primarily helps with (e.g., vocabulary, grammar, speaking).'),
});

const PersonalizeLanguageRecommendationsOutputSchema = z.object({
  recommendations: z.array(ResourceSchema).describe('A list of personalized German language learning resources.'),
});
export type PersonalizeLanguageRecommendationsOutput = z.infer<typeof PersonalizeLanguageRecommendationsOutputSchema>;

export async function personalizeLanguageRecommendations(input: PersonalizeLanguageRecommendationsInput): Promise<PersonalizeLanguageRecommendationsOutput> {
  return personalizeLanguageRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeLanguageRecommendationsPrompt',
  input: {schema: PersonalizeLanguageRecommendationsInputSchema},
  output: {schema: PersonalizeLanguageRecommendationsOutputSchema},
  prompt: `You are an expert in German language education, specializing in resources for medical professionals.
Your goal is to provide personalized recommendations for German language learning resources to a nurse, based on their assessment results and learning preferences.

Here is the nurse's profile and assessment data:
- Current German proficiency level: {{{proficiencyLevel}}}
- Areas needing improvement: {{{#each areasOfWeakness}}}- {{{this}}}
{{{/each}}}
{{#if learningStyle}}- Preferred learning style: {{{learningStyle}}}
{{/if}}{{#if timeAvailability}}- Time availability for learning: {{{timeAvailability}}}
{{/if}}

Recommend a list of at least 3, but no more than 5, distinct and highly effective German language learning resources. For each recommendation, include the resource's name, a brief description, a URL, its category, and the specific language skills or areas it focuses on. Prioritize resources that are practical, engaging, and suitable for busy professionals or those aiming for professional proficiency (B2/C1 levels for healthcare).
`,
});

const personalizeLanguageRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizeLanguageRecommendationsFlow',
    inputSchema: PersonalizeLanguageRecommendationsInputSchema,
    outputSchema: PersonalizeLanguageRecommendationsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
