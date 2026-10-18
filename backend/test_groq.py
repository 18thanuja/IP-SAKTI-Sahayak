
import os
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise SystemExit("Groq API key was not found.")

client = Groq(api_key=api_key)

print("Testing Groq...", flush=True)

response = client.chat.completions.create(
    model="openai/gpt-oss-20b",
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant. Answer briefly."
        },
        {
            "role": "user",
            "content": "In one sentence, explain what a patent is."
        }
    ],
    max_completion_tokens=300,
    reasoning_effort="low",
)

choice = response.choices[0]

print("Model:", response.model)
print("Finish reason:", choice.finish_reason)
print("Answer:", repr(choice.message.content))
print("Usage:", response.usage)

if choice.message.content and choice.message.content.strip():
    print("\nGroq text generation test passed!")
else:
    print("\nNo visible answer was returned. Check the usage and finish reason.")
