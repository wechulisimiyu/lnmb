import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, MessageSquare, Users, Calendar } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Contact Us</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Have questions about the run, want to volunteer, or need support? We&apos;d love to hear from you and help in any
            way we can.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
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

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <Card className="p-6">
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Get in Touch</h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-slate-600">
                        KNH Hospital Drive
                        <br />
                        Nairobi, Kenya
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-slate-600">+254 796 105948</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-slate-600">communication@lnmb-run.org</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-semibold">Office Hours</p>
                      <p className="text-slate-600">
                        Monday - Friday: 9:00 AM - 5:00 PM
                        <br />
                        Saturday: 10:00 AM - 2:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Department Contacts */}
            <Card className="p-6">
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Department Contacts</h2>

                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-slate-900">Event Registration</h3>
                    <p className="text-slate-600">registration@lnmb-run.org</p>
                    <p className="text-sm text-slate-500">Questions about signing up, race day logistics</p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-slate-900">Volunteer Coordination</h3>
                    <p className="text-slate-600">volunteers@lnmb-run.org</p>
                    <p className="text-sm text-slate-500">Volunteer opportunities and scheduling</p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-slate-900">Corporate Partnerships</h3>
                    <p className="text-slate-600">partnerships@lnmb-run.org</p>
                    <p className="text-sm text-slate-500">Sponsorship and partnership opportunities</p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-slate-900">Media & Press</h3>
                    <p className="text-slate-600">media@lnmb-run.org</p>
                    <p className="text-sm text-slate-500">Press inquiries and media coverage</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Quick Links */}
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
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Race Day Emergency</h2>
          <p className="text-blue-700 mb-4">For race day emergencies only, please call our emergency hotline:</p>
          <div className="text-2xl font-bold text-blue-800">(+254) 911-HELP</div>
          <p className="text-sm text-blue-600 mt-2">
            This number is only active during race events. For non-emergencies, use the regular contact methods above.
          </p>
        </div>
      </div>
    </div>
  )
}
