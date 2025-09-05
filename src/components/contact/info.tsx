import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactInfo() {
  return (
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
  )
}

export default ContactInfo