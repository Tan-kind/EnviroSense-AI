"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FloatingButtons } from "@/components/ui/floating-buttons";
import {
  Target,
  CheckCircle,
  Plus,
  Leaf,
  Droplets,
  Zap,
  Recycle,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  days: number;
  current_day: number;
  status: "active" | "completed";
  created_at: string;
  completed_at?: string;
  environmental_impact: {
    co2_saved: number;
    water_saved: number;
    energy_saved: number;
    waste_reduced: number;
    impact_description: string;
  };
}

interface CumulativeImpact {
  total_co2_saved: number;
  total_water_saved: number;
  total_energy_saved: number;
  total_waste_reduced: number;
  goals_completed: number;
  total_days_active: number;
}

export default function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [cumulativeImpact, setCumulativeImpact] = useState<CumulativeImpact>({
    total_co2_saved: 0,
    total_water_saved: 0,
    total_energy_saved: 0,
    total_waste_reduced: 0,
    goals_completed: 0,
    total_days_active: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    days: 1,
  });
  const [calculatingImpact, setCalculatingImpact] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadGoals();
  }, [user]);

  // Local storage helpers for non-authenticated users
  const getLocalGoals = (): Goal[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("outbackvision-goals");
    return stored ? JSON.parse(stored) : [];
  };

  const setLocalGoals = (goals: Goal[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("outbackvision-goals", JSON.stringify(goals));
  };

  const loadGoals = async () => {
    try {
      if (user) {
        // Load from database for authenticated users
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const response = await fetch("/api/goals", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setGoals(data.goals || []);
          calculateCumulativeImpact(data.goals || []);
        }
      } else {
        // Load from localStorage for non-authenticated users
        const localGoals = getLocalGoals();
        setGoals(localGoals);
        calculateCumulativeImpact(localGoals);
      }
    } catch (error) {
      console.error("Failed to load goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCumulativeImpact = (goalsList: Goal[]) => {
    const completedGoals = goalsList.filter((g) => g.status === "completed");
    const cumulative = completedGoals.reduce(
      (acc, goal) => ({
        total_co2_saved:
          acc.total_co2_saved + goal.environmental_impact.co2_saved,
        total_water_saved:
          acc.total_water_saved + goal.environmental_impact.water_saved,
        total_energy_saved:
          acc.total_energy_saved + goal.environmental_impact.energy_saved,
        total_waste_reduced:
          acc.total_waste_reduced + goal.environmental_impact.waste_reduced,
        goals_completed: acc.goals_completed + 1,
        total_days_active: acc.total_days_active + goal.days,
      }),
      {
        total_co2_saved: 0,
        total_water_saved: 0,
        total_energy_saved: 0,
        total_waste_reduced: 0,
        goals_completed: 0,
        total_days_active: 0,
      }
    );

    setCumulativeImpact(cumulative);
  };

  const calculateEnvironmentalImpact = async (
    title: string,
    description: string,
    days: number
  ) => {
    try {
      setCalculatingImpact(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Get selected location from browser storage
      const selectedLocationObj = localStorage.getItem('envirosense-location')
      const selectedCountry = selectedLocationObj ? JSON.parse(selectedLocationObj).name : 'USA'

      const response = await fetch("/api/calculate-impact", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal_title: title,
          goal_description: description,
          duration_days: days,
          selectedCountry: selectedCountry,
        }),
      });

      if (response.ok) {
        const impact = await response.json();
        return impact;
      } else {
        throw new Error("Failed to calculate impact");
      }
    } catch (error) {
      console.error("Error calculating impact:", error);
      // Fallback calculation
      return {
        co2_saved: days * 0.5,
        water_saved: days * 10,
        energy_saved: days * 2,
        waste_reduced: days * 0.3,
        impact_description: `Estimated environmental benefit from ${days} days of ${title.toLowerCase()}`,
      };
    } finally {
      setCalculatingImpact(false);
    }
  };

  const createGoal = async () => {
    if (!newGoal.title.trim()) return;

    try {
      const impact = await calculateEnvironmentalImpact(
        newGoal.title,
        newGoal.description,
        newGoal.days
      );

      const newGoalWithImpact: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        days: newGoal.days,
        current_day: 0,
        status: "active",
        created_at: new Date().toISOString(),
        environmental_impact: impact,
      };

      if (user) {
        // Save to database for authenticated users
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const response = await fetch("/api/goals", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newGoal,
            environmental_impact: impact,
          }),
        });

        if (response.ok) {
          await loadGoals();
        } else {
          throw new Error("Failed to save to database");
        }
      } else {
        // Save to localStorage for non-authenticated users
        const currentGoals = getLocalGoals();
        const updatedGoals = [...currentGoals, newGoalWithImpact];
        setLocalGoals(updatedGoals);
        setGoals(updatedGoals);
        calculateCumulativeImpact(updatedGoals);
      }

      setNewGoal({ title: "", description: "", days: 1 });
      setShowCreateGoal(false);
    } catch (error) {
      console.error("Failed to create goal:", error);
    }
  };

  const updateGoalProgress = async (goalId: string) => {
    try {
      if (user) {
        // Update in database for authenticated users
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const response = await fetch("/api/goals", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goal_id: goalId,
            action: "progress",
          }),
        });

        if (response.ok) {
          await loadGoals();
        }
      } else {
        // Update in localStorage for non-authenticated users
        const currentGoals = getLocalGoals();
        const updatedGoals = currentGoals.map((goal) => {
          if (goal.id === goalId) {
            const newCurrentDay = goal.current_day + 1;
            return {
              ...goal,
              current_day: newCurrentDay,
              status:
                newCurrentDay >= goal.days
                  ? ("completed" as const)
                  : ("active" as const),
              completed_at:
                newCurrentDay >= goal.days
                  ? new Date().toISOString()
                  : undefined,
            };
          }
          return goal;
        });
        setLocalGoals(updatedGoals);
        setGoals(updatedGoals);
        calculateCumulativeImpact(updatedGoals);
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const completeGoal = async (goalId: string) => {
    try {
      if (user) {
        // Complete in database for authenticated users
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const response = await fetch("/api/goals", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goal_id: goalId,
            action: "complete",
          }),
        });

        if (response.ok) {
          await loadGoals();
        }
      } else {
        // Complete in localStorage for non-authenticated users
        const currentGoals = getLocalGoals();
        const updatedGoals = currentGoals.map((goal) => {
          if (goal.id === goalId) {
            return {
              ...goal,
              status: "completed" as const,
              completed_at: new Date().toISOString(),
            };
          }
          return goal;
        });
        setLocalGoals(updatedGoals);
        setGoals(updatedGoals);
        calculateCumulativeImpact(updatedGoals);
      }
    } catch (error) {
      console.error("Failed to complete goal:", error);
    }
  };

  const resetAllGoals = async () => {
    try {
      setResetting(true);

      if (user) {
        // Reset in database for authenticated users
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const response = await fetch("/api/goals", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          await loadGoals();
        }
      } else {
        // Reset localStorage for non-authenticated users
        setLocalGoals([]);
        setGoals([]);
        setCumulativeImpact({
          total_co2_saved: 0,
          total_water_saved: 0,
          total_energy_saved: 0,
          total_waste_reduced: 0,
          goals_completed: 0,
          total_days_active: 0,
        });
      }

      setShowResetDialog(false);
    } catch (error) {
      console.error("Failed to reset goals:", error);
    } finally {
      setResetting(false);
    }
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🌱 Environmental Goals
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create personal goals and track your environmental impact with
            AI-powered calculations
          </p>
        </div>

        {/* Cumulative Impact Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-emerald-50 border-emerald-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">
                    CO₂ Saved
                  </p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {cumulativeImpact.total_co2_saved.toFixed(1)}
                  </p>
                  <p className="text-xs text-emerald-500">kg total</p>
                </div>
                <Leaf className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Water Saved
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {cumulativeImpact.total_water_saved.toFixed(0)}
                  </p>
                  <p className="text-xs text-blue-500">liters total</p>
                </div>
                <Droplets className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">
                    Energy Saved
                  </p>
                  <p className="text-2xl font-bold text-amber-700">
                    {cumulativeImpact.total_energy_saved.toFixed(1)}
                  </p>
                  <p className="text-xs text-amber-500">kWh total</p>
                </div>
                <Zap className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-violet-50 border-violet-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-600">
                    Goals Completed
                  </p>
                  <p className="text-2xl font-bold text-violet-700">
                    {cumulativeImpact.goals_completed}
                  </p>
                  <p className="text-xs text-violet-500">
                    {cumulativeImpact.total_days_active} days active
                  </p>
                </div>
                <Award className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Goal Button & Reset Button */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <Dialog open={showCreateGoal} onOpenChange={setShowCreateGoal}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Environmental Goal</DialogTitle>
                <DialogDescription>
                  Set a personal environmental goal and let AI calculate your
                  potential impact
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Goal Title</label>
                  <Input
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, title: e.target.value })
                    }
                    placeholder="e.g., Use reusable water bottle"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Description (Optional)
                  </label>
                  <Textarea
                    value={newGoal.description}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, description: e.target.value })
                    }
                    placeholder="Describe your goal in more detail..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (Days)</label>
                  <Input
                    type="number"
                    value={newGoal.days}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        days: parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                    max="365"
                    placeholder="Enter number of days (1-365)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateGoal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createGoal}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={calculatingImpact || !newGoal.title.trim()}
                >
                  {calculatingImpact ? "Calculating Impact..." : "Create Goal"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Reset Button - only show if user has goals */}
          {goals.length > 0 && (
            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  🔄 Reset All Goals
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset All Goals</DialogTitle>
                  <DialogDescription>
                    This will permanently delete all your goals and reset your
                    cumulative environmental impact to zero. This action cannot
                    be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-700 mb-2">
                    <span className="text-lg">⚠️</span>
                    <span className="font-medium">
                      Warning: This will delete:
                    </span>
                  </div>
                  <ul className="text-sm text-red-600 space-y-1 ml-6">
                    <li>• {activeGoals.length} active goals</li>
                    <li>• {completedGoals.length} completed goals</li>
                    <li>• All cumulative environmental impact data</li>
                    <li>
                      • {cumulativeImpact.total_co2_saved.toFixed(1)}kg CO₂
                      saved
                    </li>
                    <li>• {cumulativeImpact.total_water_saved}L water saved</li>
                  </ul>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowResetDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={resetAllGoals}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={resetting}
                  >
                    {resetting ? "Resetting..." : "Yes, Reset Everything"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              Active Goals ({activeGoals.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGoals.map((goal) => (
                <Card
                  key={goal.id}
                  className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    {goal.description && (
                      <CardDescription>{goal.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>
                            {goal.current_day}/{goal.days} days
                          </span>
                        </div>
                        <Progress
                          value={(goal.current_day / goal.days) * 100}
                          className="h-2"
                        />
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Potential Impact:
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            CO₂: {goal.environmental_impact.co2_saved}kg
                          </div>
                          <div>
                            Water: {goal.environmental_impact.water_saved}L
                          </div>
                          <div>
                            Energy: {goal.environmental_impact.energy_saved}kWh
                          </div>
                          <div>
                            Waste: {goal.environmental_impact.waste_reduced}kg
                          </div>
                        </div>
                      </div>

                      {goal.current_day < goal.days ? (
                        <Button
                          onClick={() => updateGoalProgress(goal.id)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          ✓ Mark Today Complete
                        </Button>
                      ) : (
                        <Button
                          onClick={() => completeGoal(goal.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          🎉 Complete Goal
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Completed Goals ({completedGoals.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedGoals.map((goal) => (
                <Card
                  key={goal.id}
                  className="border-l-4 border-l-emerald-500 bg-emerald-50 shadow-lg"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-emerald-800">
                      {goal.title}
                    </CardTitle>
                    {goal.description && (
                      <CardDescription className="text-emerald-600">
                        {goal.description}
                      </CardDescription>
                    )}
                    <Badge className="w-fit bg-emerald-100 text-emerald-700">
                      Completed {goal.days} days
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Environmental Impact Achieved:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Leaf className="h-3 w-3 text-emerald-500" />
                          {goal.environmental_impact.co2_saved}kg CO₂
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-3 w-3 text-blue-500" />
                          {goal.environmental_impact.water_saved}L water
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-500" />
                          {goal.environmental_impact.energy_saved}kWh energy
                        </div>
                        <div className="flex items-center gap-1">
                          <Recycle className="h-3 w-3 text-violet-500" />
                          {goal.environmental_impact.waste_reduced}kg waste
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 italic">
                        {goal.environmental_impact.impact_description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {goals.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No goals yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first environmental goal to start making an impact!
            </p>
          </div>
        )}

        {/* Floating Buttons */}
        <FloatingButtons
          pageTitle="Environmental Goals Tracker"
          pageContext="Gamified environmental goal setting and tracking with AI-powered impact calculations, daily progress monitoring, and cumulative environmental impact visualization"
        />
      </div>
    </div>
  );
}
