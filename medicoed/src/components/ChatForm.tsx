import { useState } from "react";

import { ChatFormProps,inputEnvent,Message, textArea } from "../utils/types";

function ChatForm({setMessages}:ChatFormProps) {
  const [file,setFile]=useState<File | null>(null)
  const [chat,setChat]=useState<Message>({'type':'user','message':''})
  const [loading,setLoading]=useState<boolean>(false)
  const [chatLoading,setChatLoading]=useState<boolean>(false)

  

  const handleChange = async (e: inputEnvent) => {
    e.preventDefault();

    
    try {
      setLoading(true)
      if (e.target.files) {
        setFile(e.target.files[0]);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
  
        const res = await fetch('http://127.0.0.1:5000/api/upload-and-chat', {
          method: 'POST',
          body: formData,
        });
  
        if (res.ok) {
          const data = await res.json();
          alert(data.message);  // Display the message from the server response
        } else {
          alert(`Error: ${res.status} ${res.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);  // Log detailed error info
      alert('An unexpected error occurred while uploading the file.');
    }
    finally{
      setLoading(false)
     
    }
  };
  
  const handleChat=(e:textArea)=>{
    e.preventDefault()
    setChat((prev)=>({...prev,message:e.target.value}))

  }
  const handleSubmit = async () => {
    const body = {
      filename: file?.name,
      message: chat?.message,
    };
    setMessages((prev)=>[...prev,chat])
  
    try {
      setChatLoading(true)
      const res = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body), // Convert the body object to JSON
      });
  
      if (!res.ok) {
        // Handle errors
        // alert(`Error: ${res.status} ${res.statusText}`);
        const errorData = await res.json();
       alert("Error details:"+ errorData);
        return;
      }
      const data = await res.json(); // Parse the JSON response
      setMessages((prev)=>[...prev,data])
     
    } catch (error) {
      // Handle network errors
     alert("Network error:"+ error);
    }
    finally{
      setChatLoading(false)
      setChat({'type':'user','message':''})
    }
  };
  return (
    <div className="flex flex-1 flex-col sm:flex-row justify-around items-center gap-4 py-4 border-t">
    {/* Document Selector */}
    <div className="flex flex-col items-start w-full sm:w-1/2 md:w-auto">
      <label className="mb-1 font-medium text-gray-700">Select Document</label>
      <input 
        accept=".pdf" 
        onChange={handleChange} 
        type="file" 
        className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full sm:w-auto"
      />
      {loading&&<h1>Loading</h1>}
    </div>
  
    {/* Language Selector */}
    <div className="flex flex-col items-start w-full sm:w-1/2 md:w-auto">
      <label className="mb-1 font-medium text-gray-700">Select Language</label>
      <select className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full sm:w-auto">
        <option>English</option>
      </select>
    </div>
  
    {/* Text Area for Message */}
    <div className="flex w-full md:w-2/3 lg:w-80 h-auto">
      <textarea 
        value={chat?.message}   
        onChange={handleChat} 
        placeholder="Enter your message..." 
        className="w-full border border-gray-300 rounded-md p-2 resize-none"
      />
    </div>
  
    {/* Submit Button */}
    <div className="w-full sm:w-auto text-center">
      <button 
        onClick={handleSubmit} 
        className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6 py-2 text-sm font-semibold"
        disabled={chatLoading}
      >
       {chatLoading? 'wait...':'Submit'}
      </button>
    </div>
  </div>
  
  )
}

export default ChatForm;