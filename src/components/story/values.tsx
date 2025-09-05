import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Award, Target } from "lucide-react"

export function StoryValues() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      <Card className="text-center p-6">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Compassion</h3>
          <p className="text-muted-foreground">We believe in supporting those who dedicate their lives to healing others</p>
        </CardContent>
      </Card>

      <Card className="text-center p-6">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold">Community</h3>
          <p className="text-muted-foreground">Together, we can achieve more than any individual effort</p>
        </CardContent>
      </Card>

      <Card className="text-center p-6">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8 text-brand-success" />
          </div>
          <h3 className="text-xl font-semibold">Excellence</h3>
          <p className="text-muted-foreground">We strive for the highest standards in everything we do</p>
        </CardContent>
      </Card>

      <Card className="text-center p-6">
        <CardContent className="space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold">Impact</h3>
          <p className="text-muted-foreground">Every dollar raised directly supports student success</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default StoryValues