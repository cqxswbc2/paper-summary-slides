// Wies, Bleier & Edeling (2023), Journal of Marketing. Read from the full text.

// Post engagement predicted from Table 4 (standardized estimates: linear .715, squared -.090).
// Mean follower count 179,000; turning point 1.43 million, which implies one SD of about 315,000 followers.
const MEAN = 179000, SD = (1430511 - MEAN) / (0.715 / (2 * 0.090));
const points = [10, 100, 250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2500, 3000]; // thousand followers
const predict = (k) => {
  const z = (k * 1000 - MEAN) / SD;
  return +(0.715 * z - 0.090 * z * z).toFixed(3);
};
const labels = points.map((k) => (k >= 1000 ? `${k / 1000}M` : `${k}K`));

module.exports = {
  type: "empirical",
  title: "Finding Goldilocks Influencers: How Follower Count Drives Social Media Engagement",
  titleSize: 21,
  authors: "Simone Wies, Alexander Bleier, Alexander Edeling",
  year: 2023,
  journal: "Journal of Marketing",
  volume: "87(3), 383–405",
  question: "Do influencers with more followers get more engagement on sponsored content?",
  answerLead: "Only up to a point.",
  answer: "Engagement rises with follower count, peaks at about 1.4 million followers, and then falls. Influencers in the middle are the most effective.",
  defs: [
    { head: "Follower count", body: "The number of followers an influencer has on the day a sponsored post or story is published." },
    { head: "Engagement", body: "How much followers interact with sponsored content: likes, comments and mentions on posts, and link clicks on stories." },
  ],
  data: "802 Instagram campaigns from five influencer agencies (2017–2020): 1,738 influencers, 6,422 posts, 6,178 stories; plus eye-tracking and lab experiments.",
  model: "Engagement regressed on follower count and its square, their interactions with two campaign features, and controls; corrects for how brands pick influencers.",
  dataBoxH: 0.98,
  variables: [
    ["Dependent", "Engagement", "Posts: likes, comments and mentions in two days; stories: link clicks in 24 hours"],
    ["Independent", "Follower count", "Followers on the day of posting (also entered squared)"],
    ["Moderator", "Content customization", "How much captions differ across influencers in the same campaign"],
    ["Moderator", "Brand familiarity", "YouGov brand awareness score, 0–100"],
  ],
  resultLead: "Engagement first rises, then falls as follower count grows: an inverted U that peaks at about 1.4 million followers.",
  resultDetail: "The curve flattens when influencers write their own content and when the brand is less well known.",
  chart: {
    title: "Predicted post engagement",
    series: [{ name: "Post engagement", labels, values: points.map(predict) }],
    catTitle: "Follower count",
    options: { valAxisHidden: true },
  },
  why: [
    "More followers: more people see the post.",
    "But each follower feels a weaker tie to a big influencer and engages less.",
    "Custom content and lesser-known brands show the influencer cares about followers.",
  ],
  whyNote: "Per dollar, influencers with 100K–500K followers got the most likes.",
  implication: "Brands should not simply hire the influencers with the most followers: mid-sized influencers deliver the most engagement per dollar, and giving influencers creative freedom helps large ones keep their audience engaged.",
  notes: [
    "Wies, S., Bleier, A., & Edeling, A. (2023). Finding Goldilocks influencers: How follower count drives social media engagement. Journal of Marketing, 87(3), 383–405. https://doi.org/10.1177/00222429221125131",
    "Data: Study 1 data section. Model: Equations 7a and 7b, Table 3. Turning points: post 1,430,511 and story 1,253,392 followers. Moderators: Figure 3. Cost per like: Figure 5.",
    "Chart drawn from the Table 4 standardized estimates (linear .715, squared -.090); the vertical axis is in standardized units.",
  ],
};
