// src/components/Chatbot.js
import React, { useState, useEffect, useRef } from "react";
import {
  Box, TextField,
  Button, IconButton,
  List, ListItem,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import axiosInstance from "../../Api/axiosInstance";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [chatbot, setChatbot] = useState("gemini");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      const endpoint = (chatbot === 'gemini') ? '/AI/generate2' : '/AI/chatbot';
      const response = await axiosInstance.post(endpoint, { prompt: input });

      const data = await response.data;
      const botMessage = { sender: "bot", text: renderMessageWithLinks(data) };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setInput("");
  };

  function renderMessageWithLinks(text) {
    const withLinks = text.replace(
      /(https?:\/\/[^\s]+)/g,
      url => {
        // Rút ngắn chỉ hiển thị phần /courses/... thay vì full URL
        const label = url.replace(/^https?:\/\/[^\/]+/, ''); // → "/courses/overview/..."
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      }
    );
    return <div dangerouslySetInnerHTML={{ __html: withLinks }} />;
  }


  return (
    <>
      {/* Nút mở chatbot */}
      {!open && (
        <IconButton
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "#0084ff",
            color: "white",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            "&:hover": { backgroundColor: "#0063cc" },
            zIndex: 1000, // Chatbot phải nằm trên cùng các components
          }}
          onClick={() => setOpen(true)}
        >
          <ChatIcon fontSize="large" />
        </IconButton>
      )}

      {/* Hộp chat */}
      {open && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 350,
            height: 500,
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            backgroundColor: "#f0f2f5",
            animation: "slideIn 0.3s ease-in-out",
            zIndex: 1000, // Chatbot phải nằm trên cùng các components
          }}
        >
          {/* Header với nút đóng */}
          <Box
            sx={{
              backgroundColor: "#0084ff",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <strong>Chatbot</strong>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <select value={chatbot} onChange={(e) => setChatbot(e.target.value)}
            style={{
              padding: "8px 12px", borderRadius: "8px",
              border: "1px solid #ccc", backgroundColor: "#fff",
              color: "#333", fontSize: "14px",
              outline: "none", appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              cursor: "pointer", margin: "10px",
              caretColor: "transparent", // 👈 NGĂN con trỏ nhấp nháy
            }}>
            <option value="gemini">Gemini</option>
            <option value="myChatbot">EnglishForceBot</option>
          </select>

          {/* Danh sách tin nhắn */}
          <List
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    maxWidth: "75%",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    wordWrap: "break-word",
                    backgroundColor:
                      msg.sender === "user" ? "#0084ff" : "#e4e6eb",
                    color: msg.sender === "user" ? "white" : "black",
                    fontSize: "14px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </Box>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>

          {/* Ô nhập tin nhắn */}
          <Box
            sx={{ display: "flex", padding: "10px", backgroundColor: "white" }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              sx={{
                borderRadius: "20px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              sx={{
                marginLeft: "10px",
                borderRadius: "50%",
                minWidth: "40px",
                height: "40px",
              }}
            >
              🚀
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chatbot;
