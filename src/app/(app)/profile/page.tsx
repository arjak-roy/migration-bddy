'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Download,
  Upload,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const profileSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    dob: z.date({
      required_error: 'A date of birth is required.',
    }),
    contactNumber: z.string().optional(),
    qualifications: z.string().min(10, 'Please describe your qualifications.'),
    domainWorked: z
      .string()
      .min(2, "Please enter the domain you've worked in."),
    currentExperience: z
      .string()
      .min(2, 'Please enter your current experience.'),
    experience1: z.string().optional(),
    experience2: z.string().optional(),
    experience3: z.string().optional(),
    experience4: z.string().optional(),
    experience5: z.string().optional(),
    skills: z.string().min(5, 'Please list some of your skills.'),
    careerGap: z.boolean().default(false),
    careerGapYears: z.coerce.number().optional(),
    careerGapReason: z.string().optional(),
    resume: z.any().optional(),
    languageCertificate: z.any().optional(),
    graduationCertificate: z.any().optional(),
    experienceCertificate: z.any().optional(),
    employerOfferLetter: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.careerGap) {
      if (!data.careerGapYears || data.careerGapYears <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide the number of years for the career gap.',
          path: ['careerGapYears'],
        });
      }
      if (!data.careerGapReason || data.careerGapReason.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide a reason for the career gap.',
          path: ['careerGapReason'],
        });
      }
    }
  });

type ProfileFormValues = z.infer<typeof profileSchema>;

const LOCAL_STORAGE_KEY = 'mmb-profile-photo';

