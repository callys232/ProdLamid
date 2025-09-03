import { useState } from "react";
import { motion } from "framer-motion";

const TablePage = ({ formData, handleChange, handleProceed }) => {
  const [tableData, setTableData] = useState(formData.tableData || []);

  // Handle Table Data Updates
  const handleTableChange = (e, rowIndex, colIndex) => {
    const updatedTable = [...tableData];
    updatedTable[rowIndex][colIndex] = e.target.value;
    setTableData(updatedTable);
    handleChange({ target: { id: "tableData", value: updatedTable } });
  };

  // Add a new row
  const addRow = () => {
    setTableData([...tableData, Array(5).fill("")]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex justify-center items-center min-h-screen"
    >
      {/* Form Frame */}
      <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg border border-white/20">
        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Table Data Entry</h2>
        <p className="text-gray-400 mb-6 text-center">Fill in the table below. Click "Add Row" to expand.</p>

        {/* Table Styling */}
        <table className="w-full border border-gray-500 rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="p-2">Column 1</th>
              <th className="p-2">Column 2</th>
              <th className="p-2">Column 3</th>
              <th className="p-2">Column 4</th>
              <th className="p-2">Column 5</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border">
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-2 text-center">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleTableChange(e, rowIndex, colIndex)}
                      className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-red-400 hover:shadow-md transition-all duration-300 ease-in-out"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Row Button */}
        <button
          onClick={addRow}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:bg-red-700 hover:scale-105 hover:ring-2 hover:ring-red-400"
        >
          Add Row +
        </button>
      </div>
    </motion.div>
  );
};

export default TablePage;
