import { pool } from "./index";

/**
 * Auto-bootstrap: create every table from the Drizzle schema using raw DDL,
 * then seed demo data when the products table is empty.
 * This runs once on server startup via instrumentation.ts.
 */
export async function initDatabase() {
  const client = await pool.connect();
  try {
    // ── 1. Create tables (IF NOT EXISTS — fully idempotent) ────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id            SERIAL       PRIMARY KEY,
        name          TEXT         NOT NULL,
        slug          TEXT         NOT NULL UNIQUE,
        description   TEXT,
        image         TEXT,
        created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS products (
        id                SERIAL       PRIMARY KEY,
        name              TEXT         NOT NULL,
        slug              TEXT         NOT NULL UNIQUE,
        description       TEXT         NOT NULL,
        short_description TEXT,
        price             NUMERIC(10,2) NOT NULL,
        original_price    NUMERIC(10,2),
        images            JSONB        NOT NULL DEFAULT '[]',
        category_id       INTEGER      REFERENCES categories(id),
        duration          TEXT,
        location          TEXT,
        travel_type       TEXT,
        highlights        JSONB        DEFAULT '[]',
        included          JSONB        DEFAULT '[]',
        featured          BOOLEAN      DEFAULT FALSE,
        best_seller       BOOLEAN      DEFAULT FALSE,
        max_guests        INTEGER      DEFAULT 10,
        rating            NUMERIC(2,1) DEFAULT 0,
        review_count      INTEGER      DEFAULT 0,
        created_at        TIMESTAMP    NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id            SERIAL       PRIMARY KEY,
        product_id    INTEGER      NOT NULL REFERENCES products(id),
        author_name   TEXT         NOT NULL,
        author_avatar TEXT,
        rating        INTEGER      NOT NULL,
        title         TEXT,
        content       TEXT         NOT NULL,
        travel_date   TEXT,
        travel_type   TEXT,
        verified      BOOLEAN      DEFAULT TRUE,
        created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cart_items (
        id            SERIAL       PRIMARY KEY,
        session_id    TEXT         NOT NULL,
        product_id    INTEGER      NOT NULL REFERENCES products(id),
        quantity      INTEGER      NOT NULL DEFAULT 1,
        travel_date   TEXT,
        guests        INTEGER      DEFAULT 1,
        created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id              SERIAL       PRIMARY KEY,
        session_id      TEXT         NOT NULL,
        customer_name   TEXT         NOT NULL,
        customer_email  TEXT         NOT NULL,
        customer_phone  TEXT,
        total_amount    NUMERIC(10,2) NOT NULL,
        status          TEXT         NOT NULL DEFAULT 'confirmed',
        items           JSONB        NOT NULL,
        created_at      TIMESTAMP    NOT NULL DEFAULT NOW()
      );
    `);

    // ── 2. Seed if empty ──────────────────────────────────────────────
    const { rows } = await client.query(
      `SELECT count(*)::int AS cnt FROM products`
    );
    if (rows[0].cnt > 0) {
      console.log("[db] Tables ready — already seeded.");
      return;
    }

    console.log("[db] Seeding demo data …");

    // Categories
    const catResult = await client.query(`
      INSERT INTO categories (name, slug, description, image) VALUES
        ('Beach & Island Getaways',     'beach-island',         'Pristine shores, turquoise waters, and endless relaxation',
          'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'),
        ('European Adventures',         'european-adventures',  'Historic cities, stunning architecture, and rich culture',
          'https://images.pexels.com/photos/16922421/pexels-photo-16922421.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'),
        ('Mountain & Hiking Expeditions','mountain-hiking',     'Conquer peaks and discover breathtaking alpine scenery',
          'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'),
        ('Safari & Wildlife',           'safari-wildlife',      'Witness nature''s most magnificent creatures up close',
          'https://images.pexels.com/photos/28157155/pexels-photo-28157155.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'),
        ('Cruise & Ocean Voyages',      'cruise-ocean',         'Luxury at sea with world-class destinations',
          'https://images.pexels.com/photos/33270055/pexels-photo-33270055.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'),
        ('Cultural & Heritage Tours',   'cultural-heritage',    'Immerse yourself in traditions and ancient wonders',
          'https://images.pexels.com/photos/16226627/pexels-photo-16226627.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200')
      RETURNING id;
    `);
    const catIds = catResult.rows.map((r: { id: number }) => r.id);

    // Products — helper for readability
    const img = (id: number) =>
      `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;
    const imgPng = (id: number) =>
      `https://images.pexels.com/photos/${id}/pexels-photo-${id}.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;

    const prodValues = [
      // 1 – Maldives
      `('Maldives Overwater Villa Escape','maldives-overwater-villa',
        'Experience paradise at its finest with a 7-night stay in a private overwater villa. Wake up to crystal-clear lagoon views, enjoy world-class snorkeling right from your deck, and unwind with spa treatments overlooking the Indian Ocean. This all-inclusive package features gourmet dining at five specialty restaurants, sunset dolphin cruises, and guided coral reef excursions. Perfect for couples seeking an unforgettable romantic retreat or families wanting a luxurious island getaway.',
        '7 nights in a private overwater villa with all-inclusive dining & spa',
        4299.00, 5499.00,
        '${JSON.stringify([img(1320686), img(9080921), img(14923418), img(6875499)])}',
        ${catIds[0]},'7 Nights / 8 Days','Maldives','couple',
        '${JSON.stringify(["Private overwater villa","All-inclusive dining","Sunset dolphin cruise","Spa treatments","Snorkeling excursions","Seaplane transfers"])}',
        '${JSON.stringify(["Return seaplane transfers","All meals & premium beverages","Daily spa credit ($150)","Snorkeling gear","Sunset cruise","Airport lounge access"])}',
        true, true, 4, 4.9, 127)`,

      // 2 – Bali
      `('Bali Family Paradise Retreat','bali-family-paradise',
        'Create unforgettable family memories in Bali with this 10-day adventure. Stay in a spacious private villa with pool, explore ancient temples, learn Balinese cooking, and enjoy white-water rafting adventures. Includes dedicated kids'' activities, family-friendly cultural excursions, and a magical dinner at a cliffside restaurant. From the rice terraces of Ubud to the beaches of Seminyak, this curated itinerary balances adventure and relaxation for every family member.',
        '10-day family adventure with private villa, cultural tours & activities',
        3199.00, 3899.00,
        '${JSON.stringify([img(6016924), img(23696830), img(14923418), img(23696838)])}',
        ${catIds[0]},'10 Nights / 11 Days','Bali, Indonesia','family',
        '${JSON.stringify(["Private villa with pool","Cooking class","Temple tours","White water rafting","Rice terrace trek","Cliffside dinner"])}',
        '${JSON.stringify(["Airport transfers","Breakfast daily","5 guided excursions","Cooking class","Rafting adventure","Kids'' activity program"])}',
        true, false, 8, 4.8, 89)`,

      // 3 – Santorini
      `('Santorini Sunset Romance','santorini-sunset-romance',
        'Fall in love all over again on the magical island of Santorini. This 5-night romantic escape features a cave suite with caldera views, private wine tasting of local Assyrtiko varieties, a sunset catamaran cruise, and a couples'' spa treatment. Wander through the iconic blue-domed churches of Oia, sample fresh seafood at waterfront tavernas, and watch the world''s most famous sunset from your private terrace.',
        '5-night romantic escape with cave suite, wine tasting & sunset cruise',
        2899.00, 3299.00,
        '${JSON.stringify([img(5785080), img(31587579), img(30794940), img(28945727)])}',
        ${catIds[0]},'5 Nights / 6 Days','Santorini, Greece','couple',
        '${JSON.stringify(["Cave suite with caldera views","Sunset catamaran cruise","Wine tasting experience","Couples spa treatment","Oia village tour","Helicopter tour option"])}',
        '${JSON.stringify(["Airport transfers","Daily breakfast","Wine tasting tour","Sunset cruise","Spa session for two","Welcome champagne"])}',
        false, true, 2, 4.9, 203)`,

      // 4 – Grand European
      `('Grand European Discovery','grand-european-discovery',
        'Embark on the ultimate European journey spanning 14 days across 5 iconic cities. From the romantic streets of Paris to the historic ruins of Rome, the vibrant nightlife of Barcelona, the classical beauty of Vienna, and the charming canals of Amsterdam. Travel in style with first-class rail passes, boutique hotel stays, and curated experiences including a Michelin-starred dinner, private museum tours, and a Seine river cruise.',
        '14-day journey through 5 European capitals with first-class rail travel',
        5999.00, 7299.00,
        '${JSON.stringify([img(16922421), img(18815996), img(18688136), img(16857488)])}',
        ${catIds[1]},'14 Nights / 15 Days','Paris, Rome, Barcelona, Vienna, Amsterdam','solo',
        '${JSON.stringify(["5 iconic cities","First-class rail pass","Michelin dinner","Private museum tours","Seine river cruise","Wine country day trip"])}',
        '${JSON.stringify(["First-class Eurail pass","Boutique hotel stays","Daily breakfast","8 guided tours","Michelin dinner","Travel insurance"])}',
        true, true, 6, 4.7, 156)`,

      // 5 – Prague & Budapest
      `('Prague & Budapest Twin City Break','prague-budapest-twin-city',
        'Discover two of Central Europe''s most enchanting capitals in one spectacular trip. Explore Prague''s fairy-tale Old Town, cross the iconic Charles Bridge at sunrise, and savor Bohemian cuisine. Then journey to Budapest for thermal bath experiences, ruin bar adventures, and a Danube dinner cruise past the illuminated Parliament.',
        '6-night twin city adventure exploring Prague & Budapest',
        1899.00, 2299.00,
        '${JSON.stringify([img(18192481), img(18815996), img(16922421), imgPng(22619624)])}',
        ${catIds[1]},'6 Nights / 7 Days','Prague & Budapest','couple',
        '${JSON.stringify(["Charles Bridge sunrise tour","Thermal bath experience","Danube dinner cruise","Ruin bar tour","Castle District walk","Beer tasting"])}',
        '${JSON.stringify(["Train transfer between cities","Boutique hotels","Daily breakfast","Walking tours","Danube cruise","Thermal bath entry"])}',
        false, false, 4, 4.8, 94)`,

      // 6 – Nepal
      `('Nepal Everest Base Camp Trek','nepal-everest-base-camp',
        'The adventure of a lifetime awaits on this legendary 14-day trek to Everest Base Camp. Journey through Sherpa villages, cross suspension bridges over roaring rivers, and witness sunrise over the Himalayas from Kala Patthar. Our experienced guides ensure safe acclimatization while sharing deep knowledge of local culture and ecology.',
        '14-day guided trek to Everest Base Camp with experienced Sherpa guides',
        2499.00, 2999.00,
        '${JSON.stringify([img(11930659), img(9629654), img(1271619), img(17317399)])}',
        ${catIds[2]},'14 Nights / 15 Days','Nepal, Himalayas','solo',
        '${JSON.stringify(["Everest Base Camp","Kala Patthar sunrise","Sherpa villages","Namche Bazaar","Suspension bridges","Himalayan panoramas"])}',
        '${JSON.stringify(["Experienced Sherpa guide","Porter service","All meals on trek","Teahouse stays","Permits & fees","Celebratory dinner"])}',
        true, false, 12, 4.9, 78)`,

      // 7 – Canadian Rockies
      `('Canadian Rockies Family Adventure','canadian-rockies-family',
        'Discover the raw beauty of the Canadian Rockies on this 8-day family adventure. Explore turquoise lakes, spot wildlife including bears and elk, ride the Banff Gondola, and raft through stunning mountain canyons. Stay in a luxury mountain lodge with kids'' programs, enjoy campfire evenings, and take scenic helicopter flights over glaciers.',
        '8-day family mountain adventure in Banff & Jasper National Parks',
        3599.00, 4199.00,
        '${JSON.stringify([img(33310482), img(6016924), img(1271619), img(9629654)])}',
        ${catIds[2]},'8 Nights / 9 Days','Banff & Jasper, Canada','family',
        '${JSON.stringify(["Banff Gondola ride","Lake Louise visit","Wildlife spotting","River rafting","Helicopter flight","Campfire evenings"])}',
        '${JSON.stringify(["Mountain lodge accommodation","Daily breakfast & dinner","Park passes","Guided hikes","Rafting excursion","Kids'' adventure program"])}',
        false, true, 8, 4.8, 112)`,

      // 8 – Tanzania
      `('Tanzania Great Migration Safari','tanzania-great-migration',
        'Witness one of nature''s most awe-inspiring spectacles — the Great Migration across the Serengeti. This 10-day luxury safari takes you through Tanzania''s finest national parks including the Serengeti, Ngorongoro Crater, and Tarangire. Stay in exclusive tented camps, enjoy game drives at dawn and dusk, and watch thousands of wildebeest cross the Mara River.',
        '10-day luxury safari witnessing the Great Migration in the Serengeti',
        6499.00, 7999.00,
        '${JSON.stringify([img(28157155), img(36702538), img(9185432), img(19281386)])}',
        ${catIds[3]},'10 Nights / 11 Days','Tanzania, East Africa','couple',
        '${JSON.stringify(["Great Migration viewing","Ngorongoro Crater","Hot air balloon","Maasai village visit","Big Five spotting","Luxury tented camps"])}',
        '${JSON.stringify(["Luxury tented accommodation","All meals & drinks","Game drives","Balloon safari","Park fees","Internal flights"])}',
        true, true, 6, 5.0, 67)`,

      // 9 – Mediterranean Cruise
      `('Mediterranean Grand Cruise','mediterranean-grand-cruise',
        'Set sail on a 12-night Mediterranean odyssey visiting 8 stunning ports. From the glamour of Monaco to the ancient ruins of Athens, the romantic Amalfi Coast, and the vibrant streets of Barcelona. Enjoy world-class entertainment, gourmet dining across 12 restaurants, a luxury spa, and exclusive shore excursions.',
        '12-night luxury Mediterranean cruise visiting 8 ports of call',
        4799.00, 5999.00,
        '${JSON.stringify([img(33270055), img(37880222), img(24244288), img(17712477)])}',
        ${catIds[4]},'12 Nights / 13 Days','Mediterranean Sea','family',
        '${JSON.stringify(["8 ports of call","Private balcony stateroom","12 dining venues","Luxury spa","Shore excursions","Evening entertainment"])}',
        '${JSON.stringify(["Balcony stateroom","All meals onboard","Entertainment package","2 shore excursions","Spa credit ($200)","Beverage package"])}',
        true, false, 4, 4.7, 189)`,

      // 10 – Japan
      `('Japan Cherry Blossom Cultural Journey','japan-cherry-blossom',
        'Experience the magic of Japan during sakura season on this meticulously curated 12-day cultural journey. From the neon-lit streets of Tokyo to the serene temples of Kyoto, the deer-filled parks of Nara, and the historic Peace Memorial in Hiroshima. Participate in a traditional tea ceremony, stay in a ryokan with onsen baths, witness geisha performances, and ride the legendary Shinkansen.',
        '12-day cultural journey through Japan during cherry blossom season',
        5299.00, 6499.00,
        '${JSON.stringify([img(16226627), img(20817306), img(36353249), img(31761848)])}',
        ${catIds[5]},'12 Nights / 13 Days','Tokyo, Kyoto, Nara, Hiroshima','solo',
        '${JSON.stringify(["Cherry blossom viewing","Tea ceremony","Ryokan stay","Geisha district tour","Shinkansen travel","Sushi-making class"])}',
        '${JSON.stringify(["Boutique hotels & ryokan","Japan Rail Pass","Daily breakfast","8 cultural experiences","Tea ceremony","Airport transfers"])}',
        true, true, 10, 4.9, 143)`,

      // 11 – Costa Rica
      `('Costa Rica Solo Explorer','costa-rica-solo-explorer',
        'Embrace the Pura Vida lifestyle on this thrilling 9-day solo adventure through Costa Rica. Zip-line through cloud forests, surf Pacific waves, hike active volcanoes, and spot toucans and sloths in pristine rainforests. Meet fellow travelers at eco-lodges, enjoy farm-to-table cuisine, and discover why Costa Rica is the world''s happiest country.',
        '9-day solo adventure through Costa Rica''s rainforests & volcanoes',
        1999.00, 2499.00,
        '${JSON.stringify([img(6016924), img(1271619), img(23696830), img(17317399)])}',
        ${catIds[2]},'9 Nights / 10 Days','Costa Rica','solo',
        '${JSON.stringify(["Zip-lining","Volcano hiking","Surfing lessons","Wildlife spotting","Hot springs","Cloud forest walk"])}',
        '${JSON.stringify(["Eco-lodge stays","Daily breakfast","6 guided activities","Surf lesson","National park fees","Airport transfers"])}',
        false, false, 1, 4.6, 62)`,

      // 12 – Amalfi
      `('Amalfi Coast Luxury Escape','amalfi-coast-luxury',
        'Indulge in la dolce vita along Italy''s most glamorous coastline. This 7-night luxury escape features a cliffside boutique hotel in Positano, private boat tours along the coast, limoncello tasting in Ravello, Pompeii archaeological excursions, and a private cooking class with a local nonna.',
        '7-night luxury Italian coastal escape with private boat tours & cooking classes',
        3899.00, 4599.00,
        '${JSON.stringify([img(16857488), img(18688136), img(18192481), imgPng(22619624)])}',
        ${catIds[1]},'7 Nights / 8 Days','Amalfi Coast, Italy','couple',
        '${JSON.stringify(["Positano cliffside hotel","Private boat tour","Cooking class","Pompeii visit","Limoncello tasting","Capri day trip"])}',
        '${JSON.stringify(["Boutique hotel stay","Daily breakfast","Private boat tour","Cooking class","Pompeii guided tour","Airport transfers"])}',
        false, true, 4, 4.8, 176)`,
    ];

    const prodResult = await client.query(`
      INSERT INTO products
        (name, slug, description, short_description, price, original_price,
         images, category_id, duration, location, travel_type,
         highlights, included, featured, best_seller, max_guests, rating, review_count)
      VALUES ${prodValues.join(",\n")}
      RETURNING id;
    `);
    const prodIds = prodResult.rows.map((r: { id: number }) => r.id);

    // Reviews (2-3 per product)
    await client.query(`
      INSERT INTO reviews (product_id, author_name, rating, title, content, travel_date, travel_type) VALUES
        (${prodIds[0]}, 'Sarah & James Mitchell', 5, 'Beyond our wildest dreams',
          'This trip exceeded every expectation. The overwater villa was absolutely stunning — we could see tropical fish swimming beneath our glass floor. The staff remembered our names from day one. The sunset dolphin cruise was magical, and the food was exceptional at every restaurant. Worth every penny!',
          'March 2025', 'Couple'),
        (${prodIds[0]}, 'Elena Rodriguez', 5, 'Pure paradise',
          'I''ve traveled extensively and this was hands down the most beautiful destination. The snorkeling right from our villa was incredible — we saw manta rays! The spa treatments were heavenly. Already planning our return trip.',
          'January 2025', 'Couple'),
        (${prodIds[0]}, 'David Chen', 4, 'Incredible but pricey',
          'Everything about this trip was world-class. The only reason for 4 stars is the additional costs for some activities not in the package. But the villa, the service, and the natural beauty were absolutely 5-star.',
          'February 2025', 'Couple'),

        (${prodIds[1]}, 'The Williams Family', 5, 'Best family vacation ever!',
          'Our kids (8 and 12) still talk about this trip daily. The cooking class was a highlight — they now make their own nasi goreng at home! The villa was spacious and the pool was perfect. The rafting adventure was thrilling but safe. WanderNest thought of everything.',
          'July 2025', 'Family'),
        (${prodIds[1]}, 'Priya Sharma', 5, 'Cultural immersion at its finest',
          'What I loved most was the balance between tourist highlights and authentic experiences. Visiting the temples early morning before crowds, learning from local artisans, and the cliffside dinner at sunset — just perfect.',
          'August 2025', 'Family'),

        (${prodIds[2]}, 'Mark & Lisa Johnson', 5, 'The perfect anniversary trip',
          'We chose this for our 10th anniversary and it was absolutely perfect. The cave suite views were breathtaking, and waking up to the caldera every morning was surreal. The wine tasting was educational and fun, and the sunset cruise was the highlight.',
          'September 2025', 'Couple'),
        (${prodIds[2]}, 'Sophie Laurent', 5, 'Romantic perfection',
          'Every detail was thoughtfully arranged. The spa was incredible, and the private wine tasting in a centuries-old cave was something I''ll never forget. Santorini sunsets really are as magical as they say.',
          'October 2025', 'Couple'),

        (${prodIds[3]}, 'Alex Thompson', 5, 'Life-changing journey',
          'As a solo traveler, I was nervous about 14 days alone in Europe. But WanderNest''s itinerary was so well planned that I met amazing people at every stop. The Michelin dinner in Paris was extraordinary, and the private museum tours meant no crowds.',
          'June 2025', 'Solo'),
        (${prodIds[3]}, 'Rachel Kim', 4, 'Amazing but intense pace',
          'Five cities in 14 days is ambitious. Every destination was wonderful, but I wish we had one more day in each city. The accommodations were beautiful and the experiences were top-notch.',
          'May 2025', 'Solo'),

        (${prodIds[4]}, 'Tom & Amy Richards', 5, 'Hidden gems of Europe',
          'We''ve done Paris and London, but Prague and Budapest blew us away. The architecture, the food, the thermal baths — everything was incredible. The Danube dinner cruise with the Parliament building lit up was one of the most beautiful things we''ve ever seen.',
          'April 2025', 'Couple'),

        (${prodIds[5]}, 'Michael Torres', 5, 'Achievement unlocked!',
          'Standing at Everest Base Camp was the most profound experience of my life. Our Sherpa guide, Pemba, was not just experienced but became a friend. The acclimatization schedule was perfect — no altitude sickness issues.',
          'November 2025', 'Solo'),
        (${prodIds[5]}, 'Jenny Haworth', 5, 'Challenging but so rewarding',
          'I trained for months and it was worth every step. The teahouses were more comfortable than expected, and the food was hearty and delicious. The mountain views are impossible to capture in photos.',
          'October 2025', 'Solo'),

        (${prodIds[6]}, 'The Garcia Family', 5, 'Nature at its absolute best',
          'We saw bears, elk, and even a moose! Lake Louise was even more beautiful than the photos. The kids loved the rafting and the campfire evenings. The helicopter flight over the glaciers was absolutely breathtaking.',
          'August 2025', 'Family'),

        (${prodIds[7]}, 'Christine & Robert Bell', 5, 'Once in a lifetime — literally',
          'Watching thousands of wildebeest cross the Mara River while a crocodile lurked nearby — it was like watching a nature documentary in real life. The hot air balloon at sunrise over the Serengeti was the most magical experience.',
          'July 2025', 'Couple'),
        (${prodIds[7]}, 'James Okafor', 5, 'Africa stole my heart',
          'I''ve wanted to do this safari my entire life and it exceeded every expectation. We saw all of the Big Five within the first three days! The Ngorongoro Crater was like a lost world.',
          'August 2025', 'Couple'),

        (${prodIds[8]}, 'Patricia & Harold Moore', 5, 'Floating luxury palace',
          'Everything about this cruise was first-class. The ship was gorgeous, the food was incredible (we tried all 12 restaurants!), and the port stops were well-timed. Monaco and the Amalfi Coast were highlights.',
          'September 2025', 'Family'),
        (${prodIds[8]}, 'The Anderson Family', 4, 'Great for families',
          'Our teens loved the onboard activities while we relaxed at the spa. The shore excursions were well-organized. Only dock time in Athens felt too short. Would definitely cruise again!',
          'July 2025', 'Family'),

        (${prodIds[9]}, 'Maria Santos', 5, 'Japan during sakura is MAGIC',
          'I timed this trip perfectly for cherry blossom season and every day was more beautiful than the last. The tea ceremony was a profound experience, and staying in the ryokan with onsen baths was incredibly relaxing.',
          'April 2025', 'Solo'),
        (${prodIds[9]}, 'Peter & Yuki Zhang', 5, 'Perfect blend of old and new',
          'From the futuristic streets of Shibuya to the ancient serenity of Nara''s deer park, every day brought something extraordinary. The sushi-making class was fun and the Shinkansen rides were an experience in themselves.',
          'April 2025', 'Couple'),

        (${prodIds[10]}, 'Ryan Douglas', 5, 'Pure adventure',
          'As a solo traveler, Costa Rica was perfect. The zip-lining through the cloud forest was exhilarating, and I spotted a toucan and two sloths! The eco-lodges were comfortable and I met great people.',
          'February 2025', 'Solo'),

        (${prodIds[11]}, 'Isabella & Marco Bianchi', 5, 'La dolce vita indeed!',
          'Positano exceeded our expectations. The cooking class with Nonna Maria was unforgettable — her pasta recipe is now a family heirloom. The private boat tour revealed hidden beaches and grottoes.',
          'June 2025', 'Couple'),
        (${prodIds[11]}, 'Olivia Harper', 5, 'Italy at its most beautiful',
          'Every morning I''d step onto my balcony and pinch myself — the views of Positano''s colorful houses cascading down to the sea were unreal. The Capri day trip and Pompeii visit added wonderful variety.',
          'May 2025', 'Solo');
    `);

    console.log(
      `[db] Seeded: ${catIds.length} categories, ${prodIds.length} products, 22 reviews ✅`
    );
  } finally {
    client.release();
  }
}
