import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <p className="text-muted-foreground text-sm">
              Medang Market is your trusted platform for buying and selling
              within the school community.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/products"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/sellers"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Sellers
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/faq"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
            <div className="space-y-2">
              <Link
                href="mailto:medangmarket@gmail.com"
                className="text-muted-foreground hover:underline hover:text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center text-sm">
                  medangmarket@gmail.com
                </div>
              </Link>
              <Link
                href="https://wa.me/6289683094141"
                className="text-muted-foreground hover:underline hover:text-green-500 mt-2"
              >
                <div className="flex items-center text-sm mt-2">
                  <FaWhatsapp size={18} className="mr-2" />{" "}
                  {/* <span>(+62) 896-8309-4141</span> */}
                  <span>rzq.lasv</span>
                </div>
              </Link>
              <Link
                href="https://wa.me/6285891732172"
                className="text-muted-foreground hover:underline hover:text-green-500 mt-2"
              >
                <div className="flex items-center text-sm mt-2">
                  <FaWhatsapp size={18} className="mr-2" />{" "}
                  {/* <span>(+62) 858-9178-3172</span> */}
                  <span>halo.huddin</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>
            &copy; {new Date().getFullYear()} Medang Market. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
