// import { Card, CardContent } from "@/components/ui/card";

import Card, { CardContent } from "../../common/components/ui/Card";
import { Rocket, Sparkles, Trophy } from "lucide-react";

import Progress from "../../common/components/ui/Progress";
import { motion } from "framer-motion";

// Related to developer progress
const projectStats = {
  stripeSetup: true,
  adminCrud: true,
  wishlist: true,
  vendorSystem: true,
  settingsPolish: true,
  superAdmin: true,
  checkoutPage: true,
  heroSection: true,
  contactFix: true,
  planUpgradeSystem: true,
  deploymentPrep: false,
};

const SuperAdminDeveloperJourneyTracker = () => {
  // projectStats = { stripeSetup: true, adminCrud: true, wishlist: true, vendorSystem: false, settingsPolish: true, superAdmin: true }

  const totalTasks = Object.keys(projectStats).length;
  const completed = Object.values(projectStats).filter(Boolean).length;
  const completion = Math.round((completed / totalTasks) * 100);

  const stages = [
    { label: "Level 1: Tinkerer", progress: 100 },
    { label: "Level 2: Builder", progress: 100 },
    { label: "Level 3: Architect", progress: 100 },
    {
      label: "Level 4: Visionary",
      progress: completion >= 80 ? 100 : completion,
    },
    {
      label: "Level 5: Creator",
      progress: completion >= 95 ? completion : completion / 2,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="max-w-lg mx-auto"
    >
      <Card className="shadow-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              <Sparkles className="w-6 h-6" /> Nova-Cart Dev Journey
            </h2>
            <Rocket className="w-6 h-6 text-yellow-300" />
          </div>

          <div className="space-y-3">
            {stages.map((stage, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span>{stage.label}</span>
                  <span>{stage.progress}%</span>
                </div>
                <Progress value={stage.progress} className="bg-indigo-300" />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between">
            <span className="text-lg font-semibold">Overall Progress</span>
            <span className="text-2xl font-bold flex items-center gap-2">
              {completion}% <Trophy className="w-5 h-5 text-yellow-300" />
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SuperAdminDeveloperJourneyTracker;
