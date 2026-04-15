import Link from "next/link";
import { SmartImage } from "./SmartImage";

export function Footer() {
  const links = [
    ["Write a Review", "https://healthcaredeliveryreviews.co.uk/write-review/"],
    ["Contact Us", "https://healthcaredeliveryreviews.co.uk/contact-us/"],
    ["Privacy Policy", "https://healthcaredeliveryreviews.co.uk/privacy-policy/"],
    ["Reviewer Guidelines", "https://healthcaredeliveryreviews.co.uk/reviewer-guidelines/"],
    ["Terms & Conditions", "https://healthcaredeliveryreviews.co.uk/terms-conditions/"],
    ["Stoma Care", "https://healthcaredeliveryreviews.co.uk/stoma-care/"],
    ["Verified Provider", "https://healthcaredeliveryreviews.co.uk/verified-provider/"],
    ["Site Map", "https://healthcaredeliveryreviews.co.uk/site-map/"]
  ] as const;

  return (
    <footer className="mt-10">
      <div className="bg-hcdr-light-grey py-8">
        <div className="mx-auto flex max-w-5xl justify-center px-4 md:px-6">
          <SmartImage
            src="/images/footer-logo.png"
            alt="Healthcare Delivery Reviews"
            width={320}
            height={72}
            className="h-auto w-[220px] md:w-[320px]"
            fallbackSrc="https://healthcaredeliveryreviews.co.uk/wp-content/uploads/2019/06/before-footer-logo-new.png"
          />
        </div>
      </div>
      <div className="bg-hcdr-dark px-4 py-8 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:flex-wrap md:justify-center md:gap-x-6 md:gap-y-3">
            {links.map(([label, href]) => (
              <Link key={label} href={href} target="_blank" className="text-sm text-white hover:text-hcdr-orange">
                {label}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-[#999999]">
            ©2026. Healthcare Delivery Reviews. All Rights Reserved. Registered In England: 12890632
          </p>
        </div>
      </div>
    </footer>
  );
}
