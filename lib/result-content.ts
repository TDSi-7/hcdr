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
    body: `Catheter discomfort is one of the most common issues and one of the most fixable. Not all catheters feel the same, and small differences in design can make a big difference to your daily experience.

There are three main types of catheter surface: <strong>uncoated</strong> (which require separate lubricating gel), <strong>hydrophilic-coated</strong> (which become slippery when activated with water), and <strong>pre-lubricated/gel-reservoir</strong> (which are ready to use straight from the packet). Hydrophilic and pre-lubricated catheters are specifically designed to reduce friction during insertion and removal, which can significantly improve comfort, particularly if you're catheterising several times a day.

Catheter <strong>length and size (French gauge)</strong> also matter. A catheter that's too large can cause unnecessary pressure, while one that's too small may not drain effectively. Women can often use shorter, more compact catheters that are easier to handle.

A specialist provider can review your current catheter and discuss alternatives that may be more comfortable — without changing your prescription process. This is a free, no-obligation conversation.`
  },
  uti_worry: {
    topic: "hygiene",
    title: "Reducing your UTI risk through catheter choice and routine",
    body: `Recurrent UTIs are one of the biggest concerns for catheter users, and you're not alone in worrying about them. While no catheter can eliminate infection risk entirely, some features are specifically designed to help reduce it.

<strong>Single-use catheters</strong> are recommended over reusable ones because they reduce bacterial exposure. If you're currently reusing catheters due to supply issues, this is worth raising with your provider.

<strong>Hydrophilic-coated catheters</strong> create a smooth, low-friction surface that can reduce microtrauma to the urethra during insertion, and microtrauma is one of the pathways through which bacteria can enter the urinary tract. Some evidence suggests hydrophilic catheters may be associated with lower UTI rates compared to uncoated alternatives.

<strong>Closed-system catheters</strong> (also called no-touch or enclosed catheters) keep the catheter inside a protective sleeve, so you never directly handle the tube that enters your body. This can be particularly useful when catheterising in less hygienic environments like public toilets or at work.

Beyond the catheter itself, ensuring you're catheterising <strong>frequently enough</strong> to avoid overfilling the bladder, and drinking adequate fluids throughout the day, are two of the most effective ways to reduce infection risk. A specialist provider can review your full routine and discuss whether any product or technique changes might help with hygiene or infection management. This is a free, no-obligation conversation.`
  },
  reorder_hassle: {
    topic: "reorder",
    title: "There's a simpler way to manage your supplies",
    body: `If reordering feels like a constant battle, chasing your GP, managing repeat prescriptions, or dealing with missed deliveries, you're experiencing one of the most common frustrations among catheter users. But it doesn't have to be this way.

<strong>Specialist Dispensing Appliance Contractors (DACs)</strong> can manage your entire prescription process for you. They liaise directly with your GP to handle your repeat prescription, then deliver your supplies to your door on a schedule that works for you, often monthly, with reminders before each delivery so you can adjust quantities if needed.

This service is <strong>free through the NHS</strong>. You don't pay anything extra, and your catheter supplies remain fully funded. The difference is that instead of you managing the process, a dedicated team handles it on your behalf.

Many DACs also assign you a named contact, so if you ever have questions or need to change your order, you're speaking to someone who already knows your history, not starting from scratch each time.

If you're currently collecting supplies from a pharmacy or managing prescriptions yourself, switching to a specialist supplier could remove one of the biggest sources of stress in your routine.`
  },
  discretion: {
    topic: "discretion",
    title: "Discreet options that fit into your life",
    body: `Feeling self-conscious about carrying, using, or disposing of catheters is completely understandable, and product design has come a long way in addressing this.

<strong>Compact catheters</strong> are now available that fold or telescope down to a size that fits easily in a pocket, handbag, or jacket. Some are designed to look like everyday items, a pen, a cosmetics case, or a small torch, so they don't draw attention if seen.

<strong>Pre-lubricated catheters</strong> that are ready to use straight from the packet can speed up the process when you're away from home, reducing the time spent in a toilet cubicle and removing the need to carry separate lubricant and activation water.

For <strong>disposal</strong>, opaque, sealable disposal bags are available that contain the used catheter without any visible medical branding. Some specialist suppliers include these with your regular delivery at no extra cost.

<strong>Packaging</strong> matters too. Most specialist suppliers now use plain, unmarked outer packaging for home deliveries, so there's nothing on the box that reveals the contents to neighbours or housemates.

A specialist provider can talk you through the most discreet options available for your specific needs.`
  },
  no_choice: {
    topic: "choice",
    title: "You have more choice than you might think",
    body: `Many catheter users don't realise that they have the right to request specific products and to choose who supplies them. The NHS supports <strong>patient choice</strong>, you're not obligated to accept whatever your GP surgery or hospital initially prescribes.

Here's what you can do:

You can <strong>ask your GP, nurse, or urology team to prescribe a different catheter</strong> if your current one isn't working well for you. They can prescribe by product name or by specification (e.g., a hydrophilic-coated catheter of a specific French gauge and length).

You can <strong>choose your supplier</strong>. You don't have to collect from your local pharmacy. Specialist Dispensing Appliance Contractors (DACs) can receive your prescription directly from your GP and deliver supplies to your home.

You can <strong>request samples</strong> from catheter manufacturers or through specialist suppliers before committing to a change. This lets you try a product before switching your prescription.

A specialist provider can guide you through this process and help you explore what's available without you having to navigate the system alone.`
  }
};

