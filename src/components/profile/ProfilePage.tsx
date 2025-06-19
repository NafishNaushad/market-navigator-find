
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Globe, CreditCard, LogOut, Shield } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  country: string;
  plan: string;
  search_count_today: number;
  created_at: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [country, setCountry] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
        setCountry(data.country || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error loading profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!profile) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ country })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, country } : null);
      toast({
        title: "Profile updated",
        description: "Your preferences have been saved.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'pro':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'premium':
        return 'bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Email Address
              </Label>
              <p className="text-lg font-medium">{profile.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Plan
              </Label>
              <div className="mt-1">
                <Badge className={getPlanColor(profile.plan)}>
                  {profile.plan}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Member Since
              </Label>
              <p className="text-lg font-medium">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Searches Today
              </Label>
              <p className="text-lg font-medium">{profile.search_count_today}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="country">Country/Region</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter your country"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                This helps us show relevant platforms and pricing
              </p>
            </div>
            <Button onClick={updateProfile} disabled={updating}>
              {updating ? "Updating..." : "Save Preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Usage Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{profile.search_count_today}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Searches Today</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">10</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Daily Limit</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(((10 - profile.search_count_today) / 10) * 100)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Upgrade Plan</h3>
                <p className="text-sm text-gray-500">Get unlimited searches and premium features</p>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Upgrade
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 dark:border-red-800">
              <div>
                <h3 className="font-medium text-red-700 dark:text-red-300">Sign Out</h3>
                <p className="text-sm text-gray-500">Sign out of your account</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
