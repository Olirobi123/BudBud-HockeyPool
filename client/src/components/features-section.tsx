import { Card, CardContent } from "@/components/ui/card";
import { 
  Rocket, 
  Palette, 
  Smartphone, 
  Shield, 
  Settings, 
  TrendingUp 
} from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Modern Performance",
    description: "Optimized loading times and smooth interactions across all devices with cutting-edge technology.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Palette,
    title: "Beautiful Design",
    description: "Contemporary visual design with improved typography and enhanced user interface components.",
    color: "text-secondary-500",
    bgColor: "bg-secondary-500/10"
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Mobile-first approach ensuring perfect experience across all screen sizes and devices.",
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    icon: Shield,
    title: "Enhanced Security",
    description: "Advanced security measures and accessibility standards for a safe and inclusive experience.",
    color: "text-green-600",
    bgColor: "bg-green-600/10"
  },
  {
    icon: Settings,
    title: "Smart Functionality",
    description: "All existing features maintained and enhanced with improved user flows and interactions.",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10"
  },
  {
    icon: TrendingUp,
    title: "Analytics Ready",
    description: "Built-in analytics support and performance monitoring for data-driven improvements.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-600/10"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Enhanced Features
          </h3>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the perfect blend of functionality and design with our modernized platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index}
                className="bg-white hover:shadow-lg transition-shadow duration-300 border border-gray-100 group hover:-translate-y-1 transform transition-transform"
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className={`${feature.color} w-6 h-6`} />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
