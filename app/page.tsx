import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";

export default function HomePage() {
  const faqItems = [
    {
      question: "Are catheters supposed to hurt?",
      answer:
        "Some discomfort during intermittent catheterisation is common, particularly for new users or when using a catheter that does not suit you well. However, ongoing catheter pain, burning, or irritation is not something you simply have to live with. Different catheter types, including hydrophilic and gel-lubricated options, are designed to reduce discomfort. A specialist catheter provider can discuss what might work better for your situation."
    },
    {
      question: "How can I make catheterisation more comfortable?",
      answer:
        "Comfort during catheterisation depends on several factors: the type of catheter you use, the lubrication method, your technique, and how well the product suits your anatomy. Many people find that switching to a different catheter type makes a noticeable difference. Our quiz helps you identify your comfort priorities so that a specialist provider can recommend appropriate options to discuss with your healthcare professional."
    },
    {
      question: "Is this quiz a medical assessment?",
      answer:
        "No. This quiz asks about your preferences, frustrations, and daily routine, not your medical history or symptoms. It is not a diagnostic tool and does not recommend specific products. If you are experiencing significant or worsening catheter pain, please speak to your doctor, nurse, or continence specialist."
    }
  ];

  const quizCovers = [
    {
      title: "Your catheter experience",
      body: "How long you've been catheterising, how often, and where you find it hardest to manage your routine"
    },
    {
      title: "What frustrates you most",
      body: "Whether that's catheter pain, irritation, infection worries, reordering hassle, or lack of choice in what you're given"
    },
    {
      title: "What would make the biggest difference",
      body: "More comfort and less irritation, simpler supplies, fewer infection concerns, or more discreet products"
    },
    {
      title: "Your current supply setup",
      body: "How you receive your catheter supplies now and how satisfied you are with your current provider"
    }
  ];

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
            <h1 className="text-3xl font-bold text-hcdr-dark md:text-4xl">
              Catheter Pain or Discomfort? Understand What Could Help
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-hcdr-body">
              A free, independent 2-minute quiz that helps you identify what matters most in your catheter routine,
              including comfort, and shows you what support is available.
            </p>
            <ul className="mt-6 space-y-2 text-hcdr-body">
              <li>✓ Independent — we don&apos;t sell catheters or represent any brand</li>
              <li>✓ Private — your answers are confidential and protected</li>
              <li>✓ Free — no cost, no obligation, takes under 2 minutes</li>
            </ul>
            <Link
              href="/quiz"
              className="mt-6 inline-block w-full rounded-lg bg-hcdr-orange px-6 py-3 text-center font-semibold text-white transition hover:bg-hcdr-orange-hover md:w-auto"
            >
              Start Quiz
            </Link>
            <p className="mt-6 leading-relaxed text-hcdr-body">
              If your catheter hurts, causes irritation, or simply feels uncomfortable, you&apos;re not alone. Many
              catheter users experience ongoing discomfort but aren&apos;t sure whether different products, techniques,
              or specialist support could help. This short quiz covers your catheter routine, your biggest
              frustrations, what would make the most difference, and how you currently receive your supplies. Based on
              your answers, we&apos;ll show you personalised insights and, if you&apos;d like, connect you with specialist
              providers who can discuss your comfort options, all at no cost through the NHS.
            </p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-hcdr-dark">What This Quiz Covers</h2>
          <p className="mt-3 text-hcdr-body">In under 2 minutes, you&apos;ll answer 8 straightforward questions about:</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {quizCovers.map((item, index) => (
              <article key={item.title} className="rounded-lg border border-hcdr-light-grey bg-hcdr-warm-bg p-4">
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-hcdr-orange text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-hcdr-dark">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-hcdr-body">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-hcdr-dark">Common Questions</h2>
          <div className="mt-5 space-y-3">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-lg border border-hcdr-light-grey bg-white p-4">
                <summary className="cursor-pointer list-none font-medium text-hcdr-dark [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.question}
                    <span className="text-hcdr-orange transition group-open:rotate-180">▾</span>
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-hcdr-body">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-10 text-hcdr-body">
          <p>
            Healthcare Delivery Reviews is the UK&apos;s independent review platform for prescription appliance
            providers. We don&apos;t sell products or represent any brand.
          </p>
        </div>
        <div className="mt-8 border-t border-[#E5E5E5] pt-5 text-[13px] text-[#999999]">
          <p>
            <strong>Please note:</strong> This quiz is for informational purposes only and does not constitute medical
            advice. If you are experiencing significant or worsening pain during catheterisation, please speak to your
            doctor, nurse, or healthcare professional before making any changes. This quiz does not diagnose
            conditions or recommend specific products.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
