import Image from "next/image"

export function StoryHero() {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Story</h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        What started as a small community initiative has grown into a movement that has supported hundreds of
        medical students on their journey to becoming healthcare heroes.
      </p>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg"
        alt="Dr. Sarah Martinez at the first charity run"
        width={500}
        height={400}
        className="rounded-lg shadow-lg"
      />
    </div>
  )
}

export default StoryHero