const { client, createProduct } = require("./");
const { createCart, createUser, updateUser, createCartItem } = require("./models");

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
          "cartId" INTEGER REFERENCES carts(id) 
        );

    `);
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    const product1 = await createProduct({
      name: "RainBow Feet",
      description: "100% Cotton | long socks | breathable material",
      photo: "https://i.ibb.co/LtLzGgm/p-3.jpg",
      price: 5.99,
    });
    const product2 = await createProduct({
      name: "SharkBoy",
      description: "100% cotton| base-color: blue | ankle socks ",
      photo: "https://i.ibb.co/LzDt9pH/p-4.jpg",
      price: 5.99,
    });
    const product3 = await createProduct({
      name: "Flame Thrower",
      description:
        "Throws flames at your enemies and keeps your feet warm at night",
      photo: "https://i.ibb.co/7YTgq1f/p-5.jpg",
      price: 5.99,
    });
    const product4 = await createProduct({
      name: "The lady with the crooked face",
      description: " Carry a lady on your foot that never blinks",
      photo: "https://i.ibb.co/RjYFFDB/p-6.jpg",
      price: 5.99,
    });
    const product5 = await createProduct({
      name: "Fruity Pebbles with out milk",
      description:
        "Enjoy a fruity flavor on your feet all day #tastetheRainbow",
      photo: "https://i.ibb.co/T1Zg4tK/p-1.jpg",
      price: 5.99,
    });
    const product6 = await createProduct({
      name: "Sandy the Squirel",
      description: "Folks love spongebob so get your  very own sandy socks",
      photo: "https://i.ibb.co/1nHDvJ3/p-11.jpg",
      price: 5.99,
    });
    const product7 = await createProduct({
      name: "Naked Lady",
      description: "There is a lady in a shell",
      photo: "https://i.ibb.co/n3DsHHy/p-12.jpg",
      price: 5.99,
    });
    const product8 = await createProduct({
      name: "Alien dance Party",
      description:
        "You got a bunch of alines on your feet what else do you need",
      photo: "https://i.ibb.co/pKy1dBk/p-13.jpg",
      price: 5.99,
    });
    const product9 = await createProduct({
      name: "The egypt man with a hat on (red)",
      description: "lakdjf",
      photo: "https://i.ibb.co/h8bgSRr/p.jpg",
      price: 5.99,
    });
    const product10 = await createProduct({
      name: "The egypt man with a hat on (blue)",
      description:
        "Have you ever been to the pyramids of Giza? Ok, don't gloat about it.",
      photo: "https://i.ibb.co/h8bgSRr/p.jpg",
      price: 5.99,
    });
    const product11 = await createProduct({
      name: "The strong woman",
      description: "Lady carrying her son on back",
      photo: "https://i.ibb.co/1mqFm36/s-l300-2.jpg",
      price: 5.99,
    });
    const product12 = await createProduct({
      name: "The love couple",
      description: "There are just making out.",
      photo: "https://i.ibb.co/wWR0Vt7/s-l300-3.jpg",
      price: 5.99,
    });

    const admin = await createUser({
      username: "testadmin",
      password: "password",
      email: "admin@email.com"
    })
    const updateAdmin = await updateUser(1, {isAdmin: true})

    const annie = await createUser({
      username: "anniemahl",
      password: "anniemahl",
      email: "annie@email.com"
    })

    const sammy = await createUser({
      username: "sammyester",
      password: "sammyester",
      email: "sammy@email.com"
    })

    const niko = await createUser({
      username: "nikoboykin",
      password: "nikoboykin",
      email: "niko@email.com"
    })
    
    const cart = await createCart({
      userId: 1,
      sessionId: 1
    })

    const cart1Item1 = await createCartItem({
      productId: 2,
      priceAtPurchase: 5.99,
      cartId: 1
    })

    const cart1Item2 = await createCartItem({
      productId: 4,
      priceAtPurchase: 5.99,
      cartId: 1
    })

    const cart1Item3 = await createCartItem({
      productId: 5,
      priceAtPurchase: 5.99,
      cartId: 1
    })

    const cart2 = await createCart({
      userId: 2,
      sessionId: 2
    })

    const cart2Item1 = await createCartItem({
      productId: 7,
      priceAtPurchase: 5.99,
      cartId: 2
    })

    const cart2Item2 = await createCartItem({
      productId: 10,
      priceAtPurchase: 5.99,
      cartId: 2
    })

    const cart2Item3 = await createCartItem({
      productId: 10,
      priceAtPurchase: 5.99,
      cartId: 2
    })
    
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
