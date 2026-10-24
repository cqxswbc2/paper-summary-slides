// Nistor, Selove & Villas-Boas (2025), Management Science. Approved by the supervisor (2026-10-24).

// Re-plot of the paper's Figure 1 from its equations and Table 2 parameters
const g = 0.75, b = 1.2, SWITCH = 0.73, dt = 0.001, step = 0.1;
function simulate(policy) {
  let A = 0.01, switched = false;
  const out = [];
  for (let k = 0; k <= 10 / dt + 1e-9; k++) {
    const t = k * dt;
    if (policy === "optimal" && A >= SWITCH) switched = true;
    const auth = policy === "auth" || (policy === "optimal" && !switched);
    if (Math.abs(t / step - Math.round(t / step)) < 1e-6) out.push(+(auth ? A : g * A).toFixed(4));
    A += dt * (auth ? b : g * b) * A * (1 - A);
  }
  return out;
}
const labels = Array.from({ length: 101 }, (_, i) => (i % 10 === 0 ? String(i / 10) : ""));

module.exports = {
  type: "theory",
  title: "Influencer Authenticity: To Grow or to Monetize",
  authors: "Cristina Nistor, Matthew Selove, J. Miguel Villas-Boas",
  year: 2025,
  journal: "Management Science",
  volume: "71(6), 5251–5267",
  question: "When should an influencer stay authentic to grow the audience, and when should the influencer start accepting all sponsorship offers to earn more?",
  answerLead: "Grow first, monetize later.",
  answer: "A small influencer endorses only products that fit the content. Once enough people know the influencer, the influencer accepts all offers and does not switch back.",
  defs: [
    { head: "Growth", body: "More people come to know the influencer. New followers arrive through current followers, so more followers today means faster growth tomorrow." },
    { head: "Monetization", body: "Accepting all sponsorship offers, including products that do not fit the content. Each follower brings more profit, but some followers leave." },
  ],
  players: [
    ["Influencer", "More ad income now vs. faster follower growth later", "Endorsement policy: accept only products that fit, or accept all offers"],
    ["Followers", "Enjoy the influencer’s content vs. dislike irrelevant ads", "Follow or unfollow"],
  ],
  playerRowH: [0.62, 0.5],
  timingNote: "repeats continuously; the influencer maximizes total discounted profit",
  timing: ["Influencer picks a policy", "Viewers follow or unfollow", "Influencer earns ad income", "Followers bring in new followers"],
  resultLead: "The influencer stays authentic at first, then accepts all offers once the audience is large enough.",
  resultDetail: "This holds when accepting all offers pays more right away and follower growth is fast enough to be worth waiting for; otherwise the influencer always stays authentic.",
  chart: {
    title: "Followers over time (paper’s example)",
    labelEvery: 10,
    series: [
      { name: "Always authentic", labels, values: simulate("auth") },
      { name: "Optimal", labels, values: simulate("optimal") },
      { name: "Always accept all", labels, values: simulate("inauth") },
    ],
    options: { valAxisMinVal: 0, valAxisMaxVal: 1, valAxisMajorUnit: 0.25, valAxisLabelFormatCode: "0%" },
  },
  why: [
    "Small influencer: each follower brings in more followers, so losing followers costs a lot of future growth.",
    "Large influencer: few new followers are left, and brands pay more for a large audience.",
  ],
  whyNote: "Example: the switch happens at 73% of potential followers; 25% of followers then leave.",
  implication: "Influencers should stay selective while their audience is still growing and accept broader endorsements only after growth slows.",
  notes: [
    "Nistor, C., Selove, M., & Villas-Boas, J. M. (2025). Influencer authenticity: To grow or to monetize. Management Science, 71(6), 5251–5267. https://doi.org/10.1287/mnsc.2023.03479",
    "Model: Section 3, Table 1. Main result: Proposition 1. Example: Section 3.5, Table 2.",
    "Chart redrawn from the paper's equations with the Table 2 values; it matches Figure 1.",
  ],
};
