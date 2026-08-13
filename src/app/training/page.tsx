import { getTrainings } from "../admin/actions";
import TrainingClient from "./TrainingClient";

export const revalidate = 3600; // ISR static caching (auto-invalidated on admin updates via revalidatePath)

export default async function TrainingPage() {
  const trainings = await getTrainings();
  return <TrainingClient initialTrainings={JSON.parse(JSON.stringify(trainings))} />;
}
