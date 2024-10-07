const PaginationWow = ({ currentPage, onPageChange }) => {
    return (
        <div className="m-4 flex justify-center content-center">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 mr-2 bg-gray-600 text-white rounded disabled:opacity-50"
            >
                Previous
            </button>
            <span
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
            >
                Page: {currentPage}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                // disabled={currentPage === }
                className="px-4 py-2 ml-2 bg-gray-600 text-white disabled:opacity-50"
            >
                Next
            </button>
        </div >
    );
};

export default PaginationWow;