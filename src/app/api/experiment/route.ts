"use server";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db/connect";
import { Product } from "@/lib/db/models/product.model";

interface GeneratedProduct {
  seller_id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  variations: {
    variant_title: string;
    price: number;
    stock: number;
    images: string[];
    discount?: number;
    discount_value?: number;
    discount_type?: "percent" | "value";
  }[];
  purchased_by: mongoose.Types.ObjectId[];
  isActive: boolean;
  isPreOrder: boolean;
  created_at: Date;
  updated_at: Date;
}

function generateUniqueProducts(
  sellerId: string,
  count: number
): GeneratedProduct[] {
  const categories = ["Elektronik", "Kosmetik", "Makanan", "Minuman"];
  const foodAndDrinks = [
    "Nasi Goreng",
    "Soto Ayam",
    "Gado-Gado",
    "Rendang",
    "Sate Ayam",
    "Bakso",
    "Mie Ayam",
    "Es Teh Manis",
    "Jus Alpukat",
    "Kopi Susu",
    "Teh Tarik",
    "Air Mineral",
    "Cappuccino",
    "Latte",
    "Pizza",
    "Burger",
    "Kentang Goreng",
    "Ayam Goreng",
    "Sushi",
    "Ramen",
    "Pasta",
    "Spaghetti",
    "Pancake",
    "Waffle",
    "Donat",
    "Martabak",
    "Pecel",
    "Rawon",
    "Gudeg",
    "Bubur Ayam",
    "Siomay",
    "Batagor",
    "Pempek",
    "Lumpia",
    "Kolak",
    "Es Campur",
    "Es Buah",
    "Dawet",
    "Bandrek",
    "Bajigur",
    "Wedang Jahe",
    "Sekoteng",
    "Kue Lumpur",
    "Bika Ambon",
    "Klepon",
    "Getuk",
    "Cendol",
    "Es Doger",
  ];

  const variantTitles = ["kecil", "sedang", "besar"];
  const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
  const randomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const uniqueProducts: GeneratedProduct[] = [];
  const usedTitles = new Set<string>();

  while (uniqueProducts.length < count) {
    const randomTitle = `${getRandom(foodAndDrinks)}`;
    if (usedTitles.has(randomTitle)) {
      continue;
    }
    usedTitles.add(randomTitle);

    const randomDescription = `Ini adalah produk ${randomTitle.toLowerCase()} kategori ${getRandom(
      categories
    ).toLowerCase()}. Sangat cocok untuk ${randomTitle.toLowerCase()}`;
    const randomCategory = getRandom(categories);
    const randomVariant = getRandom(variantTitles);

    const variations = [
      {
        variant_title: randomVariant,
        price: randomNumber(10000, 100000),
        stock: randomNumber(5, 50),
        images: [`https://picsum.photos/200?random=${Math.random()}`],
        discount: randomNumber(0, 50),
        discount_value: randomNumber(1000, 10000),
        discount_type: getRandom(["percent", "value"]),
      },
    ];

    const product = {
      seller_id: new mongoose.Types.ObjectId(sellerId),
      title: randomTitle,
      description: randomDescription,
      category: randomCategory,
      variations,
      purchased_by: [],
      isActive: true,
      isPreOrder: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    uniqueProducts.push(product);
  }

  return uniqueProducts;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const sellerIds = ["6764c4486cecacee024a6ac9", "676810a4deaaacac93bf10b4"];

    const allProducts: GeneratedProduct[] = [];
    sellerIds.forEach((sellerId) => {
      const uniqueProducts = generateUniqueProducts(sellerId, 25);
      allProducts.push(...uniqueProducts);
    });

    return NextResponse.json({ data: allProducts }, { status: 200 });
  } catch (error: any) {
    console.error("Error creating products:", error);
    return NextResponse.json(
      { message: `Gagal membuat produk: ${error.message}` },
      { status: 500 }
    );
  }
}
