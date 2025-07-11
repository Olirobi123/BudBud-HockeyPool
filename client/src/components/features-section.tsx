import { Card, CardContent } from "@/components/ui/card";
import { 
  Rocket, 
  Palette, 
  Smartphone, 
  Shield, 
  Settings, 
  TrendingUp 
} from "lucide-react";

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
          {/* The features array is removed, so this loop will not render any cards. */}
        </div>
      </div>
    </section>
  );
}
