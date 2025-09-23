const Footer = () => {
  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Blog"],
    },
    {
      title: "Products",
      links: ["Spot Trading", "Futures", "Lending", "Staking"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "API Documentation", "Status"],
    },
    {
      title: "Legal",
      links: [
        "Terms of Service",
        "Privacy Policy",
        "Risk Disclosure",
        "Cookie Policy",
      ],
    },
  ];

  return (
    <footer className="border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4 text-center">
                {section.title}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground text-center">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors text-center"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ZenithX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
