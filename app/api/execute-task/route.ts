import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { description, agent, model, maxTokens } = await req.json();

    // Use the provided model and maxTokens, or fall back to defaults
    const selectedModel = model || process.env.NEXT_PUBLIC_DEFAULT_MODEL;
    const selectedMaxTokens = maxTokens || 500;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: agent,
          },
          {
            role: "system",
            content: `# Ignore Words from Vocabulary List
                Never use below words or minimize the use to avoid making it sound robotic:
                delve, dive, deep, (most common) tapestry, intriguing, holistic, intersection, not only ... but ... (standard inversions), dancing metaphores,Site specific: (shipping) - navigate into, sail into the future(research) - ethical considerations, area, realm, in the field of (even if it already knows the field), in the <> of (completely unecessary), in the age of, in the search of.At the end of almost every long essay prompt: Paragraph idea: Save the world, make the world better, in the future, it is essential to <>.In essence, may seem counterintuitive
        
                # Output Instructions
                Write the note in markdown format using various sections such as tables, >, *italics*, **bold**, headings from # to ######, internal note links to common keywords or keywords which should be explored further for the note in Wikipedia style`,
          },
          {
            role: "user",
            content: description,
          },
        ],
        max_tokens: selectedMaxTokens,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to execute task");
    }

    return NextResponse.json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error("Failed to execute task:", error);
    return NextResponse.json(
      { error: "Failed to execute task" },
      { status: 500 }
    );
  }
} 