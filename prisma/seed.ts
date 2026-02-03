// prisma/seed.ts

import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// Online images from Unsplash (free to use)
const productImages = {
  'pink-floral-maxi-dress': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=700&fit=crop',
  'lavender-silk-slip-dress': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=700&fit=crop',
  'rose-gold-sequin-mini-dress': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=700&fit=crop',
  'blush-satin-camisole': 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&h=700&fit=crop',
  'coral-off-shoulder-blouse': 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&h=700&fit=crop',
  'dusty-rose-pleated-skirt': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=700&fit=crop',
  'mint-ruffle-crop-top': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&h=700&fit=crop',
  'peach-high-waist-trousers': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=700&fit=crop',
};

const categoryImages = {
  'new-arrivals': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=600&fit=crop',
  'dresses': 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=500&h=600&fit=crop',
  'tops': 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&h=600&fit=crop',
  'bottoms': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=600&fit=crop',
  'best-sellers': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=600&fit=crop',
  'sale': 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&h=600&fit=crop',
};

const bannerImages = {
  'hero-1': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=600&fit=crop',
  'hero-2': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=600&fit=crop',
  'hero-3': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=600&fit=crop',
  'promo-1': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop',
};

async function main() {
  console.log('🌸 Seeding Goddess Essence database...\n')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.payment.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.review.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.newsletter.deleteMany()

  // ==================== CATEGORIES ====================
  console.log('📁 Creating categories...')

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'New Arrivals',
        slug: 'new-arrivals',
        description: 'Discover our latest collection of stunning pieces',
        image: categoryImages['new-arrivals'],
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dresses',
        slug: 'dresses',
        description: 'Elegant dresses for every occasion',
        image: categoryImages['dresses'],
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Tops',
        slug: 'tops',
        description: 'Trendy tops and blouses',
        image: categoryImages['tops'],
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bottoms',
        slug: 'bottoms',
        description: 'Stylish skirts, pants, and shorts',
        image: categoryImages['bottoms'],
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Best Sellers',
        slug: 'best-sellers',
        description: 'Our most loved pieces',
        image: categoryImages['best-sellers'],
        sortOrder: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sale',
        slug: 'sale',
        description: 'Amazing deals on gorgeous styles',
        image: categoryImages['sale'],
        sortOrder: 6,
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories\n`)

  // ==================== PRODUCTS ====================
  console.log('👗 Creating products...')

  const dressesCategory = categories.find(c => c.slug === 'dresses')!
  const topsCategory = categories.find(c => c.slug === 'tops')!
  const bottomsCategory = categories.find(c => c.slug === 'bottoms')!

  const productsData = [
    {
      name: 'Pink Floral Maxi Dress',
      slug: 'pink-floral-maxi-dress',
      description: 'A stunning maxi dress featuring beautiful floral prints. Perfect for summer days and special occasions. Made with lightweight, breathable fabric for all-day comfort.',
      price: new Prisma.Decimal(89.99),
      sku: 'GE-DRS-001',
      categoryId: dressesCategory.id,
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: 'Lavender Silk Slip Dress',
      slug: 'lavender-silk-slip-dress',
      description: 'Elegant silk slip dress in a gorgeous lavender shade. Features adjustable straps and a flattering cut that drapes beautifully.',
      price: new Prisma.Decimal(129.99),
      salePrice: new Prisma.Decimal(99.99),
      sku: 'GE-DRS-002',
      categoryId: dressesCategory.id,
      isFeatured: true,
      isOnSale: true,
    },
    {
      name: 'Rose Gold Sequin Mini Dress',
      slug: 'rose-gold-sequin-mini-dress',
      description: 'Dazzle at your next party with this stunning rose gold sequin mini dress. Features a flattering bodycon fit and subtle shimmer.',
      price: new Prisma.Decimal(149.99),
      sku: 'GE-DRS-003',
      categoryId: dressesCategory.id,
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Blush Satin Camisole',
      slug: 'blush-satin-camisole',
      description: 'A versatile satin camisole in a soft blush color. Can be dressed up or down for any occasion. Features delicate lace trim.',
      price: new Prisma.Decimal(45.99),
      sku: 'GE-TOP-001',
      categoryId: topsCategory.id,
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: 'Coral Off-Shoulder Blouse',
      slug: 'coral-off-shoulder-blouse',
      description: 'Romantic off-shoulder blouse in a vibrant coral shade. Features flutter sleeves and a comfortable relaxed fit.',
      price: new Prisma.Decimal(55.99),
      salePrice: new Prisma.Decimal(39.99),
      sku: 'GE-TOP-002',
      categoryId: topsCategory.id,
      isOnSale: true,
    },
    {
      name: 'Mint Ruffle Crop Top',
      slug: 'mint-ruffle-crop-top',
      description: 'Fresh and fun mint green crop top with playful ruffle details. Perfect for summer outings and beach days.',
      price: new Prisma.Decimal(38.99),
      sku: 'GE-TOP-003',
      categoryId: topsCategory.id,
      isNewArrival: true,
    },
    {
      name: 'Dusty Rose Pleated Skirt',
      slug: 'dusty-rose-pleated-skirt',
      description: 'Elegant pleated midi skirt in a sophisticated dusty rose shade. Features a comfortable elastic waistband.',
      price: new Prisma.Decimal(65.99),
      sku: 'GE-BTM-001',
      categoryId: bottomsCategory.id,
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Peach High-Waist Trousers',
      slug: 'peach-high-waist-trousers',
      description: 'Sophisticated high-waist trousers in a soft peach color. Features a wide leg design and flattering fit.',
      price: new Prisma.Decimal(79.99),
      salePrice: new Prisma.Decimal(59.99),
      sku: 'GE-BTM-002',
      categoryId: bottomsCategory.id,
      isOnSale: true,
    },
  ]

  for (const productData of productsData) {
    const product = await prisma.product.create({
      data: productData,
    })

    // Create product image
    const imageUrl = productImages[productData.slug as keyof typeof productImages] || 
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=700&fit=crop'
    
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: imageUrl,
        alt: productData.name,
        isPrimary: true,
        sortOrder: 0,
      },
    })

    // Create variants
    const sizes = ['XS', 'S', 'M', 'L', 'XL']
    const colors = [
      { name: 'Pink', hex: '#FFB6C1' },
      { name: 'Lavender', hex: '#E6E6FA' },
    ]

    for (const size of sizes) {
      for (const color of colors) {
        const variantSku = `${productData.sku}-${size}-${color.name}`
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            size,
            color: color.name,
            colorHex: color.hex,
            stock: Math.floor(Math.random() * 20) + 5,
            sku: variantSku,
          },
        })
      }
    }

    console.log(`  ✅ Created: ${productData.name}`)
  }

  // ==================== BANNERS ====================
  console.log('\n🖼️  Creating banners...')

  await prisma.banner.createMany({
    data: [
      {
        title: 'NEW ARRIVALS',
        subtitle: 'Discover the latest trends in women\'s fashion',
        image: bannerImages['hero-1'],
        mobileImage: bannerImages['hero-1'],
        link: '/categories/new-arrivals',
        buttonText: 'Shop Now',
        position: 'HERO',
        sortOrder: 1,
      },
      {
        title: 'SUMMER COLLECTION',
        subtitle: 'Light, breezy styles for the sunny days ahead',
        image: bannerImages['hero-2'],
        mobileImage: bannerImages['hero-2'],
        link: '/categories/dresses',
        buttonText: 'Explore',
        position: 'HERO',
        sortOrder: 2,
      },
      {
        title: 'UP TO 50% OFF',
        subtitle: 'Don\'t miss our biggest sale of the season',
        image: bannerImages['hero-3'],
        mobileImage: bannerImages['hero-3'],
        link: '/categories/sale',
        buttonText: 'Shop Sale',
        position: 'HERO',
        sortOrder: 3,
      },
      {
        title: 'FREE SHIPPING',
        subtitle: 'On orders over $75',
        image: bannerImages['promo-1'],
        link: '/shipping',
        buttonText: 'Learn More',
        position: 'PROMOTIONAL',
        sortOrder: 1,
      },
    ],
  })

  console.log('✅ Created 4 banners')

  // ==================== COUPONS ====================
  console.log('\n🎫 Creating coupons...')

  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        description: '10% off your first order',
        type: 'PERCENTAGE',
        value: new Prisma.Decimal(10),
        minPurchase: new Prisma.Decimal(50),
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'GODDESS20',
        description: '20% off orders over $100',
        type: 'PERCENTAGE',
        value: new Prisma.Decimal(20),
        minPurchase: new Prisma.Decimal(100),
        maxDiscount: new Prisma.Decimal(50),
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'SUMMER25',
        description: '$25 off summer collection',
        type: 'FIXED',
        value: new Prisma.Decimal(25),
        minPurchase: new Prisma.Decimal(75),
        usageLimit: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'FLASH15',
        description: '15% off - Flash sale!',
        type: 'PERCENTAGE',
        value: new Prisma.Decimal(15),
        usageLimit: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ],
  })

  console.log('✅ Created 4 coupons')

  // ==================== NEWSLETTER SUBSCRIBERS ====================
  console.log('\n📧 Creating newsletter subscribers...')

  await prisma.newsletter.createMany({
    data: [
      { email: 'fashion.lover@email.com' },
      { email: 'style.queen@email.com' },
      { email: 'trendy.girl@email.com' },
      { email: 'chic.lady@email.com' },
      { email: 'elegant.woman@email.com' },
      { email: 'glamour.fan@email.com' },
      { email: 'beauty.seeker@email.com' },
      { email: 'dress.lover@email.com' },
      { email: 'boutique.shopper@email.com' },
      { email: 'fashion.forward@email.com' },
    ],
  })

  console.log('✅ Created 10 newsletter subscribers')

  console.log('\n🌸 Seeding completed successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Database is ready for Goddess Essence! 💖')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })