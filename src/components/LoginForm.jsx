import React, { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔄 Attempting login with real API...');
      
      // Call real API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          remember_me: rememberMe
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Login successful!', data);
        console.log('User:', data.user);
        console.log('Token received:', data.access_token ? 'Yes' : 'No');
        
        // Store token in localStorage
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Show success message
        setError('');
        console.log('🎉 Authentication successful! Redirecting to dashboard...');
        
      } else {
        console.log('❌ Login failed:', data.message);
        setError(data.message || 'Login failed. Please try again.');
      }
      
    } catch (error) {
      console.error('🔥 Login error:', error);
      setError('Connection error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '12px',
    },
    formContainer: {
      maxWidth: '400px',
      width: '100%',
      backgroundColor: 'white',
      padding: '32px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    logo: {
      width: '48px',
      height: '48px',
      backgroundColor: '#3b82f6',
      borderRadius: '50%',
      margin: '0 auto 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: 'white',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: '0 0 8px 0',
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '14px',
      margin: 0,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
    },
    inputContainer: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    passwordInput: {
      paddingRight: '40px',
    },
    showPasswordBtn: {
      position: 'absolute',
      right: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6b7280',
      fontSize: '14px',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px',
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    checkbox: {
      width: '16px',
      height: '16px',
    },
    forgotPassword: {
      color: '#3b82f6',
      textDecoration: 'none',
    },
    submitBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    submitBtnHover: {
      backgroundColor: '#2563eb',
    },
    submitBtnDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
    },
    error: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '12px',
      borderRadius: '6px',
      fontSize: '14px',
    },
    demoCredentials: {
      backgroundColor: '#fffbeb',
      border: '1px solid #fed7aa',
      padding: '16px',
      borderRadius: '6px',
      marginTop: '16px',
    },
    demoTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#92400e',
      margin: '0 0 8px 0',
    },
    demoText: {
      fontSize: '12px',
      color: '#92400e',
      margin: '4px 0',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <div style={styles.logo}>🏘️</div>
          <h2 style={styles.title}>Sign in to Smart Village</h2>
          <p style={styles.subtitle}>
            Enter your credentials to access the management system
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              style={styles.input}
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.inputContainer}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                style={{...styles.input, ...styles.passwordInput}}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                style={styles.showPasswordBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div style={styles.checkboxContainer}>
            <div style={styles.checkboxGroup}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                style={styles.checkbox}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>

            <a href="#" style={styles.forgotPassword}>
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.username || !formData.password}
            style={{
              ...styles.submitBtn,
              ...(loading || !formData.username || !formData.password ? styles.submitBtnDisabled : {})
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
            Don't have an account?{' '}
            <a href="#" style={styles.forgotPassword}>
              Contact your administrator
            </a>
          </div>
        </form>

        {/* Demo credentials */}
        <div style={styles.demoCredentials}>
          <h4 style={styles.demoTitle}>Demo Credentials</h4>
          <div style={styles.demoText}>
            <p style={styles.demoText}><strong>SuperAdmin:</strong> superadmin / SmartVillage2025!</p>
            <p style={styles.demoText}><strong>Admin:</strong> admin / admin123</p>
            <p style={styles.demoText}><strong>User:</strong> user / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

