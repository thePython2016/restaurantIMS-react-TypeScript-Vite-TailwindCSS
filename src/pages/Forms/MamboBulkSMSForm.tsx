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
const MESSAGE_LIMIT = 160;

export default function BulkSMSPage() {
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [status, setStatus] = useState("");
  const { accessToken } = useAuth();

  // Predefined contact groups
  const contactGroups = {
    staff: "0622071858,0766047800",
    customers: "0778071858,0766047800",
    all: "0622071858,0766047800,0778071858"
  };

  const sendBulkSMS = async (smsData: { sender_id: string; message: string; mobile: string }) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/sms/bulk-send/`,
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

  const saveSentMessage = (recipients: string[], message: string, senderId: string, status: string) => {
    try {
      const existingMessages = localStorage.getItem('sentMessages');
      const messages = existingMessages ? JSON.parse(existingMessages) : [];
      
      const currentDate = new Date().toLocaleString();
      const recipientsList = recipients.map(recipient => recipient.trim());
      
      // Create individual entries for each recipient
      recipientsList.forEach((recipient, index) => {
        const newMessage = {
          id: `${Date.now()}-${index}`,
          recipient: recipient,
          message: message,
          status: status,
          date: currentDate,
          senderId: senderId
        };
        messages.unshift(newMessage); // Add to beginning of array
      });
      
      // Keep only the last 100 messages to prevent localStorage from getting too large
      const trimmedMessages = messages.slice(0, 100);
      
      localStorage.setItem('sentMessages', JSON.stringify(trimmedMessages));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('messageSent'));
    } catch (error) {
      console.error('Error saving sent message:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending bulk SMS...");

    try {
      const smsData = { sender_id: senderId, message, mobile };
      const result = await sendBulkSMS(smsData);
      
      setStatus(`Bulk SMS sent successfully to ${result.total_recipients} recipients!`);

      // Save sent messages to localStorage
      const recipients = mobile.split(',').filter(num => num.trim());
      saveSentMessage(recipients, message, senderId, 'Sent');

      // Clear form fields
      setSenderId("");
      setMobile("");
      setMessage("");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus("");
      }, 5000);
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Provide more user-friendly messages for specific errors
      if (errorMessage.includes('No contacts available')) {
        errorMessage = 'Phone numbers not registered with SMS service. Please contact your SMS provider to register these numbers.';
      } else if (errorMessage.includes('Failed to send bulk SMS')) {
        errorMessage = 'SMS service error. Please check your sender ID and try again.';
      }
      
      setStatus(`Error: ${errorMessage}`);
    }
  };

  // Count recipients
  const getRecipientCount = () => {
    if (mobile) {
      return mobile.split(',').filter(num => num.trim()).length;
    }
    return 0;
  };

  return (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3, mt: 6 }}>
      <CardContent>
        {/* Header */}
        <Typography variant="h6" gutterBottom>
          Send Bulk SMS
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
              >
                <InputLabel id="sender-id-label">Sender ID</InputLabel>
                <Select
                  labelId="sender-id-label"
                  id="sender-id-select"
                  value={senderId}
                                     onChange={(e) => setSenderId(e.target.value as string)}
                  label="Sender ID"
                >
                  <MenuItem value="">
                    <em>Select Sender ID</em>
                  </MenuItem>
                  <MenuItem value="MAMBO SMS">MAMBO SMS</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Contact Groups */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="contact-group-label">Quick Select Contact Group</InputLabel>
                <Select
                  labelId="contact-group-label"
                  id="contact-group-select"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value as string)}
                  label="Quick Select Contact Group"
                >
                  <MenuItem value="">
                    <em>Choose a group or enter custom numbers below</em>
                  </MenuItem>
                  <MenuItem value={contactGroups.staff}>
                    Staff Group ({contactGroups.staff.split(',').length} contacts)
                  </MenuItem>
                  <MenuItem value={contactGroups.customers}>
                    Customer Group ({contactGroups.customers.split(',').length} contacts)
                  </MenuItem>
                  <MenuItem value={contactGroups.all}>
                    All Contacts ({contactGroups.all.split(',').length} contacts)
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Custom Numbers Input */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Mobile Numbers (comma-separated)"
                variant="outlined"
                fullWidth
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value as string)}
                placeholder="e.g., 0713123456,0754789012,0765456789"
                helperText="Enter mobile numbers separated by commas (format: 0XXXXXXXXX)"
                multiline
                rows={3}
              />
            </Grid>

            {/* Recipient Count */}
            {mobile && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Recipients: {getRecipientCount()} contacts
                </Typography>
              </Grid>
            )}

            {/* Message */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Message"
                variant="outlined"
                fullWidth
                multiline
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value as string)}
                required
                placeholder="Enter your SMS message here..."
                sx={{ minWidth: 500 }}
                inputProps={{ maxLength: MESSAGE_LIMIT }}
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
              disabled={status === "Sending bulk SMS..." || !mobile || !message || !senderId}
              sx={{
                px: 8,
                py: 2,
                minWidth: 250,
                fontSize: "1.1rem",
                borderRadius: "50px", // Rounded button
              }}
            >
              {status === "Sending bulk SMS..." ? "Sending..." : "Send Bulk SMS"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}