import React from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Form from "../components/Form";
import Card from "../components/Card";
import notFoundImage from "../assets/images/banners/not-found.jpg";
import { fetchCamps } from "../api/fetchCamps";
import useQueryParams from "../utilities/useQueryParams";
import useInfiniteScroll from "../utilities/useInfiniteScroll";

const CampFinder = () => {
  const queryClient = useQueryClient();
  const campsPerPage = 9;
  const { qStateCode, qSearchTerm } = useQueryParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["camps", qStateCode, qSearchTerm, campsPerPage],
    queryFn: ({ pageParam }) =>
      fetchCamps({
        queryKey: ["camps", qStateCode, qSearchTerm, campsPerPage],
        pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const totalCamps = Number(lastPage.total);
      const currentStart = Number(lastPage.start);
      const currentPageCount = lastPage.data.length;
      const nextStart = currentStart + currentPageCount;

      return currentPageCount < campsPerPage || nextStart > totalCamps ? undefined : nextStart;
    },
  });

  const handleSearch = () => {
    queryClient.invalidateQueries([
      "camps",
      qStateCode,
      qSearchTerm,
      campsPerPage,
    ]);
  };

  useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  return (
    <div className="campgrounds-page page">
      <div className="campgrounds-banner">
        <div className="banner-content">
          <h1 className="banner-heading">Find your Campground</h1>
          <p>
            Escape to the outdoors and discover the ideal campground for your
            next adventure. Whether you're seeking serene forests, lakeside
            retreats, or mountainous vistas, our easy-to-use campground finder
            helps you locate the best spots to unwind and reconnect with nature.
          </p>
        </div>
      </div>

      <div className="campgrounds-form">
        <div className="campgrounds-form-container">
          <Form
            uPath="campgrounds"
            uState={qStateCode}
            uSearch={qSearchTerm}
            onSearch={handleSearch}
          />
        </div>
      </div>
      <div className="content-container container">
        {error ? (
          <p className="status">Error: {error.message}</p>
        ) : data && data.pages.length > 0 ? (
          <div className="gallery">
            {data.pages.map((group, i) =>
              group.data.map((camp) => (
                <Card
                  id={camp.id}
                  key={camp.id}
                  title={camp.name}
                  imageUrl={camp.images && camp.images[0]
                      ? camp.images[0].url
                      : notFoundImage
                  }
                  parkUrl={`/camp?cID=${camp.id}`}
                />
              ))
            )}
            {isFetchingNextPage && <p className="status">Loading more...</p>}
          </div>
        ) : (
          <p className="status">No Camps Available</p>
        )}
      </div>
    </div>
  );
};

export default CampFinder;
