'use server';
/**
 * @fileOverview This file implements a Genkit flow for predicting migration success to Germany for nurses.
 *
 * - migrationPrediction - A function that handles the prediction process.
 * - MigrationPredictionInput - The input type for the migrationPrediction function.
 * - MigrationPredictionOutput - The return type for the migrationPrediction function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MigrationPredictionInputSchema = z.object({
  qualifications: z.string().describe("The nurse's professional qualifications."),
  skills: z.string().describe("A list of the nurse's technical and soft skills."),
  totalExperienceYears: z.number().describe('Total years of professional nursing experience.'),
  domainWorked: z.string().describe('The primary medical domain the nurse has worked in (e.g., ICU, Pediatrics).'),
  hasCareerGap: z.boolean().describe('Whether the nurse has had a significant career gap.'),
  careerGapYears: z.number().optional().describe('The duration of the career gap in years, if applicable.'),
  assessmentScorePercentage: z.number().min(0).max(100).describe('The score (0-100) from the German language readiness assessment test.'),
  documentsUploaded: z.object({
    resume: z.boolean(),
    languageCertificate: z.boolean(),
    graduationCertificate: z.boolean(),
    experienceCertificate: z.boolean(),
    employerOfferLetter: z.boolean(),
  }).describe('A checklist of which documents have been uploaded. The content of the documents is not available, only their presence.'),
});
export type MigrationPredictionInput = z.infer<typeof MigrationPredictionInputSchema>;

const MigrationPredictionOutputSchema = z.object({
  predictionScore: z.number().min(0).max(100).describe('A prediction score from 0-100 indicating the likelihood of successful migration and integration.'),
  summary: z.string().describe('A concise, encouraging summary of the prediction and key factors.'),
  strengths: z.array(z.string()).describe('A list of the key strengths in the applicant\'s profile.'),
  areasForImprovement: z.array(z.string()).describe('A list of areas the applicant should focus on improving.'),
  recommendations: z.array(z.string()).describe('A list of actionable recommendations for the applicant.'),
});
export type MigrationPredictionOutput = z.infer<typeof MigrationPredictionOutputSchema>;


/**
 * Simulates a Random Forest model by averaging scores from multiple "decision trees"
 * or "expert evaluators" that focus on different aspects of the profile.
 * @param input The candidate's profile data.
 * @returns A score between 0 and 100.
 */
function calculateRandomForestScore(input: MigrationPredictionInput): number {
    const maxScore = 100;

    // "Decision Tree" 1: Experience-focused Evaluator
    let scoreTree1 = 20;
    scoreTree1 += input.totalExperienceYears * 4; // Weight experience
    if (input.hasCareerGap) {
        scoreTree1 -= 15; // Penalty for having a gap
        if (input.careerGapYears) {
            scoreTree1 -= input.careerGapYears * 3; // Additional penalty per year
        }
    }
    if (input.totalExperienceYears > 5) scoreTree1 += 10; // Bonus for significant experience
    if (input.totalExperienceYears > 10) scoreTree1 += 5;


    // "Decision Tree" 2: Skills & Qualifications-focused Evaluator
    let scoreTree2 = 10;
    const searchText = `${input.skills.toLowerCase()} ${input.qualifications.toLowerCase()}`;
    let skillBonus = 0;
    if (searchText.includes('icu') || searchText.includes('intensive care')) {
        skillBonus += 25;
    }
    if (searchText.includes('surgery') || searchText.includes('operating room')) {
        skillBonus += 20;
    }
    if (searchText.includes('pediatrics')) {
        skillBonus += 15;
    }
    if (searchText.includes('acls') || searchText.includes('advanced cardiac life support')) {
        skillBonus += 15;
    }
    if (searchText.includes('er') || searchText.includes('emergency')) {
        skillBonus += 15;
    }
    scoreTree2 += skillBonus;
    if (searchText.includes('b2') || searchText.includes('c1')) {
        scoreTree2 += 10; // Bonus for mentioning high language proficiency
    }

    // "Decision Tree" 3: Preparedness-focused Evaluator
    let scoreTree3 = 15;
    scoreTree3 += input.assessmentScorePercentage * 0.5; // Strong weight on assessment score
    const docCount = Object.values(input.documentsUploaded).filter(Boolean).length;
    scoreTree3 += docCount * 5; // Good weight for each document uploaded


    // Normalize scores from each tree to be within the 0-100 range before averaging
    const normalizedScore1 = Math.max(0, Math.min(maxScore, scoreTree1));
    const normalizedScore2 = Math.max(0, Math.min(maxScore, scoreTree2));
    const normalizedScore3 = Math.max(0, Math.min(maxScore, scoreTree3));

    // Average the scores from the "trees" to get the final Random Forest score
    const finalScore = (normalizedScore1 + normalizedScore2 + normalizedScore3) / 3;

    return Math.round(finalScore);
}


