'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-language-recommendations.ts';
import '@/ai/flows/german-readiness-assessment.ts';
import '@/ai/flows/migration-prediction.ts';
