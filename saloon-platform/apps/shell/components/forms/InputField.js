import React from 'react';
import styles from './InputField.module.css'; // Assuming a CSS module for styling

const InputField = ({ label, type, id, value, onChange, required, error }) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={error ? styles.inputError : ''}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default InputField;
