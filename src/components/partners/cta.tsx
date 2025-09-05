import { Button } from "@/components/ui/button"

export function PartnersCTA() {
  return (
    <div className="text-center bg-white border-2 border-blue-200 rounded-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Partner</h2>
      <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
        Join our mission to support medical students and strengthen our healthcare community. We offer flexible
        partnership packages to fit organizations of all sizes.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Download Partnership Package
        </Button>
        <Button size="lg" variant="outline">
          Contact Partnership Team
        </Button>
      </div>
    </div>
  )
}

export default PartnersCTA