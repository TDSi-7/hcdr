import Link from "next/link";
import { SmartImage } from "./SmartImage";

export function Header() {
  const base = "https://healthcaredeliveryreviews.co.uk";
  const links = [
    { label: "Write Review", href: `${base}/write-review/` },
    { label: "Read Reviews", href: `${base}/read-reviews/` },
    {
      label: "Find A Provider",
      href: `${base}/find-provider/`,
      children: [
        ["Ainsworth", "/provider/ainsworth/"],
        ["Amcare", "/provider/amcare/"],
        ["Bladder & Bowel Community", "/provider/bladder-bowel-home-delivery-service/"],
        ["Brunlea", "/provider/brunlea-surgical-supplies/"],
        ["Bullen", "/provider/bullen-healthcare/"],
        ["Coloplast Charter", "/provider/coloplast-charter/"],
        ["Emerald Prescription Service", "/provider/emerald-prescription-service/"],
        ["Fittleworth", "/provider/fittleworth/"],
        ["GoldCare", "/provider/goldcare/"],
        ["Medilink", "/provider/salts-medilink/"],
        ["Moorland Surgical", "/provider/moorland-surgical/"],
        ["Nightingale", "/provider/nightingale/"],
        ["Nucare", "/provider/nucare/"],
        ["Patient Choice", "/provider/patient-choice/"],
        ["Rapidcare", "/provider/rapidcare/"],
        ["Renew Medical", "/provider/renew-medical/"],
        ["Respond Healthcare", "/provider/respond/"],
        ["Script Easy", "/provider/script-easy/"],
        ["SecuriCare", "/provider/securicare/"],
        ["Select Home Delivery", "/provider/select-home-delivery/"],
        ["South Yorkshire OS", "/provider/south-yorkshire-ostomy-supplies/"],
        ["Teleflex", "/provider/teleflex-care/"],
        ["Vyne", "/provider/vyne/"]
      ] as Array<[string, string]>
    },
    { label: "Stoma Care", href: `${base}/stoma-care/` },
    { label: "Catheter Guide", href: `${base}/the-ultimate-guide-to-intermittent-self-catheterisation/` },
    { label: "About", href: `${base}/about-us/` }
  ];

  return (
    <header className="border-b border-[#E5E5E5] bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href={`${base}/`} aria-label="Go to home">
          <SmartImage
            src="/images/logo.png"
            alt="Healthcare Delivery Reviews"
            width={200}
            height={58}
            className="h-auto w-[170px] md:w-[200px]"
            fallbackSrc="https://healthcaredeliveryreviews.co.uk/wp-content/uploads/2019/06/logo-main.png"
            priority
          />
        </Link>
        <Link
          href={`${base}/write-review/`}
          target="_blank"
          className="hidden rounded-md bg-hcdr-orange px-4 py-2 text-sm font-medium text-white transition hover:bg-hcdr-orange-hover md:inline-flex"
        >
          Write review
        </Link>
      </div>
      <nav className="mx-auto hidden w-full max-w-5xl px-4 pb-3 md:block md:px-6">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-hcdr-dark">
          {links.map((item) => (
            <li key={item.label} className="group relative">
              <Link href={item.href} target="_blank" className="hover:text-hcdr-orange">
                {item.label}
              </Link>
              {item.children ? (
                <div className="invisible absolute left-0 top-full z-20 mt-2 max-h-72 w-72 overflow-auto rounded-md bg-white p-2 opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition group-hover:visible group-hover:opacity-100">
                  {item.children.map(([label, path]) => (
                    <Link
                      key={label}
                      href={`${base}${path}`}
                      target="_blank"
                      className="block rounded px-2 py-1 text-sm hover:bg-hcdr-orange-light hover:text-hcdr-orange-hover"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
      <details className="border-t border-[#E5E5E5] md:hidden">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-hcdr-dark">Menu</summary>
        <div className="space-y-2 px-4 pb-4">
          {links.map((item) => (
            <details key={item.label} className="rounded border border-hcdr-light-grey">
              <summary className="cursor-pointer px-3 py-2 text-sm font-medium">{item.label}</summary>
              <div className="space-y-1 px-3 pb-2">
                <Link href={item.href} target="_blank" className="block text-sm text-hcdr-orange-hover underline">
                  Open {item.label}
                </Link>
                {item.children?.map(([label, path]) => (
                  <Link key={label} href={`${base}${path}`} target="_blank" className="block text-sm text-hcdr-body">
                    {label}
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </div>
      </details>
    </header>
  );
}
