import Card, {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../common/components/ui/Card";
import { useEffect, useMemo, useState } from "react";

/**
 * ProjectProgressTracker
 * - Saves state into localStorage under key: novaCartProgress_v2
 * - Supports adding custom features per section
 * - Collapsible sections, per-section & global progress bars
 */

const STORAGE_KEY = "novaCartProgress_v2";

const DEFAULT_SECTIONS = {
  "Client Side": [
    {
      id: "auth",
      label: "User Authentication (Register/Login/OAuth)",
      done: true,
      notes: "Stable",
    },
    {
      id: "roles",
      label: "Role-based Access (User, Writer, Admin, SuperAdmin)",
      done: true,
      notes: "Done",
    },
    {
      id: "plans",
      label: "Plan Subscription & Management",
      done: true,
      notes: "Upgrade/Downgrade/Cancel",
    },
    {
      id: "highlight",
      label: "Plan Highlight & Basic Plan Reversion",
      done: true,
      notes: "Polished",
    },
    {
      id: "wishlist",
      label: "Wishlist System",
      done: true,
      notes: "Fully functional",
    },
    {
      id: "cart",
      label: "Cart System",
      done: true,
      notes: "Dynamic, quantity update works",
    },
    { id: "checkout", label: "Checkout Page", done: true, notes: "Done" },
    {
      id: "billing",
      label: "Mock Billing & Payment Confirmation",
      done: true,
      notes: "Before Stripe integration",
    },
    {
      id: "coupons",
      label: "Coupons / Discounts System",
      done: true,
      notes: "Optional but enabled",
    },
    {
      id: "orderHistory",
      label: "Order History Page",
      done: true,
      notes: "Integrated with plan history",
    },
    {
      id: "profile",
      label: "Profile & Settings Page",
      done: false,
      notes: "Final polish",
    },
    {
      id: "responsiveness",
      label: "UI Responsiveness (Mobile + Tablet)",
      done: false,
      notes: "Final pass needed",
    },
    {
      id: "toasts",
      label: "Toasts & Alerts Review",
      done: true,
      notes: "Consistency ok",
    },
    { id: "dark", label: "Dark Mode", done: true, notes: "Optional" },
  ],
  "Super Admin Panel": [
    {
      id: "superAuth",
      label: "Super Admin Authentication",
      done: true,
      notes: "Global role access",
    },
    {
      id: "weekly",
      label: "Weekly Revenue Analytics",
      done: true,
      notes: "Working nicely",
    },
    {
      id: "monthly",
      label: "Monthly Revenue Analytics",
      done: true,
      notes: "With transactions & tooltip",
    },
    {
      id: "summary",
      label: "Total Revenue Summary",
      done: true,
      notes: "Displayed in chart card",
    },
    {
      id: "users",
      label: "User Growth Analytics",
      done: true,
      notes: "Admin side done",
    },
    {
      id: "planHistory",
      label: "Plan History Overview",
      done: true,
      notes: "Tracks all plan changes",
    },
    {
      id: "planTable",
      label: "Plan Subscription Summary Table",
      done: true,
      notes: "Active users per plan",
    },
    {
      id: "transactions",
      label: "Transactions Table / CSV Export",
      done: true,
      notes: "Export available",
    },
    {
      id: "featureUsage",
      label: "Feature Usage Stats",
      done: true,
      notes: "Feature metrics available",
    },
    {
      id: "adminMgmt",
      label: "Admin Management (Add/Remove Admins)",
      done: true,
      notes: "Optional controls",
    },
    {
      id: "topProducts",
      label: "Product Revenue / Top Selling Categories",
      done: false,
      notes: "Post-eCommerce",
    },
    {
      id: "logs",
      label: "Notifications or Logs Panel",
      done: false,
      notes: "System-level logs",
    },
    {
      id: "uiPolish",
      label: "Super Admin UI Polish",
      done: false,
      notes: "Spacing / hover effects",
    },
  ],
  "Tech & Future Polish": [
    {
      id: "token",
      label: "Token Refresh Fix",
      done: true,
      notes: "authReady handled",
    },
    {
      id: "modular",
      label: "Modularized Controllers",
      done: true,
      notes: "Admin / SuperAdmin / User",
    },
    {
      id: "components",
      label: "Reusable Components (Card, Chart, etc.)",
      done: true,
      notes: "Done",
    },
    {
      id: "stripe",
      label: "Stripe Integration",
      done: false,
      notes: "Post-MVP (test mode)",
    },
    {
      id: "email",
      label: "Email Notifications",
      done: false,
      notes: "Optional (plan upgrades)",
    },
    {
      id: "perf",
      label: "Performance & Security Check",
      done: false,
      notes: "Before public deploy",
    },
  ],
};

const uniqueId = (prefix = "") =>
  `${prefix}${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 7)}`;

export default function ProjectProgressTracker() {
  const [sections, setSections] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_SECTIONS;
    } catch {
      return DEFAULT_SECTIONS;
    }
  });

  const [collapsed, setCollapsed] = useState({});
  const [newFeatureText, setNewFeatureText] = useState({});
  const [importing, setImporting] = useState(false);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
    } catch {
      // ignore write errors
    }
  }, [sections]);

  const totals = useMemo(() => {
    let total = 0,
      done = 0;
    const sectionStats = Object.entries(sections).map(([name, items]) => {
      const t = items.length;
      const d = items.filter((i) => i.done).length;
      total += t;
      done += d;
      return { name, total: t, done: d, pct: Math.round((d / t) * 100) || 0 };
    });
    return {
      sectionStats,
      overall: { total, done, pct: Math.round((done / total) * 100) || 0 },
    };
  }, [sections]);

  const toggleFeature = (sectionName, id) => {
    setSections((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName].map((f) =>
        f.id === id ? { ...f, done: !f.done } : f
      ),
    }));
  };

  const addFeature = (sectionName) => {
    const text = (newFeatureText[sectionName] || "").trim();
    if (!text) return;
    const newItem = { id: uniqueId("c_"), label: text, done: false, notes: "" };
    setSections((prev) => ({
      ...prev,
      [sectionName]: [...prev[sectionName], newItem],
    }));
    setNewFeatureText((p) => ({ ...p, [sectionName]: "" }));
  };

  const markAll = (sectionName, value = true) => {
    setSections((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName].map((f) => ({ ...f, done: !!value })),
    }));
  };

  const resetToDefault = () => {
    if (
      !window.confirm(
        "Reset all progress and custom features? This will restore defaults."
      )
    )
      return;
    setSections(DEFAULT_SECTIONS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportJSON = () => {
    const payload = JSON.stringify(sections, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nova-cart-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file) => {
    if (!file) return;
    setImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        // naive validation: object with arrays
        const ok =
          parsed &&
          typeof parsed === "object" &&
          Object.values(parsed).every(Array.isArray);
        if (!ok) throw new Error("Invalid format");
        setSections(parsed);
        setImporting(false);
      } catch (err) {
        setImporting(false);
        alert("Failed to import: invalid file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 w-full">
          <div>
            <CardTitle>🚀 Nova-Cart Launch Readiness</CardTitle>
            <p className="text-sm text-base-content/70 mt-1">
              Track core features and polish tasks. Progress is saved locally.
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-base-content/80">Overall Progress</div>
            <div className="w-56 bg-base-200 rounded-full h-3 mt-2 overflow-hidden">
              <div
                className={`h-3 transition-all duration-500 ${
                  totals.overall.pct >= 80
                    ? "bg-green-500"
                    : totals.overall.pct >= 50
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
                style={{ width: `${totals.overall.pct}%` }}
                aria-hidden
              />
            </div>
            <div className="text-sm font-semibold mt-2">
              {totals.overall.pct}% ({totals.overall.done}/
              {totals.overall.total})
            </div>

            <div className="flex gap-2 justify-end mt-3">
              <button
                onClick={() => {
                  if (
                    !window.confirm(
                      "Mark all features across all sections as done?"
                    )
                  )
                    return;
                  const allDone = {};
                  Object.keys(sections).forEach(
                    (k) =>
                      (allDone[k] = sections[k].map((f) => ({
                        ...f,
                        done: true,
                      })))
                  );
                  setSections(allDone);
                }}
                className="btn btn-sm btn-success"
              >
                Mark All Done
              </button>
              <button onClick={resetToDefault} className="btn btn-sm btn-ghost">
                Reset
              </button>
              <button onClick={exportJSON} className="btn btn-sm btn-outline">
                Export
              </button>
              <label className="btn btn-sm btn-outline cursor-pointer">
                {importing ? "Importing..." : "Import"}
                <input
                  type="file"
                  accept="application/json"
                  onChange={(e) => importJSON(e.target.files?.[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {Object.entries(sections).map(([sectionName, items]) => {
            const doneCount = items.filter((i) => i.done).length;
            const pct = Math.round((doneCount / items.length) * 100) || 0;
            return (
              <div
                key={sectionName}
                className="border rounded-lg p-3 bg-base-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setCollapsed((p) => ({
                          ...p,
                          [sectionName]: !p[sectionName],
                        }))
                      }
                      className="text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold">
                          {sectionName}
                        </span>
                        <span className="text-sm text-base-content/60">
                          {doneCount}/{items.length}
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-36 bg-base-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 transition-all duration-500 ${
                          pct >= 80
                            ? "bg-green-500"
                            : pct >= 50
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${pct}%` }}
                        aria-hidden
                      />
                    </div>
                    <div className="text-sm text-base-content/70 font-medium">
                      {pct}%
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => markAll(sectionName, true)}
                        className="btn btn-xs btn-success"
                        title="Mark all done"
                      >
                        All
                      </button>
                      <button
                        onClick={() => markAll(sectionName, false)}
                        className="btn btn-xs btn-ghost"
                        title="Clear all"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {!collapsed[sectionName] && (
                  <div className="mt-3 space-y-3">
                    <div className="grid gap-2">
                      {items.map((f) => (
                        <label
                          key={f.id}
                          className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-base-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={!!f.done}
                              onChange={() => toggleFeature(sectionName, f.id)}
                              className="h-4 w-4 accent-indigo-600"
                            />
                            <div>
                              <div className="text-sm font-medium">
                                {f.label}
                              </div>
                              {f.notes && (
                                <div className="text-xs text-base-content/60">
                                  {f.notes}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-sm text-base-content/60">
                            {f.done ? "✅ Done" : "⬜ Pending"}
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Add new feature input */}
                    <div className="flex gap-2 mt-2">
                      <input
                        value={newFeatureText[sectionName] || ""}
                        onChange={(e) =>
                          setNewFeatureText((p) => ({
                            ...p,
                            [sectionName]: e.target.value,
                          }))
                        }
                        placeholder={`Add new feature to "${sectionName}"`}
                        className="input input-bordered flex-1"
                      />
                      <button
                        onClick={() => addFeature(sectionName)}
                        className="btn btn-primary"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
