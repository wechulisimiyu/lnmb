"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import {
  Users,
  ShoppingCart,
  Eye,
  BarChart3,
  DollarSign,
  Calendar,
  Package,
  CreditCard,
  Shield,
  LogIn,
} from "lucide-react";

interface Order {
  _id: string;
  orderReference: string;
  name: string;
  email: string;
  phone?: string;
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

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user } = useUser();

  // Fetch data from Convex - now safe to call
  const orders = useQuery(api.orders.getAllOrders, {});
  const payments = useQuery(api.orders.getAllPayments, {});
  const orderStats = useQuery(api.orders.getOrderStats, {});

  const totalOrders = orderStats?.totalOrders ?? (orders ? orders.length : 0);
  const paidOrders =
    orderStats?.paidOrders ??
    (orders ? orders.filter((order) => order.paid).length : 0);
  const successfulPayments =
    orderStats?.successfulPayments ??
    (payments
      ? payments.filter((payment) => payment.status === "paid").length
      : 0);
  const pendingPayments =
    orderStats?.pendingPayments ??
    (payments
      ? payments.filter((payment) => payment.status === "pending").length
      : 0);
  const totalRevenue =
    orderStats?.totalRevenue ??
    (orders
      ? orders
          .filter((order) => order.paid)
          .reduce((sum, order) => sum + order.totalAmount, 0)
      : 0);
  const monthlyOrders =
    orderStats?.monthlyOrders ??
    (orders
      ? orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          const now = new Date();
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        }).length
      : 0);
  const itemsSold = orders
    ? orders.reduce((sum, order) => sum + order.quantity, 0)
    : 0;
  const uniqueCustomers = orders
    ? new Set(
        orders
          .map((order) => order.email)
          .filter((email): email is string => Boolean(email)),
      ).size
    : 0;
  const outstandingBalance = orders
    ? orders
        .filter((order) => !order.paid)
        .reduce((sum, order) => sum + order.totalAmount, 0)
    : 0;
  const averageOrderValue =
    paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0;
  const pendingOrders = Math.max(totalOrders - paidOrders, 0);

  const formatCurrency = (value: number) => `KES ${value.toLocaleString()}`;

  type OverviewCard = {
    label: string;
    value: string;
    icon: LucideIcon;
    iconClass: string;
  };

  const overviewCards: OverviewCard[] = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      iconClass: "text-green-600",
    },
    {
      label: "Monthly Orders",
      value: monthlyOrders.toLocaleString(),
      icon: Calendar,
      iconClass: "text-blue-600",
    },
    {
      label: "Items Sold",
      value: itemsSold.toLocaleString(),
      icon: ShoppingCart,
      iconClass: "text-purple-600",
    },
    {
      label: "Pending Orders",
      value: pendingOrders.toLocaleString(),
      icon: Package,
      iconClass: "text-amber-600",
    },
    {
      label: "Unique Customers",
      value: uniqueCustomers.toLocaleString(),
      icon: Users,
      iconClass: "text-slate-600",
    },
    {
      label: "Average Order Value",
      value: formatCurrency(averageOrderValue),
      icon: BarChart3,
      iconClass: "text-indigo-600",
    },
    {
      label: "Outstanding Balance",
      value: formatCurrency(outstandingBalance),
      icon: CreditCard,
      iconClass: "text-rose-600",
    },
  ];

  const generateRecentActivity = () => {
    type Activity = {
      action: string;
      user: string;
      time: string;
      type: string;
      timestamp: number;
    };

    const describeTimeAgo = (timestamp: number) => {
      const diff = Date.now() - timestamp;
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes < 1) return "Just now";
      if (minutes < 60)
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
      const days = Math.floor(hours / 24);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    };

    const activities: Activity[] = [];
    if (orders && orders.length > 0) {
      orders.slice(0, 5).forEach((order) => {
        activities.push({
          action: `New order for ${order.tshirtType} (${order.quantity}x)`,
          user: order.name,
          time: describeTimeAgo(order.createdAt),
          type: "order",
          timestamp: order.createdAt,
        });
      });
    }

    if (payments && payments.length > 0) {
      payments.slice(0, 5).forEach((payment) => {
        const amount = payment.orderAmount ?? payment.amount ?? 0;
        const name =
          [payment.customerFirstName, payment.customerLastName]
            .filter(Boolean)
            .join(" ") || "Unknown User";
        let activityType = "payment-pending";
        if (payment.status === "paid") activityType = "payment-success";
        else if (payment.status !== "pending") activityType = "payment-other";
        activities.push({
          action: `Payment ${payment.status} - ${formatCurrency(amount)}`,
          user: name,
          time: describeTimeAgo(payment.createdAt),
          type: activityType,
          timestamp: payment.createdAt,
        });
      });
    }

    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 6)
      .map(({ action, user, time, type }) => ({ action, user, time, type }));
  };

  const recentActivity = generateRecentActivity();

  return (
    <div className="min-h-screen bg-secondary py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4">
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
                  <p className="font-medium">{user?.fullName}</p>
                </div>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-fit gap-1">
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
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {overviewCards.map(({ label, value, icon: Icon, iconClass }) => (
                <Card key={label}>
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-slate-600">
                          {label}
                        </p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                          {value}
                        </p>
                      </div>
                      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${iconClass}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Total Orders
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        {totalOrders.toLocaleString()}
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
                        {paidOrders.toLocaleString()}
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
                        {successfulPayments.toLocaleString()}
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
                        {pendingPayments.toLocaleString()}
                      </p>
                    </div>
                    <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div
                        key={`${activity.action}-${activity.time}-${index}`}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${activity.type === "order" ? "bg-blue-600" : activity.type === "payment-success" ? "bg-green-600" : activity.type === "payment-pending" ? "bg-yellow-600" : "bg-slate-400"}`}
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
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      No recent activity yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Order Management
              </h2>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {totalOrders.toLocaleString()} Total Orders
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {paidOrders.toLocaleString()} Paid
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

          <TabsContent value="payments" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Payment Management
              </h2>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {successfulPayments.toLocaleString()} Successful
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700"
                >
                  {pendingPayments.toLocaleString()} Pending
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
                                <span className="text-xs text-slate-400">
                                  -
                                </span>
                              )}
                            </td>
                            <td className="p-3 sm:p-4">
                              <p className="text-sm">
                                {new Date(
                                  payment.createdAt,
                                ).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-slate-600">
                                {new Date(
                                  payment.createdAt,
                                ).toLocaleTimeString()}
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
        </Tabs>
      </div>
    </div>
  );
}

export default function ManagePage() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-sm mx-auto">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600 mb-6">
            You must be signed in to access the management dashboard.
          </p>
          <SignInButton mode="redirect" forceRedirectUrl="/manage">
            <Button className="w-full">
              <LogIn className="w-4 h-4 mr-2" />
              Sign in with Google
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return <DashboardContent />;
}
