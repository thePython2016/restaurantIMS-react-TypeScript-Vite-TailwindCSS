import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from "@mui/material";

const API_BASE_URL = "http://127.0.0.1:8000";
const MESSAGE_LIMIT = 160; // max characters allowed

export default function MamboSMSUserForm() {
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [status, setStatus] = useState("");
  const { accessToken } = useAuth();

  const sendSMS = async (smsData) => {
    const headers = { "Content-Type": "application/json" };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/api/v1/sms/single/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(smsData),
        }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error ||
            result.details ||
            `HTTP error! status: ${response.status}`
        );
      return result;
    } catch (error) {
      throw error;
    }
  };

  const saveSentMessage = (recipient: string, message: string, senderId: string, status: string) => {
    try {
      const existingMessages = localStorage.getItem('sentMessages');
      const messages = existingMessages ? JSON.parse(existingMessages) : [];
      
      const currentDate = new Date().toLocaleString();
      
      const newMessage = {
        id: `${Date.now()}-single`,
        recipient: recipient,
        message: message,
        status: status,
        date: currentDate,
        senderId: senderId
      };
      
      messages.unshift(newMessage); // Add to beginning of array
      
      // Keep only the last 100 messages to prevent localStorage from getting too large
      const trimmedMessages = messages.slice(0, 100);
      
      localStorage.setItem('sentMessages', JSON.stringify(trimmedMessages));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('messageSent'));
    } catch (error) {
      console.error('Error saving sent message:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const smsData = { sender_id: senderId, message, mobile };
      await sendSMS(smsData);
      setStatus("Message sent successfully!");

      // Save sent message to localStorage
      saveSentMessage(mobile, message, senderId, 'Sent');

      // Clear form fields
      setSenderId("");
      setMobile("");
      setMessage("");

      // Clear success message after 3s
      setTimeout(() => {
        setStatus("");
      }, 3000);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3, mt: 6 }}>
      <CardContent>
        {/* Header */}
        <Typography variant="h6" gutterBottom>
          Send SMS
        </Typography>
        <Divider sx={{ mb: 3 }} />

          {/* Status Message */}
          {status && (
            <Typography
              variant="subtitle1"
              textAlign="center"
              color={status.startsWith("Error") ? "error" : "success.main"}
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              {status}
            </Typography>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Sender ID */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ minWidth: 250 }}
                >
                  <InputLabel id="sender-id-label">Sender ID</InputLabel>
                  <Select
                    labelId="sender-id-label"
                    id="sender-id-select"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    label="Sender ID"
                  >
                    <MenuItem value="">
                      <em>Select Sender ID</em>
                    </MenuItem>
                    <MenuItem value="MAMBO SMS">MAMBO SMS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Mobile */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Mobile Number"
                  variant="outlined"
                  fullWidth
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  sx={{ minWidth: 250 }}
                  placeholder="Enter mobile number (e.g. +255712345678)"
                />
              </Grid>

              {/* Message */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Message"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Enter your SMS message here..."
                  sx={{ minWidth: 500 }}
                  inputProps={{ maxLength: MESSAGE_LIMIT }} // Limit characters
                  helperText={`${message.length} / ${MESSAGE_LIMIT} characters`}
                />
              </Grid>
            </Grid>

            {/* Send Button aligned left */}
            <Box
              sx={{
                mt: 6,
                pt: 3,
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={status === "Sending..."}
                sx={{
                  px: 8,
                  py: 2,
                  minWidth: 250,
                  fontSize: "1.1rem",
                  borderRadius: "50px", // Rounded button
                }}
              >
                {status === "Sending..." ? "Sending..." : "Send SMS"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
  );
}
