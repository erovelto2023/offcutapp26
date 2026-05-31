"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Settings, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { getAllWidgetConfigs, getWidgetConfig, getWidgetsByCategory } from "@/lib/widgets/registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WidgetDataViewer from "./WidgetDataViewer";

interface WidgetInstance {
  _id: string;
  widgetType: string;
  title: string;
  config: Record<string, any>;
  order: number;
  isActive: boolean;
}

interface WidgetManagerProps {
  treeId: string;
}

export default function WidgetManager({ treeId }: WidgetManagerProps) {
  const [widgets, setWidgets] = useState<WidgetInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [configuringWidget, setConfiguringWidget] = useState<WidgetInstance | null>(null);
  const [widgetConfig, setWidgetConfig] = useState<Record<string, any>>({});
  const [viewingDataWidget, setViewingDataWidget] = useState<WidgetInstance | null>(null);

  // Widgets that collect data
  const dataCollectingWidgets = ["email_collection", "arc_reader", "coach_booking", "realtor_listing", "nonprofit_fundraiser"];

  useEffect(() => {
    fetchWidgets();
  }, [treeId]);

  const fetchWidgets = async () => {
    try {
      const res = await fetch(`/api/widgets?treeId=${treeId}`);
      if (!res.ok) throw new Error("Failed to load widgets");
      const data = await res.json();
      setWidgets(data);
    } catch (err) {
      toast.error("Failed to load widgets");
    } finally {
      setLoading(false);
    }
  };

  const handleAddWidget = async (widgetType: string) => {
    try {
      const defaultConfig = getWidgetConfig(widgetType)?.defaultConfig || {};
      const res = await fetch("/api/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treeId,
          widgetType,
          config: defaultConfig,
        }),
      });

      if (!res.ok) throw new Error("Failed to add widget");

      toast.success("Widget added successfully");
      setShowAddModal(false);
      fetchWidgets();
    } catch (err) {
      toast.error("Failed to add widget");
    }
  };

  const handleDeleteWidget = async (widgetId: string) => {
    if (!confirm("Are you sure you want to delete this widget?")) return;

    try {
      const res = await fetch(`/api/widgets?id=${widgetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete widget");

      toast.success("Widget deleted successfully");
      fetchWidgets();
    } catch (err) {
      toast.error("Failed to delete widget");
    }
  };

  const handleSaveConfig = async () => {
    if (!configuringWidget) return;

    try {
      const res = await fetch("/api/widgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: configuringWidget._id,
          config: widgetConfig,
        }),
      });

      if (!res.ok) throw new Error("Failed to save widget configuration");

      toast.success("Widget configuration saved");
      setConfiguringWidget(null);
      fetchWidgets();
    } catch (err) {
      toast.error("Failed to save widget configuration");
    }
  };

  const categories = ["all", "engagement", "showcase", "booking", "commerce", "content"];
  const allWidgets = getAllWidgetConfigs();
  const filteredWidgets =
    selectedCategory === "all"
      ? allWidgets
      : getWidgetsByCategory(selectedCategory as any);

  if (loading) {
    return <div className="p-6 text-center text-zinc-500">Loading widgets...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Widget List */}
      <Card className="border-white/10 bg-zinc-900/40">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-white">Active Widgets</CardTitle>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-violet-600 hover:bg-violet-500 text-white gap-2"
          >
            <Plus className="w-4 h-4" /> Add Widget
          </Button>
        </CardHeader>
        <CardContent>
          {widgets.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              No widgets added yet. Click "Add Widget" to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {widgets.map((widget) => (
                <div
                  key={widget._id}
                  className="flex items-center gap-3 p-4 bg-zinc-950/60 border border-white/5 rounded-xl hover:border-white/10 transition-all"
                >
                  <GripVertical className="w-5 h-5 text-zinc-600 cursor-move" />
                  <div className="flex-1">
                    <div className="text-white font-medium">{widget.title || getWidgetConfig(widget.widgetType)?.title}</div>
                    <div className="text-zinc-500 text-xs">{getWidgetConfig(widget.widgetType)?.description}</div>
                  </div>
                  {dataCollectingWidgets.includes(widget.widgetType) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewingDataWidget(widget)}
                      className="text-zinc-400 hover:text-green-400"
                      title="View Results"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setConfiguringWidget(widget);
                      setWidgetConfig(widget.config);
                    }}
                    className="text-zinc-400 hover:text-white"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteWidget(widget._id)}
                    className="text-zinc-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Widget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-4xl border-white/10 bg-zinc-900/95 backdrop-blur-xl max-h-[90vh] overflow-hidden flex flex-col">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-white">Add Widget</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              {/* Category Filter */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-violet-600 text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Widget Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWidgets.map((widget) => (
                  <button
                    key={widget.widgetType}
                    onClick={() => handleAddWidget(widget.widgetType)}
                    className="p-4 bg-zinc-950/60 border border-white/5 hover:border-violet-500/50 rounded-xl text-left transition-all group"
                  >
                    <div className="text-2xl mb-2">{widget.icon}</div>
                    <div className="text-white font-medium mb-1">{widget.title}</div>
                    <div className="text-zinc-500 text-xs">{widget.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t border-white/5 flex justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Configure Widget Modal */}
      {configuringWidget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-2xl border-white/10 bg-zinc-900/95 backdrop-blur-xl max-h-[90vh] overflow-hidden flex flex-col">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-white">
                Configure {getWidgetConfig(configuringWidget.widgetType)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {Object.entries(widgetConfig).map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, " $1").trim();

                // Special handling for collectionName - dropdown
                if (key === "collectionName") {
                  return (
                    <div key={key} className="space-y-2">
                      <Label className="text-zinc-300 text-sm capitalize">{label}</Label>
                      <select
                        value={value as string}
                        onChange={(e) => setWidgetConfig({ ...widgetConfig, [key]: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50"
                      >
                        <option value="newsletter">Newsletter</option>
                        <option value="updates">Updates</option>
                        <option value="announcements">Announcements</option>
                        <option value="tips">Tips</option>
                        <option value="exclusive">Exclusive Content</option>
                      </select>
                    </div>
                  );
                }

                // Special handling for boolean values
                if (typeof value === "boolean") {
                  return (
                    <div key={key} className="space-y-2">
                      <Label className="text-zinc-300 text-sm capitalize">{label}</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={key}
                            checked={value === true}
                            onChange={() => setWidgetConfig({ ...widgetConfig, [key]: true })}
                            className="w-4 h-4 accent-violet-500"
                          />
                          <span className="text-zinc-300 text-xs">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={key}
                            checked={value === false}
                            onChange={() => setWidgetConfig({ ...widgetConfig, [key]: false })}
                            className="w-4 h-4 accent-violet-500"
                          />
                          <span className="text-zinc-300 text-xs">No</span>
                        </label>
                      </div>
                    </div>
                  );
                }

                // Special handling for buttonColor - color picker
                if (key === "buttonColor") {
                  return (
                    <div key={key} className="space-y-2">
                      <Label className="text-zinc-300 text-sm capitalize">Button Color</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={value as string}
                          onChange={(e) => setWidgetConfig({ ...widgetConfig, [key]: e.target.value })}
                          className="w-12 h-10 rounded border border-white/10 bg-zinc-950 cursor-pointer"
                        />
                        <Input
                          value={value as string}
                          onChange={(e) => setWidgetConfig({ ...widgetConfig, [key]: e.target.value })}
                          className="bg-zinc-950 border-white/10 text-white flex-1"
                          placeholder="#8b5cf6"
                        />
                      </div>
                    </div>
                  );
                }

                // Default text input
                return (
                  <div key={key} className="space-y-2">
                    <Label className="text-zinc-300 text-sm capitalize">{label}</Label>
                    <Input
                      value={value as string}
                      onChange={(e) => setWidgetConfig({ ...widgetConfig, [key]: e.target.value })}
                      className="bg-zinc-950 border-white/10 text-white"
                    />
                  </div>
                );
              })}
            </CardContent>
            <div className="p-4 border-t border-white/5 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setConfiguringWidget(null)}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveConfig}
                className="bg-violet-600 hover:bg-violet-500 text-white"
              >
                Save Configuration
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* View Data Modal */}
      {viewingDataWidget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-6xl border-white/10 bg-zinc-900/95 backdrop-blur-xl max-h-[90vh] overflow-hidden flex flex-col">
            <CardHeader className="pb-4 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-white">
                {getWidgetConfig(viewingDataWidget.widgetType)?.title} - Results
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewingDataWidget(null)}
                className="text-zinc-400 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              <WidgetDataViewer treeId={treeId} widgetId={viewingDataWidget._id} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
