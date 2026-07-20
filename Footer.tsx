import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg">
                W
              </div>
              <span className="font-serif text-xl font-bold text-white">WanderNest</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Curating extraordinary travel experiences for families, couples, and solo adventurers since 2018. Your journey, our passion.
            </p>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Destinations</h4>
            <ul className="space-y-2.5">
              {["Beach & Islands", "European Cities", "Mountain Treks", "Safari Adventures", "Cruise Voyages", "Cultural Tours"].map((item) => (
                <li key={item}>
                  <Link href="/packages" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {["About Us", "Our Team", "Careers", "Press", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-400 hover:text-brand-400 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5">
              {["Help Center", "Travel Insurance", "Cancellation Policy", "Payment Options", "Accessibility", "Terms of Service"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-400 hover:text-brand-400 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">&copy; 2025 WanderNest Travels. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {["Instagram", "Twitter", "Facebook", "YouTube"].map((social) => (
              <span key={social} className="text-xs text-gray-500 hover:text-brand-400 cursor-pointer transition-colors">
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
