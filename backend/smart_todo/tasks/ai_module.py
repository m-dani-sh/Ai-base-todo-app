def enhance_task(title, context):
    from google.generativeai import GenerativeModel, configure
    from google.api_core.exceptions import ResourceExhausted
    import os, json

    configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = GenerativeModel("gemini-1.5-flash")

    prompt = f"""
    Based on the following task, suggest AI-powered improvements.

    Title: {title}
    Context: {context}

    Respond ONLY in JSON:
    {{
      "priority": number (1-5),
      "deadline": "YYYY-MM-DD",
      "tags": ["string"],
      "enhancedDescription": "string",
      "reasoning": "string"
    }}
    """

    try:
        response = model.generate_content(prompt)
        print("✅ Gemini Response:", response.text)
        content = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(content)
    except ResourceExhausted as e:
        print("🚨 Gemini quota exceeded:", str(e))
        return {
            "priority": 3,
            "deadline": "N/A",
            "tags": [],
            "enhancedDescription": "Gemini quota exceeded.",
            "reasoning": "You've exceeded usage limits. Try again later or upgrade plan."
        }
