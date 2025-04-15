import { Container } from '../components';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { io } from "socket.io-client";

const socket = io("https://mukulkasana0001.github.io/Server_repo/");

function App() {

  const state = useSelector((state) => state.auth.status);
  const  userData= useSelector((state) => state.auth.userData);
  console.log(userData);
  const [todos, settodos] = useState([])
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);



  // Listen for messages
  useEffect(() => {
    socket.on("receive_message", (data) => {

      settodos((prevTodos) => {
        data = userData.name+" :: "+ data;
        const updatedTodos = [...prevTodos, data];
        // const updatedTodos=[]
        localStorage.setItem("todos", JSON.stringify(updatedTodos));
        return updatedTodos;
      });

      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", message);
      setMessage("");
    }
  };

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    settodos(storedTodos);
  }, []);


  if (!state) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                Login to read posts
              </h1>
            </div>
          </div>
        </Container>
      </div>
    )
  }
  else {
    return (
      <div className="p-2">
        {/* <h2 className="text-2xl font-bold mb-3 ">CHAT APPLICATION 💬 </h2> */}

        <div className=" items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>


        <div className="p-4 bg-blue-100 w-full">
          <h5 className="text-lg font-semibold mb-2">💬 Messages</h5>
          <div className="flex justify-end p-4 bg-blue-100 w-full">
            <div className="space-y-2 max-w-md w-full">
              <ul className="space-y-2 text-right">
                {todos.length === 0 ?
                  (<li className="text-gray-500 italic underline">No messages yet 💬</li>
                  ) :
                  (
                    todos.map((todo, index) => (
                      <li key={index} className="bg-blue-100 px-4 py-2 rounded-md shadow-md break-words"> {todo} 💬</li>
                    )))
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default App;


