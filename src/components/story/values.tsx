import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Award, Target } from "lucide-react"

export function StoryValues() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      <Card className="text-center p-6">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">Compassion</h3>
          <p className="text-gray-600">We believe in supporting those who dedicate their lives to healing others</p>
        </CardContent>
      </Card>

      <Card className="text-center p-6">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-sky-600" />
          </div>
          <h3 className="text-xl font-semibold">Community</h3>
          <p className="text-gray-600">Together, we can achieve more than any individual effort</p>
        </CardContent>
      </Card>

      <Card className="text-center p-6">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8 text-cyan-600" />
          </div>
          <h3 className="text-xl font-semibold">Excellence</h3>
          <p className="text-gray-600">We strive for the highest standards in everything we do</p>
        </CardContent>
      </Card>

      <Card className="text-center p-6">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-blue-700" />
          </div>
          <h3 className="text-xl font-semibold">Impact</h3>
          <p className="text-gray-600">Every dollar raised directly supports student success</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default StoryValues