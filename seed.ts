import { db } from "./index";
import { categories, products, reviews } from "./schema";
import { sql } from "drizzle-orm";

async function seed() {
  // Clear existing data
  await db.execute(sql`TRUNCATE reviews, cart_items, orders, products, categories RESTART IDENTITY CASCADE`);

  // Seed categories
  const cats = await db
    .insert(categories)
    .values([
      {
        name: "Beach & Island Getaways",
        slug: "beach-island",
        description: "Pristine shores, turquoise waters, and endless relaxation",
        image: "https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      },
      {
        name: "European Adventures",
        slug: "european-adventures",
        description: "Historic cities, stunning architecture, and rich culture",
        image: "https://images.pexels.com/photos/16922421/pexels-photo-16922421.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      },
      {
        name: "Mountain & Hiking Expeditions",
        slug: "mountain-hiking",
        description: "Conquer peaks and discover breathtaking alpine scenery",
        image: "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      },
      {
        name: "Safari & Wildlife",
        slug: "safari-wildlife",
        description: "Witness nature's most magnificent creatures up close",
        image: "https://images.pexels.com/photos/28157155/pexels-photo-28157155.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      },
      {
        name: "Cruise & Ocean Voyages",
        slug: "cruise-ocean",
        description: "Luxury at sea with world-class destinations",
        image: "https://images.pexels.com/photos/33270055/pexels-photo-33270055.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      },
      {
        name: "Cultural & Heritage Tours",
        slug: "cultural-heritage",
        description: "Immerse yourself in traditions and ancient wonders",
        image: "https://images.pexels.com/photos/16226627/pexels-photo-16226627.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      },
    ])
    .returning();

  // Seed products
  const prods = await db
    .insert(products)
    .values([
      // Beach & Island
      {
        name: "Maldives Overwater Villa Escape",
        slug: "maldives-overwater-villa",
        description:
          "Experience paradise at its finest with a 7-night stay in a private overwater villa. Wake up to crystal-clear lagoon views, enjoy world-class snorkeling right from your deck, and unwind with spa treatments overlooking the Indian Ocean. This all-inclusive package features gourmet dining at five specialty restaurants, sunset dolphin cruises, and guided coral reef excursions. Perfect for couples seeking an unforgettable romantic retreat or families wanting a luxurious island getaway.",
        shortDescription: "7 nights in a private overwater villa with all-inclusive dining & spa",
        price: "4299.00",
        originalPrice: "5499.00",
        images: [
          "https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/9080921/pexels-photo-9080921.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/14923418/pexels-photo-14923418.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/6875499/pexels-photo-6875499.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        ],
        categoryId: cats[0].id,
        duration: "7 Nights / 8 Days",
        location: "Maldives",
        travelType: "couple",
        highlights: ["Private overwater villa", "All-inclusive dining", "Sunset dolphin cruise", "Spa treatments", "Snorkeling excursions", "Seaplane transfers"],
        included: ["Return seaplane transfers", "All meals & premium beverages", "Daily spa credit ($150)", "Snorkeling gear", "Sunset cruise", "Airport lounge access"],
        featured: true,
        bestSeller: true,
        maxGuests: 4,
        rating: "4.9",
        reviewCount: 127,
      },
      {
        name: "Bali Family Paradise Retreat",
        slug: "bali-family-paradise",
        description:
          "Create unforgettable family memories in Bali with this 10-day adventure. Stay in a spacious private villa with pool, explore ancient temples, learn Balinese cooking, and enjoy white-water rafting adventures. Includes dedicated kids' activities, family-friendly cultural excursions, and a magical dinner at a cliffside restaurant. From the rice terraces of Ubud to the beaches of Seminyak, this curated itinerary balances adventure and relaxation for every family member.",
        shortDescription: "10-day family adventure with private villa, cultural tours & activities",
        price: "3199.00",
        originalPrice: "3899.00",
        images: [
          "https://images.pexels.com/photos/6016924/pexels-photo-6016924.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/23696830/pexels-photo-23696830.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/14923418/pexels-photo-14923418.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/23696838/pexels-photo-23696838.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        ],
        categoryId: cats[0].id,
        duration: "10 Nights / 11 Days",
        location: "Bali, Indonesia",
        travelType: "family",
        highlights: ["Private villa with pool", "Cooking class", "Temple tours", "White water rafting", "Rice terrace trek", "Cliffside dinner"],
        included: ["Airport transfers", "Breakfast daily", "5 guided excursions", "Cooking class", "Rafting adventure", "Kids' activity program"],
        featured: true,
        bestSeller: false,
        maxGuests: 8,
        rating: "4.8",
        reviewCount: 89,
      },
      {
        name: "Santorini Sunset Romance",
        slug: "santorini-sunset-romance",
        description:
          "Fall in love all over again on the magical island of Santorini. This 5-night romantic escape features a cave suite with caldera views, private wine tasting of local Assyrtiko varieties, a sunset catamaran cruise, and a couples' spa treatment. Wander through the iconic blue-domed churches of Oia, sample fresh seafood at waterfront tavernas, and watch the world's most famous sunset from your private terrace.",
        shortDescription: "5-night romantic escape with cave suite, wine tasting & sunset cruise",
        price: "2899.00",
        originalPrice: "3299.00",
        images: [
          "https://images.pexels.com/photos/5785080/pexels-photo-5785080.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/31587579/pexels-photo-31587579.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/30794940/pexels-photo-30794940.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/28945727/pexels-photo-28945727.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        ],
        categoryId: cats[0].id,
        duration: "5 Nights / 6 Days",
        location: "Santorini, Greece",
        travelType: "couple",
        highlights: ["Cave suite with caldera views", "Sunset catamaran cruise", "Wine tasting experience", "Couples spa treatment", "Oia village tour", "Helicopter tour option"],
        included: ["Airport transfers", "Daily breakfast", "Wine tasting tour", "Sunset cruise", "Spa session for two", "Welcome champagne"],
        featured: false,
        bestSeller: true,
        maxGuests: 2,
        rating: "4.9",
        reviewCount: 203,
      },
      // European Adventures
      {
        name: "Grand European Discovery",
        slug: "grand-european-discovery",
        description:
          "Embark on the ultimate European journey spanning 14 days across 5 iconic cities. From the romantic streets of Paris to the historic ruins of Rome, the vibrant nightlife of Barcelona, the classical beauty of Vienna, and the charming canals of Amsterdam. Travel in style with first-class rail passes, boutique hotel stays, and curated experiences including a Michelin-starred dinner, private museum tours, and a Seine river cruise. This is Europe at its magnificent best.",
        shortDescription: "14-day journey through 5 European capitals with first-class rail travel",
        price: "5999.00",
        originalPrice: "7299.00",
        images: [
          "https://images.pexels.com/photos/16922421/pexels-photo-16922421.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/18815996/pexels-photo-18815996.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/18688136/pexels-photo-18688136.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/16857488/pexels-photo-16857488.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        ],
        categoryId: cats[1].id,
        duration: "14 Nights / 15 Days",
        location: "Paris, Rome, Barcelona, Vienna, Amsterdam",
        travelType: "solo",
        highlights: ["5 iconic cities", "First-class rail pass", "Michelin dinner", "Private museum tours", "Seine river cruise", "Wine country day trip"],
        included: ["First-class Eurail pass", "Boutique hotel stays", "Daily breakfast", "8 guided tours", "Michelin dinner", "Travel insurance"],
        featured: true,
        bestSeller: true,
        maxGuests: 6,
        rating: "4.7",
        reviewCount: 156,
      },
      {
        name: "Prague & Budapest Twin City Break",
        slug: "prague-budapest-twin-city",
        description:
          "Discover two of Central Europe's most enchanting capitals in one spectacular trip. Explore Prague's fairy-tale Old Town, cross the iconic Charles Bridge at sunrise, and savor Bohemian cuisine. Then journey to Budapest for thermal bath experiences, ruin bar adventures, and a Danube dinner cruise past the illuminated Parliament. This 6-night escape perfectly blends history, culture, and nightlife.",
        shortDescription: "6-night twin city adventure exploring Prague & Budapest",
        price: "1899.00",
        originalPrice: "2299.00",
        images: [
          "https://images.pexels.com/photos/18192481/pexels-photo-18192481.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/18815996/pexels-photo-18815996.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/16922421/pexels-photo-16922421.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/22619624/pexels-photo-22619624.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        ],
        categoryId: cats[1].id,
        duration: "6 Nights / 7 Days",
        location: "Prague & Budapest",
        travelType: "couple",
        highlights: ["Charles Bridge sunrise tour", "Thermal bath experience", "Danube dinner cruise", "Ruin bar tour", "Castle District walk", "Beer tasting"],
        included: ["Train transfer between cities", "Boutique hotels", "Daily breakfast", "Walking tours", "Danube cruise", "Thermal bath entry"],
        featured: false,
        bestSeller: false,
        maxGuests: 4,
        rating: "4.8",
        reviewCount: 94,
      },
      // Mountain & Hiking
      {
        name: "Nepal Everest Base Camp Trek",
        slug: "nepal-everest-base-camp",
        description:
          "The adventure of a lifetime awaits on this legendary 14-day trek to Everest Base Camp. Journey through Sherpa villages, cross suspension bridges over roaring rivers, and witness sunrise over the Himalayas from Kala Patthar. Our experienced guides ensure safe acclimatization while sharing deep knowledge of local culture and ecology. Includes comfortable teahouse accommodation, all meals on trek, and a celebratory dinner in Kathmandu.",
        shortDescription: "14-day guided trek to Everest Base Camp with experienced Sherpa guides",
        price: "2499.00",
        originalPrice: "2999.00",
        images: [
          "https://images.pexels.com/photos/11930659/pexels-photo-11930659.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/9629654/pexels-photo-9629654.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/17317399/pexels-photo-17317399.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        ],
        categoryId: cats[2].id,
        duration: "14 Nights / 15 Days",
        location: "Nepal, Himalayas",
        travelType: "solo",
        highlights: ["Everest Base Camp", "Kala Patthar sunrise", "Sherpa villages", "Namche Bazaar", "Suspension bridges", "Himalayan panoramas"],
        included: ["Experienced Sherpa guide", "Porter service", "All meals on trek", "Teahouse stays", "Permits & fees", "Celebratory dinner"],
        featured: true,
        bestSeller: false,
        maxGuests: 12,
        rating: "4.9",
        reviewCount: 78,
      },
      {
        name: "Canadian Rockies Family Adventure",
        slug: "canadian-rockies-family",
        description:
          "Discover the raw beauty of the Canadian Rockies on this 8-day family adventure. Explore turquoise lakes, spot wildlife including bears and elk, ride the Banff Gondola, and raft through stunning mountain canyons. Stay in a luxury mountain lodge with kids' programs, enjoy campfire evenings, and take scenic helicopter flights over glaciers. An outdoor paradise that brings families together.",
        shortDescription: "8-day family mountain adventure in Banff & Jasper National Parks",
        price: "3599.00",
        originalPrice: "4199.00",
        images: [
          "https://images.pexels.com/photos/33310482/pexels-photo-33310482.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/6016924/pexels-photo-6016924.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/9629654/pexels-photo-9629654.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        ],
        categoryId: cats[2].id,
        duration: "8 Nights / 9 Days",
        location: "Banff & Jasper, Canada",
        travelType: "family",
        highlights: ["Banff Gondola ride", "Lake Louise visit", "Wildlife spotting", "River rafting", "Helicopter flight", "Campfire evenings"],
        included: ["Mountain lodge accommodation", "Daily breakfast & dinner", "Park passes", "Guided hikes", "Rafting excursion", "Kids' adventure program"],
        featured: false,
        bestSeller: true,
        maxGuests: 8,
        rating: "4.8",
        reviewCount: 112,
      },
      // Safari & Wildlife
      {
        name: "Tanzania Great Migration Safari",
        slug: "tanzania-great-migration",
        description:
          "Witness one of nature's most awe-inspiring spectacles — the Great Migration across the Serengeti. This 10-day luxury safari takes you through Tanzania's finest national parks including the Serengeti, Ngorongoro Crater, and Tarangire. Stay in exclusive tented camps, enjoy game drives at dawn and dusk, and watch thousands of wildebeest cross the Mara River. Includes a hot air balloon safari and visits to Maasai communities.",
        shortDescription: "10-day luxury safari witnessing the Great Migration in the Serengeti",
        price: "6499.00",
        originalPrice: "7999.00",
        images: [
          "https://images.pexels.com/photos/28157155/pexels-photo-28157155.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/36702538/pexels-photo-36702538.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/9185432/pexels-photo-9185432.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/19281386/pexels-photo-19281386.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        ],
        categoryId: cats[3].id,
        duration: "10 Nights / 11 Days",
        location: "Tanzania, East Africa",
        travelType: "couple",
        highlights: ["Great Migration viewing", "Ngorongoro Crater", "Hot air balloon", "Maasai village visit", "Big Five spotting", "Luxury tented camps"],
        included: ["Luxury tented accommodation", "All meals & drinks", "Game drives", "Balloon safari", "Park fees", "Internal flights"],
        featured: true,
        bestSeller: true,
        maxGuests: 6,
        rating: "5.0",
        reviewCount: 67,
      },
      // Cruise
      {
        name: "Mediterranean Grand Cruise",
        slug: "mediterranean-grand-cruise",
        description:
          "Set sail on a 12-night Mediterranean odyssey visiting 8 stunning ports. From the glamour of Monaco to the ancient ruins of Athens, the romantic Amalfi Coast, and the vibrant streets of Barcelona. Enjoy world-class entertainment, gourmet dining across 12 restaurants, a luxury spa, and exclusive shore excursions. Your floating palace features a private balcony stateroom and 24-hour butler service.",
        shortDescription: "12-night luxury Mediterranean cruise visiting 8 ports of call",
        price: "4799.00",
        originalPrice: "5999.00",
        images: [
          "https://images.pexels.com/photos/33270055/pexels-photo-33270055.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/37880222/pexels-photo-37880222.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/24244288/pexels-photo-24244288.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/17712477/pexels-photo-17712477.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        ],
        categoryId: cats[4].id,
        duration: "12 Nights / 13 Days",
        location: "Mediterranean Sea",
        travelType: "family",
        highlights: ["8 ports of call", "Private balcony stateroom", "12 dining venues", "Luxury spa", "Shore excursions", "Evening entertainment"],
        included: ["Balcony stateroom", "All meals onboard", "Entertainment package", "2 shore excursions", "Spa credit ($200)", "Beverage package"],
        featured: true,
        bestSeller: false,
        maxGuests: 4,
        rating: "4.7",
        reviewCount: 189,
      },
      // Cultural
      {
        name: "Japan Cherry Blossom Cultural Journey",
        slug: "japan-cherry-blossom",
        description:
          "Experience the magic of Japan during sakura season on this meticulously curated 12-day cultural journey. From the neon-lit streets of Tokyo to the serene temples of Kyoto, the deer-filled parks of Nara, and the historic Peace Memorial in Hiroshima. Participate in a traditional tea ceremony, stay in a ryokan with onsen baths, witness geisha performances, and ride the legendary Shinkansen between cities. This trip captures the perfect harmony of ancient tradition and cutting-edge modernity.",
        shortDescription: "12-day cultural journey through Japan during cherry blossom season",
        price: "5299.00",
        originalPrice: "6499.00",
        images: [
          "https://images.pexels.com/photos/16226627/pexels-photo-16226627.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/20817306/pexels-photo-20817306.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/36353249/pexels-photo-36353249.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/31761848/pexels-photo-31761848.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        ],
        categoryId: cats[5].id,
        duration: "12 Nights / 13 Days",
        location: "Tokyo, Kyoto, Nara, Hiroshima",
        travelType: "solo",
        highlights: ["Cherry blossom viewing", "Tea ceremony", "Ryokan stay", "Geisha district tour", "Shinkansen travel", "Sushi-making class"],
        included: ["Boutique hotels & ryokan", "Japan Rail Pass", "Daily breakfast", "8 cultural experiences", "Tea ceremony", "Airport transfers"],
        featured: true,
        bestSeller: true,
        maxGuests: 10,
        rating: "4.9",
        reviewCount: 143,
      },
      // Additional products
      {
        name: "Costa Rica Solo Explorer",
        slug: "costa-rica-solo-explorer",
        description:
          "Embrace the Pura Vida lifestyle on this thrilling 9-day solo adventure through Costa Rica. Zip-line through cloud forests, surf Pacific waves, hike active volcanoes, and spot toucans and sloths in pristine rainforests. Meet fellow travelers at eco-lodges, enjoy farm-to-table cuisine, and discover why Costa Rica is the world's happiest country. This perfectly balanced itinerary mixes adrenaline with tranquility.",
        shortDescription: "9-day solo adventure through Costa Rica's rainforests & volcanoes",
        price: "1999.00",
        originalPrice: "2499.00",
        images: [
          "https://images.pexels.com/photos/6016924/pexels-photo-6016924.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/23696830/pexels-photo-23696830.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/17317399/pexels-photo-17317399.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        ],
        categoryId: cats[2].id,
        duration: "9 Nights / 10 Days",
        location: "Costa Rica",
        travelType: "solo",
        highlights: ["Zip-lining", "Volcano hiking", "Surfing lessons", "Wildlife spotting", "Hot springs", "Cloud forest walk"],
        included: ["Eco-lodge stays", "Daily breakfast", "6 guided activities", "Surf lesson", "National park fees", "Airport transfers"],
        featured: false,
        bestSeller: false,
        maxGuests: 1,
        rating: "4.6",
        reviewCount: 62,
      },
      {
        name: "Amalfi Coast Luxury Escape",
        slug: "amalfi-coast-luxury",
        description:
          "Indulge in la dolce vita along Italy's most glamorous coastline. This 7-night luxury escape features a cliffside boutique hotel in Positano, private boat tours along the coast, limoncello tasting in Ravello, Pompeii archaeological excursions, and a private cooking class with a local nonna. Soak up the Mediterranean sun, feast on fresh seafood, and explore colorful villages perched above the azure sea.",
        shortDescription: "7-night luxury Italian coastal escape with private boat tours & cooking classes",
        price: "3899.00",
        originalPrice: "4599.00",
        images: [
          "https://images.pexels.com/photos/16857488/pexels-photo-16857488.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/18688136/pexels-photo-18688136.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/18192481/pexels-photo-18192481.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/22619624/pexels-photo-22619624.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        ],
        categoryId: cats[1].id,
        duration: "7 Nights / 8 Days",
        location: "Amalfi Coast, Italy",
        travelType: "couple",
        highlights: ["Positano cliffside hotel", "Private boat tour", "Cooking class", "Pompeii visit", "Limoncello tasting", "Capri day trip"],
        included: ["Boutique hotel stay", "Daily breakfast", "Private boat tour", "Cooking class", "Pompeii guided tour", "Airport transfers"],
        featured: false,
        bestSeller: true,
        maxGuests: 4,
        rating: "4.8",
        reviewCount: 176,
      },
    ])
    .returning();

  // Seed reviews
  const reviewData = [
    // Maldives
    { productId: prods[0].id, authorName: "Sarah & James Mitchell", rating: 5, title: "Beyond our wildest dreams", content: "This trip exceeded every expectation. The overwater villa was absolutely stunning — we could see tropical fish swimming beneath our glass floor. The staff remembered our names and preferences from day one. The sunset dolphin cruise was magical, and the food was exceptional at every restaurant. Worth every penny!", travelDate: "March 2025", travelType: "Couple" },
    { productId: prods[0].id, authorName: "Elena Rodriguez", rating: 5, title: "Pure paradise", content: "I've traveled extensively and this was hands down the most beautiful destination. The snorkeling right from our villa was incredible — we saw manta rays! The spa treatments were heavenly. Already planning our return trip.", travelDate: "January 2025", travelType: "Couple" },
    { productId: prods[0].id, authorName: "David Chen", rating: 4, title: "Incredible but pricey", content: "Everything about this trip was world-class. The only reason for 4 stars is the additional costs for some activities not in the package. But the villa, the service, and the natural beauty were absolutely 5-star.", travelDate: "February 2025", travelType: "Couple" },
    // Bali
    { productId: prods[1].id, authorName: "The Williams Family", rating: 5, title: "Best family vacation ever!", content: "Our kids (8 and 12) still talk about this trip daily. The cooking class was a highlight — they now make their own nasi goreng at home! The villa was spacious and the pool was perfect. The rafting adventure was thrilling but safe. WanderNest thought of everything.", travelDate: "July 2025", travelType: "Family" },
    { productId: prods[1].id, authorName: "Priya Sharma", rating: 5, title: "Cultural immersion at its finest", content: "What I loved most was the balance between tourist highlights and authentic experiences. Visiting the temples early morning before crowds, learning from local artisans, and the cliffside dinner at sunset — just perfect.", travelDate: "August 2025", travelType: "Family" },
    // Santorini
    { productId: prods[2].id, authorName: "Mark & Lisa Johnson", rating: 5, title: "The perfect anniversary trip", content: "We chose this for our 10th anniversary and it was absolutely perfect. The cave suite views were breathtaking, and waking up to the caldera every morning was surreal. The wine tasting was educational and fun, and the sunset cruise was the highlight — we had the best view in the world.", travelDate: "September 2025", travelType: "Couple" },
    { productId: prods[2].id, authorName: "Sophie Laurent", rating: 5, title: "Romantic perfection", content: "Every detail was thoughtfully arranged. The spa was incredible, and the private wine tasting in a centuries-old cave was something I'll never forget. Santorini sunsets really are as magical as they say.", travelDate: "October 2025", travelType: "Couple" },
    // Grand European
    { productId: prods[3].id, authorName: "Alex Thompson", rating: 5, title: "Life-changing journey", content: "As a solo traveler, I was nervous about 14 days alone in Europe. But WanderNest's itinerary was so well planned that I met amazing people at every stop. The Michelin dinner in Paris was extraordinary, and the private museum tours meant no crowds. First-class rail travel was luxurious and the scenery between cities was stunning.", travelDate: "June 2025", travelType: "Solo" },
    { productId: prods[3].id, authorName: "Rachel Kim", rating: 4, title: "Amazing but intense pace", content: "Five cities in 14 days is ambitious. Every destination was wonderful, but I wish we had one more day in each city. The accommodations were beautiful and the experiences were top-notch. Would recommend extending if possible.", travelDate: "May 2025", travelType: "Solo" },
    // Prague & Budapest
    { productId: prods[4].id, authorName: "Tom & Amy Richards", rating: 5, title: "Hidden gems of Europe", content: "We've done Paris and London, but Prague and Budapest blew us away. The architecture, the food, the thermal baths — everything was incredible. The Danube dinner cruise with the Parliament building lit up was one of the most beautiful things we've ever seen.", travelDate: "April 2025", travelType: "Couple" },
    // Nepal
    { productId: prods[5].id, authorName: "Michael Torres", rating: 5, title: "Achievement unlocked!", content: "Standing at Everest Base Camp was the most profound experience of my life. Our Sherpa guide, Pemba, was not just experienced but became a friend. The acclimatization schedule was perfect — no altitude sickness issues. The sunrise from Kala Patthar brought tears to my eyes.", travelDate: "November 2025", travelType: "Solo" },
    { productId: prods[5].id, authorName: "Jenny Haworth", rating: 5, title: "Challenging but so rewarding", content: "I trained for months and it was worth every step. The teahouses were more comfortable than expected, and the food was hearty and delicious. The mountain views are impossible to capture in photos — you have to see them in person.", travelDate: "October 2025", travelType: "Solo" },
    // Canadian Rockies
    { productId: prods[6].id, authorName: "The Garcia Family", rating: 5, title: "Nature at its absolute best", content: "We saw bears, elk, and even a moose! Lake Louise was even more beautiful than the photos. The kids loved the rafting and the campfire evenings. The helicopter flight over the glaciers was the highlight — absolutely breathtaking. A perfect family adventure.", travelDate: "August 2025", travelType: "Family" },
    // Tanzania
    { productId: prods[7].id, authorName: "Christine & Robert Bell", rating: 5, title: "Once in a lifetime — literally", content: "Watching thousands of wildebeest cross the Mara River while a crocodile lurked nearby — it was like watching a nature documentary in real life. The hot air balloon at sunrise over the Serengeti was the most magical experience. The luxury camps were incredibly comfortable after long game drives.", travelDate: "July 2025", travelType: "Couple" },
    { productId: prods[7].id, authorName: "James Okafor", rating: 5, title: "Africa stole my heart", content: "I've wanted to do this safari my entire life and it exceeded every expectation. We saw all of the Big Five within the first three days! The Ngorongoro Crater was like a lost world. Our guide's knowledge of animal behavior was phenomenal.", travelDate: "August 2025", travelType: "Couple" },
    // Cruise
    { productId: prods[8].id, authorName: "Patricia & Harold Moore", rating: 5, title: "Floating luxury palace", content: "Everything about this cruise was first-class. The ship was gorgeous, the food was incredible (we tried all 12 restaurants!), and the port stops were well-timed. Monaco and the Amalfi Coast were highlights. The butler service was a lovely touch.", travelDate: "September 2025", travelType: "Family" },
    { productId: prods[8].id, authorName: "The Anderson Family", rating: 4, title: "Great for families", content: "Our teens loved the onboard activities while we relaxed at the spa. The shore excursions were well-organized. Only dock time in Athens felt too short. Would definitely cruise again!", travelDate: "July 2025", travelType: "Family" },
    // Japan
    { productId: prods[9].id, authorName: "Maria Santos", rating: 5, title: "Japan during sakura is MAGIC", content: "I timed this trip perfectly for cherry blossom season and every day was more beautiful than the last. The tea ceremony was a profound experience, and staying in the ryokan with onsen baths was incredibly relaxing. Kyoto's temples framed by pink blossoms — I'll remember that forever.", travelDate: "April 2025", travelType: "Solo" },
    { productId: prods[9].id, authorName: "Peter & Yuki Zhang", rating: 5, title: "Perfect blend of old and new", content: "From the futuristic streets of Shibuya to the ancient serenity of Nara's deer park, every day brought something extraordinary. The sushi-making class was fun and the Shinkansen rides were an experience in themselves. WanderNest's local connections made this trip special.", travelDate: "April 2025", travelType: "Couple" },
    // Costa Rica
    { productId: prods[10].id, authorName: "Ryan Douglas", rating: 5, title: "Pure adventure", content: "As a solo traveler, Costa Rica was perfect. The zip-lining through the cloud forest was exhilarating, and I spotted a toucan and two sloths! The eco-lodges were comfortable and I met great people. The surf lessons were the cherry on top.", travelDate: "February 2025", travelType: "Solo" },
    // Amalfi Coast
    { productId: prods[11].id, authorName: "Isabella & Marco Bianchi", rating: 5, title: "La dolce vita indeed!", content: "Positano exceeded our expectations. The cooking class with Nonna Maria was unforgettable — her pasta recipe is now a family heirloom. The private boat tour revealed hidden beaches and grottoes. The limoncello tasting in Ravello's garden was pure magic.", travelDate: "June 2025", travelType: "Couple" },
    { productId: prods[11].id, authorName: "Olivia Harper", rating: 5, title: "Italy at its most beautiful", content: "Every morning I'd step onto my balcony and pinch myself — the views of Positano's colorful houses cascading down to the sea were unreal. The Capri day trip and Pompeii visit added wonderful variety to the coastal relaxation.", travelDate: "May 2025", travelType: "Solo" },
  ];

  await db.insert(reviews).values(reviewData);

  console.log("✅ Database seeded successfully!");
  console.log(`  - ${cats.length} categories`);
  console.log(`  - ${prods.length} products`);
  console.log(`  - ${reviewData.length} reviews`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
