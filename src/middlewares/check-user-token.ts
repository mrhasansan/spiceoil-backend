import { createMiddleware } from "hono/factory";
import { validateToken } from "../libs/jwt";
import { prisma } from "../libs/prisma";

export const checkUserToken = () => {
  return createMiddleware(async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      console.log("Authorization header missing"); // Log if the Authorization header is missing
      c.status(401);
      return c.json({
        message: " Not allowed, authorization header is required",
      });
    }

    const token = authHeader.split(" ")[1];
    // this splits the authHeader string into an array of substrings using space and then accesr the second element [1]
    // Authorization: ["Bearer", "token"]
    // exp : ["Bearer", "eyChemistrysecret"]
    if (!token) {
      c.status(401);
      return c.json({
        message: "Not Allowed, token is required",
      });
    }
    const decodedToken = await validateToken(token);
    if (!decodedToken) {
      c.status(401);
      return c.json({ message: "Not allowed, token is invalid" });
    }

    const userId = decodedToken.subject;
    if (!userId) {
      c.status(401);
      return c.json({ message: "User ID does not exist" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      c.status(404);
      return c.json({ message: "User not found" });
    }
    c.set("user", user);

    await next();
  });
};
