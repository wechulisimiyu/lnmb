export function StoryTimeline() {
  return (
    <section className="px-4 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Journey</h2>
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-700 font-bold">2022</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">First ever</h3>
              <p className="text-gray-600">Launched our inaugural charity run.</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-800 font-bold">2023</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Second ever</h3>
              <p className="text-gray-600">Expanded reach and participation.</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-600 font-bold">2024</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Third ever</h3>
              <p className="text-gray-600">Scaled and had even more participants.</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-600 font-bold">2025</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">4th edition this year</h3>
              <p className="text-gray-600">Our latest edition. Join us.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StoryTimeline