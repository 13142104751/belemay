import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productModelCompatibility.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.model.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  // ======= BRANDS =======
  const apple = await prisma.brand.create({
    data: { name: "Apple", slug: "apple" },
  });
  const samsung = await prisma.brand.create({
    data: { name: "Samsung", slug: "samsung" },
  });
  const google = await prisma.brand.create({
    data: { name: "Google", slug: "google" },
  });

  // ======= MODELS =======
  const iphoneModels = [
    await prisma.model.create({ data: { name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", brandId: apple.id } }),
    await prisma.model.create({ data: { name: "iPhone 16 Pro", slug: "iphone-16-pro", brandId: apple.id } }),
    await prisma.model.create({ data: { name: "iPhone 16", slug: "iphone-16", brandId: apple.id } }),
    await prisma.model.create({ data: { name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", brandId: apple.id } }),
    await prisma.model.create({ data: { name: "iPhone 15 Pro", slug: "iphone-15-pro", brandId: apple.id } }),
    await prisma.model.create({ data: { name: "iPhone 15", slug: "iphone-15", brandId: apple.id } }),
  ];

  const samsungModels = [
    await prisma.model.create({ data: { name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", brandId: samsung.id } }),
    await prisma.model.create({ data: { name: "Galaxy S25", slug: "galaxy-s25", brandId: samsung.id } }),
    await prisma.model.create({ data: { name: "Galaxy S24 Ultra", slug: "galaxy-s24-ultra", brandId: samsung.id } }),
    await prisma.model.create({ data: { name: "Galaxy S24", slug: "galaxy-s24", brandId: samsung.id } }),
  ];

  const googleModels = [
    await prisma.model.create({ data: { name: "Pixel 9 Pro", slug: "pixel-9-pro", brandId: google.id } }),
    await prisma.model.create({ data: { name: "Pixel 9", slug: "pixel-9", brandId: google.id } }),
    await prisma.model.create({ data: { name: "Pixel 8 Pro", slug: "pixel-8-pro", brandId: google.id } }),
    await prisma.model.create({ data: { name: "Pixel 8", slug: "pixel-8", brandId: google.id } }),
  ];

  // ======= CATEGORIES =======
  const clear = await prisma.category.create({ data: { name: "Clear Cases", slug: "clear", description: "Transparent cases that show off your phone's design." } });
  const silicone = await prisma.category.create({ data: { name: "Silicone", slug: "silicone", description: "Soft-touch silicone cases with a premium feel." } });
  const magsafe = await prisma.category.create({ data: { name: "MagSafe", slug: "magsafe", description: "Magnetic cases compatible with MagSafe accessories." } });
  const rugged = await prisma.category.create({ data: { name: "Rugged", slug: "rugged", description: "Heavy-duty protection for demanding environments." } });
  const leather = await prisma.category.create({ data: { name: "Leather", slug: "leather", description: "Premium genuine leather cases." } });

  // ======= PRODUCTS =======
  // Helper to create a product with variants, images, compatibilities, and categories
  async function createProduct(data: {
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    compareAtPrice?: number;
    isFeatured?: boolean;
    isNew?: boolean;
    onSale?: boolean;
    brandId: string;
    categoryIds: string[];
    modelIds: string[];
    variants: Array<{
      colorName: string;
      colorHex: string;
      stock: number;
      price?: number;
    }>;
  }) {
    const { variants, categoryIds, modelIds, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        featuredImageUrl: `https://picsum.photos/seed/${data.slug}/600/600`,
        totalStock: variants.reduce((sum, v) => sum + v.stock, 0),
        variants: {
          create: variants.map((v, i) => ({
            sku: `${data.slug.toUpperCase()}-${v.colorName.toUpperCase().replace(/\s/g, "")}-${i + 1}`,
            colorName: v.colorName,
            colorHex: v.colorHex,
            stock: v.stock,
            price: v.price,
            imageUrl: `https://picsum.photos/seed/${data.slug}-${i}/600/600`,
          })),
        },
        images: {
          create: [
            { url: `https://picsum.photos/seed/${data.slug}-a/600/600`, order: 1, alt: `${data.name} View 1` },
            { url: `https://picsum.photos/seed/${data.slug}-b/600/600`, order: 2, alt: `${data.name} View 2` },
          ],
        },
        categories: {
          create: categoryIds.map((id) => ({ categoryId: id })),
        },
        compatibleModels: {
          create: modelIds.map((id) => ({ modelId: id })),
        },
      },
    });

    return product;
  }

  // --- iPhone Products ---
  const allIphoneModels = iphoneModels.map((m) => m.id);
  const iphone16Models = iphoneModels.filter((m) => m.slug.startsWith("iphone-16")).map((m) => m.id);

  // 1. Crystal Clear Case
  await createProduct({
    name: "Crystal Clear Case",
    slug: "crystal-clear-case",
    description: "Ultra-transparent case that lets your iPhone's original color shine through. Military-grade drop protection with reinforced corners without adding bulk. Anti-yellowing coating keeps it crystal clear for longer.",
    basePrice: 19.99,
    isFeatured: true,
    brandId: apple.id,
    categoryIds: [clear.id],
    modelIds: allIphoneModels,
    variants: [
      { colorName: "Clear", colorHex: "#e8e8e8", stock: 100 },
    ],
  });

  // 2. Silicone Soft Touch
  await createProduct({
    name: "Liquid Silicone Case",
    slug: "liquid-silicone-case",
    description: "Premium liquid silicone with a buttery soft-touch finish. Inside lined with soft microfiber to protect your phone. Slim profile with precise cutouts and responsive button covers.",
    basePrice: 24.99,
    compareAtPrice: 29.99,
    onSale: true,
    isFeatured: true,
    brandId: apple.id,
    categoryIds: [silicone.id],
    modelIds: allIphoneModels,
    variants: [
      { colorName: "Midnight Black", colorHex: "#1a1a1a", stock: 80 },
      { colorName: "Stone Gray", colorHex: "#8e8e93", stock: 60 },
      { colorName: "Deep Blue", colorHex: "#003d6b", stock: 70 },
      { colorName: "Rose Pink", colorHex: "#f5c6d0", stock: 50 },
      { colorName: "Forest Green", colorHex: "#2d5a27", stock: 45 },
      { colorName: "Cream", colorHex: "#f5f0e6", stock: 55 },
    ],
  });

  // 3. MagSafe Magnetic Case
  await createProduct({
    name: "MagSafe Magnetic Case",
    slug: "magsafe-magnetic-case",
    description: "Built-in ring of 38 powerful magnets for seamless MagSafe attachment. Compatible with all MagSafe chargers, wallets, and accessories. Dual-layer construction absorbs shock while maintaining a slim 1.2mm profile.",
    basePrice: 34.99,
    isNew: true,
    isFeatured: true,
    brandId: apple.id,
    categoryIds: [magsafe.id, clear.id],
    modelIds: iphone16Models,
    variants: [
      { colorName: "Matte Black", colorHex: "#2a2a2a", stock: 90 },
      { colorName: "Clear", colorHex: "#e8e8e8", stock: 75 },
      { colorName: "Matte White", colorHex: "#f0f0f0", stock: 60 },
    ],
  });

  // 4. Rugged Armor Pro
  await createProduct({
    name: "Rugged Armor Pro",
    slug: "rugged-armor-pro",
    description: "Tested to withstand drops from up to 10 feet. Dual-layer design with a rigid outer shell and shock-absorbing inner core. Raised bezels protect the screen and camera. Built-in kickstand for hands-free viewing.",
    basePrice: 39.99,
    isFeatured: true,
    brandId: apple.id,
    categoryIds: [rugged.id],
    modelIds: allIphoneModels,
    variants: [
      { colorName: "Tactical Black", colorHex: "#1c1c1c", stock: 100 },
      { colorName: "Olive Green", colorHex: "#4a5d23", stock: 50 },
      { colorName: "Desert Tan", colorHex: "#c4a882", stock: 40 },
    ],
  });

  // 5. Leather Wallet Case
  await createProduct({
    name: "Leather Wallet Case",
    slug: "leather-wallet-case",
    description: "Genuine Italian leather that develops a beautiful patina over time. Integrated card slot holds up to 2 cards. Precision-crafted with reinforced stitching and a slim, pocketable design.",
    basePrice: 49.99,
    isNew: true,
    brandId: apple.id,
    categoryIds: [leather.id, magsafe.id],
    modelIds: iphone16Models,
    variants: [
      { colorName: "Saddle Brown", colorHex: "#8b4513", stock: 35 },
      { colorName: "Black", colorHex: "#1a1a1a", stock: 45 },
      { colorName: "Midnight Blue", colorHex: "#191970", stock: 30 },
    ],
  });

  // 6. Minimalist Matte
  await createProduct({
    name: "Minimalist Matte Case",
    slug: "minimalist-matte-case",
    description: "Ultra-thin 0.35mm matte case for minimalists. Scratch-resistant matte coating that feels smooth and grippy. Precise cutouts for ports and speakers. Weighs only 8 grams.",
    basePrice: 14.99,
    isNew: true,
    brandId: apple.id,
    categoryIds: [clear.id],
    modelIds: iphone16Models,
    variants: [
      { colorName: "Frosted Black", colorHex: "#333333", stock: 120 },
      { colorName: "Frosted White", colorHex: "#e0e0e0", stock: 90 },
    ],
  });

  // --- Samsung Products ---
  const samsung25Models = samsungModels.filter((m) => m.slug.startsWith("galaxy-s25")).map((m) => m.id);
  const allSamsungModels = samsungModels.map((m) => m.id);

  // 7. Samsung Silicone Grip
  await createProduct({
    name: "Silicone Grip Case",
    slug: "samsung-silicone-grip",
    description: "Textured silicone provides an incredibly secure grip on your Galaxy. Raised ridges on the sides for extra hold. Available in bold colors that complement the Galaxy design.",
    basePrice: 22.99,
    isFeatured: true,
    brandId: samsung.id,
    categoryIds: [silicone.id],
    modelIds: allSamsungModels,
    variants: [
      { colorName: "Phantom Black", colorHex: "#111111", stock: 80 },
      { colorName: "Lavender", colorHex: "#b8a0d0", stock: 45 },
      { colorName: "Lime", colorHex: "#c0d730", stock: 35 },
      { colorName: "Cream", colorHex: "#f2e8d5", stock: 50 },
    ],
  });

  // 8. Samsung Rugged Shield
  await createProduct({
    name: "Rugged Shield Case",
    slug: "samsung-rugged-shield",
    description: "Maximum protection for Galaxy devices. Air-cushioned corners, raised camera ring, and textured grip panels. Passes MIL-STD-810G drop test standards.",
    basePrice: 36.99,
    brandId: samsung.id,
    categoryIds: [rugged.id, magsafe.id],
    modelIds: samsung25Models,
    variants: [
      { colorName: "Stealth Black", colorHex: "#0d0d0d", stock: 70 },
      { colorName: "Titanium Gray", colorHex: "#6d6d6d", stock: 55 },
    ],
  });

  // 9. Samsung Clear View
  await createProduct({
    name: "Clear View Case",
    slug: "samsung-clear-view",
    description: "Crystal clear case designed specifically for Galaxy devices. Precision camera cutouts that frame the lens array perfectly. Anti-yellowing technology keeps it looking fresh.",
    basePrice: 18.99,
    isNew: true,
    brandId: samsung.id,
    categoryIds: [clear.id],
    modelIds: samsung25Models,
    variants: [
      { colorName: "Clear", colorHex: "#e8e8e8", stock: 90 },
    ],
  });

  // --- Google Pixel Products ---
  const allGoogleModels = googleModels.map((m) => m.id);

  // 10. Pixel Silicone Case
  await createProduct({
    name: "Pixel Silicone Case",
    slug: "pixel-silicone-case",
    description: "Designed to perfectly fit the Pixel's unique camera bar. Premium silicone with a soft microfiber lining. Precise cutouts that don't interfere with the fingerprint sensor.",
    basePrice: 24.99,
    isFeatured: true,
    brandId: google.id,
    categoryIds: [silicone.id],
    modelIds: allGoogleModels,
    variants: [
      { colorName: "Obsidian", colorHex: "#1c1c1c", stock: 65 },
      { colorName: "Hazel", colorHex: "#8b7355", stock: 45 },
      { colorName: "Porcelain", colorHex: "#f5f0eb", stock: 55 },
      { colorName: "Bay Blue", colorHex: "#5b7a9a", stock: 40 },
    ],
  });

  // 11. Pixel Clear Case
  await createProduct({
    name: "Pixel Clear Case",
    slug: "pixel-clear-case",
    description: "Showcase your Pixel's unique design. Ultra-clear polycarbonate with UV-resistant coating. Raised edges protect the camera bar and display.",
    basePrice: 17.99,
    brandId: google.id,
    categoryIds: [clear.id, magsafe.id],
    modelIds: allGoogleModels,
    variants: [
      { colorName: "Clear", colorHex: "#e8e8e8", stock: 85 },
    ],
  });

  // 12. Universal Lanyard Case (for all brands)
  const allModels = [...allIphoneModels, ...allSamsungModels, ...allGoogleModels];

  await createProduct({
    name: "Adventure Lanyard Case",
    slug: "adventure-lanyard-case",
    description: "Perfect for outdoor adventures. Includes a detachable wrist lanyard for extra security. Shock-absorbing TPU with a textured grip and reinforced corners.",
    basePrice: 29.99,
    isNew: true,
    brandId: apple.id,
    categoryIds: [rugged.id],
    modelIds: allIphoneModels,
    variants: [
      { colorName: "Alpine White", colorHex: "#f5f5f5", stock: 50 },
      { colorName: "Summit Black", colorHex: "#1a1a1a", stock: 60 },
      { colorName: "Trail Orange", colorHex: "#ff6600", stock: 35 },
    ],
  });

  console.log("Seed complete!");
  console.log(`Created: 3 brands, ${iphoneModels.length + samsungModels.length + googleModels.length} models, 5 categories, 12 products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
