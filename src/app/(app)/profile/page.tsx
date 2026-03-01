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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  dob: z.date({
    required_error: 'A date of birth is required.',
  }),
  contactNumber: z.string().optional(),
  qualifications: z.string().min(10, 'Please describe your qualifications.'),
  domainWorked: z.string().min(2, "Please enter the domain you've worked in."),
  currentExperience: z.string().min(2, "Please enter your current experience."),
  experience1: z.string().optional(),
  experience2: z.string().optional(),
  experience3: z.string().optional(),
  experience4: z.string().optional(),
  experience5: z.string().optional(),
  skills: z.string().min(5, 'Please list some of your skills.'),
  careerGap: z.boolean().default(false),
  careerGapReason: z.string().optional(),
}).refine((data) => {
    if (data.careerGap && !data.careerGapReason) {
      return false;
    }
    return true;
  },
  {
    message: "Please provide a reason for the career gap.",
    path: ["careerGapReason"],
  }
);

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'Nurse Alex',
      email: 'alex.doe@example.com',
      qualifications: 'Registered Nurse with 5 years of experience in intensive care. Certified in Advanced Cardiac Life Support (ACLS). Bachelor of Science in Nursing from XYZ University.',
      contactNumber: '+1 123-456-7890',
      dob: new Date('1990-05-20'),
      domainWorked: 'Healthcare / ICU',
      currentExperience: '5 years at Berlin Charité Hospital',
      experience1: '2 years as a staff nurse at City Hospital',
      experience2: '1 year at Community Clinic',
      experience3: '',
      experience4: '',
      experience5: '',
      skills: 'Patient care, ACLS, ICU management, German (B1), Tracheostomy care, Ventilator management',
      careerGap: false,
      careerGapReason: '',
    },
  });

  const watchCareerGap = form.watch('careerGap');
  const watchDob = form.watch('dob');

  const calculateAge = (birthDate: Date | undefined) => {
    if (!birthDate) return null;
    const today = new Date();
    let age = today.getFullYear() - new Date(birthDate).getFullYear();
    const m = today.getMonth() - new Date(birthDate).getMonth();
    if (m < 0 || (m === 0 && today.getDate() < new Date(birthDate).getDate())) {
        age--;
    }
    return age;
  };

  const age = calculateAge(watchDob);

  function onSubmit(data: ProfileFormValues) {
    console.log(data);
    toast({
      title: 'Profile Updated',
      description: 'Your information has been successfully saved.',
    });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                   <AvatarImage src="https://picsum.photos/seed/avatar/128/128" data-ai-hint="nurse portrait" />
                  <AvatarFallback>NA</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="font-headline text-2xl">Your Profile</CardTitle>
                  <CardDescription>
                    Manage your personal and professional information.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
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
                        <Input type="email" placeholder="your.email@example.com" {...field} />
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
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
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
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Your date of birth is used to calculate your age. {age != null && `You are ${age} years old.`}
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
                        <Input placeholder="e.g., ICU, Pediatrics, Surgery" {...field} />
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
                        <Input placeholder="e.g., 5 years at Berlin Charité Hospital" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <FormLabel>Previous Experiences</FormLabel>
                <FormDescription className="pt-2">List your previous roles and workplaces, one per field.</FormDescription>
                <div className="mt-2 space-y-4">
                  <FormField
                    control={form.control}
                    name="experience1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Previous Experience 1" {...field} value={field.value ?? ''} />
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
                          <Input placeholder="Previous Experience 2" {...field} value={field.value ?? ''} />
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
                          <Input placeholder="Previous Experience 3" {...field} value={field.value ?? ''} />
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
                          <Input placeholder="Previous Experience 4" {...field} value={field.value ?? ''} />
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
                          <Input placeholder="Previous Experience 5" {...field} value={field.value ?? ''} />
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Did you have a career gap?
                      </FormLabel>
                      <FormDescription>
                        Let us know if you have had any gaps in your career.
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            </CardContent>
            <CardFooter>
              <Button type="submit">Update Profile</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
