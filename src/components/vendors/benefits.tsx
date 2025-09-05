import { Heart, Users, TrendingUp } from "lucide-react"

export function VendorsBenefits() {
  const benefits = [
    {
      icon: Heart,
      title: "Community Impact",
      description: "Directly support medical students and contribute to healthcare workforce development",
      color: "red",
    },
    {
      icon: Users,
      title: "Brand Visibility",
      description: "Prominent logo placement on race materials, website, and social media channels",
      color: "blue",
    },
    {
      icon: Users,
      title: "Networking Opportunities",
      description: "Connect with healthcare professionals, medical institutions, and community leaders",
      color: "green",
    },
    {
      icon: TrendingUp,
      title: "Marketing ROI",
      description: "Reach engaged audiences while building positive brand association with healthcare",
      color: "purple",
    },
  ]

  return (
    <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12 sm:mb-16">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden rounded-2xl ${
            benefit.color === "red"
              ? "bg-red-50"
              : benefit.color === "blue"
                ? "bg-blue-50"
                : benefit.color === "green"
                  ? "bg-green-50"
                  : "bg-purple-50"
          } p-1 hover:shadow-2xl transition-all duration-300`}
        >
          <div className="relative bg-white rounded-xl p-6 h-full">
            {/* Medical Cross Pattern */}
            <div
              className={`absolute top-4 right-4 w-6 h-6 opacity-10 ${
                benefit.color === "red"
                  ? "text-red-600"
                  : benefit.color === "blue"
                    ? "text-blue-600"
                    : benefit.color === "green"
                      ? "text-green-600"
                      : "text-purple-600"
              }`}
            >
              <div className="absolute inset-0 bg-current rounded-sm transform rotate-45"></div>
              <div className="absolute inset-0 bg-current rounded-sm"></div>
            </div>

            <div className="relative z-10">
              <div
                className={`w-14 h-14 ${
                  benefit.color === "red"
                    ? "bg-red-500"
                    : benefit.color === "blue"
                      ? "bg-blue-500"
                      : benefit.color === "green"
                        ? "bg-green-500"
                        : "bg-purple-500"
                } rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <benefit.icon className="w-7 h-7 text-white" />
              </div>

              <h3
                className={`text-lg font-bold mb-3 ${
                  benefit.color === "red"
                    ? "group-hover:text-red-600"
                    : benefit.color === "blue"
                      ? "group-hover:text-blue-600"
                      : benefit.color === "green"
                        ? "group-hover:text-green-600"
                        : "group-hover:text-purple-600"
                } transition-colors`}
              >
                {benefit.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VendorsBenefits