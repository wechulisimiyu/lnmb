import ContactHero from "@/components/contact/hero"
import ContactForm from "@/components/contact/form"
import ContactInfo from "@/components/contact/info"
import ContactDepartments from "@/components/contact/departments"
import ContactFAQ from "@/components/contact/faq"
import ContactEmergency from "@/components/contact/emergency"

export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <ContactHero />

        <div className="grid lg:grid-cols-2 gap-12">
          <ContactForm />

          <div className="space-y-8">
            <ContactInfo />
            <ContactDepartments />
            <ContactFAQ />
          </div>
        </div>

        <ContactEmergency />
      </div>
    </div>
  )
}
