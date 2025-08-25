import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function BulkSMSForm() {
  const { accessToken } = useAuth();
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const numbers = recipients.split(',').map(num => num.trim()).filter(num => num);
      
      if (!message.trim()) {
        throw new Error('Message is required');
      }
      
      if (numbers.length === 0) {
        throw new Error('At least one phone number is required');
      }

      if (!accessToken) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch('http://127.0.0.1:8000/api/send-sms/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ 
          message, 
          recipients: numbers 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send SMS');
      }

      const result = await response.json();
      setSuccess(`SMS sent successfully to ${numbers.length} recipients!`);
      
      // Reset form on success
      setMessage('');
      setRecipients('');
      
    } catch (err) {
      setError(err.message || 'Failed to send SMS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const recipientCount = recipients ? recipients.split(',').filter(num => num.trim()).length : 0;

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#333'
    },
    title: {
      fontSize: '1.8rem',
      margin: '0 0 0.5rem 0',
      color: '#2c3e50'
    },
    subtitle: {
      fontSize: '1rem',
      margin: '0',
      color: '#7f8c8d'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontWeight: '600',
      color: '#34495e',
      fontSize: '0.95rem'
    },
    textarea: {
      padding: '0.75rem',
      border: '2px solid #e1e8ed',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '100px',
      transition: 'border-color 0.2s ease',
      outline: 'none'
    },
    textareaFocus: {
      borderColor: '#3498db'
    },
    input: {
      padding: '0.75rem',
      border: '2px solid #e1e8ed',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      transition: 'border-color 0.2s ease',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#3498db'
    },
    charCount: {
      fontSize: '0.85rem',
      color: '#7f8c8d',
      textAlign: 'right',
      marginTop: '0.25rem'
    },
    charCountOver: {
      color: '#e74c3c',
      fontWeight: 'bold'
    },
    recipientCount: {
      fontSize: '0.85rem',
      color: '#27ae60',
      marginTop: '0.25rem'
    },
    button: {
      padding: '1rem 2rem',
      background: 'linear-gradient(135deg, #3498db, #2980b9)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      minHeight: '50px'
    },
    buttonDisabled: {
      background: '#bdc3c7',
      cursor: 'not-allowed'
    },
    buttonHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)'
    },
    spinner: {
      width: '18px',
      height: '18px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    alert: {
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontSize: '0.95rem'
    },
    alertSuccess: {
      background: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    alertError: {
      background: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    },
    tips: {
      marginTop: '2rem',
      padding: '1rem',
      background: '#f8f9fa',
      borderRadius: '8px',
      borderLeft: '4px solid #3498db'
    },
    tipsTitle: {
      margin: '0 0 0.5rem 0',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#2c3e50'
    },
    tipsList: {
      margin: '0',
      paddingLeft: '1rem',
      fontSize: '0.85rem',
      color: '#5a6c7d'
    },
    tipsItem: {
      marginBottom: '0.25rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📱 Bulk SMS</h1>
        <p style={styles.subtitle}>Send messages to multiple recipients</p>
      </div>

      {success && (
        <div style={{...styles.alert, ...styles.alertSuccess}}>
          ✅ {success}
        </div>
      )}

      {error && (
        <div style={{...styles.alert, ...styles.alertError}}>
          ❌ {error}
        </div>
      )}

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Message *</label>
          <textarea 
            value={message} 
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message here..."
            style={styles.textarea}
            maxLength={160}
            required
          />
          <div style={{
            ...styles.charCount,
            ...(message.length > 160 ? styles.charCountOver : {})
          }}>
            {message.length}/160 characters
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Numbers *</label>
          <input 
            value={recipients} 
            onChange={e => setRecipients(e.target.value)}
            placeholder="Comma-separated phone numbers: +254712345678, +254723456789"
            style={styles.input}
            required
          />
          {recipientCount > 0 && (
            <div style={styles.recipientCount}>
              📊 {recipientCount} recipient{recipientCount !== 1 ? 's' : ''} detected
            </div>
          )}
        </div>

        <button 
          type="submit"
          onClick={handleSubmit}
          disabled={loading || !message.trim() || !recipients.trim()}
          style={{
            ...styles.button,
            ...(loading || !message.trim() || !recipients.trim() ? styles.buttonDisabled : {})
          }}
        >
          {loading ? (
            <>
              <div style={styles.spinner}></div>
              Sending SMS...
            </>
          ) : (
            <>
              📤 Send SMS
              {recipientCount > 0 && ` (${recipientCount})`}
            </>
          )}
        </button>
      </form>

      <div style={styles.tips}>
        <div style={styles.tipsTitle}>💡 Tips:</div>
        <ul style={styles.tipsList}>
          <li style={styles.tipsItem}>Use international format: +254712345678</li>
          <li style={styles.tipsItem}>Separate multiple numbers with commas</li>
          <li style={styles.tipsItem}>Keep messages under 160 characters for single SMS</li>
          <li style={styles.tipsItem}>Test with a few numbers first</li>
        </ul>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .bulk-sms-form input:focus,
        .bulk-sms-form textarea:focus {
          border-color: #3498db !important;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }
        
        .bulk-sms-form button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
        }
        
        @media (max-width: 768px) {
          .bulk-sms-form {
            margin: 1rem;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default BulkSMSForm;