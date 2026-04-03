import { Calendar } from "@/components/calendar";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Economy Calendar</h1>
      <Calendar />
    </main>
  );
}
