// components/ImageMigrationDashboard.tsx
"use client";

import { useState, useEffect } from "react";

interface MigrationStatus {
  job: {
    id: string;
    status: string;
    totalEscorts: number;
    processedEscorts: number;
    totalImages: number;
    uploadedImages: number;
    failedImages: number;
    startedAt: string;
    completedAt?: string;
    errors: string[];
    currentBatch: number;
  };
  progress: {
    escorts: string;
    images: string;
    percentage: string;
  };
  isProcessing: boolean;
  isPaused: boolean;
}

export default function ImageMigrationDashboard() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [batchSize, setBatchSize] = useState(5);
  const [maxEscorts, setMaxEscorts] = useState(0);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/firebase/migrate-images/status");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Failed to fetch status:", error);
    }
  };

  const startMigration = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/firebase/migrate-images/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchSize,
          maxEscorts: maxEscorts || undefined,
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
      }
    } catch (error) {
      console.error("Failed to start migration:", error);
    }
    setLoading(false);
  };

  const pauseMigration = async () => {
    await fetch("/api/firebase/migrate-images/pause", { method: "POST" });
    await fetchStatus();
  };

  const resumeMigration = async () => {
    await fetch("/api/firebase/migrate-images/resume", { method: "POST" });
    await fetchStatus();
  };

  const cancelMigration = async () => {
    if (confirm("Are you sure you want to cancel the migration?")) {
      await fetch("/api/firebase/migrate-images/cancel", { method: "POST" });
      await fetchStatus();
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Image Migration Dashboard</h1>

      {/* Controls */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-3">Migration Controls</h2>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Batch Size</label>
            <input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              className="border rounded px-2 py-1 w-24"
              min="1"
              max="20"
              disabled={status?.isProcessing}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Max Escorts (0=all)</label>
            <input
              type="number"
              value={maxEscorts}
              onChange={(e) => setMaxEscorts(parseInt(e.target.value))}
              className="border rounded px-2 py-1 w-24"
              min="0"
              disabled={status?.isProcessing}
            />
          </div>
        </div>

        <div className="flex gap-3">
          {!status?.isProcessing ? (
            <button
              onClick={startMigration}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Starting..." : "Start Migration"}
            </button>
          ) : (
            <>
              {status?.isPaused ? (
                <button
                  onClick={resumeMigration}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Resume Migration
                </button>
              ) : (
                <button
                  onClick={pauseMigration}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Pause Migration
                </button>
              )}
              <button
                onClick={cancelMigration}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel Migration
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status Display */}
      {status && status.job && (
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Migration Status</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Job ID:</span>
              <span className="font-mono text-sm">{status.job.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`font-semibold ${
                  status.job.status === "completed"
                    ? "text-green-600"
                    : status.job.status === "failed"
                      ? "text-red-600"
                      : status.job.status === "paused"
                        ? "text-yellow-600"
                        : "text-blue-600"
                }`}
              >
                {status.job.status.toUpperCase()}
              </span>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{status.progress.percentage}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-500 rounded-full h-4 transition-all"
                  style={{ width: status.progress.percentage }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-600">Escorts</div>
                <div className="font-semibold">{status.progress.escorts}</div>
              </div>
              <div>
                <div className="text-gray-600">Images</div>
                <div className="font-semibold">{status.progress.images}</div>
              </div>
              <div>
                <div className="text-gray-600">Failed Images</div>
                <div className="font-semibold text-red-600">
                  {status.job.failedImages}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Current Batch</div>
                <div className="font-semibold">{status.job.currentBatch}</div>
              </div>
            </div>

            {status.job.startedAt && (
              <div className="text-sm text-gray-500">
                Started: {new Date(status.job.startedAt).toLocaleString()}
              </div>
            )}

            {status.job.completedAt && (
              <div className="text-sm text-gray-500">
                Completed: {new Date(status.job.completedAt).toLocaleString()}
              </div>
            )}

            {status.job.errors.length > 0 && (
              <div className="mt-4">
                <div className="text-red-600 font-semibold mb-2">
                  Errors ({status.job.errors.length})
                </div>
                <div className="bg-red-50 p-3 rounded max-h-40 overflow-auto">
                  {status.job.errors.slice(0, 10).map((error, i) => (
                    <div key={i} className="text-sm text-red-600 mb-1">
                      • {error}
                    </div>
                  ))}
                  {status.job.errors.length > 10 && (
                    <div className="text-sm text-gray-500">
                      ... and {status.job.errors.length - 10} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
