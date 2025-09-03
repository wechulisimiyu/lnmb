"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Save } from "lucide-react"
import Link from "next/link"

export default function AddTeamMemberPage() {
  const [formData, setFormData] = useState({
    name: "",
    rank: "",
    role: "",
    year: "2024",
    bio: "",
    email: "",
    linkedin: "",
    twitter: "",
    specialties: "",
    awards: "",
    status: "Active",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <Badge className="bg-red-600 text-white">PERSONNEL FILE</Badge>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Add Team Member</h1>
          <p className="text-slate-600">Create a new personnel record for the command roster</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. John Smith"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rank">Rank/Title</Label>
                      <Input
                        id="rank"
                        value={formData.rank}
                        onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                        placeholder="Mission Commander"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role *</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Medical Director"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <select
                        id="year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biography *</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Brief description of background, experience, and role in the mission..."
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@leavenomedicbehind.org"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter Handle</Label>
                      <Input
                        id="twitter"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="@username"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialties">Specialties</Label>
                    <Input
                      id="specialties"
                      value={formData.specialties}
                      onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                      placeholder="Emergency Medicine, Leadership, Medical Education (comma separated)"
                    />
                    <p className="text-sm text-slate-500">Separate multiple specialties with commas</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="awards">Awards & Commendations</Label>
                    <Textarea
                      id="awards"
                      value={formData.awards}
                      onChange={(e) => setFormData({ ...formData, awards: e.target.value })}
                      placeholder="Healthcare Hero 2023, Community Leader Award (one per line)"
                      rows={3}
                    />
                    <p className="text-sm text-slate-500">Enter one award per line</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">Upload profile photo</p>
                    <p className="text-sm text-slate-500">PNG, JPG up to 5MB</p>
                    <Button variant="outline" className="mt-4 bg-transparent">
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="status">Member Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Team Member
                  </Button>
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Save as Draft
                  </Button>
                  <Link href="/admin">
                    <Button type="button" variant="ghost" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
