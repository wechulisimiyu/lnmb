export function StoryTimeline() {
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Journey</h2>
      <div className="space-y-8">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-bold">2019</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">The Beginning</h3>
            <p className="text-gray-600">First run with 50 participants, raised $15,000</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sky-600 font-bold">2020</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Virtual Pivot</h3>
            <p className="text-gray-600">
              Adapted to virtual format during pandemic, 200 participants, $35,000 raised
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-cyan-600 font-bold">2021</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Growing Impact</h3>
            <p className="text-gray-600">500 participants, first corporate sponsors, $75,000 raised</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 font-bold">2022</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Scholarship Program</h3>
            <p className="text-gray-600">
              Launched formal scholarship program, 1,000 participants, $125,000 raised
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-800 font-bold">2023</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">National Recognition</h3>
            <p className="text-gray-600">
              Featured in Medical Education Today, 2,500 participants, $250,000 raised
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoryTimeline