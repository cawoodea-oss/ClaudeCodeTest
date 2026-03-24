import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getAuthUrl() {
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
}

export async function getTokensFromCode(code) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function createCalendarEvent(tokens, event) {
  oauth2Client.setCredentials(tokens);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const eventData = {
    summary: event.title,
    description: event.description || "",
    start: {
      dateTime: event.startTime,
      timeZone: "UTC",
    },
    end: {
      dateTime: event.endTime,
      timeZone: "UTC",
    },
  };

  try {
    const result = await calendar.events.insert({
      calendarId: "primary",
      resource: eventData,
    });
    return result.data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}
