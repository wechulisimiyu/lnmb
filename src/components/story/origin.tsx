export function StoryOrigin() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">How It All Began</h2>
        <p className="text-gray-600 text-lg">
          In 2019, Dr. Sarah Martinez noticed that many of her brightest medical students were struggling
          financially. Despite their dedication and academic excellence, the rising costs of medical education were
          forcing some to consider dropping out.
        </p>
        <p className="text-gray-600 text-lg">
          Inspired by her own journey as a first-generation medical student, Dr. Martinez organized the first &ldquo;Leave
          No Medic Behind Run&rdquo; with just 50 participants. That small event raised $15,000 and helped three students
          complete their studies.
        </p>
      </div>
      <div>{/* Placeholder for origin story image */}</div>
    </div>
  )
}

export default StoryOrigin