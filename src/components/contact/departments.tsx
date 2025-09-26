import { Card, CardContent } from "@/components/ui/card";

export function ContactDepartments() {
  return (
    <Card className="p-6">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Department Contacts
        </h2>

        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-slate-900">Event Registration</h3>
            <p className="text-slate-600">registration@lnmb-run.org</p>
            <p className="text-sm text-slate-500">
              Questions about signing up, race day logistics
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-slate-900">
              Volunteer Coordination
            </h3>
            <p className="text-slate-600">volunteers@lnmb-run.org</p>
            <p className="text-sm text-slate-500">
              Volunteer opportunities and scheduling
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-slate-900">
              Corporate Partnerships
            </h3>
            <p className="text-slate-600">partnerships@lnmb-run.org</p>
            <p className="text-sm text-slate-500">
              Sponsorship and partnership opportunities
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-slate-900">Media & Press</h3>
            <p className="text-slate-600">media@lnmb-run.org</p>
            <p className="text-sm text-slate-500">
              Press inquiries and media coverage
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ContactDepartments;
