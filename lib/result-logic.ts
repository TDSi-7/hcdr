export function getProfile(answers: Record<number, string>): "A" | "B" | "C" {
  const satisfaction = parseInt(answers[8] ?? "0", 10);
  const choiceAwareness = answers[4];

  if (satisfaction >= 4 && choiceAwareness === "happy") {
    return "C";
  }

  if (satisfaction <= 3 && choiceAwareness !== "happy") {
    return "A";
  }

  return "B";
}
