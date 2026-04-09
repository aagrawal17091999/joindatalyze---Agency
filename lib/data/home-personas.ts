export type HomePersona = {
  role: string;
  pain: string;
  outcome: string;
};

export const homePersonas: HomePersona[] = [
  {
    role: 'Founders',
    pain: "You're setting strategy and allocating budget on metrics you half-trust, defending numbers in board meetings you wouldn't bet your own money on, and you don't have the bandwidth to fix any of it.",
    outcome:
      'You walk into every board meeting, every team review, and every fundraise with one set of numbers — and the confidence to defend them.',
  },
  {
    role: 'Heads of Growth',
    pain: "Your experiments need baselines you don't have. Your attribution falls apart the moment finance asks a question. Your growth model is held together with duct tape and three different exports.",
    outcome:
      'You run experiments you can defend, attribute spend you can justify, and build a growth engine that compounds instead of leaks.',
  },
  {
    role: 'Product Leads',
    pain: "You're shipping features without knowing which ones drive retention. Your usage data lives in three tools that don't agree. Prioritization is half instinct, half politics — and you're losing the political fights.",
    outcome:
      'You walk into roadmap meetings with feature-level impact data and win the prioritization argument before it starts.',
  },
];
