"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-20 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to SchoolMarket
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your trusted marketplace for the school community. Buy and sell with
          confidence.
        </p>
        <div className="space-x-4">
          <Link href="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
          <Link href="/api/auth/register">
            <Button variant="outline" size="lg">
              Start Selling
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add featured categories here */}
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trending Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Add trending products here */}
        </div>
      </section>
    </div>
  );
}
