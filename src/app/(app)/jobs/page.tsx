'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExternalLink, MapPin, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';

const mockJobs = [
  {
    title: 'Registered Nurse (ICU)',
    hospital: 'Charité - Universitätsmedizin Berlin',
    location: 'Berlin',
    specialty: 'ICU',
    description:
      'Seeking an experienced ICU nurse for our state-of-the-art intensive care unit. Requires B2 German.',
  },
  {
    title: 'Pediatric Nurse',
    hospital: 'Klinikum der Universität München',
    location: 'Munich',
    specialty: 'Pediatrics',
    description:
      'Join our dedicated pediatrics team. Experience with children is a must. Competitive salary and benefits.',
  },
  {
    title: 'Surgical Nurse',
    hospital: 'Universitätsklinikum Hamburg-Eppendorf',
    location: 'Hamburg',
    specialty: 'Surgery',
    description:
      'Full-time position in a fast-paced surgical ward. Opportunity for professional growth and training.',
  },
  {
    title: 'Geriatric Nurse',
    hospital: 'Klinikum Köln',
    location: 'Cologne',
    specialty: 'Geriatrics',
    description:
      'Compassionate nurse needed for our geriatric care facility. Focus on patient-centered care.',
  },
  {
    title: 'Oncology Nurse',
    hospital: 'Universitätsklinikum Frankfurt',
    location: 'Frankfurt',
    specialty: 'Oncology',
    description:
      'Work with a leading oncology team. Experience in cancer care and chemotherapy administration preferred.',
  },
  {
    title: 'Operating Room Nurse',
    hospital: 'Charité - Universitätsmedizin Berlin',
    location: 'Berlin',
    specialty: 'Surgery',
    description:
      'Assist in a wide range of surgical procedures in a modern OR environment.',
  },
  {
    title: 'Emergency Room Nurse',
    hospital: 'Klinikum der Universität München',
    location: 'Munich',
    specialty: 'ER',
    description:
      'High-energy individual for our busy emergency department. Triage and trauma care experience is a plus.',
  },
];

const specialties = [
  'All',
  'ICU',
  'Pediatrics',
  'Surgery',
  'Geriatrics',
  'Oncology',
  'ER',
];
const locations = [
  'All',
  'Berlin',
  'Munich',
  'Hamburg',
  'Cologne',
  'Frankfurt',
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [location, setLocation] = useState('All');
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const { isStepUnlocked } = useProgress();
  const router = useRouter();

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const results = mockJobs.filter((job) => {
      const termMatch =
        job.title.toLowerCase().includes(lowercasedTerm) ||
        job.hospital.toLowerCase().includes(lowercasedTerm);
      const specialtyMatch = specialty === 'All' || job.specialty === specialty;
      const locationMatch = location === 'All' || job.location === location;
      return termMatch && specialtyMatch && locationMatch;
    });
    setFilteredJobs(results);
  }, [searchTerm, specialty, location]);

  if (!isStepUnlocked('jobs')) {
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
              Please complete the previous steps in your pathway to unlock job
              listings.
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold">Job Listings</h1>
        <p className="mt-2 text-muted-foreground">
          Explore curated nursing opportunities across Germany.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title or hospital..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.hospital}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <p className="text-sm text-muted-foreground">
                  {job.description}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <h3 className="text-xl font-semibold">No jobs found</h3>
            <p className="text-muted-foreground">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
