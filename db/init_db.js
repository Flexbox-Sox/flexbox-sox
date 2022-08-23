const { client, createProduct } = require("./");
const { createUser, updateUser } = require("./models");

async function buildTables() {
  try {
    client.connect();
    console.log("Dropping tables...");
    await client.query(`
        DROP TABLE IF EXISTS "cartItems";
        DROP TABLE IF EXISTS carts;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;
    `);
    console.log("Tables dropped!");
    console.log("Creating tables...");
    await client.query(`
        CREATE TABLE users(
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          username VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          "isAdmin" BOOLEAN DEFAULT FALSE,
          UNIQUE (username, email)
        );

        CREATE TABLE products(
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          price NUMERIC NOT NULL,
          "inStock" BOOLEAN DEFAULT TRUE,
          description VARCHAR(255) NOT NULL,
          photo VARCHAR(255) NOT NULL,
          reviews VARCHAR(255)
        );

        CREATE TABLE carts(
          id SERIAL PRIMARY KEY,
          "userId" INTEGER REFERENCES users(id),
          "orderStatus" VARCHAR(255) DEFAULT 'active',
          "sessionId" VARCHAR(255)
        );

        CREATE TABLE "cartItems"(
          id SERIAL PRIMARY KEY,
          "productId" INTEGER REFERENCES products(id),
          "priceAtPurchase" NUMERIC DEFAULT 0.00,
          "cartId" INTEGER REFERENCES carts(id),
          quantity INTEGER DEFAULT 1
        );

    `);
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    await createProduct({
      name: "Our Best Selling Sock",
      description: "A pair of black socks with Annie's face all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/dP5cx1T/annie-sock-removebg-preview.png",
      price: 99.99
    })

    await createProduct({
      name: "CHIEFS KINGDOM",
      description: "Perfect socks to wear on red friday! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/ZNPd15d/IMG-4865-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Who Wants Pizza??",
      description: "A pair of turquoise socks with gray accents with delicious pepperoni pizza slices all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/n85pS7C/IMG-4862-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Cornhole, so stupid, so fun",
      description: "The perfect socks to wear while playing a fun stupid game of cornhole! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/P95SB5G/IMG-4863-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Donut You Want These?!",
      description: "A pair of green socks with pink frosted donuts all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/rbwR1vW/IMG-4861-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Happy Feet!",
      description: "A pair of red socks with blue accents with penguins all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/SRT1TTB/IMG-4864-1-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "AvoSOCKos",
      description: "A pair of blue socks with sliced avocados all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/VwLGC4Q/IMG-4874-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "A Pair of Lemons",
      description: "A pair of purple socks with delicious lemons all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/M8WJ62v/IMG-4868-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Polkasocks",
      description: "A pair of navy socks with white polkadots! Easy to dress up or down! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/qMH7kpr/IMG-4860-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Pac-Man Villians!",
      description: "A pair of black socks with Pac-Man ghosts flying around! A playful pair of socks perfect for a day of gaming! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/0JXwQvW/IMG-4866-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Happy Hour",
      description: "A pair of black socks with delicious martinis all over them! Wear these on your date night! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/C6T9RBy/IMG-4867-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Boat Day",
      description: "A pair of black socks with colorful kayak paddles all over them! Great for after a long day of paddling! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/KKyLQgq/IMG-4869-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Soccoli",
      description: "A pair of navy socks with yummy broccoli all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/7rYmggv/IMG-4870-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Llama or Alpaca?",
      description: "A pair of black socks with llamas or alpacas... we aren't sure... that's for you to decide! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/ZXGZKGb/IMG-4871-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Saillllllll",
      description: "A pair of navy socks with anchors all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/8gG2Bnx/IMG-4872-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "MIZ-ZOU",
      description: "Go Tigers!! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/P9bG8mk/IMG-4873-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "RainBow Feet",
      description: "100% Cotton | long socks | breathable material | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/LtLzGgm/p-3.jpg",
      price: 5.99,
    });

    await createProduct({
      name: "Fruity Pebbles with out milk",
      description:
        "Enjoy a fruity flavor on your feet all day #tastetheRainbow | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/T1Zg4tK/p-1.jpg",
      price: 5.99,
    });

    await createProduct({
      name: "The love couple",
      description: "There are just making out... | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/wWR0Vt7/s-l300-3.jpg",
      price: 5.99,
    });

    await createUser({
      username: "testadmin",
      password: "password",
      email: "admin@email.com"
    })
    await updateUser(1, {isAdmin: true})

    await createUser({
      username: "anniemahl",
      password: "anniemahl",
      email: "annie@email.com"
    })

    await createUser({
      username: "sammyester",
      password: "sammyester",
      email: "sammy@email.com"
    })

    await createUser({
      username: "nikoboykin",
      password: "nikoboykin",
      email: "niko@email.com"
    })
    
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
