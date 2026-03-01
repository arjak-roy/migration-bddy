import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart3, Briefcase, HeartPulse, NotebookText } from 'lucide-react';
import { Logo } from '@/components/logo';

const features = [
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: 'German Readiness Assessment',
    description: 'Our AI-powered assessment evaluates your aptitude for learning German and provides instant, personalized feedback to start you on the right foot.',
    link: '/assessment',
  },
  {
    icon: <NotebookText className="h-8 w-8 text-primary" />,
    title: 'Germany Nurse Career Guide',
    description: 'Navigate the entire process with our comprehensive guide, covering everything from qualification recognition to visa procedures.',
    link: '/guide',
  },
  {
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: 'Personalized Learning',
    description: 'Receive a curated list of language resources tailored to your assessment results, learning style, and career goals.',
    link: '/assessment',
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Curated Job Listings',
    description: 'Explore relevant nursing job opportunities across Germany, with powerful filters to find your perfect match.',
    link: '/jobs',
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-9 w-20" />
          <Link href="/">
            <span className="font-bold text-lg">My Migration Buddy</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-6 lg:py-24">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Your Pathway to a Nursing Career in Germany
            </h1>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              My Migration Buddy is your all-in-one platform for making your dream of working as a nurse in Germany a reality. From language assessment to job placement, we guide you every step of the way.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Start Your Journey <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/dashboard">Explore the Guide</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-2xl md:h-96">
             <Image
              src="https://picsum.photos/seed/hero/1200/800"
              alt="Nurse looking at a German cityscape"
              fill
              className="object-cover"
              data-ai-hint="nurse germany"
              priority
            />
          </div>
        </section>

        <section id="features" className="w-full bg-card py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                A Clear Path to Success
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We provide the tools and guidance you need for a successful migration.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col">
                  <CardHeader className="flex flex-row items-start gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="flex-1 text-muted-foreground">{feature.description}</p>
                    <Button variant="link" className="mt-4 p-0" asChild>
                       <Link href="/dashboard">Learn more <ArrowRight className="ml-2" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-16" />
            <span className="font-semibold">My Migration Buddy</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} My Migration Buddy. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link href="#" className="text-sm hover:underline">Privacy Policy</Link>
            <Link href="#" className="text-sm hover:underline">Terms of Service</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