export async function migrationPrediction(input: MigrationPredictionInput): Promise<MigrationPredictionOutput> {
  return migrationPredictionFlow(input);
}

const PromptInputSchema = MigrationPredictionInputSchema.extend({
    randomForestScore: z.number().describe('A pre-calculated prediction score based on a Random Forest model simulation. Use this as the primary factor for the final predictionScore.')
});

const prompt = ai.definePrompt({
  name: 'migrationPredictionPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: MigrationPredictionOutputSchema },
  prompt: `You are an expert immigration consultant specializing in helping foreign nurses migrate to Germany. Your task is to analyze a candidate's profile and provide a migration prediction score.

A Random Forest model simulation has pre-analyzed the candidate's data and generated a score: {{{randomForestScore}}}/100.
This score was derived by averaging evaluations from multiple "expert" decision trees, each focusing on different aspects like experience, skills, and overall preparedness.
Use this score as the primary basis for your final 'predictionScore'. You can adjust it slightly (e.g., +/- 5 points) based on your holistic analysis of the text-based fields, but it should remain very close to the provided score. Your analysis in the summary, strengths, and improvements should justify why the score is what it is.

Analyze the following candidate profile:
- Qualifications: {{{qualifications}}}
- Skills: {{{skills}}}
- Total Experience: {{{totalExperienceYears}}} years
- Domain: {{{domainWorked}}}
- German Language Aptitude Score: {{{assessmentScorePercentage}}}/100
- Career Gap: {{#if hasCareerGap}}Yes, for {{{careerGapYears}}} year(s).{{else}}No{{/if}}
- Documents Provided:
  - Resume/CV: {{#if documentsUploaded.resume}}Yes{{else}}No{{/if}}
  - Language Certificate: {{#if documentsUploaded.languageCertificate}}Yes{{else}}No{{/if}}
  - Graduation Certificate: {{#if documentsUploaded.graduationCertificate}}Yes{{else}}No{{/if}}
  - Experience Certificate: {{#if documentsUploaded.experienceCertificate}}Yes{{else}}No{{/if}}
  - Employer Offer Letter: {{#if documentsUploaded.employerOfferLetter}}Yes{{else}}No{{/if}}

Based on all this data, especially the pre-calculated score, evaluate the candidate's chances of successfully navigating the German immigration process, getting their qualifications recognized, and finding a job.

Provide a 'predictionScore' from 0 to 100. A score of 100 represents a perfect candidate with a very high chance of success.
Consider factors like experience, specialized skills (ICU, surgery, etc.), language aptitude, and completeness of their profile (e.g., document uploads). A career gap might be a minor negative factor, depending on its length. High language aptitude is a significant positive factor. The presence of uploaded documents is a positive sign of a well-prepared candidate.

IMPORTANT: You cannot see the content or verify the authenticity of the uploaded documents. Your assessment should be based on the information provided and the fact that the documents were uploaded. Mention this as a caveat in your summary.

Generate a constructive 'summary', a list of 'strengths', 'areasForImprovement', and actionable 'recommendations'. The tone should be professional, realistic, and encouraging.`,
});


const migrationPredictionFlow = ai.defineFlow(
  {
    name: 'migrationPredictionFlow',
    inputSchema: MigrationPredictionInputSchema,
    outputSchema: MigrationPredictionOutputSchema,
  },
  async (input) => {
    const randomForestScore = calculateRandomForestScore(input);

    const { output } = await prompt({
        ...input,
        randomForestScore: randomForestScore
    });

    if (!output) {
      throw new Error('Failed to get output from migration prediction prompt.');
    }
    return output;
  }
);
