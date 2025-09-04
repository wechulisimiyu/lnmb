"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Heart } from "lucide-react"
import Image from "next/image"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/story", label: "Our Story" },
    { href: "/team", label: "Team" },
    { href: "/highlights", label: "Highlights" },
    { href: "/partners", label: "Partners" },
    { href: "/vendors", label: "Vendors" },
    { href: "/shop", label: "Shop" }, // Updated href from "/tshirts" to "/shop"
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3 sm:py-4">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <Image
              src="/logo-lnmb.png"
              alt="Leave No Medic Behind Logo"
              width={120}
              height={60}
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-700 hover:text-blue-600 transition-colors font-medium text-sm xl:text-base"
              >
                {item.label}
              </Link>
            ))}
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 text-sm">
              <Heart className="w-4 h-4 mr-2" />
              Donate
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 -mr-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 bg-white">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-md hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold w-full mt-4">
                <Heart className="w-4 h-4 mr-2" />
                Donate Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
