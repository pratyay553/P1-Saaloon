import styles from './FormGroup.module.css';

const FormGroup = ({ label, children, htmlFor }) => {
  return (
    <div className={styles.formGroup}>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
    </div>
  );
};

export default FormGroup;
