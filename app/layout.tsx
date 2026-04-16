import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Understand Your Catheter Needs",
  description: "Independent 2-minute catheter needs assessment by HCDR."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MHCZWSH');`
          }}
        />
        <script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="13fb076c-8dcf-491d-b24a-4fd10daaab4f"
          data-blockingmode="auto"
          type="text/javascript"
          async
        />
      </head>
      <body className={`${poppins.className} min-h-screen bg-white text-hcdr-body`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MHCZWSH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <script
          id="CookieDeclaration"
          src="https://consent.cookiebot.com/13fb076c-8dcf-491d-b24a-4fd10daaab4f/cd.js"
          type="text/javascript"
          async
        />
      </body>
    </html>
  );
}
