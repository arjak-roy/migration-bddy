import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const guideContent = [
  {
    value: 'item-1',
    title: 'Nursing in Germany: An Overview',
    content:
      'Germany has one of the best healthcare systems in the world, with a high demand for skilled nursing professionals. Nurses in Germany enjoy excellent working conditions, competitive salaries, and opportunities for professional development. The role involves a high degree of autonomy and responsibility, working within a structured and technologically advanced environment.',
  },
  {
    value: 'item-2',
    title: 'Recognition of Foreign Qualifications',
    content:
      'To work as a nurse in Germany, your professional qualification must be officially recognized. This process, known as "Anerkennung," involves submitting your documents (diploma, transcripts, work experience) to the relevant state authority. They will assess if your training is equivalent to German nursing education. If there are significant differences, you may be required to complete an adaptation course or pass an aptitude test.',
  },
  {
    value: 'item-3',
    title: 'Visa and Residence Permit',
    content:
      'Non-EU citizens require a visa to enter Germany for work. You will typically apply for a National Visa (D-Visa) for the purpose of qualified employment. Key requirements include a valid passport, a concrete job offer from a German employer, and proof of your recognized nursing qualification. Once in Germany, you must apply for a residence permit from the local Foreigners\' Authority (Ausländerbehörde).',
  },
  {
    value: 'item-4',
    title: 'Language Requirements (B1/B2 Level)',
    content:
      'Proficiency in the German language is crucial for working as a nurse. Most employers and state registration boards require at least a B2 level certificate from a recognized language institute (e.g., Goethe-Institut, TestDaF, telc). Some may initially accept B1 with a commitment to reach B2 within a specific timeframe. Strong language skills are essential for patient safety, communication with colleagues, and documentation.',
  },
  {
    value: 'item-5',
    title: 'Finding a Job and Application Process',
    content:
      'You can search for nursing positions on online job portals, hospital websites, and through recruitment agencies specializing in healthcare. A typical application includes a cover letter (Anschreiben) and a CV (Lebenslauf) in German format. Prepare for interviews where you will be asked about your clinical skills, experience, and motivation to work in Germany.',
  },
  {
    value: 'item-6',
    title: 'Living and Working in Germany',
    content:
      'Germany offers a high quality of life with excellent public transport, social security, and healthcare. Expect to pay taxes and social security contributions, which cover health, unemployment, and pension insurance. Integrating into the culture involves understanding local customs, being punctual, and enjoying the balance between work and leisure time. Joining local clubs or groups can help you build a social network.',
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-3xl font-bold">Germany Nurse Career Guide</h1>
        <p className="mt-2 text-muted-foreground">
          Your comprehensive guide to starting a nursing career in Germany.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {guideContent.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className="text-lg font-semibold">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
