from langchain_core.prompts.chat import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_openai import ChatOpenAI

from operator import itemgetter

from decouple import config

from src.qdrant import vector_store

model = ChatOpenAI(
    tiktoken_model_name="gpt-4-turbo-preview",
    api_key=config("OPENAI_API_KEY"),
    temperature=0
)

prompt_template = """
Answer the question based on the context, in a concise manner and using bullet points where applicable.

Context: {context}
Question: {question}
Answer:
"""

prompt = ChatPromptTemplate.from_template(prompt_template)
retriever = vector_store.as_retriever()


def create_chain():
    chain = ({
        "context": retriever.with_config(top_k=4),
        "question": RunnablePassthrough(),
    }
        | RunnableParallel({
            "response": prompt | model,
            "context": itemgetter("context")
        })
    )

    return chain


def get_answer_and_docs(question: str):
    chain = create_chain()
    response = chain.invoke(question)
    answer = response["response"].content
    context = response["context"]
    return {
        "answer": answer,
        "context": context
    }


async def async_get_answer_and_docs(question: str):
    chain = create_chain()
    async for event in chain.astream_events(input=question, version='v1'):
        event_type = event["event"]
        if event_type == "on_retriever_end":
            yield {
                "event_type": event_type,
                "context": [doc.dict() for doc in event['data']['output']['documents']]
            }
        elif event_type == "on_chat_model_stream":
            yield {
                "event_type": event_type,
                "context": event['data']['chunk'].content
            }

    yield {
        "event_type": "done"
    }
