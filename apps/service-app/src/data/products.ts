import type { Product } from "@/types/product";

export const CARRIERS = ["GigaTel", "NovaMobile", "SkyConnect", "VinaLink"] as const;

export const products: Product[] = [
  // ---- eSIM plans ----
  {
    id: "plan-giga-01",
    category: "esim",
    carrier: "GigaTel",
    name: "Siêu Việt eSIM 5G",
    badge: "Hỗ trợ eSIM",
    icon: "📶",
    highlights: ["240GB/tháng", "Miễn phí nội mạng", "100' ngoại mạng"],
    basePrice: 350000,
    stock: "Còn hàng",
    description:
      "Gói cước tốc độ cao dành cho người dùng data lớn, kèm ưu đãi thoại nội mạng không giới hạn.",
    variantGroups: [
      {
        id: "duration",
        label: "Kỳ hạn gói",
        options: [
          { id: "v1", label: "1 tháng", priceDelta: 0 },
          { id: "v3", label: "3 tháng", priceDelta: -30000 },
          { id: "v6", label: "6 tháng", priceDelta: -70000 },
        ],
      },
    ],
    detailRows: [
      { label: "Nhà mạng", value: "GigaTel" },
      { label: "Dung lượng", value: "240GB/tháng" },
      { label: "Phí gia hạn", value: "160.000đ/tháng" },
      { label: "Ưu đãi kèm theo", value: "Miễn phí nội mạng, 100' ngoại mạng" },
      { label: "Quà tặng", value: "Gói Basic TV360" },
      { label: "Loại SIM", value: "eSIM (kích hoạt qua QR)" },
      { label: "Xuất xứ", value: "Việt Nam" },
    ],
  },
  {
    id: "plan-nova-01",
    category: "esim",
    carrier: "NovaMobile",
    name: "NovaMax eSIM Data",
    badge: "Hỗ trợ eSIM",
    icon: "📶",
    highlights: ["180GB/tháng", "Miễn phí nội mạng"],
    basePrice: 299000,
    stock: "Còn hàng",
    description: "Gói data tiết kiệm, phù hợp cho nhu cầu lướt web và mạng xã hội hàng ngày.",
    variantGroups: [
      {
        id: "duration",
        label: "Kỳ hạn gói",
        options: [
          { id: "v1", label: "1 tháng", priceDelta: 0 },
          { id: "v3", label: "3 tháng", priceDelta: -20000 },
        ],
      },
    ],
    detailRows: [
      { label: "Nhà mạng", value: "NovaMobile" },
      { label: "Dung lượng", value: "180GB/tháng" },
      { label: "Phí gia hạn", value: "140.000đ/tháng" },
      { label: "Ưu đãi kèm theo", value: "Miễn phí nội mạng" },
      { label: "Loại SIM", value: "eSIM (kích hoạt qua QR)" },
      { label: "Xuất xứ", value: "Việt Nam" },
    ],
  },
  {
    id: "plan-sky-01",
    category: "esim",
    carrier: "SkyConnect",
    name: "SkyConnect eSIM Pro",
    badge: "Hỗ trợ eSIM",
    icon: "📶",
    highlights: ["300GB/tháng", "Miễn phí nội mạng", "200' ngoại mạng"],
    basePrice: 399000,
    stock: "Còn hàng",
    description: "Gói cao cấp cho người dùng cần data lớn và nhiều phút gọi ngoại mạng.",
    variantGroups: [
      {
        id: "duration",
        label: "Kỳ hạn gói",
        options: [
          { id: "v1", label: "1 tháng", priceDelta: 0 },
          { id: "v3", label: "3 tháng", priceDelta: -40000 },
          { id: "v6", label: "6 tháng", priceDelta: -90000 },
          { id: "v12", label: "12 tháng", priceDelta: -180000 },
        ],
      },
    ],
    detailRows: [
      { label: "Nhà mạng", value: "SkyConnect" },
      { label: "Dung lượng", value: "300GB/tháng" },
      { label: "Phí gia hạn", value: "199.000đ/tháng" },
      { label: "Ưu đãi kèm theo", value: "Miễn phí nội mạng, 200' ngoại mạng" },
      { label: "Quà tặng", value: "1 tháng Music+" },
      { label: "Loại SIM", value: "eSIM (kích hoạt qua QR)" },
      { label: "Xuất xứ", value: "Việt Nam" },
    ],
  },
  {
    id: "plan-vina-01",
    category: "esim",
    carrier: "VinaLink",
    name: "VinaLink eSIM Sinh Viên",
    badge: "Hỗ trợ eSIM",
    icon: "📶",
    highlights: ["150GB/tháng", "Miễn phí nội mạng"],
    basePrice: 199000,
    stock: "Còn hàng",
    description: "Gói ưu đãi dành riêng cho học sinh, sinh viên với mức giá tiết kiệm.",
    variantGroups: [
      {
        id: "duration",
        label: "Kỳ hạn gói",
        options: [
          { id: "v1", label: "1 tháng", priceDelta: 0 },
          { id: "v3", label: "3 tháng", priceDelta: -15000 },
        ],
      },
    ],
    detailRows: [
      { label: "Nhà mạng", value: "VinaLink" },
      { label: "Dung lượng", value: "150GB/tháng" },
      { label: "Phí gia hạn", value: "99.000đ/tháng" },
      { label: "Ưu đãi kèm theo", value: "Miễn phí nội mạng" },
      { label: "Loại SIM", value: "eSIM (kích hoạt qua QR)" },
      { label: "Xuất xứ", value: "Việt Nam" },
    ],
  },
  {
    id: "plan-giga-02",
    category: "esim",
    carrier: "GigaTel",
    name: "GigaTel eSIM Gia Đình",
    badge: "Hỗ trợ eSIM",
    icon: "📶",
    highlights: ["400GB/tháng", "Miễn phí nội mạng", "300' ngoại mạng"],
    basePrice: 450000,
    stock: "Còn hàng",
    description: "Chia sẻ data cho cả gia đình với dung lượng lớn và nhiều ưu đãi đi kèm.",
    variantGroups: [
      {
        id: "duration",
        label: "Kỳ hạn gói",
        options: [
          { id: "v1", label: "1 tháng", priceDelta: 0 },
          { id: "v6", label: "6 tháng", priceDelta: -100000 },
          { id: "v12", label: "12 tháng", priceDelta: -220000 },
        ],
      },
    ],
    detailRows: [
      { label: "Nhà mạng", value: "GigaTel" },
      { label: "Dung lượng", value: "400GB/tháng" },
      { label: "Phí gia hạn", value: "249.000đ/tháng" },
      { label: "Ưu đãi kèm theo", value: "Miễn phí nội mạng, 300' ngoại mạng" },
      { label: "Quà tặng", value: "Gói Premium TV360" },
      { label: "Loại SIM", value: "eSIM (kích hoạt qua QR)" },
      { label: "Xuất xứ", value: "Việt Nam" },
    ],
  },
  {
    id: "plan-sky-02",
    category: "esim",
    carrier: "SkyConnect",
    name: "SkyConnect eSIM Cơ Bản",
    badge: "Hỗ trợ eSIM",
    icon: "📶",
    highlights: ["100GB/tháng", "Miễn phí nội mạng"],
    basePrice: 149000,
    stock: "Còn hàng",
    description: "Gói cơ bản, giá tốt cho nhu cầu liên lạc và data ở mức vừa phải.",
    variantGroups: [
      {
        id: "duration",
        label: "Kỳ hạn gói",
        options: [
          { id: "v1", label: "1 tháng", priceDelta: 0 },
          { id: "v3", label: "3 tháng", priceDelta: -10000 },
        ],
      },
    ],
    detailRows: [
      { label: "Nhà mạng", value: "SkyConnect" },
      { label: "Dung lượng", value: "100GB/tháng" },
      { label: "Phí gia hạn", value: "79.000đ/tháng" },
      { label: "Ưu đãi kèm theo", value: "Miễn phí nội mạng" },
      { label: "Loại SIM", value: "eSIM (kích hoạt qua QR)" },
      { label: "Xuất xứ", value: "Việt Nam" },
    ],
  },

  // ---- Accessories (cross-sell) ----
  {
    id: "acc-01",
    category: "accessory",
    name: "Ốp lưng điện thoại chống sốc",
    icon: "📱",
    basePrice: 149000,
    stock: "Còn hàng",
    description: "Ốp lưng silicon chống sốc, bảo vệ toàn diện các góc cạnh của máy.",
    variantGroups: [
      {
        id: "color",
        label: "Màu sắc",
        options: [
          { id: "black", label: "Đen", priceDelta: 0 },
          { id: "white", label: "Trắng", priceDelta: 0 },
          { id: "blue", label: "Xanh dương", priceDelta: 10000 },
        ],
      },
    ],
    detailRows: [
      { label: "Thương hiệu", value: "GenericAcc" },
      { label: "Chất liệu", value: "Silicon TPU" },
      { label: "Bảo hành", value: "6 tháng" },
      { label: "Xuất xứ", value: "Việt Nam" },
    ],
  },
  {
    id: "acc-02",
    category: "accessory",
    name: "Sạc nhanh 20W đầu USB-C",
    icon: "🔌",
    basePrice: 259000,
    stock: "Còn hàng",
    description: "Củ sạc nhanh công suất 20W, hỗ trợ sạc nhanh cho hầu hết điện thoại phổ biến.",
    variantGroups: [
      {
        id: "color",
        label: "Màu sắc",
        options: [
          { id: "white", label: "Trắng", priceDelta: 0 },
          { id: "black", label: "Đen", priceDelta: 0 },
        ],
      },
    ],
    detailRows: [
      { label: "Thương hiệu", value: "GenericAcc" },
      { label: "Công suất", value: "20W" },
      { label: "Bảo hành", value: "12 tháng" },
      { label: "Xuất xứ", value: "Việt Nam" },
    ],
  },
  {
    id: "acc-03",
    category: "accessory",
    name: "Tai nghe Bluetooth true wireless",
    icon: "🎧",
    basePrice: 399000,
    stock: "Còn hàng",
    description: "Tai nghe không dây chống ồn, thời lượng pin lên đến 24 giờ kèm hộp sạc.",
    variantGroups: [
      {
        id: "color",
        label: "Màu sắc",
        options: [
          { id: "black", label: "Đen", priceDelta: 0 },
          { id: "white", label: "Trắng", priceDelta: 0 },
        ],
      },
    ],
    detailRows: [
      { label: "Thương hiệu", value: "GenericAcc" },
      { label: "Thời lượng pin", value: "24 giờ (kèm hộp sạc)" },
      { label: "Kết nối", value: "Bluetooth 5.3" },
      { label: "Bảo hành", value: "12 tháng" },
      { label: "Xuất xứ", value: "Việt Nam" },
    ],
  },
  {
    id: "acc-04",
    category: "accessory",
    name: "Cáp sạc Type-C",
    icon: "🔗",
    basePrice: 89000,
    stock: "Còn hàng",
    description: "Cáp sạc Type-C bọc dù chống đứt gãy, hỗ trợ sạc nhanh và truyền dữ liệu.",
    // Two independent variant groups on the same product — length AND color.
    variantGroups: [
      {
        id: "length",
        label: "Chiều dài",
        options: [
          { id: "1m", label: "1m", priceDelta: 0 },
          { id: "1.5m", label: "1.5m", priceDelta: 15000 },
          { id: "2m", label: "2m", priceDelta: 25000 },
        ],
      },
      {
        id: "color",
        label: "Màu sắc",
        options: [
          { id: "black", label: "Đen", priceDelta: 0 },
          { id: "white", label: "Trắng", priceDelta: 0 },
        ],
      },
    ],
    detailRows: [
      { label: "Thương hiệu", value: "GenericAcc" },
      { label: "Chất liệu", value: "Bọc dù chống đứt gãy" },
      { label: "Bảo hành", value: "6 tháng" },
      { label: "Xuất xứ", value: "Việt Nam" },
    ],
  },
  {
    id: "acc-05",
    category: "accessory",
    name: "Pin sạc dự phòng",
    icon: "🔋",
    basePrice: 349000,
    stock: "Còn hàng",
    description: "Pin sạc dự phòng nhỏ gọn, hỗ trợ sạc nhanh hai chiều.",
    variantGroups: [
      {
        id: "capacity",
        label: "Dung lượng",
        options: [
          { id: "10000", label: "10.000mAh", priceDelta: 0 },
          { id: "20000", label: "20.000mAh", priceDelta: 150000 },
        ],
      },
      {
        id: "color",
        label: "Màu sắc",
        options: [
          { id: "black", label: "Đen", priceDelta: 0 },
          { id: "white", label: "Trắng", priceDelta: 0 },
        ],
      },
    ],
    detailRows: [
      { label: "Thương hiệu", value: "GenericAcc" },
      { label: "Công nghệ sạc", value: "Sạc nhanh hai chiều" },
      { label: "Bảo hành", value: "12 tháng" },
      { label: "Xuất xứ", value: "Việt Nam" },
    ],
  },
];

export const esimPlans = products.filter((p) => p.category === "esim");
export const accessories = products.filter((p) => p.category === "accessory");

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
