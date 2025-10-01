import { fetchProduct, fetchProducts } from "@/lib/data/products";
import { notFound } from "next/navigation";
import React from "react";
import Image from "next/image";
import ReviewScore from "@/components/products/review-score";
import { Box, Gift, Truck } from "lucide-react";
import ReviewList from "@/components/products/review-list";
import Stars from "@/components/stars";
import RatingBarChart from "@/components/products/rating-bar-chart";
import AddToCartBtn from "@/components/products/add-to-cart-btn";
import { URLProps } from "@/lib/interfaces";
import ProductPrice from "@/components/products/product-price";
import DiscountTag from "@/components/products/discount-tag";

export async function generateMetadata({ params }: URLProps) {
  const { slug } = await params;

  if (slug) {
    const product = await fetchProduct(slug);
    if (product) {
      return {
        title: `Maison Nova - ${product.title}`,
        description: `Detailed product information about: ${product.title}`,
      };
    }
  }
  return {
    title: "Maison Nova - Not Found",
    description: "The product don't exist",
  };
}

export async function generateStaticParams() {
  const result = await fetchProducts();

  if (result) {
    const allProducts = result;
    return allProducts.map((product) => ({
      slug: product.slug,
    }));
  }
}

export default async function Page({ params, searchParams }: URLProps) {
  const { slug } = await params;
  const { sort } = await searchParams;

  if (!slug) {
    return notFound();
  }

  const product = await fetchProduct(slug);

  if (!product) {
    return notFound();
  }

  /* Display decmials if price is under 1000 */
  const showDecimals = product.price > 1000 ? 0 : 2;
  /* Display the images in two columns if the product have two or more images */
  const imageGrid = product.images.length < 2 ? "grid-cols-1" : "grid-cols-2";

  return (
    <>
      <section className="relative px-8 pt-16 pb-8 grid gap-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <figure
            className={`grid ${imageGrid} lg:grid-cols-1 lg:h-[1000px] overflow-auto gap-2 relative lg:mx-auto`}>
            {product.discountPercentage && (
              <DiscountTag discount={product.discountPercentage}></DiscountTag>
            )}
            {product.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${product.title} + ${index}`}
                width={500}
                height={500}
                className="bg-foreground"></Image>
            ))}
          </figure>

          <section className="grid gap-8 h-min">
            {/* Productinfo */}
            <div className=" flex justify-between border-b-1 pb-8">
              <div>
                <h2>{product.title}</h2>
                {product.reviews ? (
                  <ReviewScore
                    nrOfReviews={product.reviews.length}
                    scoreOutOfFive={product.rating!}></ReviewScore>
                ) : (
                  <ReviewScore nrOfReviews={0} scoreOutOfFive={0}></ReviewScore>
                )}
              </div>
              <ProductPrice
                discount={product.discountPercentage ?? 0}
                price={product.price}></ProductPrice>
            </div>
            {/* Decsription */}
            <section className="grid gap-4 border-b-1 pb-8">
              <h3>Description</h3>
              <p>
                {product.description} Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Labore esse quam ducimus vel facilis. Natus at
                tempore tenetur pariatur, distinctio ab praesentium dignissimos
                soluta optio deserunt nobis incidunt nemo atque.
              </p>
            </section>

            {/* Buy options */}
            <div className="border-b-1 pb-8 ">
              <AddToCartBtn product={product} />
            </div>

            {/* General order information */}
            <section className="grid justify-start gap-8 md:border-b-1 pb-8">
              <div className="flex gap-10">
                <Truck size={50} strokeWidth={1}></Truck>
                <div>
                  <p className="font-bold">Free Shipping</p>
                  <p>On all orders over $100</p>
                </div>
              </div>

              <div className="flex gap-10">
                <Box size={50} strokeWidth={1}></Box>
                <div>
                  <p className="font-bold">Easy Returns</p>
                  <p>Extenden through November 31</p>
                </div>
              </div>

              <div className="flex gap-10">
                <Gift size={50} strokeWidth={1}></Gift>
                <div>
                  <p className="font-bold">Send It As A Gift</p>
                  <p>Add a free personalized note during checkout</p>
                </div>
              </div>
            </section>
          </section>
        </div>
      </section>

      <section className="pt-8 grid gap-8">
        <h2 className="text-center">Reviews</h2>

        <div className="grid md:flex gap-16 justify-center md:block-flex bg-foreground p-16 ">
          <div className="grid content-start justify-center gap-4">
            <p className="font-semibold wrap-pretty">{`${
              product.rating?.toFixed(1) ?? 0
            } Overall Rating`}</p>
            {product.rating && (
              <Stars scoreOutOfFive={product.rating} starCn="size-6"></Stars>
            )}
          </div>

          {product.reviews ? (
            <RatingBarChart
              numbers={product.reviews.map(
                (review) => review.rating
              )}></RatingBarChart>
          ) : (
            <RatingBarChart numbers={[0]}></RatingBarChart>
          )}
        </div>

        <ReviewList sort={sort} reviews={product.reviews ?? []}></ReviewList>
      </section>
    </>
  );
}
