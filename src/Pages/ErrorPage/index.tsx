import "./style.css";

export default function index() {
  return (
    <div className="error-page">
      <h1>Oops</h1>
      <p className="message">
        <span className="status">404</span> - Page Not Found!
      </p>
    </div>
  );
}
