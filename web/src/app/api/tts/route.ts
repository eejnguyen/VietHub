import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string" || text.length > 500) {
      return NextResponse.json(
        { error: "Invalid text parameter (max 500 chars)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "TTS not configured" },
        { status: 503 }
      );
    }

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: "vi-VN",
            name: "vi-VN-Wavenet-A",
            ssmlGender: "FEMALE",
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 0.9,
            sampleRateHertz: 22050,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Google TTS error:", err);
      return NextResponse.json(
        { error: "TTS generation failed" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const audioContent = data.audioContent; // base64

    // Return as audio
    const buffer = Buffer.from(audioContent, "base64");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
