import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

console.log("ElevenLabs TTS Edge Function init");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { textToSpeak, voiceId } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    const TARGET_VOICE_ID = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default Adam voice, pick one you like

    if (!ELEVENLABS_API_KEY) {
      throw new Error("ElevenLabs API key is not set in environment variables.");
    }
    if (!textToSpeak) {
      throw new Error("textToSpeak is required.");
    }

    console.log(`Generating audio for text: "${textToSpeak.substring(0, 50)}..." using voice ID: ${TARGET_VOICE_ID}`);

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${TARGET_VOICE_ID}`;

    const response = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: textToSpeak,
        model_id: "eleven_multilingual_v2", // Or another model like "eleven_turbo_v2.5"
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          // style: 0.0, // for eleven_multilingual_v2, style exaggeration can be used
          // use_speaker_boost: true, // for eleven_multilingual_v2
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("ElevenLabs API Error:", response.status, errorBody);
      throw new Error(`ElevenLabs API request failed with status ${response.status}: ${errorBody}`);
    }

    const audioArrayBuffer = await response.arrayBuffer();
    // For now, just return the audio directly. TODO: Save to Supabase Storage and return URL.
    // const audioBlob = new Blob([audioArrayBuffer], { type: 'audio/mpeg' });

    return new Response(audioArrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    });

  } catch (error) {
    console.error("Error in ElevenLabs TTS Edge Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

/* 
TODO:
1. Securely store and retrieve ELEVENLABS_API_KEY from Supabase secrets.
2. Implement saving the returned audio to Supabase Storage.
3. Return the public URL of the stored audio file.
4. Potentially log to voice_synthesis table.
5. Add more robust error handling and input validation.
6. Allow selection of different voices and models via request parameters.
*/ 