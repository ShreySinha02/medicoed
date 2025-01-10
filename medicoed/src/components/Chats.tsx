import { Message } from "../utils/types";

function Chats({ messages }: { messages: Message[] }) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Message copied to clipboard!");
    });
  };

  // Function to save message as a text file
  const handleSave = (text: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "message.txt";
    link.click();
  };

  return (
    <div className="flex h-full max-h-full flex-col space-y-2 p-4 overflow-y-auto">
      {messages.map((message, i) => (
        <div
          key={i}
          className={`${
            message.type === "user"
              ? "bg-red-500 self-end text-white"
              : "bg-gray-300 self-start text-black"
          } rounded-3xl p-4 box-border max-w-[80%] sm:max-w-[50%] break-words relative`}
        >
          <span>{message.message}</span>

          {message.type !== "user" && (
            <div className="flex flex-row space-x-2 text-gray-700 mt-4">
              <span
                className="cursor-pointer hover:underline"
                onClick={() => handleCopy(message.message)}
              >
                Copy
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => handleSave(message.message)}
              >
                Save
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Chats;
