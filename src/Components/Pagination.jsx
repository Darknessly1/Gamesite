
function Pagination({ cardsPerPage, totalCards, paginate, currentPage }) {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalCards / cardsPerPage);

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);

    if (endPage - startPage < 2) {
        if (currentPage === totalPages) {
            startPage = Math.max(1, endPage - 2);
        } else {
            endPage = Math.min(totalPages, startPage + 2);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="my-4">
            <ul className="flex justify-center space-x-2">
                <li className={`page-item ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded"
                    >
                        Previous
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'font-bold' : ''}`}>
                        <button
                            onClick={() => paginate(number)}
                            className="px-3 py-1 border rounded"
                        >
                            {number}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded"
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
}
export default Pagination;
