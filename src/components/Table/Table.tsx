import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import "./Table.css";
import { fetchTableData } from "../../redux/tableSlice";
import LoadingOverlay from "react-loading-overlay-ts";
import axios from "axios";

const Table: React.FC = () => {
  const isActiveLoading = true;
  const dispatch: AppDispatch = useDispatch();
  const { data, status, error } = useSelector(
    (state: RootState) => state.table
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<number>(Math.ceil(data.count / 10));
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [inputError, settInputError] = useState("");

  const [editedRow, setEditedRow] = useState({
    name: "",
    address: "",
    phone_number: "",
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTableData(currentPage * 10));
    }
  }, [status, dispatch]);

  useEffect(() => {
    setPages(Math.ceil(data.count / 10));
  }, [data.count]);

  const handleNextPage = async () => {
    if (currentPage + 1 === pages) return;

    setCurrentPage((prev) => prev + 1);
    if (currentPage < pages) {
      dispatch(fetchTableData((currentPage + 1) * 10));
    }
  };

  const handlePrevPage = async () => {
    if (currentPage >= 1) {
      setCurrentPage((prev) => prev - 1);
      dispatch(fetchTableData((currentPage - 1) * 10));
    }
  };

  const handleCheckPage = async (index: number) => {
    setCurrentPage(index);
    dispatch(fetchTableData(index * 10));
  };

  const handleEditRow = (id: number) => {
    setSelectedRow(id);

    const selectedItem = data.results.find((item) => item.id === id);
    if (selectedItem) {
      setEditedRow({
        name: selectedItem.name,
        address: selectedItem.address,
        phone_number: selectedItem.phone_number,
      });
    }
  };

  const handleSaveRow = async (id: number) => {
    if (
      editedRow.name.length < 3 ||
      editedRow.address.length <= 5 ||
      editedRow.phone_number.length <= 7
    ) {
      settInputError(
        "Make sure your name, address and phone number are entered correctly (Name: min 3 symbols, Address: 5, Phone: 7)"
      );
      return;
    }

    try {
      const dataToUpdate = {
        name: editedRow.name,
        address: editedRow.address,
        phone_number: editedRow.phone_number,
      };

      await axios.patch(
        `https://technical-task-api.icapgroupgmbh.com/api/table/${id}/`,
        dataToUpdate
      );
      settInputError("");
      setSelectedRow(null);
      dispatch(fetchTableData(currentPage * 10));
    } catch (error) {
      console.log(error);
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
  console.log(pages);

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((item) => (
                <tr key={item.id}>
                  <td>
                    {selectedRow === item.id ? (
                      <div className="change-wrapper">
                        <input
                          type="text"
                          value={editedRow.name}
                          onChange={(e) =>
                            setEditedRow({ ...editedRow, name: e.target.value })
                          }
                          className="input-change-mode"
                        />
                      </div>
                    ) : (
                      item.name
                    )}
                  </td>
                  <td>{item.email}</td>
                  <td>
                    {selectedRow === item.id ? (
                      <div className="change-wrapper">
                        <input
                          type="text"
                          value={editedRow.address}
                          onChange={(e) =>
                            setEditedRow({
                              ...editedRow,
                              address: e.target.value,
                            })
                          }
                          className="input-change-mode"
                        />
                      </div>
                    ) : (
                      item.address
                    )}
                  </td>
                  <td>
                    {selectedRow === item.id ? (
                      <div className="change-wrapper">
                        <input
                          type="text"
                          value={editedRow.phone_number}
                          onChange={(e) =>
                            setEditedRow({
                              ...editedRow,
                              phone_number: e.target.value,
                            })
                          }
                          onKeyPress={(e) => {
                            if (!/[0-9+]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          className="input-change-mode"
                        />
                      </div>
                    ) : (
                      item.phone_number
                    )}
                  </td>
                  <td>
                    {selectedRow === item.id ? (
                      <button
                        className="change-button"
                        onClick={() => handleSaveRow(item.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          className="change-button"
                          onClick={() => handleEditRow(item.id)}
                        >
                          Change
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {inputError.length > 0 && <p className="input-error">{inputError}</p>}
          <div className="pagination" id="pagination">
            <div
              onClick={handlePrevPage}
              className={
                currentPage === 0 || currentPage === pages
                  ? "pagination-arrows left-position-off"
                  : "pagination-arrows"
              }
            >
              &lt;
            </div>
            {new Array<number>(pages).fill(pages).map((_, index) => (
              <div
                key={index}
                className={
                  index === currentPage ? "active-page" : "number-page"
                }
                onClick={() => handleCheckPage(index)}
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
