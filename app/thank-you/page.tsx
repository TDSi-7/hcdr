import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const guideUrl = "https://healthcaredeliveryreviews.co.uk";

export default function ThankYouPage() {
  return (
    <main className="bg-hcdr-warm">
      <Header />
      <section className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6">
        <div className="rounded-lg border border-hcdr-light-grey bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-bold text-hcdr-dark">Thank You — We&apos;ve Received Your Details</h1>
          <p className="mt-4 text-hcdr-body">
            A specialist catheter provider will be in touch soon to discuss your needs. In the meantime, you might
            find our free ISC guide helpful:
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={guideUrl}
              target="_blank"
              className="rounded-lg bg-hcdr-orange px-5 py-3 text-center font-semibold text-white transition hover:bg-hcdr-orange-hover"
            >
              Download the Free ISC Guide
            </Link>
            <Link href="https://healthcaredeliveryreviews.co.uk/" target="_blank" className="text-hcdr-orange-hover underline">
              Visit Healthcare Delivery Reviews
            </Link>
          </div>
          <p className="mt-4 text-sm text-hcdr-body">
            If you change your mind, you can withdraw your consent at any time by emailing
            help@healthcaredeliveryreviews.co.uk
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
