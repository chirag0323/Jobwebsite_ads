import "./globals.css";

export const metadata = {
  title: "Opportunity Hub | Find your next role",
  description: "Browse current job openings and apply directly.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><header><a className="brand" href="/">Opportunity<span>Hub</span></a><nav><a href="/">Open roles</a></nav></header>{children}<footer>© {new Date().getFullYear()} Opportunity Hub · New opportunities, clearly presented.<span className="footer-links"><a href="/about">About</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></span></footer></body></html>;
}
