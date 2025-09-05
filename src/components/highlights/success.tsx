import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function HighlightsSuccess() {
  return (
    <div className="mt-16 bg-blue-50 rounded-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Student Success Stories</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg"
                alt="Maria Gonzalez"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold">Dr. Maria Gonzalez</h3>
                <p className="text-sm text-gray-600">2021 Scholarship Recipient</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              &ldquo;The Leave No Medic Behind scholarship allowed me to focus on my studies instead of working multiple
              jobs. I&apos;m now a resident in pediatrics, living my dream of helping children.&rdquo;
            </p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg"
                alt="David Kim"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold">Dr. David Kim</h3>
                <p className="text-sm text-gray-600">2020 Scholarship Recipient</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              &ldquo;Without Leave No Medic Behind&apos;s support, I would have had to drop out in my third year. Now I&apos;m an
              emergency medicine physician, giving back to my community.&rdquo;
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HighlightsSuccess