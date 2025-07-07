# tasks/context_ai.py
import os
import json
from google.generativeai import GenerativeModel, configure
from google.api_core.exceptions import ResourceExhausted

# ✅ Configure Gemini with your API key (from environment variable for security)
configure(api_key=os.getenv("GEMINI_API_KEY"))


def extract_tags(context_text: str) -> list[str]:
    """
    Uses Gemini to extract 3 to 5 useful tags from a block of context.
    """
    model = GenerativeModel("gemini-1.5-flash")

    prompt = f"""
    Analyze the following context and generate 3 to 5 useful tags that represent its key themes or categories.

    Context:
    \"\"\"{context_text}\"\"\"

    Respond with a plain list of comma-separated tags like:
    urgent, planning, client, budget, design
    """

    try:
        response = model.generate_content(prompt)
        print("✅ Gemini Tag Response:", response.text)

        # Clean the output into a list of tags
        text = response.text.strip()
        tags = [tag.strip().lower().replace("#", "") for tag in text.replace("\n", ",").split(",") if tag.strip()]
        return tags

    except ResourceExhausted as e:
        print("🚨 Gemini quota exceeded:", str(e))
        return ["general", "ai", "context"]
