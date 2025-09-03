import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Award, Target } from "lucide-react"
import Image from "next/image"

export default function StoryPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
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

        {/* Origin Story */}
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

        {/* Growth Timeline */}
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

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Compassion</h3>
              <p className="text-gray-600">We believe in supporting those who dedicate their lives to healing others</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold">Community</h3>
              <p className="text-gray-600">Together, we can achieve more than any individual effort</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold">Excellence</h3>
              <p className="text-gray-600">We strive for the highest standards in everything we do</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold">Impact</h3>
              <p className="text-gray-600">Every dollar raised directly supports student success</p>
            </CardContent>
          </Card>
        </div>

        {/* Looking Forward */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Looking Forward</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Our goal for 2024 is to raise $400,000 and support 200 medical students. With your help, we can ensure that
            financial barriers never prevent passionate individuals from pursuing their calling to heal and serve.
          </p>
          <div className="text-2xl font-bold text-blue-600">
            Together, we&apos;re building a healthier tomorrow, one step at a time.
          </div>
        </div>
      </div>
    </div>
  )
}
