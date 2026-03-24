import { cookies } from "next/headers";
import { createCalendarEvent } from "@/lib/google-calendar";

export async function POST(request) {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("google_access_token")?.value;
  const { task } = await request.json();

  if (!access_token) {
    return Response.json(
      { error: "Not authenticated. Please connect to Google Calendar first." },
      { status: 401 }
    );
  }

  if (!task) {
    return Response.json(
      { error: "Missing task data" },
      { status: 400 }
    );
  }

  try {
    // Parse date and time to create start time in local timezone
    let startTime;
    if (task.date) {
      const [year, month, day] = task.date.split("-");
      let hour = 9; // Default to 9 AM
      let minute = 0;

      // If start time is provided, parse it (HH:mm format)
      if (task.startTime) {
        const [h, m] = task.startTime.split(":");
        hour = parseInt(h);
        minute = parseInt(m);
      }

      startTime = new Date(year, parseInt(month) - 1, parseInt(day), hour, minute, 0);
    } else {
      // If no date provided, use current time
      startTime = new Date();
      if (task.startTime) {
        const [h, m] = task.startTime.split(":");
        startTime.setHours(parseInt(h), parseInt(m), 0);
      }
    }

    // Calculate end time based on duration (in minutes)
    const endTime = new Date(startTime.getTime() + task.duration * 60 * 1000);

    const eventData = {
      title: task.title,
      description: task.priority ? `Priority: ${task.priority}` : "",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    console.log("Creating calendar event:", eventData);

    const tokens = {
      access_token,
    };

    const calendarEvent = await createCalendarEvent(tokens, eventData);

    console.log("Event created successfully:", calendarEvent.id);

    return Response.json({
      success: true,
      eventId: calendarEvent.id,
      calendarEventUrl: calendarEvent.htmlLink,
    });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return Response.json(
      { error: "Failed to create calendar event", details: error.message },
      { status: 500 }
    );
  }
}
