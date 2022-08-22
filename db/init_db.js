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
      name: "Annie's Face Sock",
      description: "A pair of black socks with Annie's face all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/dP5cx1T/annie-sock-removebg-preview.png",
      price: 99.99
    })

    await createProduct({
      name: "I Heart KC",
      description: "A pair of gray socks with red accents with the kc heart logo all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/j8jkHcV/heartkc-sock-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Who Wants Pizza??",
      description: "A pair of turquoise socks with gray accents with delicious pepperoni pizza slices all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/Qky9CY0/pizza-sock-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Dill Pickle Feet",
      description: "A pair of mustard colored socks with navy accents with pickles all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/RTpykS2/pickle-sock-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Donut You Want These Socks?!",
      description: "A pair of green socks with pink frosted donuts all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/Zh9MrM1/donut-sock-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Funky Bananas",
      description: "A pair of red socks with gray accents with bananas all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/tKHYvBn/banana-sock-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "Yummy Avocados",
      description: "A pair of blue socks with sliced avocados all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/j5x8tZm/avocado-sock-removebg-preview.png",
      price: 5.99
    })

    await createProduct({
      name: "A Pair of Lemons",
      description: "A pair of purple socks with delicious lemons all over them! | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/QmfD1yC/lemon-sock-removebg-preview.png",
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
      name: "The egypt man with a hat on",
      description:
        "Have you ever been to the pyramids of Giza? Ok, don't gloat about it. | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/h8bgSRr/p.jpg",
      price: 5.99,
    });

    await createProduct({
      name: "The strong woman",
      description: "Lady carrying her son on back. | 100% Cotton | Long Socks | Breathable and Durable Material",
      photo: "https://i.ibb.co/1mqFm36/s-l300-2.jpg",
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
