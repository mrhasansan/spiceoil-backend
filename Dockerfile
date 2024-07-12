# Use a base image with Bun pre-installed
FROM oven/bun:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN bun install

# Generate Prisma client using bunx
RUN bunx prisma generate

# Command to run the application
CMD ["bun", "start"]