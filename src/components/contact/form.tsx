import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare } from "lucide-react"

export function ContactForm() {
  return (
    <div>
      <Card className="p-8">
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input id="phone" type="tel" placeholder="+254 123 456 789" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registration">Event Registration</SelectItem>
                  <SelectItem value="volunteer">Volunteer Opportunities</SelectItem>
                  <SelectItem value="sponsorship">Sponsorship Inquiry</SelectItem>
                  <SelectItem value="merchandise">Merchandise Question</SelectItem>
                  <SelectItem value="media">Media Inquiry</SelectItem>
                  <SelectItem value="general">General Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Tell us how we can help you..." rows={5} />
            </div>

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ContactForm