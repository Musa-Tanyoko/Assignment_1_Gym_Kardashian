import { Button } from "@fitness-app/ui";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Gym Kardashian
        </h1>
        <p className="text-center mb-8 text-lg">
          A fitness app that doubles as a game where users care for a digital pet
        </p>
        <p>We'll try to keep up with you</p>
        <div className="flex justify-center gap-4">
          <Button variant="primary">Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>
    </main>
  );
} 