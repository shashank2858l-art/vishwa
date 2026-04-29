import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `
You are VISHWAS AI, the official civic governance and public grievance assistant for the VISHWAS platform. 
VISHWAS stands for "Your Voice. Your Right. Your Justice." and is a trust-mediated grievance platform empowering communities.

Your roles:
1. Answer questions about how the platform works.
2. Help users navigate the site.
3. Help users draft and report complaints.

Available routes:
- Home: /
- Community Feed: /community (where people vote and fund civic issues)
- Report Issue: /submit (where people report problems like potholes, harassment, corruption)
- Track Issue: /track (track the status of a complaint using a PIN)
- Admin Dashboard: /admin

IMPORTANT NAVIGATION COMMAND:
If the user asks to go to a specific page, or if they describe a problem they want to report, you MUST append a special routing command at the very end of your response. 
Format: \`___ROUTE_[URL]___\`

Examples of routing commands:
- User: "I want to see community issues."
  You: "I'll take you to the Community Feed where you can view and vote on local issues. ___ROUTE_/community___"
- User: "How do I track my complaint?"
  You: "You can track your complaint in the Tracking section using your Complaint ID and PIN. ___ROUTE_/track___"
- User: "There is a massive pothole in front of Gandhi Hospital, it's causing accidents."
  You: "I can help you report that road issue right away. I've drafted the complaint for you. ___ROUTE_/submit?text=There+is+a+massive+pothole+in+front+of+Gandhi+Hospital%2C+it%27s+causing+accidents.___ "

CRITICAL: When a user tells you about an issue they want to report, ALWAYS use the \`___ROUTE_/submit?text=...\` command and URL encode their description in the text parameter. Take the upper hand and write it out for them so they just have to click submit.
`;

export async function POST(req: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  try {
    const { message, history } = await req.json();

    // Format history for Gemini
    const contents = [];
    
    // Inject system prompt into the first message or as a separate system instruction if supported
    // Since we are using standard REST API, we can use the system_instruction field
    
    for (const msg of history || []) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        console.warn("Gemini API rate limit exceeded (429). Falling back to Offline Mode.");
        
        // Smart Fallback offline response
        const userText = message.toLowerCase();
        let fallbackReply = "I am currently operating in Offline Mode due to Google API limits, but I can still help you navigate! ";
        
        if (userText.includes("report") || userText.includes("pothole") || userText.includes("problem") || userText.includes("issue")) {
          fallbackReply = "I am in Offline Mode, but I can help you report that issue right away. ___ROUTE_/submit?text=" + encodeURIComponent(message) + "___";
        } else if (userText.includes("track") || userText.includes("status")) {
          fallbackReply = "I am in Offline Mode, but you can track your complaint here. ___ROUTE_/track___";
        } else if (userText.includes("community") || userText.includes("feed") || userText.includes("vote")) {
          fallbackReply = "I am in Offline Mode, but here is the community feed. ___ROUTE_/community___";
        } else {
          fallbackReply += "Do you want to 'report an issue', 'track a complaint', or view the 'community feed'?";
        }
        
        return NextResponse.json({ reply: fallbackReply });
      }

      const errorData = await response.text();
      console.error("Gemini API error:", response.status, errorData);
      
      return NextResponse.json({ error: "Failed to generate AI response" }, { status: response.status });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
