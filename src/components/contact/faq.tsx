import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, MessageSquare } from "lucide-react"

export function ContactFAQ() {
  return (
    <Card className="p-6">
      <CardContent className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Quick Answers</h2>
        <p className="text-slate-600">Looking for immediate answers? Check out these common questions:</p>

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Calendar className="w-4 h-4 mr-2" />
            When is the next run?
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Users className="w-4 h-4 mr-2" />
            How do I register?
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <MapPin className="w-4 h-4 mr-2" />
            Where does the race start?
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <MessageSquare className="w-4 h-4 mr-2" />
            Can I volunteer?
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContactFAQ