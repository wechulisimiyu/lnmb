import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
// import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:space-y-6 md:col-span-2 lg:col-span-1">
            {/* <div className="flex items-center space-x-3">
              <Image
                src="/logo-lnmb.png"
                alt="Leave No Medic Behind Logo"
                width={150}
                height={75}
                className="h-12 w-auto"
              />
            </div> */}
            <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
              Supporting medical students through community-driven charity runs,
              scholarships, and educational resources. Every step counts towards
              building tomorrow&apos;s healthcare heroes.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://x.com/AMSUNrunning"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>

              <Link
                href="https://www.instagram.com/amsunrunning/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>

              <Link
                href="https://www.facebook.com/amsunrunning/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-blue-400 text-sm sm:text-base">
              QUICK LINKS
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <Link
                href="/story"
                className="block text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                Our Story
              </Link>
              <Link
                href="/team"
                className="block text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                Our Team
              </Link>
              {/* <Link
                href="/highlights"
                className="block text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                Past Highlights
              </Link> */}
              <Link
                href="/contact"
                className="block text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-blue-400 text-sm sm:text-base">
              GET INVOLVED
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {/* TODO: update to /volunteer when volunteer page is ready */}
              <Link
                href="/"
                className="block text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                Volunteer
              </Link>

              {/* TODO: update to /shop when shop/merch page is available */}
              <Link
                href="/"
                className="block text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                Shop Merchandise
              </Link>

              {/* TODO: update to /partners when partnership signup page is ready */}
              <Link
                href="/"
                className="block text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                Become a Partner
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-blue-400 text-sm sm:text-base">
              CONTACT INFO
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div className="text-slate-400 text-sm sm:text-base">
                  KNH Hospital Drive
                  <br />
                  Nairobi, Kenya
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                <div className="text-slate-400 text-sm sm:text-base">
                  +254 796 105948
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                <div className="text-slate-400 text-sm sm:text-base">
                  communication@lnmb-run.org
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-slate-400 text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Prof Hassan Saidi Fund. All rights
            reserved.
          </p>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            Leave No Medic Behind
          </p>
        </div>
      </div>
    </footer>
  );
}
