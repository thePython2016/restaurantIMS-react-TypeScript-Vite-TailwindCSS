import os
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from openai import OpenAI

# Initialize OpenAI client (key from environment, not hardcoded!)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@api_view(["POST"])
@permission_classes([AllowAny])
def chatbot_response(request):
    user_message = request.data.get("message", "")

    if not user_message:
        return JsonResponse({"error": "No message provided"}, status=400)

    try:
        print(f"OpenAI API Key present: {bool(os.getenv('OPENAI_API_KEY'))}")  # Debug log
        print(f"User message: {user_message}")  # Debug log
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # small + cheap, works well
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message},
            ],
        )
        answer = response.choices[0].message.content
        print(f"OpenAI response: {answer}")  # Debug log
        return JsonResponse({"response": answer})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
