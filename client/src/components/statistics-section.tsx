import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "99.9%", label: "Uptime", color: "text-primary" },
  { value: "2.3s", label: "Load Time", color: "text-accent" },
  { value: "50K+", label: "Users", color: "text-secondary-500" },
  { value: "98%", label: "Satisfaction", color: "text-green-400" },
];

export default function StatisticsSection() {
  return (
    <section className="py-16 sm:py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold sm:text-4xl">Platform Analytics</h3>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Real-time performance metrics showcasing our enhanced platform capabilities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <Card className="glassmorphism bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
