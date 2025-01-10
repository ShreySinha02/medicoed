import { useState } from "react";
import ChatForm from "./components/ChatForm";
import Chats from "./components/Chats";
import { Message } from "./utils/types";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <>
      <section className="h-screen   w-full flex flex-col">
        <div className="flex justify-center items-center h-24 text-4xl font-semibold">
          <h1>
            Chat with <span className="text-red-600">Document</span>
          </h1>
        </div>
        <div className="m-4 p-4 border-2 rounded-lg h-[90%] shadow-gray-400 shadow-lg flex flex-col  ">
          <div className="flex-1 overflow-hidden">
            {/* Make this part scrollable */}
            <Chats messages={messages} />
          </div>
          <div className=" md:basis-60 lg:basis-32 flex">
            <ChatForm setMessages={setMessages} />
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
