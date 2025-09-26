export function ContactEmergency() {
  return (
    <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
      <h2 className="text-xl font-bold text-blue-800 mb-2">
        Race Day Emergency
      </h2>
      <p className="text-blue-700 mb-4">
        For race day emergencies only, please call our emergency hotline:
      </p>
      <div className="text-2xl font-bold text-blue-800">(+254) 911-HELP</div>
      <p className="text-sm text-blue-600 mt-2">
        This number is only active during race events. For non-emergencies, use
        the regular contact methods above.
      </p>
    </div>
  );
}

export default ContactEmergency;
