"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Package,
  CreditCard,
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch data from Convex
  const orders = useQuery(api.orders.getAllOrders) || [];
  const payments = useQuery(api.orders.getAllPayments) || [];
  const orderStats = useQuery(api.orders.getOrderStats);

  // Mock data for other sections
  const stats = {
    totalMembers: 24,
    totalHighlights: 15,
    totalProducts: 8,
    totalRevenue: orderStats?.totalRevenue || 45250,
    monthlyOrders: orderStats?.monthlyOrders || 156,
    activeYears: 5,
  };

  // Generate recent activity from orders and payments
  const generateRecentActivity = () => {
    const activities = [];

    // Add recent orders
    const recentOrders = orders.slice(0, 2);
    recentOrders.forEach((order) => {
      const timeAgo = Math.floor(
        (Date.now() - order.createdAt) / (1000 * 60 * 60),
      ); // hours ago
      activities.push({
        action: `New order for ${order.tshirtType} (${order.quantity}x)`,
        user: order.name,
        time: timeAgo < 1 ? "Just now" : `${timeAgo} hours ago`,
        type: "order",
      });
    });

    // Add recent payments
    const recentPayments = payments.slice(0, 2);
    recentPayments.forEach((payment) => {
      const timeAgo = Math.floor(
        (Date.now() - payment.createdAt) / (1000 * 60 * 60),
      ); // hours ago
      const amount = payment.orderAmount || payment.amount || 0;
      activities.push({
        action: `Payment ${payment.status} - KES ${amount.toLocaleString()}`,
        user: `${payment.customerFirstName || "Unknown"} ${payment.customerLastName || "User"}`,
        time: timeAgo < 1 ? "Just now" : `${timeAgo} hours ago`,
        type: payment.status === "paid" ? "payment-success" : "payment-pending",
      });
    });

    // Add some mock activities for other sections
    activities.push(
      {
        action: "New team member added",
        user: "Admin",
        time: "2 hours ago",
        type: "team",
      },
      {
        action: "Product updated",
        user: "Admin",
        time: "4 hours ago",
        type: "product",
      },
    );

    return activities.slice(0, 6); // Show only 6 recent activities
  };

  const recentActivity = generateRecentActivity();

  const teamMembers = [
    {
      id: 1,
      name: "Dr. Sarah Martinez",
      role: "Founder & Director",
      year: "2024",
      status: "Active",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Event Coordinator",
      year: "2024",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Aisha Patel",
      role: "Student Liaison",
      year: "2024",
      status: "Active",
    },
    {
      id: 4,
      name: "Lisa Thompson",
      role: "Communications Director",
      year: "2023",
      status: "Inactive",
    },
  ];

  const highlights = [
    {
      id: 1,
      title: "Breaking Barriers 2023",
      year: "2023",
      status: "Published",
      views: 1250,
    },
    {
      id: 2,
      title: "Stronger Together 2022",
      year: "2022",
      status: "Published",
      views: 980,
    },
    {
      id: 3,
      title: "Hope in Motion 2021",
      year: "2021",
      status: "Published",
      views: 750,
    },
  ];

  const products = [
    {
      id: 1,
      name: "Official Medical Students Run 2024 Tee",
      price: 25,
      stock: 150,
      sales: 89,
    },
    {
      id: 2,
      name: "Performance Running Tank",
      price: 28,
      stock: 75,
      sales: 45,
    },
    {
      id: 3,
      name: "Long Sleeve Support Shirt",
      price: 32,
      stock: 100,
      sales: 67,
    },
    {
      id: 4,
      name: "Medical Students Run Hoodie",
      price: 45,
      stock: 50,
      sales: 23,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4">
        {/* Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Medical Students Run Management
              </p>
            </div>
            <Badge className="bg-brand-success text-white w-fit">
              SYSTEM ONLINE
            </Badge>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 lg:w-fit gap-1">
            <TabsTrigger
              value="dashboard"
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <Package className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Payments</span>
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger
              value="highlights"
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Highlights</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
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
                      <p className="text-xs sm:text-sm text-slate-600">
                        Team Members
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        {stats.totalMembers}
                      </p>
                    </div>
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Highlights
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
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
                      <p className="text-xs sm:text-sm text-slate-600">
                        Products
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        {stats.totalProducts}
                      </p>
                    </div>
                    <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Revenue
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        KES {stats.totalRevenue.toLocaleString()}
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
                      <p className="text-xs sm:text-sm text-slate-600">
                        Monthly Orders
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        {stats.monthlyOrders}
                      </p>
                    </div>
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Active Years
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        {stats.activeYears}
                      </p>
                    </div>
                    <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Total Orders
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        {orderStats?.totalOrders || 0}
                      </p>
                    </div>
                    <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Paid Orders
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        {orderStats?.paidOrders || 0}
                      </p>
                    </div>
                    <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Successful Payments
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        {orderStats?.successfulPayments || 0}
                      </p>
                    </div>
                    <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Pending Payments
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        {orderStats?.pendingPayments || 0}
                      </p>
                    </div>
                    <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity - Mobile Optimized */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "team"
                              ? "bg-primary"
                              : activity.type === "product"
                                ? "bg-purple-600"
                                : activity.type === "order"
                                  ? "bg-blue-600"
                                  : activity.type === "payment-success"
                                    ? "bg-green-600"
                                    : activity.type === "payment-pending"
                                      ? "bg-yellow-600"
                                      : "bg-brand-success"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium text-foreground text-sm sm:text-base">
                            {activity.action}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600">
                            by {activity.user}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm text-slate-500">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Order Management
              </h2>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {orderStats?.totalOrders || 0} Total Orders
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {orderStats?.paidOrders || 0} Paid
                </Badge>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Order Ref
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Customer
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          T-Shirt
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Amount
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Status
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Date
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-t">
                          <td className="p-3 sm:p-4">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {order.orderReference}
                            </code>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div>
                              <p className="font-medium text-sm sm:text-base">
                                {order.name}
                              </p>
                              <p className="text-xs text-slate-600">
                                {order.email}
                              </p>
                              <p className="text-xs text-slate-600">
                                {order.phone}
                              </p>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div>
                              <p className="text-sm">{order.tshirtType}</p>
                              <p className="text-xs text-slate-600">
                                Size: {order.tshirtSize}
                              </p>
                              <p className="text-xs text-slate-600">
                                Qty: {order.quantity}
                              </p>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <span className="font-semibold">
                              KES {order.totalAmount.toLocaleString()}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4">
                            <Badge
                              variant={order.paid ? "default" : "outline"}
                              className={
                                order.paid
                                  ? "bg-green-600 text-white"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {order.paid ? "Paid" : "Pending"}
                            </Badge>
                          </td>
                          <td className="p-3 sm:p-4">
                            <p className="text-sm">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-600">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm">
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>No orders found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Payment Management
              </h2>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {orderStats?.successfulPayments || 0} Successful
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700"
                >
                  {orderStats?.pendingPayments || 0} Pending
                </Badge>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Order Ref
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Customer
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Amount
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Status
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Transaction ID
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Date
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment._id} className="border-t">
                          <td className="p-3 sm:p-4">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {payment.orderReference}
                            </code>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div>
                              <p className="font-medium text-sm sm:text-base">
                                {payment.customerFirstName || "Unknown"}{" "}
                                {payment.customerLastName || "User"}
                              </p>
                              <p className="text-xs text-slate-600">
                                {payment.customerEmail ||
                                  payment.phoneNumber ||
                                  "No email"}
                              </p>
                              <p className="text-xs text-slate-600">
                                {payment.customerPhone ||
                                  payment.phoneNumber ||
                                  "No phone"}
                              </p>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <span className="font-semibold">
                              {payment.currency || "KES"}{" "}
                              {(
                                payment.orderAmount ||
                                payment.amount ||
                                0
                              ).toLocaleString()}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4">
                            <Badge
                              variant="outline"
                              className={
                                payment.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {payment.status.charAt(0).toUpperCase() +
                                payment.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-3 sm:p-4">
                            {payment.transactionId ? (
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {payment.transactionId}
                              </code>
                            ) : (
                              <span className="text-xs text-slate-400">-</span>
                            )}
                          </td>
                          <td className="p-3 sm:p-4">
                            <p className="text-sm">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-600">
                              {new Date(payment.createdAt).toLocaleTimeString()}
                            </p>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm">
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {payments.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>No payments found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Team Management
              </h2>
              <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Name
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Role
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Year
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Status
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((member) => (
                        <tr key={member.id} className="border-t">
                          <td className="p-3 sm:p-4 font-medium text-sm sm:text-base">
                            {member.name}
                          </td>
                          <td className="p-3 sm:p-4 text-slate-600 text-sm sm:text-base">
                            {member.role}
                          </td>
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
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Highlights Management
              </h2>
              <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Highlight
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Title
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Year
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Status
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Views
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {highlights.map((highlight) => (
                        <tr key={highlight.id} className="border-t">
                          <td className="p-3 sm:p-4 font-medium text-sm sm:text-base">
                            {highlight.title}
                          </td>
                          <td className="p-3 sm:p-4">
                            <Badge variant="outline" className="text-xs">
                              {highlight.year}
                            </Badge>
                          </td>
                          <td className="p-3 sm:p-4">
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {highlight.status}
                            </Badge>
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
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Products Management
              </h2>
              <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Product Name
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Price
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Stock
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Sales
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-t">
                          <td className="p-3 sm:p-4 font-medium text-sm sm:text-base">
                            {product.name}
                          </td>
                          <td className="p-3 sm:p-4 text-slate-600 text-sm sm:text-base">
                            ${product.price}
                          </td>
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
                          <td className="p-3 sm:p-4 text-slate-600 text-sm sm:text-base">
                            {product.sales} sold
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
        </Tabs>
      </div>
    </div>
  );
}
