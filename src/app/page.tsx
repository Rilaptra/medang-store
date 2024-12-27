"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SearchPage from "@/components/search-page";
import Footer from "@/components/layout/footer";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    search: string | null;
    category: string | null;
  }>({
    search: null,
    category: null,
  });

  const params = useSearchParams();

  useEffect(() => {
    setIsClient(true);
    setSearchParams({
      search: params.get("search"),
      category: params.get("category"),
    });
  }, [params]);

  if (!isClient) {
    return null;
  }

  if (searchParams.search) {
    return (
      <>
        <SearchPage
          category={searchParams.category}
          query={searchParams.search}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <section className="text-center py-20 bg-gradient-to-r from-primary/10 to-primary/0 rounded-lg relative">
          <div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 to-primary/0 z-0 border-2 border-transparent border-r-0 border-l-0k"
            style={{
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
            }}
          ></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 relative z-10">
            Welcome to Medang Market
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto relative z-10">
            Your trusted marketplace for the school community. Buy and sell with
            confidence.
          </p>
          <div className="flex flex-col gap-2 md:flex-row w-full max-w-md mx-auto p-2 relative z-10">
            <Link href="/products" className="flex-1">
              <Button size="lg" className="w-full">
                Browse Products
              </Button>
            </Link>
            <Link href="/api/aut jh/register" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
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
      <Footer />
    </>
  );
}
