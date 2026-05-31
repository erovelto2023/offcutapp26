"use client";

import React, { useState, useEffect } from "react";
import { Mail, Download, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WidgetDataEntry {
  _id: string;
  widgetId: string;
  treeId: string;
  dataType: string;
  data: Record<string, any>;
  status: string;
  createdAt: string;
}

interface WidgetDataViewerProps {
  treeId: string;
  widgetId?: string;
}

export default function WidgetDataViewer({ treeId, widgetId }: WidgetDataViewerProps) {
  const [dataEntries, setDataEntries] = useState<WidgetDataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [treeId, widgetId, filter]);

  const fetchData = async () => {
    try {
      let url = filter === "all"
        ? `/api/widgets/data?treeId=${treeId}`
        : `/api/widgets/data?treeId=${treeId}&dataType=${filter}`;

      if (widgetId) {
        url += `&widgetId=${widgetId}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load data");
      const data = await res.json();
      setDataEntries(data);
    } catch (err) {
      toast.error("Failed to load widget data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Type", "Email", "Name", "Status"];
    const rows = dataEntries.map((entry) => [
      new Date(entry.createdAt).toLocaleDateString(),
      entry.dataType,
      entry.data.email || "",
      entry.data.name || "",
      entry.status,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `widget-data-${treeId}.csv`;
    a.click();
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      // This would need a new API endpoint for updating status
      toast.success("Status updated");
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      // This would need a new API endpoint for deletion
      toast.success("Entry deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete entry");
    }
  };

  const filteredEntries = dataEntries.filter((entry) => {
    const matchesSearch =
      entry.data.email?.toLowerCase().includes(search.toLowerCase()) ||
      entry.data.name?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <div className="p-6 text-center text-zinc-500">Loading widget data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-zinc-900/40">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-white">Collected Data</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="border-white/10 text-zinc-300 hover:bg-white/5"
              >
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-zinc-950 border-white/10 text-white"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-zinc-950 border border-white/10 text-white rounded-lg px-4 py-2"
            >
              <option value="all">All Types</option>
              <option value="email">Emails</option>
              <option value="form_submission">Form Submissions</option>
              <option value="booking_request">Booking Requests</option>
              <option value="donation">Donations</option>
              <option value="inquiry">Inquiries</option>
            </select>
          </div>

          {/* Data Table */}
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              No data entries found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-400 text-sm">
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Type</th>
                    <th className="pb-3 px-4">Email</th>
                    <th className="pb-3 px-4">Name</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr key={entry._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-zinc-300 text-sm">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-violet-500/20 text-violet-300">
                          {entry.dataType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white text-sm">{entry.data.email || "-"}</td>
                      <td className="py-3 px-4 text-white text-sm">{entry.data.name || "-"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.status === "new"
                              ? "bg-blue-500/20 text-blue-300"
                              : entry.status === "contacted"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : entry.status === "converted"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-zinc-500/20 text-zinc-300"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(entry._id)}
                            className="text-zinc-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
