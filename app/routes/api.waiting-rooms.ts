import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { fetchWaitingRooms } from "@/api/fortunemusic/waitingRooms";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const eventId = url.searchParams.get("eventId");

  if (!eventId) {
    return json({ error: "Missing eventId" }, { status: 400 });
  }

  try {
    const data = await fetchWaitingRooms(Number(eventId));
    
    // waitingRooms is Map<number, WaitingRoom[]>
    // We convert it to array of entries: [number, WaitingRoom[]][]
    const serializedWaitingRooms = Array.from(data.waitingRooms.entries());

    return json({
      message: data.message,
      waitingRooms: serializedWaitingRooms
    });
  } catch (error) {
    console.error(error);
    return json({ error: "Failed to fetch waiting rooms" }, { status: 500 });
  }
}
