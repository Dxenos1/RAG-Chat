import Markdown from "react-markdown";
import { ChatResponse } from "./types";

export default function ChatResponseLayout(chatResponse: ChatResponse) {
  return (
    <div className="flex flex-col items-start gap-4 text-start lg:flex-row">
      <div className="flex-1 justify-items-start rounded-lg border-2 border-solid border-gray-700 p-4 dark:bg-gray-700 w-full">
        <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
          Question
        </h1>
        {chatResponse.question}
        <h1 className="mb-4 mt-8 text-xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
          Answer
        </h1>
        <Markdown>{chatResponse.answer}</Markdown>
      </div>
      <div className="flex-1 justify-items-start rounded-lg border-2 border-solid border-gray-700 p-4 dark:bg-gray-700">
        <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
          Sources
        </h1>
        <ol className="grid w-full gap-2 text-start">
          {chatResponse.documents?.map((d) => (
            <li className="mb-2" id={d.metadata._id}>
              <span className="mb-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                <a href={d.metadata.source_url}>{d.metadata.source_url}</a>
              </span>
              <p>{d.page_content}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
