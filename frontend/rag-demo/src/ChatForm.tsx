import { ChangeEvent, FormEvent } from "react";
import { Message } from "./types";

interface ChatFormProps {
  handleSubmitForm: (e: FormEvent) => void;
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  formData: Message;
  isLoading: boolean;
}

export default function ChatForm({
  handleSubmitForm,
  handleChange,
  formData,
  isLoading,
}: ChatFormProps) {
  return (
    <form onSubmit={handleSubmitForm}>
      <textarea
        name="message"
        id="message"
        rows={4}
        cols={50}
        className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-zinc-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="What would you like to chat about today...?"
        value={formData.message}
        onChange={handleChange}
      />
      <button
        type="submit"
        disabled={isLoading || formData.message.length === 0}
        className="rounded bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? "Answering..." : "Chat"}
      </button>
    </form>
  );
}
