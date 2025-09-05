import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import Image from "next/image"

export function ShopProducts() {
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
  )
}

export default ShopProducts