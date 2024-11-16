import { Card } from "@/components/ui/card";
import { TrophyIcon } from "lucide-react";

const tournaments = [
  {
    name: "Nordic Open 2024",
    date: "Apr 15-18, 2024",
    location: "Copenhagen, Denmark",
    status: "Registration Open",
  },
  {
    name: "US Open Championships",
    date: "May 22-26, 2024",
    location: "Las Vegas, USA",
    status: "Coming Soon",
  },
  {
    name: "Mediterranean Classic",
    date: "Jun 8-12, 2024",
    location: "Monte Carlo, Monaco",
    status: "Registration Open",
  },
  {
    name: "Asian Championship",
    date: "Jul 1-5, 2024",
    location: "Tokyo, Japan",
    status: "Coming Soon",
  },
];

export default function TournamentUpdates() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Tournament Updates</h2>
      <div className="space-y-4">
        {tournaments.map((tournament, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <TrophyIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">{tournament.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {tournament.date}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tournament.location}
                </p>
                <div className="mt-2">
                  <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    {tournament.status}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}