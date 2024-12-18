export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <p className="text-muted-foreground">
              SchoolMarket is your trusted platform for buying and selling within the school community.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="text-muted-foreground hover:text-primary">
                  Products
                </a>
              </li>
              <li>
                <a href="/sellers" className="text-muted-foreground hover:text-primary">
                  Sellers
                </a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground">Email: support@schoolmarket.com</p>
              <p className="text-muted-foreground">Phone: (123) 456-7890</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SchoolMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}