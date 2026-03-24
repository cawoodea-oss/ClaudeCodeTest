import { createCalendarEvent } from "@/lib/google-calendar";

export async function POST(request) {
  const { access_token, task } = await request.json();

  if (!access_token || !task) {
    return Response.json(
      { error: "Missing access_token or task data" },
      { status: 400 }
    );
  }

  try {
    // Calculate end time based on duration
    const startTime = task.date ? new Date(task.date) : new Date();
    const endTime = new Date(startTime.getTime() + task.duration * 60 * 1000);

    const eventData = {
      title: task.title,
      description: task.priority ? `Priority: ${task.priority}` : "",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    const tokens = {
      access_token,
    };

    const calendarEvent = await createCalendarEvent(tokens, eventData);

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
