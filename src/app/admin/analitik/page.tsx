import React from "react";
import { getVisitorLogs } from "../actions";
import AnalitikClient from "./AnalitikClient";

export const revalidate = 0; // Disable caching

export default async function AnalyticsPage() {
  let visitors: any[] = [];
  try {
    visitors = await getVisitorLogs();
  } catch (error) {
    console.error("Failed to query visitor analytics:", error);
  }

  // Convert prisma dates/types to plain JSON for client serialization
  const serializedVisitors = JSON.parse(JSON.stringify(visitors));

  return <AnalitikClient initialVisitors={serializedVisitors} />;
}
