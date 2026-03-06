'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';
import { FileText, Video, BookCopy, Download } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const resourceLevels = [
  {
    level: 'A1',
    title: 'A1 Resources',
    description: 'Foundation materials for beginners.',
    content: [
      { type: 'Mock Papers', icon: FileText },
      { type: 'Class Plan', icon: BookCopy },
      { type: 'Videos', icon: Video },
    ],
  },
  {
    level: 'A2',
    title: 'A2 Resources',
    description: 'Building on the basics for elementary users.',
    content: [
      { type: 'Mock Papers', icon: FileText },
      { type: 'Class Plan', icon: BookCopy },
      { type: 'Videos', icon: Video },
    ],
  },
  {
    level: 'B1',
    title: 'B1 Resources',
    description: 'Intermediate level materials for independent users.',
    content: [
      { type: 'Mock Papers', icon: FileText },
      { type: 'Class Plan', icon: BookCopy },
      { type: 'Videos', icon: Video },
    ],
  },
  {
    level: 'B2',
    title: 'B2 Resources',
    description: 'Upper-intermediate resources for advanced topics.',
    content: [
      { type: 'Mock Papers', icon: FileText },
      { type: 'Class Plan', icon: BookCopy },
      { type: 'Videos', icon: Video },
    ],
  },
];

const vocabularyLevels = [
  {
    level: 'A1',
    title: 'A1 - Beginner Vocabulary',
    description: 'Essential words for basic communication in daily and medical contexts.',
    words: [
      { german: 'Hallo', english: 'Hello' },
      { german: 'Guten Tag', english: 'Good day' },
      { german: 'Danke / Bitte', english: 'Thank you / Please' },
      { german: 'Ja / Nein', english: 'Yes / No' },
      { german: 'die Krankenschwester / der Krankenpfleger', english: 'Nurse (female / male)' },
      { german: 'der Arzt / die Ärztin', english: 'Doctor (male / female)' },
      { german: 'der Patient / die Patientin', english: 'Patient (male / female)' },
      { german: 'das Wasser', english: 'Water' },
      { german: 'die Hilfe', english: 'Help' },
    ],
  },
  {
    level: 'A2',
    title: 'A2 - Elementary Vocabulary',
    description: 'Build on the basics to form simple sentences and handle routine tasks.',
    words: [
      { german: 'arbeiten', english: 'to work' },
      { german: 'essen / trinken', english: 'to eat / to drink' },
      { german: 'sprechen', english: 'to speak' },
      { german: 'das Fieber', english: 'Fever' },
      { german: 'die Schmerzen', english: 'Pain (plural)' },
      { german: 'das Bett', english: 'Bed' },
      { german: 'Der Patient braucht Hilfe.', english: 'The patient needs help.' },
      { german: 'Wo ist die Toilette?', english: 'Where is the toilet?' },
    ],
  },
  {
    level: 'B1',
    title: 'B1 - Intermediate Vocabulary',
    description: 'Vocabulary for describing experiences, giving reasons, and discussing medical topics.',
    words: [
      { german: 'der Blutdruck', english: 'Blood pressure' },
      { german: 'die Untersuchung', english: 'Examination / check-up' },
      { german: 'das Medikament', english: 'Medication' },
      { german: 'die Spritze', english: 'Injection / syringe' },
      { german: 'der Verband', english: 'Bandage / dressing' },
      { german: 'sich fühlen', english: 'to feel (health-wise)' },
      { german: 'Ich habe gestern im Krankenhaus gearbeitet.', english: 'I worked in the hospital yesterday.' },
      { german: 'Können Sie Ihre Symptome beschreiben?', english: 'Can you describe your symptoms?' },
    ],
  },
  {
    level: 'B2',
    title: 'B2 - Upper-Intermediate Vocabulary',
    description: 'Specialized and nuanced vocabulary for complex and professional communication.',
    words: [
      { german: 'die Anamnese', english: 'Medical history' },
      { german: 'der Befund', english: 'Medical finding / report' },
      { german: 'die Entzündung', english: 'Inflammation' },
      { german: 'die Dosierung', english: 'Dosage' },
      { german: 'die Nebenwirkung', english: 'Side effect' },
      { german: 'Vitalparameter überwachen', english: 'to monitor vital signs' },
      { german: 'eine Diagnose stellen', english: 'to make a diagnosis' },
      { german: 'Der Patient wurde auf die Intensivstation verlegt.', english: 'The patient was moved to the intensive care unit.' },
    ],
  },
];

export default function LanguageResourcesPage() {
  const { completeStep, isStepUnlocked } = useProgress();
  const router = useRouter();

  if (!isStepUnlocked('language-resources')) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Section Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please complete the previous steps in your pathway to unlock this
              section.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleCompletion = () => {
    completeStep('language-resources');
    router.push('/dashboard');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold">Language Resources</h1>
        <p className="mt-2 text-muted-foreground">
          Find materials and vocabulary to help you prepare for your German
          language exams.
        </p>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="materials">Study Materials</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
        </TabsList>
        <TabsContent value="materials" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {resourceLevels.map((level) => (
              <Card key={level.level} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline">{level.title}</CardTitle>
                  <CardDescription>{level.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Coming soon:
                  </p>
                  <ul className="space-y-3">
                    {level.content.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li
                          key={item.type}
                          className="flex items-center justify-between rounded-md border bg-background/50 p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <span className="font-medium">{item.type}</span>
                          </div>
                          <Button variant="outline" size="sm" disabled>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="vocabulary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">
                German Vocabulary by Level
              </CardTitle>
              <CardDescription>
                Expand your German vocabulary with these essential words and
                phrases for each proficiency level.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {vocabularyLevels.map((levelData) => (
                  <AccordionItem key={levelData.level} value={levelData.level}>
                    <AccordionTrigger className="text-lg font-semibold">
                      {levelData.title}
                    </AccordionTrigger>
                    <AccordionContent>
                       <p className="mb-4 text-sm text-muted-foreground">{levelData.description}</p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50%]">German</TableHead>
                            <TableHead>English</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {levelData.words.map((word) => (
                            <TableRow key={word.german}>
                              <TableCell className="font-medium">
                                {word.german}
                              </TableCell>
                              <TableCell>{word.english}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <Button onClick={handleCompletion}>
          Mark as Reviewed and Continue
        </Button>
      </div>
    </div>
  );
}
