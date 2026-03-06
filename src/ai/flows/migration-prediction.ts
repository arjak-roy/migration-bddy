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
 * Simulates a logistic regression model by applying weights to various profile factors.
 * This provides a more deterministic, rule-based score to guide the AI's prediction.
 * @param input The candidate's profile data.
 * @returns A score between 0 and 100.
 */
function calculateLogisticScore(input: MigrationPredictionInput): number {
    const weights = {
        base: 20,
        experiencePerYear: 2,
        assessmentPercentage: 0.3,
        careerGapPenalty: -10,
        careerGapYearPenalty: -2,
        documentsUploaded: 3,
        // Keyword scores for high-demand specializations
        icuSkill: 10,
        surgerySkill: 8,
        pediatricsSkill: 5,
        aclsCertification: 5,
    };
    const maxScore = 100;

    let calculatedScore = weights.base;

    // Experience: more is better
    calculatedScore += input.totalExperienceYears * weights.experiencePerYear;

    // Assessment Score: direct correlation
    calculatedScore += input.assessmentScorePercentage * weights.assessmentPercentage;

    // Career Gap: penalize for gaps
    if (input.hasCareerGap) {
        calculatedScore += weights.careerGapPenalty;
        if (input.careerGapYears) {
            calculatedScore += input.careerGapYears * weights.careerGapYearPenalty;
        }
    }

    // Documents: more complete profile is better
    const docCount = Object.values(input.documentsUploaded).filter(Boolean).length;
    calculatedScore += docCount * weights.documentsUploaded;

    // Keyword analysis for high-value skills and qualifications
    const searchText = `${input.skills.toLowerCase()} ${input.qualifications.toLowerCase()}`;
    if (searchText.includes('icu') || searchText.includes('intensive care')) {
        calculatedScore += weights.icuSkill;
    }
    if (searchText.includes('surgery') || searchText.includes('operating room')) {
        calculatedScore += weights.surgerySkill;
    }
    if (searchText.includes('pediatrics')) {
        calculatedScore += weights.pediatricsSkill;
    }
    if (searchText.includes('acls') || searchText.includes('advanced cardiac life support')) {
        calculatedScore += weights.aclsCertification;
    }
    
    // Clamp the score between 0 and 100
    const finalScore = Math.max(0, Math.min(maxScore, Math.round(calculatedScore)));

    return finalScore;
}


export async function migrationPrediction(input: MigrationPredictionInput): Promise<MigrationPredictionOutput> {
  return migrationPredictionFlow(input);
}

const PromptInputSchema = MigrationPredictionInputSchema.extend({
    logisticRegressionScore: z.number().describe('A pre-calculated prediction score based on a logistic regression model simulation. Use this as the primary factor for the final predictionScore.')
});

const prompt = ai.definePrompt({
  name: 'migrationPredictionPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: MigrationPredictionOutputSchema },
  prompt: `You are an expert immigration consultant specializing in helping foreign nurses migrate to Germany. Your task is to analyze a candidate's profile and provide a migration prediction score.

A logistic regression model simulation has pre-analyzed the candidate's data and generated a score: {{{logisticRegressionScore}}}/100.
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
    const logisticScore = calculateLogisticScore(input);

    const { output } = await prompt({
        ...input,
        logisticRegressionScore: logisticScore
    });

    if (!output) {
      throw new Error('Failed to get output from migration prediction prompt.');
    }
    return output;
  }
);
