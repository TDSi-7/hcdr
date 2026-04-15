export type InsightCardContent = {
  topic: "comfort" | "hygiene" | "reorder" | "discretion" | "choice";
  title: string;
  body: string;
};

const q3ToTopic: Record<string, InsightCardContent["topic"]> = {
  discomfort: "comfort",
  uti_worry: "hygiene",
  reorder_hassle: "reorder",
  discretion: "discretion",
  no_choice: "choice"
};

const q6ToTopic: Record<string, InsightCardContent["topic"]> = {
  comfort: "comfort",
  easy_reorder: "reorder",
  hygiene: "hygiene",
  discretion: "discretion",
  best_option: "choice"
};

const q3Cards: Record<string, InsightCardContent> = {
  discomfort: {
    topic: "comfort",
    title: "Comfort starts with the right coating and size",
    body: "Catheter discomfort is common, and often fixable. Uncoated, hydrophilic-coated, and pre-lubricated designs can feel very different in daily use. Size, length, and fit also matter. A specialist provider can help you explore alternatives that may improve comfort through NHS prescribing."
  },
  uti_worry: {
    topic: "hygiene",
    title: "Reducing your UTI risk through catheter choice and routine",
    body: "UTI worries are very common. Single-use catheters, hydrophilic coatings, and closed-system designs can help reduce contamination and friction risks. Routine factors also matter, including frequency and hydration. A specialist provider can review your full routine and discuss practical options."
  },
  reorder_hassle: {
    topic: "reorder",
    title: "There's a simpler way to manage your supplies",
    body: "If reordering is stressful, specialist home-delivery suppliers can usually handle repeat prescription administration with your GP and deliver to your door on schedule. This is available through the NHS and can remove the day-to-day burden of manual ordering."
  },
  discretion: {
    topic: "discretion",
    title: "Discreet options that fit into your life",
    body: "Discretion concerns are understandable. Compact catheter formats, ready-to-use options, disposal accessories, and plain outer packaging can make public use and home delivery feel more comfortable. A specialist provider can walk through discreet product pathways for your routine."
  },
  no_choice: {
    topic: "choice",
    title: "You have more choice than you might think",
    body: "Many people are not told they can discuss alternatives. You can ask your healthcare team about different catheter options and can choose specialist supply routes for delivery and support. Product samples may also be available to help informed decisions with your clinician."
  }
};

const q6Cards: Record<string, InsightCardContent> = {
  comfort: {
    topic: "comfort",
    title: "A note on comfort",
    body: "You flagged comfort as your top priority. Coating type, tip design, and size all affect feel. Hydrophilic and pre-lubricated options are designed to reduce friction, and a specialist provider can help identify a better fit."
  },
  easy_reorder: {
    topic: "reorder",
    title: "A note on easier reordering",
    body: "You highlighted simpler reordering. Specialist suppliers can usually manage repeat prescriptions and deliver to your home on a regular schedule through the NHS, helping reduce admin and missed collections."
  },
  hygiene: {
    topic: "hygiene",
    title: "A note on hygiene",
    body: "You prioritised hygiene. Single-use hydrophilic and closed-system options may help reduce contamination risk, especially outside the home. A specialist provider can discuss what suits your routine."
  },
  discretion: {
    topic: "discretion",
    title: "A note on discretion",
    body: "You prioritised discretion. Compact products and plain-packaging delivery routes are commonly available. It can be worth discussing options that better match your day-to-day activities."
  },
  best_option: {
    topic: "choice",
    title: "Finding the right fit",
    body: "You want confidence in your current option. There are many catheter formats and features, and specialist providers can explain practical differences so you can make informed choices with your healthcare team."
  }
};

export function getResultCards(q3Value?: string, q6Value?: string): InsightCardContent[] {
  if (!q3Value || !q6Value) {
    return [];
  }
  const cards: InsightCardContent[] = [];
  const primary = q3Cards[q3Value];
  const supplementary = q6Cards[q6Value];

  if (primary) {
    cards.push(primary);
  }

  const primaryTopic = q3ToTopic[q3Value];
  const supplementaryTopic = q6ToTopic[q6Value];
  if (supplementary && primaryTopic !== supplementaryTopic) {
    cards.push(supplementary);
  }

  return cards;
}

export function getSupplyNudge(q7Value?: string): string | null {
  if (q7Value === "collect") {
    return "💡 Did you know? You do not have to collect supplies in person. Specialist providers can deliver to your door and usually handle repeat prescription admin with your GP.";
  }
  if (q7Value === "unsure") {
    return "💡 Worth knowing: even if someone else manages your supplies now, you can still choose specialist support with home delivery and dedicated contacts.";
  }
  if (q7Value === "mix") {
    return "💡 Tip: specialist home-delivery routes can often manage the full repeat prescription cycle and reduce pharmacy trips.";
  }
  return null;
}
