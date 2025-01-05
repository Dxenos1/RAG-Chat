import { ChangeEvent, FormEvent, useState } from "react";
import "./App.css";
import { ChatResponse, Message } from "./types";
import api from "./api";
import ChatForm from "./ChatForm";
import ChatResponseLayout from "./ChatResponse";

function App() {
  const [formData, setFormData] = useState<Message>({ message: "" });
  const [chatResponse, setChatResponse] = useState<ChatResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmitForm(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    //const websocket = new WebSocket("ws://localhost:8000/async_chat");
    //websocket.onopen = () => {
    //  websocket.send(formData.message);
    //};
    //
    //websocket.onmessage = (event) => {
    //  const data = JSON.parse(event.data);
    //  if (data.event_type == "on_retriever_end") {
    //    setChatResponse((prevChatResponse) => ({
    //      question: formData.message,
    //      answer: prevChatResponse!.answer,
    //      documents: data.content,
    //    }));
    //  } else if (data.event_type == "on_chat_model_stream") {
    //    setChatResponse((prevChatResponse) => ({
    //      question: formData.message,
    //      answer: prevChatResponse!.answer + data.content,
    //      documents: prevChatResponse?.documents,
    //    }));
    //  }
    //};
    //
    //websocket.onclose = () => {
    //  setIsLoading(false);
    //};
    //
    const response = await api.post("chat", formData);
    const responseData = await response.data;

    setChatResponse(responseData);
    setFormData({ message: "" });
    setIsLoading(false);
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setFormData((prevFormData) => {
      return { ...prevFormData, message: e.target.value };
    });
  }

  const responseDataContent = chatResponse ? (
    <ChatResponseLayout {...chatResponse} />
  ) : (
    <></>
  );

  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold">RAG Chat Demo</h1>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ChatForm
          handleSubmitForm={handleSubmitForm}
          handleChange={handleChange}
          formData={formData}
          isLoading={isLoading}
        />
        {responseDataContent}
      </div>
    </>
  );
}

export default App;
