import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Truck, Shield, Heart } from "lucide-react"
import Image from "next/image"

export default function ShopPage() {
  const products = [
    {
      id: 1,
      name: "Official Medical Students Run 2024 Tee",
      price: 100,
      image: "/medical-students-charity-event.png",
      description: "Premium cotton t-shirt featuring our 2024 charity run design",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Navy", "White", "Gray"],
      rating: 4.8,
      reviews: 124,
      bestseller: true,
    },
    {
      id: 2,
      name: "Performance Running Tank",
      price: 100,
      image: "/medical-students-charity-event.png",
      description: "Moisture-wicking athletic tank perfect for training and race day",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Blue", "Black", "White"],
      rating: 4.7,
      reviews: 89,
      bestseller: false,
    },
    {
      id: 3,
      name: "Long Sleeve Support Shirt",
      price: 100,
      image: "/medical-students-charity-event.png",
      description: "Comfortable long sleeve with inspiring medical student support message",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Navy", "Maroon", "Forest Green"],
      rating: 4.9,
      reviews: 156,
      bestseller: false,
    },
    {
      id: 4,
      name: "Medical Students Run Hoodie",
      price: 100,
      image: "/medical-students-charity-event.png",
      description: "Cozy fleece hoodie with embroidered logo and mission statement",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Navy", "Gray", "Black"],
      rating: 4.8,
      reviews: 203,
      bestseller: true,
    },
    {
      id: 5,
      name: "Stethoscope Charm Bracelet",
      price: 100,
      image: "/medical-students-charity-event.png",
      description: "Elegant bracelet with medical-themed charms supporting student scholarships",
      sizes: ["One Size"],
      colors: ["Silver", "Gold"],
      rating: 4.6,
      reviews: 67,
      bestseller: false,
    },
    {
      id: 6,
      name: "Water Bottle - Leave No Medic Behind",
      price: 100,
      image: "/medical-students-charity-event.png",
      description: "Insulated water bottle perfect for staying hydrated during runs and studies",
      sizes: ["500ml"],
      colors: ["Blue", "White", "Black"],
      rating: 4.7,
      reviews: 91,
      bestseller: false,
    },
  ]

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Badge className="bg-blue-600 text-white mb-3 sm:mb-4 px-3 py-1 text-sm">OFFICIAL MERCHANDISE</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
            Shop Our Collection
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Every purchase directly supports medical student scholarships and educational resources. Shop with purpose
            and make a difference in healthcare education.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Bestseller Badge */}
              {product.bestseller && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-orange-500 text-white px-3 py-1 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    BESTSELLER
                  </Badge>
                </div>
              )}

              {/* Product Image */}
              <div className="relative overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Product Info */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-500 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Size Options */}
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-2">Available Sizes:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <Badge key={size} variant="outline" className="text-xs">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Color Options */}
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-2">Colors:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <Badge key={color} variant="outline" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">KES {product.price}</span>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping & Returns Info */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Free Shipping</h3>
            <p className="text-slate-600 text-sm">Free shipping on orders over KES 200 within Kenya</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Quality Guarantee</h3>
            <p className="text-slate-600 text-sm">30-day return policy on all merchandise</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Supporting Students</h3>
            <p className="text-slate-600 text-sm">Every purchase funds medical student scholarships</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-50 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Shop with Purpose</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-6">
            When you purchase from our official merchandise store, you&apos;re not just getting quality products – you&apos;re
            directly contributing to medical student scholarships and educational resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent">
              Learn About Our Impact
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
