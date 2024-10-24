import React, { useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Form from "../components/Form";
import Card from "../components/Card";
import notFoundImage from "../assets/images/banners/not-found.jpg";

import {fetchParks} from "../api/fetchParks";
import useQueryParams from "../utilities/useQueryParams";
import useInfiniteScroll from "../utilities/useInfiniteScroll";

const Explore = () => {
  const queryClient = useQueryClient();
  const parksPerPage = 9;
  const { qActivity, qStateCode, qSearchTerm } = useQueryParams();

  const formattedActivity = qActivity ? qActivity.replace(/-/g, " ") : null;

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["parks", qStateCode, qSearchTerm, parksPerPage, formattedActivity],
    queryFn: ({ pageParam }) => fetchParks({ queryKey: ["parks", qStateCode, qSearchTerm, parksPerPage, formattedActivity], pageParam }),
    getNextPageParam: (lastPage) => {
    const totalparks = Number(lastPage.total);
    const currentStart = Number(lastPage.start);
    const currentPageCount = lastPage.parks.length;
    const nextStart = currentStart + currentPageCount;

    return currentPageCount < parksPerPage ? undefined : nextStart <= totalparks ? nextStart : undefined;
  },
 });

  const handleSearch = () => {
    queryClient.invalidateQueries(["parks", qStateCode, qSearchTerm, parksPerPage, formattedActivity]);
  };

  useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  return (
    <div className="explore-page page">
      <div className="explore-banner">
        <div className="banner-content">
          <h1 className="banner-heading">Explore</h1>
          <p>
            Welcome to National Parks, your ultimate guide to exploring
            America's most beautiful natural treasures. We believe in the power
            of nature to inspire and connect us all.
          </p>
        </div>
      </div>
      <div className="explore-form">
        <div className="explore-form-container">
          <Form
            uPath={`explore`}
            uState={qStateCode}
            uSearch={qSearchTerm}
            onSearch={handleSearch}
          />
        </div>
      </div>
      <div className="content-container container">
        {isFetching ? (
          <p className="status">Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : data && data.pages[0].parks.length > 0 ? (
          <div className="gallery">
            {data.pages.map((group, i) =>
              group.parks.map((park) => (
                <Card
                  key={park.parkID}
                  parkCode={park.parkCode}
                  title={park.name}
                  imageUrl={park.image}
                  parkUrl={`/park?pCode=${park.parkCode}`}
                />
              ))
            )}
          </div>
        ) : (
          <p className="status">No Parks Available</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
