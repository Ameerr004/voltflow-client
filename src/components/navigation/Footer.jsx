// Shared footer used across the public/user pages.
const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">bolt</span>
        <span className="label-md uppercase">© 2024 VoltFlow Logistics</span>
      </div>
      <nav className="footer-links label-md">
        <a className="text-muted" href="#">Privacy</a>
        <a className="text-muted" href="#">Terms</a>
        <a className="text-muted" href="#">Support</a>
      </nav>
    </div>
  </footer>
);

export default Footer;
