import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, DollarSign, Award } from "lucide-react"

export function HighlightsStats() {
  return (
    <div className="grid md:grid-cols-4 gap-8 mb-16">
      <Card className="text-center p-6">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600">KES 675K+</div>
          <div className="text-gray-600">Total Raised</div>
        </CardContent>
      </Card>

      <Card className="text-center p-6">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-sky-600" />
          </div>
          <div className="text-3xl font-bold text-sky-600">6,600+</div>
          <div className="text-gray-600">Total Participants</div>
        </CardContent>
      </Card>

      <Card className="text-center p-6">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8 text-cyan-600" />
          </div>
          <div className="text-3xl font-bold text-cyan-600">138</div>
          <div className="text-gray-600">Students Supported</div>
        </CardContent>
      </Card>

      <Card className="text-center p-6">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8 text-blue-700" />
          </div>
          <div className="text-3xl font-bold text-blue-700">5</div>
          <div className="text-gray-600">Years of Impact</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HighlightsStats