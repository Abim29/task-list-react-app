import { useCallback, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import { useSearchParams } from "react-router";
import SearchBar from "./SearchBar";

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const [searchQuery, setSearchQuery] = useState(null);
  const [data, setData] = useState({ products: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const getProducts = useCallback(
    async function getProducts() {
      let uri = "http://localhost:8080/product";
      if (page && (searchQuery === null || searchQuery === "")) {
        uri += `?page=${page}`;
      }
      if (searchQuery !== null && searchQuery !== "" && !page) {
        uri += `?search=${searchQuery}`;
      }
      if (page && searchQuery) {
        uri += `?page=${page}&search=${searchQuery}`;
      }
      const response = await fetch(uri);
      const resData = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch products data");
      }

      console.log(uri, searchQuery === null);

      return resData;
    },
    [page, searchQuery]
  );

  useEffect(() => {
    setIsLoading(true);
    async function fetchProducts() {
      try {
        const res = await getProducts();
        setData(res);
        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    }
    fetchProducts();
  }, [getProducts]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Customers also purchased
        </h2>
        <SearchBar onChangeSearch={setSearchQuery} />
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!isLoading && data.products && data.products.length > 0 && (
          <>
            <div className="my-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {data.products.map((product) => {
                return <ProductCard key={product._id} product={product} />;
              })}
            </div>
            <Pagination {...data} />
          </>
        )}
        {!isLoading && data.products && data.products.length === 0 && (
          <>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              <p>Products Empty</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
