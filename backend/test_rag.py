
from services.rag_service import ask_question


def main():
    question = (
        "What is the purpose of the Patents Act, 1970 "
        "in India?"
    )

    print("Question:", question)
    print("\nGenerating answer...\n")

    try:
        result = ask_question(question)

        print("=" * 60)
        print("ANSWER")
        print("=" * 60)
        print(result["answer"])

        print("\n" + "=" * 60)
        print("SOURCE CITATIONS")
        print("=" * 60)

        for citation in result["citations"]:
            print(
                f"- {citation['source']}, "
                f"page {citation['page']} "
                f"(score: {citation['score']})"
            )

        print("\nRAG test completed!")

    except Exception as error:
        print("\nRAG test failed.")
        print("Error type:", type(error).__name__)
        print("Details:", str(error))


if __name__ == "__main__":
    main()