const ProfileDisplay = ({
  data,
  avatarSrc,
}: {
  data: ProfileFormValues;
  avatarSrc: string;
}) => {
  return (
    <div className="space-y-6 bg-background p-6 font-body">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative h-32 w-32">
          <Image
            src={avatarSrc}
            alt="User avatar"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-headline text-3xl font-bold">{data.name}</h1>
          <p className="text-muted-foreground">{data.email}</p>
          {data.contactNumber && (
            <p className="text-muted-foreground">{data.contactNumber}</p>
          )}
          <p className="text-muted-foreground">
            Born on {format(data.dob, 'PPP')}
          </p>
        </div>
      </div>

      <hr />

      <div className="space-y-4">
        <h2 className="font-headline text-xl font-semibold">
          Professional Summary
        </h2>
        <div>
          <h3 className="font-semibold">Qualifications</h3>
          <p className="text-sm text-muted-foreground">{data.qualifications}</p>
        </div>
        <div>
          <h3 className="font-semibold">Skills</h3>
          <p className="text-sm text-muted-foreground">{data.skills}</p>
        </div>
      </div>

      <hr />

      <div className="space-y-4">
        <h2 className="font-headline text-xl font-semibold">Work Experience</h2>
        <div>
          <h3 className="font-semibold">Domain & Current Role</h3>
          <p className="text-sm text-muted-foreground">
            <strong>Domain:</strong> {data.domainWorked}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Current:</strong> {data.currentExperience}
          </p>
        </div>

        {(data.experience1 ||
          data.experience2 ||
          data.experience3 ||
          data.experience4 ||
          data.experience5) && (
          <div>
            <h3 className="font-semibold">Previous Experience</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {data.experience1 && <li>{data.experience1}</li>}
              {data.experience2 && <li>{data.experience2}</li>}
              {data.experience3 && <li>{data.experience3}</li>}
              {data.experience4 && <li>{data.experience4}</li>}
              {data.experience5 && <li>{data.experience5}</li>}
            </ul>
          </div>
        )}

        {data.careerGap && (
          <div>
            <h3 className="font-semibold">Career Gap</h3>
            <p className="text-sm text-muted-foreground">
              <strong>Duration:</strong> {data.careerGapYears} year(s)
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Reason:</strong> {data.careerGapReason}
            </p>
          </div>
        )}
      </div>

      <hr />

      <div className="space-y-2 pt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Generated from My Migration Buddy
        </p>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { toast } = useToast();
  const { completeStep } = useProgress();
  const router = useRouter();

  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [agreementText, setAgreementText] = useState(
    'Loading agreement terms...'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ProfileFormValues | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const savedPhoto = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPhoto) {
      setPhotoSrc(savedPhoto);
    }

    fetch('/agreement.md')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch agreement text.');
        }
        return res.text();
      })
      .then(setAgreementText)
      .catch(() => {
        setAgreementText(
          'Failed to load agreement. Please check your connection and try again.'
        );
      });
  }, []);

  const handleDownloadPdf = async () => {
    const element = profileRef.current;
    if (!element) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not find profile content to download.',
      });
      return;
    }

    toast({ title: 'Generating PDF...', description: 'This may take a moment.' });

    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasHeight / canvasWidth;

    let width = pdfWidth - 20; // 10mm margin on each side
    let height = width * ratio;
    
    // If height is more than page, scale it down.
    if (height > pdfHeight - 20) {
      height = pdfHeight - 20;
      width = height / ratio;
    }


    const x = (pdfWidth - width) / 2; // Center horizontally
    const y = 10; // 10mm margin

    pdf.addImage(imgData, 'PNG', x, y, width, height);
    pdf.save('My-Migration-Buddy-Profile.pdf');
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoSrc(result);
        localStorage.setItem(LOCAL_STORAGE_KEY, result);
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'Nurse Alex',
      email: 'alex.doe@example.com',
      qualifications:
        'Registered Nurse with 5 years of experience in intensive care. Certified in Advanced Cardiac Life Support (ACLS). Bachelor of Science in Nursing from XYZ University.',
      contactNumber: '+1 123-456-7890',
      dob: new Date('1990-05-20'),
      domainWorked: 'Healthcare / ICU',
      currentExperience: '5 years at Berlin Charité Hospital',
      experience1: '2 years as a staff nurse at City Hospital',
      experience2: '1 year at Community Clinic',
      experience3: '',
      experience4: '',
      experience5: '',
      skills:
        'Patient care, ACLS, ICU management, German (B1), Tracheostomy care, Ventilator management',
      careerGap: false,
      careerGapYears: undefined,
      careerGapReason: '',
      resume: undefined,
      languageCertificate: undefined,
      graduationCertificate: undefined,
      experienceCertificate: undefined,
      employerOfferLetter: undefined,
    },
  });

  const watchCareerGap = form.watch('careerGap');

  function onSubmit(data: ProfileFormValues) {
    console.log(data);
    toast({
      title: 'Profile Updated',
      description: 'Your information has been successfully saved.',
    });
    completeStep('profile');
    setFormData(data);
    setIsSubmitted(true);
  }

  const avatarPlaceholder = PlaceHolderImages.find((p) => p.id === 'avatar');
  const avatarDisplaySrc =
    isClient && photoSrc
      ? photoSrc
      : avatarPlaceholder?.imageUrl ||
        'https://picsum.photos/seed/avatar/128/128';

  if (isSubmitted && formData) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Profile Saved Successfully
            </CardTitle>
            <CardDescription>
              Your profile is complete. You can download a copy for your
              records or return to the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Hidden div for PDF generation */}
            <div className="fixed -left-[9999px] -top-[9999px]">
              <div ref={profileRef} style={{ width: '800px' }}>
                <ProfileDisplay data={formData} avatarSrc={avatarDisplaySrc} />
              </div>
            </div>
            {/* Visible preview */}
            <div className="rounded-lg border bg-muted p-2">
              <ScrollArea className="h-[500px]">
                <ProfileDisplay data={formData} avatarSrc={avatarDisplaySrc} />
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter className="justify-start gap-4 border-t pt-6">
            <Button onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="border-primary/20">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="bg-gradient-to-b from-primary/5">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="group relative h-32 w-32"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={photoInputRef}
                      onChange={handlePhotoChange}
                      className="hidden"
                      accept="image/png, image/jpeg"
                    />
                    <div className="relative h-32 w-32 cursor-pointer overflow-hidden rounded-full bg-muted">
                      <Image
                        src={avatarDisplaySrc}
                        alt="User avatar"
                        data-ai-hint={
                          avatarPlaceholder?.imageHint || 'indian nurse'
                        }
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div
                      className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                      title="Upload new photo"
                    >
                      <Upload className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Please upload your latest color photo
                  </p>
                </div>
                <div>
                  <CardTitle className="font-headline text-2xl text-primary">
                    Create your Profile
                  </CardTitle>
                  <CardDescription>
                    Fill out your profile to get started. This information will
                    help us tailor your experience.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() ||
                              date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Your date of birth is used to calculate your age.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 123-456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Qualifications</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Detail your nursing degree, certifications, and years of experience."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="domainWorked"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Worked</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., ICU, Pediatrics, Surgery"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Experience</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 5 years at Berlin Charité Hospital"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>Previous Experiences</FormLabel>
                <FormDescription className="pt-2">
                  List your previous roles and workplaces, one per field.
                </FormDescription>
                <div className="mt-2 space-y-4">
                  <FormField
                    control={form.control}
                    name="experience1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Previous Experience 1"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience2"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Previous Experience 2"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience3"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Previous Experience 3"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience4"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Previous Experience 4"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience5"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Previous Experience 5"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="e.g., Patient care, ACLS, ICU management, German (B1)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List your technical and soft skills.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="careerGap"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-primary/5 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Did you have a career gap?
                      </FormLabel>
                      <FormDescription>
                        Select if you have had any gaps in your career of 6
                        months or more.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchCareerGap && (
                <div className="space-y-4 rounded-md border-l-4 border-primary/50 bg-primary/5 p-4 pl-6">
                  <FormField
                    control={form.control}
                    name="careerGapYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of years</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 2"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="careerGapReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Career Gap</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Briefly explain the reason for your career gap."
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="space-y-6 rounded-lg border bg-primary/5 p-4">
                <h3 className="text-lg font-medium">Document Uploads</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your CV, certificates, and other relevant documents.
                  All uploads are optional. Accepted formats: PDF, DOC, DOCX.
                </p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resume/CV</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                              field.onChange(
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="languageCertificate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Language Certificate (A2, B1, etc.)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                              field.onChange(
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="graduationCertificate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Certificate</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                              field.onChange(
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experienceCertificate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Experience Certificate or Current offer letter
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                              field.onChange(
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employerOfferLetter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employer Offer Letter</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                              field.onChange(
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-lg border bg-primary/5 p-4">
                <h3 className="text-lg font-medium">User Agreement</h3>
                <FormDescription>
                  Please read and accept the terms and conditions to continue.
                </FormDescription>
                <ScrollArea className="h-40 w-full rounded-md border bg-card p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">
                    {agreementText}
                  </pre>
                </ScrollArea>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setAgreementAccepted(true);
                      toast({
                        title: 'Agreement Accepted',
                        description: 'You can now submit your profile.',
                      });
                    }}
                  >
                    I Agree
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAgreementAccepted(false);
                      toast({
                        variant: 'destructive',
                        title: 'Agreement Required',
                        description: 'You must agree to the terms to proceed.',
                      });
                    }}
                  >
                    I Disagree
                  </Button>
                  {agreementAccepted && (
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      You have accepted the agreement.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button type="submit" disabled={!agreementAccepted}>
                Update Profile and Continue
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
