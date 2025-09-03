"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Award,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  DollarSign,
  Calendar,
  GraduationCap,
} from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data
  const stats = {
    totalMembers: 24,
    totalHighlights: 15,
    totalProducts: 8,
    totalRevenue: 45250,
    monthlyOrders: 156,
    activeYears: 5,
  }

  const recentActivity = [
    { action: "New team member added", user: "Admin", time: "2 hours ago", type: "team" },
    { action: "Product updated", user: "Admin", time: "4 hours ago", type: "product" },
    { action: "Highlight published", user: "Admin", time: "1 day ago", type: "highlight" },
    { action: "Team member edited", user: "Admin", time: "2 days ago", type: "team" },
  ]

  const teamMembers = [
    { id: 1, name: "Dr. Sarah Martinez", role: "Founder & Director", year: "2024", status: "Active" },
    { id: 2, name: "Michael Chen", role: "Event Coordinator", year: "2024", status: "Active" },
    { id: 3, name: "Dr. Aisha Patel", role: "Student Liaison", year: "2024", status: "Active" },
    { id: 4, name: "Lisa Thompson", role: "Communications Director", year: "2023", status: "Inactive" },
  ]

  const highlights = [
    { id: 1, title: "Breaking Barriers 2023", year: "2023", status: "Published", views: 1250 },
    { id: 2, title: "Stronger Together 2022", year: "2022", status: "Published", views: 980 },
    { id: 3, title: "Hope in Motion 2021", year: "2021", status: "Published", views: 750 },
  ]

  const products = [
    { id: 1, name: "Official Medical Students Run 2024 Tee", price: 25, stock: 150, sales: 89 },
    { id: 2, name: "Performance Running Tank", price: 28, stock: 75, sales: 45 },
    { id: 3, name: "Long Sleeve Support Shirt", price: 32, stock: 100, sales: 67 },
    { id: 4, name: "Medical Students Run Hoodie", price: 45, stock: 50, sales: 23 },
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4">
        {/* Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 text-sm sm:text-base">Medical Students Run Management</p>
            </div>
            <Badge className="bg-green-600 text-white w-fit">SYSTEM ONLINE</Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-fit gap-1">
            <TabsTrigger value="dashboard" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger value="highlights" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Highlights</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Products</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            {/* Stats Grid - Mobile Responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">Team Members</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{stats.totalMembers}</p>
                    </div>
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">Highlights</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                        {stats.totalHighlights}
                      </p>
                    </div>
                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2 lg:col-span-1">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">Products</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{stats.totalProducts}</p>
                    </div>
                    <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">Revenue</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                        ${stats.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">Monthly Orders</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{stats.monthlyOrders}</p>
                    </div>
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">Active Years</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{stats.activeYears}</p>
                    </div>
                    <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity - Mobile Optimized */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "team"
                              ? "bg-blue-600"
                              : activity.type === "product"
                                ? "bg-purple-600"
                                : "bg-green-600"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm sm:text-base">{activity.action}</p>
                          <p className="text-xs sm:text-sm text-slate-600">by {activity.user}</p>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm text-slate-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Team Management</h2>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Name</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Role</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Year</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Status</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((member) => (
                        <tr key={member.id} className="border-t">
                          <td className="p-3 sm:p-4 font-medium text-sm sm:text-base">{member.name}</td>
                          <td className="p-3 sm:p-4 text-slate-600 text-sm sm:text-base">{member.role}</td>
                          <td className="p-3 sm:p-4">
                            <Badge variant="outline" className="text-xs">
                              {member.year}
                            </Badge>
                          </td>
                          <td className="p-3 sm:p-4">
                            <Badge
                              className={
                                member.status === "Active"
                                  ? "bg-green-100 text-green-800 text-xs"
                                  : "bg-slate-100 text-slate-800 text-xs"
                              }
                            >
                              {member.status}
                            </Badge>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="flex space-x-1 sm:space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Highlights Management Tab */}
          <TabsContent value="highlights" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Highlights Management</h2>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Highlight
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Title</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Year</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Status</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Views</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {highlights.map((highlight) => (
                        <tr key={highlight.id} className="border-t">
                          <td className="p-3 sm:p-4 font-medium text-sm sm:text-base">{highlight.title}</td>
                          <td className="p-3 sm:p-4">
                            <Badge variant="outline" className="text-xs">
                              {highlight.year}
                            </Badge>
                          </td>
                          <td className="p-3 sm:p-4">
                            <Badge className="bg-green-100 text-green-800 text-xs">{highlight.status}</Badge>
                          </td>
                          <td className="p-3 sm:p-4 text-slate-600 text-sm sm:text-base">
                            {highlight.views.toLocaleString()}
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="flex space-x-1 sm:space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Management Tab */}
          <TabsContent value="products" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Products Management</h2>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Product Name</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Price</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Stock</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Sales</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-t">
                          <td className="p-3 sm:p-4 font-medium text-sm sm:text-base">{product.name}</td>
                          <td className="p-3 sm:p-4 text-slate-600 text-sm sm:text-base">${product.price}</td>
                          <td className="p-3 sm:p-4">
                            <Badge
                              className={
                                product.stock > 50
                                  ? "bg-green-100 text-green-800 text-xs"
                                  : product.stock > 20
                                    ? "bg-yellow-100 text-yellow-800 text-xs"
                                    : "bg-red-100 text-red-800 text-xs"
                              }
                            >
                              {product.stock} units
                            </Badge>
                          </td>
                          <td className="p-3 sm:p-4 text-slate-600 text-sm sm:text-base">{product.sales} sold</td>
                          <td className="p-3 sm:p-4">
                            <div className="flex space-x-1 sm:space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
