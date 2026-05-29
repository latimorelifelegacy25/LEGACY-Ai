import { Contact } from '../types';

/**
 * Parsed Google Contact representing raw response from People API
 */
export interface GoogleContactImport {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  industry: string;
  notes: string;
}

/**
 * Raw Gmail Message details
 */
export interface GmailMessagePreview {
  id: string;
  subject: string;
  snippet: string;
  date: string;
  from: string;
}

/**
 * Calendar Event interface
 */
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: string; // ISO String
  end: string;   // ISO String
}

const encodeBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const base64urlEncode = (str: string): string =>
  encodeBase64(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const sanitizeMimeHeader = (value: string): string => value.replace(/[\r\n]+/g, ' ').trim();

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Service routing all Google Workspace endpoints
 */
export const googleService = {
  /**
   * Fetch connected Google Contacts
   */
  async fetchGoogleContacts(token: string): Promise<GoogleContactImport[]> {
    const url = 'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations&pageSize=100';
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google People API failed: ${response.statusText} (${errorText})`);
    }

    const data = await response.json();
    const connections = data.connections || [];

    return connections.map((person: any) => {
      const names = person.names || [];
      const primaryName = names[0] || {};
      const firstName = primaryName.givenName || '';
      const lastName = primaryName.familyName || primaryName.displayName || '';

      const emails = person.emailAddresses || [];
      const email = emails[0]?.value || '';

      const phones = person.phoneNumbers || [];
      const phone = phones[0]?.value || '';

      const orgs = person.organizations || [];
      const primaryOrg = orgs[0] || {};
      const company = primaryOrg.name || '';
      const jobTitle = primaryOrg.title || '';

      return {
        firstName,
        lastName,
        email,
        phone,
        company,
        jobTitle,
        industry: '',
        notes: `Imported from Google Contacts on ${new Date().toLocaleDateString()}`
      };
    }).filter((c: GoogleContactImport) => c.firstName || c.lastName || c.email);
  },

  /**
   * Send a real email via Gmail API
   */
  async sendEmail(
    token: string, 
    to: string, 
    subject: string, 
    body: string
  ): Promise<any> {
    const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
    const safeTo = sanitizeMimeHeader(to);
    const safeSubject = sanitizeMimeHeader(subject);
    const safeBody = escapeHtml(body).replace(/\r?\n/g, '<br />');

    if (!safeTo) {
      throw new Error('Recipient email is required before sending via Gmail.');
    }

    const formattedSubject = `Subject: =?utf-8?B?${encodeBase64(safeSubject)}?=`;
    const mimeMessage = [
      `To: ${safeTo}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      formattedSubject,
      '',
      safeBody
    ].join('\r\n');

    const raw = base64urlEncode(mimeMessage);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gmail API failed: ${response.statusText} (${errorText})`);
    }

    return response.json();
  },

  /**
   * List message headers from a specific sender
   */
  async fetchConversations(token: string, emailAddress: string): Promise<GmailMessagePreview[]> {
    const q = encodeURIComponent(`from:${emailAddress}`);
    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${q}&maxResults=5`;
    
    const response = await fetch(listUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) return [];
    const listData = await response.json();
    const messages = listData.messages || [];

    const results: GmailMessagePreview[] = [];
    for (const msg of messages) {
      try {
        const detailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`;
        const detailRes = await fetch(detailUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          const headers = detailData.payload?.headers || [];
          const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
          const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || '';
          const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';
          
          results.push({
            id: msg.id,
            subject,
            snippet: detailData.snippet || '',
            date,
            from
          });
        }
      } catch (err) {
        console.error("Failed fetching gmail message detail:", err);
      }
    }
    return results;
  },

  /**
   * Fetch live upcoming calendar events
   */
  async fetchCalendarEvents(token: string): Promise<GoogleCalendarEvent[]> {
    const now = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=15&singleEvents=true&orderBy=startTime`;
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error(`Google Calendar Fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    const items = data.items || [];

    return items.map((item: any) => ({
      id: item.id,
      summary: item.summary || 'Untitled Event',
      description: item.description || '',
      location: item.location || '',
      start: item.start?.dateTime || item.start?.date || '',
      end: item.end?.dateTime || item.end?.date || ''
    }));
  },

  /**
   * Schedule a Calendar Event (mutating operation)
   */
  async createCalendarEvent(
    token: string,
    summary: string,
    description: string,
    startIso: string,
    durationMinutes: number
  ): Promise<any> {
    const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    
    const startDate = new Date(startIso);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    const body = {
      summary,
      description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Calendar Event insertion failed: ${response.statusText} (${errorText})`);
    }

    return response.json();
  }
};
