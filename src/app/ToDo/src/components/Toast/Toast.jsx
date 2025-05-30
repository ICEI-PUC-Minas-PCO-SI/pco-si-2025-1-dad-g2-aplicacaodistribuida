import './Toast.css';

const Toast = ({ visible, message, type, position = 'bottom' }) => {
  if (!visible) return null;

  return (
    <div className={`toast ${type} ${position}`}>
      {message}
    </div>
  );
};

export default Toast;
