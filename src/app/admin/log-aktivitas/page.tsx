import React from "react";
import { getActivityLogs } from "../actions";
import LogAktivitasClient from "./LogAktivitasClient";

export const revalidate = 0; // Disable cache for logs page

export default async function ActivityLogsPage() {
  let logs: any[] = [];
  try {
    logs = await getActivityLogs();
  } catch (error) {
    console.error("Failed to query activity logs:", error);
  }

  // Convert prisma dates/types to plain JSON for client serialization
  const serializedLogs = JSON.parse(JSON.stringify(logs));

  return <LogAktivitasClient initialLogs={serializedLogs} />;
}
