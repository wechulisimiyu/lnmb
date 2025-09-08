"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Twitter, Instagram, ExternalLink, Heart, MessageCircle, Repeat2, Calendar, Verified } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export function HomeSocial() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Placeholder data - replace with actual API calls
  const socialPosts = [
    {
      id: "1",
      platform: "twitter",
      username: "AMSUNrunning",
      handle: "@AMSUNrunning",
      content:
        "🏃‍♂️ Training update: Our medical students are pushing hard for the upcoming charity run! Every step brings us closer to supporting more future healthcare heroes. #LeaveNoMedicBehind #CharityRun",
      timestamp: "2024-01-15T10:30:00Z",
      likes: 45,
      retweets: 12,
      replies: 8,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      verified: true,
    },
    {
      id: "2",
      platform: "instagram",
      username: "amsunrunning",
      handle: "@amsunrunning",
      content:
        "Behind every successful doctor is a journey of dedication and support. Our scholarship recipients share their stories of hope and determination. 💪🩺 #MedicalStudents #Scholarship #Healthcare",
      timestamp: "2024-01-14T15:45:00Z",
      likes: 128,
      comments: 23,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      verified: true,
    },
    {
      id: "3",
      platform: "twitter",
      username: "AMSUNrunning",
      handle: "@AMSUNrunning",
      content:
        "📚 IMPACT UPDATE: Thanks to your support, we've provided textbooks to 15 medical students this month! Education should never be limited by financial barriers. #MedicalEducation #Support",
      timestamp: "2024-01-13T09:15:00Z",
      likes: 67,
      retweets: 28,
      replies: 15,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      verified: true,
    },
    {
      id: "4",
      platform: "instagram",
      username: "amsunrunning",
      handle: "@amsunrunning",
      content:
        "From the starting line to the finish line, every runner makes a difference. Join us in our mission to support medical students! Registration is now open 🏃‍♀️🏃‍♂️",
      timestamp: "2024-01-12T12:20:00Z",
      likes: 89,
      comments: 12,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      verified: true,
    },
    {
      id: "5",
      platform: "twitter",
      username: "AMSUNrunning",
      handle: "@AMSUNrunning",
      content:
        "🎉 MILESTONE ALERT: We've officially raised over $675,000 for medical student support! This wouldn't be possible without our amazing community. Thank you! 🙏 #Milestone #Community",
      timestamp: "2024-01-11T16:00:00Z",
      likes: 156,
      retweets: 45,
      replies: 32,
      image: null,
      verified: true,
    },
    {
      id: "6",
      platform: "instagram",
      username: "amsunrunning",
      handle: "@amsunrunning",
      content:
        "Meet Sarah, one of our scholarship recipients who just completed her clinical rotations! Stories like hers inspire us to keep running for a cause. 👩‍⚕️✨ #SuccessStory #FutureDoctor",
      timestamp: "2024-01-10T11:30:00Z",
      likes: 203,
      comments: 34,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      verified: true,
    },
  ]

  const formatTimeAgo = (timestamp: string) => {
    // Return a static format during SSR to prevent hydration mismatch
    if (!mounted) {
      const postTime = new Date(timestamp)
      // Use ISO date string format to ensure consistency
      return postTime.toISOString().split('T')[0] // Returns YYYY-MM-DD format
    }

    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    // Use a consistent date format
    return postTime.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric' 
    })
  }

  // Pick the single latest post across platforms
  const latestPost = socialPosts.length
    ? socialPosts.reduce((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? a : b))
    : null

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-secondary to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="bg-brand-accent text-accent-foreground mb-4 px-3 py-1 text-sm">SOCIAL UPDATES</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
            Latest from Our Community
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay connected with our latest updates, training sessions, and success stories from our social media
            channels.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center gap-4 mb-8 sm:mb-12">
          <Button
            variant="outline"
            className="bg-transparent border-accent text-accent hover:bg-accent/10"
            asChild
          >
            <a href="https://x.com/AMSUNrunning" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-4 h-4 mr-2" />
              Follow on X
            </a>
          </Button>
          <Button variant="outline" className="bg-transparent border-destructive text-destructive hover:bg-destructive/10" asChild>
            <a href="https://www.instagram.com/amsunrunning/" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-4 h-4 mr-2" />
              Follow on Instagram
            </a>
          </Button>
        </div>

        {/* Social Media Feed - single latest post */}
        <div className="max-w-3xl mx-auto">
          {latestPost && (
            <div
              key={latestPost.id}
              className={`group relative overflow-hidden rounded-2xl bg-background shadow-lg hover:shadow-2xl transition-all duration-300 ${
                latestPost.platform === "twitter" ? "border-t-4 border-t-accent" : "border-t-4 border-t-destructive"
              }`}
            >
              {/* Platform Header */}
              <div className="p-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        latestPost.platform === "twitter" ? "bg-accent/10" : "bg-destructive/10"
                      }`}
                    >
                      {latestPost.platform === "twitter" ? (
                        <Twitter className="w-5 h-5 text-accent" />
                      ) : (
                        <Instagram className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-foreground text-sm">{latestPost.username}</span>
                        {latestPost.verified && (
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              latestPost.platform === "twitter" ? "bg-accent" : "bg-destructive"
                            }`}
                          >
                            <Verified className="w-2.5 h-2.5 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs">{latestPost.handle}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{formatTimeAgo(latestPost.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 pb-4">
                <p className="text-foreground text-sm leading-relaxed mb-4">{latestPost.content}</p>

                {latestPost.image && (
                  <div className="relative mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={
                        latestPost.image ||
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg"
                      }
                      alt="Social media post image"
                      width={400}
                      height={latestPost.platform === "instagram" ? 400 : 300}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Engagement Stats - Medical Monitor Style */}
                <div
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    latestPost.platform === "twitter" ? "bg-accent/10" : "bg-destructive/10"
                  }`}
                >
                  <div className="flex items-center space-x-4 text-xs">
                    <div
                      className={`flex items-center space-x-1 ${
                        latestPost.platform === "twitter" ? "text-accent" : "text-destructive"
                      }`}
                    >
                      <Heart className="w-3 h-3" />
                      <span className="font-semibold">{latestPost.likes}</span>
                    </div>
                    {latestPost.platform === "twitter" ? (
                      <>
                        <div className="flex items-center space-x-1 text-accent">
                          <Repeat2 className="w-3 h-3" />
                          <span className="font-semibold">{latestPost.retweets}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-accent">
                          <MessageCircle className="w-3 h-3" />
                          <span className="font-semibold">{latestPost.replies}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center space-x-1 text-destructive">
                        <MessageCircle className="w-3 h-3" />
                        <span className="font-semibold">{latestPost.comments}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-xs p-1 h-auto hover:scale-110 transition-transform duration-300 ${
                      latestPost.platform === "twitter"
                        ? "text-accent hover:text-accent/80"
                        : "text-destructive hover:text-destructive/80"
                    }`}
                    asChild
                  >
                    <a
                      href={
                        latestPost.platform === "twitter"
                          ? `https://x.com/AMSUNrunning/status/${latestPost.id}`
                          : `https://www.instagram.com/p/${latestPost.id}/`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View this post on ${latestPost.platform}`}
                      title={`View this post on ${latestPost.platform}`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="bg-transparent border-accent text-accent hover:bg-accent/10"
              asChild
            >
              <a href="https://x.com/AMSUNrunning" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-4 h-4 mr-2" />
                View More on X
              </a>
            </Button>
            <Button variant="outline" className="bg-transparent border-destructive text-destructive hover:bg-destructive/10" asChild>
              <a href="https://www.instagram.com/amsunrunning/" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-4 h-4 mr-2" />
                View More on Instagram
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeSocial
