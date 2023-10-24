import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import "./Table.css";
import { fetchTableData } from "../../redux/tableSlice";
import LoadingOverlay from "react-loading-overlay-ts";

const Table: React.FC = () => {
  const isActiveLoading = true;
  const dispatch: AppDispatch = useDispatch();
  const { data, status, error } = useSelector(
    (state: RootState) => state.table
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<number>(Math.ceil(data.count / 10));

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTableData(currentPage * 10));
    }
  }, [status, dispatch]);

  useEffect(() => {
    setPages(Math.ceil(data.count / 10));
  }, [data.count]);

  const handleNextPage = async () => {
    if (currentPage + 1 === 7) return;

    setCurrentPage((prev) => prev + 1);
    if (currentPage < 7) {
      dispatch(fetchTableData((currentPage + 1) * 10));
    }
  };

  const handlePrevPage = async () => {
    if (currentPage >= 1) {
      setCurrentPage((prev) => prev - 1);
      dispatch(fetchTableData((currentPage - 1) * 10));
    }
  };

  if (status === "loading") {
    return (
      <div className="loading">
        <LoadingOverlay
          active={isActiveLoading}
          spinner
          text="Loading your content..."
        >
          <div style={{ height: 400 }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </LoadingOverlay>
      </div>
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="tableWrapper">
      {data.results?.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.address}</td>
                  <td>{item.phone_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination" id="pagination">
            <div
              onClick={handlePrevPage}
              className={
                currentPage === 0
                  ? "pagination-arrows left-position-off"
                  : "pagination-arrows"
              }
            >
              &lt;
            </div>
            {new Array<number>(pages).fill(pages).map((_, index) => (
              <div
                key={index}
                className={index === currentPage ? "active-page" : ""}
              >
                {index + 1}
              </div>
            ))}
            <div
              onClick={handleNextPage}
              className={
                currentPage === 6
                  ? "pagination-arrows left-position-off"
                  : "pagination-arrows"
              }
            >
              &gt;
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Table;
