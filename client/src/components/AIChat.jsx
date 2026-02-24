import { useState } from "react";
import api from "../services/api"; // make sure this exists
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";

const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // 🔥 important

      const res = await api.post(
        "/ai/chat",
        { message: userMessage.text },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const aiMessage = { sender: "ai", text: res.data.reply };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("AI Error:", error);

      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "AI service error." }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#1976d2",
          color: "#fff"
        }}
      >
        <SmartToyIcon />
      </IconButton>

      {open && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 20,
            width: 350,
            height: 450,
            display: "flex",
            flexDirection: "column",
            p: 2,
            zIndex: 2000
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">AI Assistant</Typography>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", mt: 2, mb: 1 }}>
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  mb: 1
                }}
              >
                <Typography
                  sx={{
                    backgroundColor:
                      msg.sender === "user" ? "#1976d2" : "#f1f1f1",
                    color: msg.sender === "user" ? "#fff" : "#000",
                    display: "inline-block",
                    px: 2,
                    py: 1,
                    borderRadius: 2
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}

            {loading && (
              <Typography variant="body2">AI is thinking...</Typography>
            )}
          </Box>

          <TextField
            size="small"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about workflows..."
          />

          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={sendMessage}
          >
            Send
          </Button>
        </Paper>
      )}
    </>
  );
};

export default AIChat;