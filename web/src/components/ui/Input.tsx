import React, { useState } from 'react';
import { colors, spacing, borderRadius } from '../../constants/theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (val: string) => void;
  type?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  autoCapitalize?: string;
  autoCorrect?: boolean;
  disabled?: boolean;
}

const wrapperBase: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs,
};

const labelStyle: React.CSSProperties = {
  color: colors.textSecondary,
  fontSize: 13,
  marginBottom: spacing.xs,
  fontWeight: 500,
};

const inputWrapperStyle: React.CSSProperties = {
  backgroundColor: colors.inputBackground,
  border: `1.5px solid ${colors.border}`,
  borderRadius: borderRadius.md,
  display: 'flex',
  alignItems: 'center',
  transition: 'border-color 0.2s ease',
};

const inputBaseStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  color: colors.text,
  width: '100%',
  padding: '12px 14px',
  fontSize: 15,
  outline: 'none',
  fontFamily: 'inherit',
  resize: 'vertical',
};

const errorStyle: React.CSSProperties = {
  color: colors.error,
  fontSize: 12,
  marginTop: spacing.xs,
};

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  error,
  multiline = false,
  rows = 3,
  autoCapitalize,
  autoCorrect,
  disabled = false,
}) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChangeText(e.target.value);
  };

  const inputElement = multiline ? (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBaseStyle,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'text',
      }}
    />
  ) : (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect ? 'on' : 'off'}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBaseStyle,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'text',
      }}
    />
  );

  return (
    <div style={wrapperBase}>
      {label && <label style={labelStyle}>{label}</label>}
      <div
        style={{
          ...inputWrapperStyle,
          borderColor: focused ? colors.primary : colors.border,
        }}
      >
        {inputElement}
      </div>
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};

export default Input;
