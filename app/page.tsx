import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";

export default function HomePage() {
  return (
    <main className="bg-white">
      <Header />
      <section className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg">
            <SmartImage
              src="/images/quiz-welcome.png"
              alt="Welcome to the catheter needs assessment"
              width={900}
              height={700}
              className="h-auto w-full rounded-lg object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-hcdr-dark md:text-4xl">Understand Your Catheter Needs</h1>
            <p className="mt-4 text-lg leading-relaxed text-hcdr-body">
              A free, independent 2-minute quiz to help you identify your priorities and discover what support is
              available to you.
            </p>
            <ul className="mt-6 space-y-2 text-hcdr-body">
              <li>✓ Independent — we don&apos;t sell products</li>
              <li>✓ Private — your data is protected</li>
              <li>✓ Free — no cost, no obligation</li>
            </ul>
            <Link
              href="/quiz"
              className="mt-6 inline-block w-full rounded-lg bg-hcdr-orange px-6 py-3 text-center font-semibold text-white transition hover:bg-hcdr-orange-hover md:w-auto"
            >
              Start Quiz
            </Link>
          </div>
        </div>

        <div className="mt-10 space-y-4 text-hcdr-body">
          <p>
            This short quiz asks about your catheter routine, what frustrates you, and what matters most. Based on
            your answers, we&apos;ll show you personalised insights and, if you&apos;d like, connect you with specialist
            providers who can help.
          </p>
          <p>
            Healthcare Delivery Reviews is the UK&apos;s independent review platform for prescription appliance
            providers. We don&apos;t sell products or represent any brand.
          </p>
        </div>
        <div className="mt-8 border-t border-[#E5E5E5] pt-5 text-[13px] text-[#999999]">
          <p>
            <strong>Please note:</strong> This quiz is for informational purposes only and does not constitute medical
            advice. It is not intended to diagnose any condition or recommend any specific product. Always consult
            your doctor, nurse, or healthcare professional before making any changes to your catheter routine or
            products.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
