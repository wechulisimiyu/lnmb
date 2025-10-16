"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  Users,
  Award,
  ShoppingCart,
  Plus,
  Eye,
  BarChart3,
  DollarSign,
  Calendar,
  GraduationCap,
  Package,
  CreditCard,
  LogOut,
  Shield,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "director";
}

interface Order {
  _id: string;
  orderReference: string;
  name: string;
  email: string;
  phone: string;
  tshirtType: string;
  tshirtSize: string;
  quantity: number;
  totalAmount: number;
  paid: boolean;
  createdAt: number;
}

interface Payment {
  _id: string;
  orderReference: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  customerPhone?: string;
  phoneNumber?: string;
  currency?: string;
  orderAmount?: number;
  amount?: number;
  status: string;
  transactionId?: string;
  createdAt: number;
}

export default function ManagePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Get current user
  const currentUser = useQuery(
    api.auth.getCurrentUser,
    authToken ? { token: authToken } : "skip"
  );

  const logout = useMutation(api.auth.logout);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/manage/login");
      return;
    }

    setAuthToken(token);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  // Check if user is authenticated
  useEffect(() => {
    if (currentUser === null && authToken) {
      // User not authenticated, redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      router.push("/manage/login");
    } else if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser, authToken, router]);

  // Fetch data from Convex with auth token
  const orders = useQuery(
    api.orders.getAllOrders,
    authToken ? { token: authToken } : "skip"
  );
  const payments = useQuery(
    api.orders.getAllPayments,
    authToken ? { token: authToken } : "skip"
  );
  const orderStats = useQuery(
    api.orders.getOrderStats,
    authToken ? { token: authToken } : "skip"
  );

  const handleLogout = async () => {
    if (authToken) {
      try {
        await logout({ 
          token: authToken,
          userAgent: navigator.userAgent,
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/manage/login");
  };

  // Show loading while checking auth
  if (!authToken || !user) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Mock data for other sections (same as before)
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

    if (orders && orders.length > 0) {
      const recentOrders = orders.slice(0, 2);
      recentOrders.forEach((order) => {
        const timeAgo = Math.floor(
          (Date.now() - order.createdAt) / (1000 * 60 * 60)
        );
        activities.push({
          action: `New order for ${order.tshirtType} (${order.quantity}x)`,
          user: order.name,
          time: timeAgo < 1 ? "Just now" : `${timeAgo} hours ago`,
          type: "order",
        });
      });
    }

    if (payments && payments.length > 0) {
      const recentPayments = payments.slice(0, 2);
      recentPayments.forEach((payment) => {
        const timeAgo = Math.floor(
          (Date.now() - payment.createdAt) / (1000 * 60 * 60)
        );
        const amount = payment.orderAmount || payment.amount || 0;
        activities.push({
          action: `Payment ${payment.status} - KES ${amount.toLocaleString()}`,
          user: `${payment.customerFirstName || "Unknown"} ${payment.customerLastName || "User"}`,
          time: timeAgo < 1 ? "Just now" : `${timeAgo} hours ago`,
          type: payment.status === "paid" ? "payment-success" : "payment-pending",
        });
      });
    }

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
      }
    );

    return activities.slice(0, 6);
  };

  const recentActivity = generateRecentActivity();

  // Check if user has admin role
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-secondary py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4">
        {/* Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Management Dashboard
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Medical Students Run Management
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-600" />
                <div className="text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-slate-600 capitalize">{user.role}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
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
            {isAdmin && (
              <>
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
              </>
            )}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            {/* Stats Grid - Mobile Responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {isAdmin && (
                <>
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
                </>
              )}

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

              {isAdmin && (
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
              )}
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

            {/* Recent Activity */}
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
                      {orders &&
                        orders.map((order: Order) => (
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
                  {(!orders || orders.length === 0) && (
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
                      {payments &&
                        payments.map((payment: Payment) => (
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
                  {(!payments || payments.length === 0) && (
                    <div className="p-8 text-center text-slate-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>No payments found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin-only tabs */}
          {isAdmin && (
            <>
              {/* Team Management Tab - Simplified mock for now */}
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
                  <CardContent className="p-8 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Team management feature coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Highlights Management Tab - Simplified mock */}
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
                  <CardContent className="p-8 text-center text-slate-500">
                    <Award className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Highlights management feature coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Products Management Tab - Simplified mock */}
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
                  <CardContent className="p-8 text-center text-slate-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Products management feature coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
