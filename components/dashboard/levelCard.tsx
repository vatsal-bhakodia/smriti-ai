import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LevelCard() {
  const stats = {
    value: "Intermediate",
    trend: "12% growth",
    progress: 65,
  };
  return (
   <Card className="rounded-xl shadow-sm hover:shadow-md transition-all light:bg-white light:border light:border-gray-200">
  <CardContent>
    <div className="flex items-center gap-4">
      <div className="bg-muted/50 light:bg-gray-100 rounded-lg p-3">
        <Award className="text-primary light:text-lime-600 h-5 w-5" />
      </div>
      <div className="space-y-1 w-full">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground light:text-gray-700">Mastery Level</p>
          <span className="text-xs font-medium text-[#adff2f] bg-[#adff2f]/10 px-3 py-1 rounded-full flex items-center gap-1 border border-[#adff2f]/20">
            {stats.trend}
          </span>
        </div>
        <p className="text-xl font-bold light:text-gray-900">{stats.value}</p>
      </div>
    </div>

    <div className="mt-4">
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden light:bg-gray-200">
        <div
          className="h-full bg-primary light:bg-lime-600 rounded-full transition-all duration-500"
          style={{ width: `${stats.progress}%` }}
        />
      </div>
      <p className="text-right text-xs text-muted-foreground light:text-gray-600 mt-1">
        {stats.progress}% achieved
      </p>
    </div>
  </CardContent>
</Card>

  );
}
