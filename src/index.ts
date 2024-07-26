import { Hono } from "hono";
import { cors } from "hono/cors";
import { prisma } from "./libs/prisma";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.json({
    message: " Welcome to REST API of Spices and Essential Oil",
    products: "/products",
    users: "/users",
  });
});

app.get("/products", async (c) => {
  try {
    const products = await prisma.product.findMany();
    return c.json(products);
  } catch (error) {
    return c.json({ error: " Error Fetching products" }, 500);
  }
});

app.get("/products/:slug", zValidator("param", z.object({ slug: z.string() })), async (c) => {
  try {
    const { slug } = c.req.valid("param");
    const product = await prisma.product.findUnique({
      where: { slug: slug },
    });

    if (!product) {
      return c.json({
        message: `Product not found`,
      });
    }

    return c.json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.log(`Error get product detail `);
  }
});

app.get("/users", async (c) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
    },
  });
  return c.json(users);
});

app.get(
  "users/:username",

  zValidator("param", z.object({ username: z.string() })),
  async (c) => {
    const { username } = c.req.valid("param");
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      c.status(404);
      c.json({
        message: `User with ${user} not found`,
      });
    }

    return c.json(user);
  }
);

app.post("/products", async (c) => {
  const body = await c.req.json();
  console.log("Receive body:", body);
  try {
    const newProduct = await prisma.product.create({
      data: {
        name: String(body.name),
        price: Number(body.price),
        slug: String(body.slug),
        quantity: Number(body.quantity),
        imageURL: String(body.image),
        category: String(body.category),
        olfactoryProfile: String(body.olfactoryProfile),
        description: String(body.description),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return c.json(newProduct);
  } catch (error) {
    return c.json(
      {
        error: "Error creating product",
      },
      500
    );
  }
});

app.put("/products/:id", async (c) => {
  const id = String(c.req.param("id"));
  if (!id) {
    return c.json({
      message: "There is no id Product",
    });
  }
  const body = await c.req.json();
  try {
    const newProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name ? String(body.name) : undefined,
        price: body.price ? Number(body.price) : undefined,
        quantity: body.quantity ? Number(body.quantity) : undefined,
        imageURL: body.image ? String(body.image) : undefined,
        category: body.category ? String(body.category) : undefined,
        olfactoryProfile: body.olfactoryProfile ? String(body.olfactoryProfile) : undefined,
      },
    });
    return c.json(newProduct);
  } catch (error) {
    return c.json({ error: "Error for updating product" }, 500);
  }
});
app.delete("/products", async (c) => {
  try {
    await prisma.product.deleteMany();

    return c.json({
      message: ` All Products have been deleted`,
    });
  } catch (error) {
    return c.json({ error: "Error deleting all products" });
  }
});

app.delete("/products/:id", async (c) => {
  const id = String(c.req.param("id"));
  if (!id) {
    return c.json({
      message: " There is no id Product",
    });
  }
  try {
    const deleteProduct = await prisma.product.delete({
      where: { id },
    });
    return c.json({
      message: `Product with ${id} has been deleted`,
      deleteProduct,
    });
  } catch (error) {
    return c.json({ error: "Error deleting product" });
  }
});

Bun.serve({
  fetch: app.fetch,
  port: 3000, // Change the port if needed
});

console.log(`API Spice Oil is Running`);
export default app;
