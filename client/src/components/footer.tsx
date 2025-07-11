import { Button } from "@/components/ui/button";
import { Activity, Mail, Phone } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">38</span>
              </div>
              <h4 className="text-2xl font-bold text-white">38BudBud</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Pool de hockey moderne avec interface intuitive et suivi en temps réel 
              pour une expérience de jeu optimale.
            </p>
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>pool@38budbud.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Activity className="w-4 h-4" />
                <span>Saison 2024-25</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-white mb-4">Pool de Hockey</h5>
            <ul className="space-y-2">
              {/* The footerLinks object was removed, so this loop will not render any links */}
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-white mb-4">Saison</h5>
            <ul className="space-y-2">
              {/* The footerLinks object was removed, so this loop will not render any links */}
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-white mb-4">Aide</h5>
            <ul className="space-y-2">
              {/* The footerLinks object was removed, so this loop will not render any links */}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 38BudBud Pool de Hockey. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#regles"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Règlements
              </a>
              <a
                href="#confidentialite"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
