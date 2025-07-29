interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface OfferingsPageProps {
  userInfo: UserInfo | null;
}

const OfferingsPage = ({ userInfo }: OfferingsPageProps) => {
  const plans = [
    {
      name: "Free",
      price: 0,
      features: [
        "1000+ Free ChatGPT Prompts",
        "100+ Free Midjourney Prompts",
        "10 Free Mega-Prompts",
        "Prompt Engineering Guide",
        "Midjourney Mastery Guide",
        "Access in Notion",
        "Lifetime updates",
      ],
    },
    {
      name: "Basic",
      tier: "Writing Pack",
      price: 37,
      features: [
        "200+ mega-prompts for writing",
        "Boost your writing in seconds",
        "Lifetime updates",
        "Access in Prompt Library",
        "Access in Notion",
      ],
    },
    {
      name: "Plus",
      tier: "ChatGPT Bundle",
      price: 97,
      features: [
        "2,000+ ChatGPT mega-prompts",
        "All premium mega-prompts in one",
        "Biggest collection of mega-prompts",
        "How-to guides & tips",
        "Access in Prompt Library",
        "Access in Notion",
      ],
    },
    {
      name: "Max",
      tier: "Complete AI Bundle",
      price: 150,
      features: [
        "Everything included in Plus",
        "30,000+ AI Prompts",
        "All Products in one",
        "Biggest collection of AI prompts",
        "Unlimited Custom Prompts",
        "Lifetime updates",
        "Access in Prompt Library",
        "Access in Notion",
      ],
    },
  ];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Give Your Business AI Superpowers
          </h1>
          <p className="text-lg text-gray-600">
            Featured On: Product Hunt, OpenAI, Toolify.ai
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`border rounded-2xl p-8 flex flex-col ${
                plan.name === "Max"
                  ? "bg-black text-white border-yellow-400"
                  : "border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-2xl font-bold mb-2 h-16 md:h-20">
                {plan.tier || ""}
              </p>
              <p className="text-5xl font-bold mb-6">${plan.price}</p>
              <button
                className={`w-full font-bold py-3 px-4 rounded-lg transition-colors ${
                  plan.name === "Free"
                    ? "bg-black text-white hover:bg-gray-800 disabled:bg-gray-500"
                    : "bg-yellow-400 text-black hover:bg-yellow-500"
                }`}
                disabled={plan.name === "Free" && !!userInfo}
              >
                {plan.name === "Free"
                  ? userInfo
                    ? "Current Plan"
                    : "Sign Up"
                  : "Get Access"}
              </button>
              <ul className="space-y-3 mt-8 text-sm flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferingsPage;
