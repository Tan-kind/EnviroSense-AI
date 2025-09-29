"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthForm } from "@/components/ui/auth-form";
import { useAuth } from "@/components/auth-provider";
import {
  Camera,
  MessageCircle,
  BarChart3,
  Target,
  Leaf,
  Calculator,
  LogOut,
  ArrowRight,
  Sparkles,
  Globe,
  TrendingUp,
  Flame,
  Tractor,
  Droplets,
  Sun,
  TreePine,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { FloatingButtons } from "@/components/ui/floating-buttons";

export default function EnviroSenseHome() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { user, loading, signOut } = useAuth();

  const primaryFeatures = [
    {
      id: "dashboard",
      title: "Climate Dashboard",
      description:
        "Real-time environmental monitoring with weather data and climate alerts",
      icon: BarChart3,
      gradient: "from-orange-500 to-red-600",
      href: "/dashboard",
      stats: "Live Climate Intelligence",
    },
    {
      id: "drought-crops",
      title: "Drought-Resistant Crops",
      description:
        "AI-powered crop recommendations for diverse climate conditions",
      icon: Leaf,
      gradient: "from-amber-500 to-yellow-600",
      href: "/drought-crops",
      stats: "Climate-Smart Farming",
    },
    {
      id: "water-conservation",
      title: "Water Conservation",
      description:
        "Smart water management strategies for homes, farms, and communities",
      icon: Droplets,
      gradient: "from-blue-500 to-cyan-600",
      href: "/water-conservation",
      stats: "Water Efficiency",
    },
    {
      id: "solar-optimizer",
      title: "Solar Panel Optimizer",
      description: "Optimize solar panel placement and sizing for any location",
      icon: Sun,
      gradient: "from-yellow-500 to-orange-500",
      href: "/solar-optimizer",
      stats: "Renewable Energy",
    },
    {
      id: "habitat-protection",
      title: "Habitat Protection",
      description:
        "AI-powered recommendations for protecting and restoring natural habitats",
      icon: Shield,
      gradient: "from-emerald-600 to-green-700",
      href: "/habitat-protection",
      stats: "Conservation Planning",
    },
    {
      id: "farm-equipment",
      title: "Farm Carbon Calculator",
      description:
        "Calculate and reduce carbon footprint of agricultural equipment and operations",
      icon: Tractor,
      gradient: "from-green-500 to-emerald-600",
      href: "/farm-equipment",
      stats: "Equipment Efficiency",
    },
    {
      id: "scanner",
      title: "Impact Scanner",
      description:
        "Revolutionary AI vision that reveals the environmental footprint of any object in seconds",
      icon: Camera,
      gradient: "from-teal-400 to-cyan-600",
      href: "/scanner",
      stats: "Environmental Analysis",
    },
    {
      id: "chat",
      title: "AI Climate Advisor",
      description:
        "Personal climate mentor for actionable sustainability guidance",
      icon: MessageCircle,
      gradient: "from-blue-400 to-indigo-600",
      href: "/chat",
      stats: "Climate Guidance",
    },
    {
      id: "simulator",
      title: "Impact Predictor",
      description: "Model future environmental impact of your actions",
      icon: Calculator,
      gradient: "from-orange-400 to-red-600",
      href: "/simulator",
      stats: "Climate Action Modeling",
    },
    {
      id: "goals",
      title: "Smart Goal Tracking",
      description:
        "AI-powered environmental goal setting with real impact measurement and progress visualization",
      icon: Target,
      gradient: "from-emerald-400 to-teal-600",
      href: "/goals",
      stats: "Track CO₂, Water & Energy",
    },
  ];

  const handleFeatureClick = (feature: any) => {
    // Allow all users to access features directly
    window.location.href = feature.href;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showAuthForm && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                OutbackVision AI
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to access all climate action features
            </p>
          </div>
          <AuthForm onSuccess={() => setShowAuthForm(false)} />
          <div className="text-center mt-4">
            <Button variant="ghost" onClick={() => setShowAuthForm(false)}>
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Floating Header */}
      <header className="fixed top-4 left-4 right-4 z-50 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg dark:bg-gray-900/70 dark:border-gray-700/20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  EnviroSense AI
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Climate Action for Everyone
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-full">
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {user.email?.split("@")[0]}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="rounded-xl"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthForm(true)}
                  className="rounded-xl border-2"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Primary Features */}
      <section className="pt-32 pb-20 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Accessible AI Tools for Climate Action
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced AI with comprehensive accessibility features to deliver
              practical climate insights for everyone, regardless of abilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {primaryFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={feature.id}
                  className="group cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden"
                  onClick={() => handleFeatureClick(feature)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4`}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex items-center justify-center mb-3">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {feature.stats}
                        </span>
                      </div>
                      {!user && (
                        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 w-full">
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>🔒</span>
                            <span>Sign in to save your data</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">EnviroSense AI</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Climate action accessible to everyone through inclusive AI-powered
              tools.
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <span>© 2024 EnviroSense AI</span>
              <span>•</span>
              <span>Accessible Climate Intelligence Platform</span>
            </div>
          </div>
        </div>
      </footer>
      {/* Floating Buttons */}
      <FloatingButtons
        pageTitle="EnviroSense AI Home"
        pageContext="Main landing page showcasing accessible AI-powered environmental tools including climate dashboard, scanner, chat advisor, goal tracking, and action simulator with comprehensive accessibility features"
      />
    </div>
  );
}
