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

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  qualifications: z.string().min(10, 'Please describe your qualifications.'),
  contactNumber: z.string().optional(),
});

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
    },
  });

  function onSubmit(data: ProfileFormValues) {
    console.log(data);
    toast({
      title: 'Profile Updated',
      description: 'Your information has been successfully saved.',
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
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
            <CardContent className="space-y-6">
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
              <FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Qualifications</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Detail your nursing degree, certifications, and years of experience."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This information will be used to match you with potential employers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