const q6Cards: Record<string, InsightCardContent> = {
  comfort: {
    topic: "comfort",
    title: "A note on comfort",
    body: "You mentioned comfort is your top priority. Catheter coatings, tip design, and size all affect how a catheter feels. Hydrophilic and pre-lubricated options are designed to minimise friction. A specialist provider can review your current catheter and discuss alternatives that may be more comfortable — without changing your prescription process. This is a free, no-obligation conversation."
  },
  easy_reorder: {
    topic: "reorder",
    title: "A note on easier reordering",
    body: "You mentioned that simpler reordering would make the biggest difference. Specialist suppliers can manage your repeat prescriptions and deliver to your door on a set schedule, completely free through the NHS. No more chasing your GP or collecting from the pharmacy."
  },
  hygiene: {
    topic: "hygiene",
    title: "A note on hygiene",
    body: "You mentioned hygiene and infection prevention are your top priority. Single-use hydrophilic catheters and closed-system options are designed to reduce contamination risk. A specialist provider can talk you through the options that best support hygiene in your specific routine."
  },
  discretion: {
    topic: "discretion",
    title: "A note on discretion",
    body: "You mentioned discretion matters most to you. Compact, foldable catheters that resemble everyday items are now widely available on the NHS. Specialist suppliers also use plain, unmarked packaging for deliveries. Worth discussing with a provider who understands your lifestyle."
  },
  best_option: {
    topic: "choice",
    title: "Finding the right fit",
    body: "You mentioned wanting confidence that you're using the right product. With dozens of catheter designs available, each with different coatings, lengths, tips, and features, it's hard to know what you don't know. A specialist provider can carry out an informal needs assessment and help you understand what's available, so you can make an informed choice with your healthcare team."
  }
};

export function getResultCards(frustrationValue?: string, priorityValue?: string): InsightCardContent[] {
  if (!frustrationValue || !priorityValue) {
    return [];
  }
  const cards: InsightCardContent[] = [];
  const primary = q3Cards[frustrationValue];
  const supplementary = q6Cards[priorityValue];

  if (primary) {
    cards.push(primary);
  }

  const primaryTopic = q3ToTopic[frustrationValue];
  const supplementaryTopic = q6ToTopic[priorityValue];
  if (supplementary && primaryTopic !== supplementaryTopic) {
    cards.push(supplementary);
  }

  return cards;
}

export function getSupplyNudge(supplyValue?: string): string | null {
  if (supplyValue === "collect") {
    return "💡 Did you know? You don't have to collect your supplies in person. Specialist catheter providers can deliver directly to your door, for free, through the NHS. They handle the prescription process with your GP so you don't have to. Connecting with a specialist is the quickest way to get this set up.";
  }
  if (supplyValue === "unsure") {
    return "💡 Worth knowing: Even if someone else currently manages your supplies, you can choose to work with a specialist provider who delivers to your home and gives you a direct line to a dedicated support team. Connecting with a specialist is the quickest way to get this set up.";
  }
  if (supplyValue === "mix") {
    return "💡 Tip: Home delivery suppliers can manage your entire repeat prescription — no more trips to the pharmacy, no more chasing your GP. They contact you before each delivery to check everything's right. Connecting with a specialist is the quickest way to get this set up.";
  }
  return null;
}

export function getCardPreview(body: string): string {
  const firstLine = body.split("\n")[0] ?? "";
  return firstLine.replace(/<[^>]*>/g, "").trim();
}
