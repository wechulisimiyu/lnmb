import { Heart, Users, Building } from "lucide-react"

export function PartnersBenefits() {
  return (
    <div className="bg-blue-50 rounded-lg p-8 mb-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Partnership Benefits</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Brand Visibility</h3>
          <p className="text-gray-600">Prominent logo placement on race materials, website, and social media</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-sky-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
          <p className="text-gray-600">
            Direct contribution to supporting the next generation of healthcare professionals
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-cyan-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Networking</h3>
          <p className="text-gray-600">
            Connect with healthcare leaders, medical professionals, and community members
          </p>
        </div>
      </div>
    </div>
  )
}

export default PartnersBenefits