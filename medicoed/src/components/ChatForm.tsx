import { useState } from "react";
import { ChatFormProps, inputEnvent, Message, textArea } from "../utils/types";

function ChatForm({ setMessages }: ChatFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [chat, setChat] = useState<Message>({ type: 'user', message: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);

  const handleChange = async (e: inputEnvent) => {
    setFileError(null); 
    e.preventDefault();

    try {
      setLoading(true); 
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        
        const formData = new FormData();
        formData.append('file', selectedFile);

        const res = await fetch('http://127.0.0.1:5000/api/upload-and-chat', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setFileError(null); 
          alert(data.message); 
        } else {
          const errorData = await res.json();
          setFileError(`Error: ${errorData.message || res.statusText}`); 
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error); 
      setFileError('An unexpected error occurred while uploading the file.');
    } finally {
      setLoading(false); 
    }
  };

  const handleChat = (e: textArea) => {
    setChatError(null);
    e.preventDefault();
    setChat((prev) => ({ ...prev, message: e.target.value }));
  };

  const handleSubmit = async () => {
    let valid = true;

    if (!file) {
      setFileError("Please select a file.");
      valid = false;
    }
    if (!chat.message.trim()) {
      setChatError("Please enter a message.");
      valid = false;
    }
    if (!valid) return;

    const body = {
      filename: file?.name,
      message: chat?.message,
    };
    setMessages((prev) => [...prev, chat]);

    try {
      setChatLoading(true);
      const res = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setChatError("Error details: " + errorData.message || res.statusText);
        return;
      }
      const data = await res.json();
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      setChatError("Network error: " + error);
    } finally {
      setChatLoading(false);
      setChat({ type: 'user', message: '' });
    }
  };

  return (
    <div className="flex flex-1 flex-col sm:flex-row justify-around items-center gap-4 py-4 border-t">
     
      <div className="flex flex-col items-start w-full sm:w-1/2 md:w-auto">
        <label className="mb-1 font-medium text-gray-700">Select Document</label>
        <input 
          accept=".pdf" 
          onChange={handleChange} 
          type="file" 
          className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full sm:w-auto"
        />
        {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
        {loading && <p className="text-gray-500 text-sm mt-1">Uploading...</p>}
      </div>

     
      <div className="flex flex-col items-start w-full sm:w-1/2 md:w-auto">
        <label className="mb-1 font-medium text-gray-700">Select Language</label>
        <select className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full sm:w-auto">
          <option>English</option>
        </select>
      </div>

     
      <div className="flex w-full md:w-2/3 lg:w-80 h-auto flex-col">
        <textarea 
          value={chat.message}   
          onChange={handleChat} 
          placeholder="Enter your message..." 
          className="w-full border border-gray-300 rounded-md p-2 resize-none"
        />
        {chatError && <p className="text-red-500 text-sm mt-1">{chatError}</p>}
      </div>

     
      <div className="w-full sm:w-auto text-center">
        <button 
          onClick={handleSubmit} 
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6 py-2 text-sm font-semibold"
          disabled={chatLoading}
        >
          {chatLoading ? 'Wait...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

export default ChatForm;
