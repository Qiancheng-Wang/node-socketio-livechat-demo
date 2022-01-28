import {useEffect, useState} from "react";

const Chat = ({socket, username, room} ) => {
  
    const [currentMessage, setCurrentMessage] = useState("")
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages((prev) => [ ...prev, data])
        })
    }, [socket])

    const sendMessage = async () => {
        if(currentMessage !== ""){
            const messageData = {
                room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }

            await socket.emit("send_message", messageData)
            setMessages((prev) => [ ...prev, messageData])
        }
    }

  return (
    <div className="chat-window">
        <div className="chat-header">
            <p>live chat</p>
        </div>
        <div className="chat-body">
        {
            messages.map( (m, index) => {
                return <div className="message" key={index} id={username === m.author ? "you" : "other"}>
                    <div>
                        <div className="message-content"><p>{m.message}</p></div>
                        <div className="message-meta">
                            <p id="time">{m.time}</p>
                            <p id="author">{m.author}</p>
                        </div>
                    </div>
                </div>
            })
        }
        </div>
        <div className="chat-footer">
            <input 
                type="text" 
                placeholder="input anything you like" 
                onChange={(e) => setCurrentMessage(e.target.value) } 
            />
            <button onClick={() => sendMessage()}>Send</button>
        </div>
    </div>
  );
}

export default Chat;
