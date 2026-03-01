'use server';
/**
 * @fileOverview This file implements a Genkit flow for a German language readiness assessment.
 *
 * - germanReadinessAssessment - A function that handles the German language readiness assessment process.
 * - GermanReadinessAssessmentInput - The input type for the germanReadinessAssessment function.
 * - GermanReadinessAssessmentOutput - The return type for the germanReadinessAssessment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GermanReadinessAssessmentInputSchema = z.object({
  priorLanguageLearningExperience: z
    .string()
    .describe(
      'A description of the nurse\'s prior language learning experience, if any.'
    ),
  germanSentenceAttempt: z
    .string()
    .describe(
      'A simple sentence the nurse attempted to write in German (e.g., "Ich bin Krankenschwester").'
    ),
  reasonForLearningGerman: z
    .string()
    .describe('The nurse\'s primary reason or motivation for learning German.'),
});
export type GermanReadinessAssessmentInput = z.infer<
  typeof GermanReadinessAssessmentInputSchema
>;

const GermanReadinessAssessmentOutputSchema = z.object({
  aptitudeScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A numerical score from 0-100 indicating the nurse\'s aptitude for learning German.'),
  feedbackSummary: z
    .string()
    .describe('A concise summary of the assessment feedback.'),
  strengths: z
    .array(z.string())
    .describe(
      'A list of the nurse\'s strengths identified during the assessment.'
    ),
  weaknesses: z
    .array(z.string())
    .describe(
      'A list of the nurse\'s weaknesses identified during the assessment.'
    ),
  recommendations: z
    .array(z.string())
    .describe(
      'Specific, personalized recommendations for learning German, based on the assessment.'
    ),
});
export type GermanReadinessAssessmentOutput = z.infer<
  typeof GermanReadinessAssessmentOutputSchema
>;

export async function germanReadinessAssessment(
  input: GermanReadinessAssessmentInput
): Promise<GermanReadinessAssessmentOutput> {
  return germanReadinessAssessmentFlow(input);
}

const germanReadinessAssessmentPrompt = ai.definePrompt({
  name: 'germanReadinessAssessmentPrompt',
  input: { schema: GermanReadinessAssessmentInputSchema },
  output: { schema: GermanReadinessAssessmentOutputSchema },
  prompt: `You are an expert German language tutor and assessor, specializing in evaluating readiness for learning German, particularly for healthcare professionals.

Your task is to assess a nurse's aptitude and current baseline for learning German based on the following information. Provide immediate, personalized feedback on their strengths and weaknesses.

Prior Language Learning Experience: {{{priorLanguageLearningExperience}}}
Nurse's German Sentence Attempt: {{{germanSentenceAttempt}}}
Reason for Learning German: {{{reasonForLearningGerman}}}

Carefully analyze the provided German sentence attempt for grammar, vocabulary, sentence structure, and overall comprehensibility. Also, consider their prior experience and motivation.

Provide an aptitude score from 0 to 100, where 0 is no aptitude and 100 is exceptionally high aptitude. Generate a concise feedback summary, a list of specific strengths, a list of identified weaknesses, and actionable personalized recommendations for learning German.

Ensure your feedback is encouraging, constructive, and tailored to their specific input.`,
});

const germanReadinessAssessmentFlow = ai.defineFlow(
  {
    name: 'germanReadinessAssessmentFlow',
    inputSchema: GermanReadinessAssessmentInputSchema,
    outputSchema: GermanReadinessAssessmentOutputSchema,
  },
  async (input) => {
    const { output } = await germanReadinessAssessmentPrompt(input);
    if (!output) {
      throw new Error('Failed to get output from German readiness assessment prompt.');
    }
    return output;
  }
);
