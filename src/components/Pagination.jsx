function Pagination({pagination, onChangePage}) {
    const handleClick = (e, page) => {
        e.preventDefault();
        onChangePage(page)
    }

    return (<>
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
                <li className={`page-item ${pagination.has_pre ? '' : 'disabled'}`}> {/* 如沒有前一頁就不能點擊按鈕 */}
                <a className="page-link" href="#" aria-label="Previous" onClick={(e) => handleClick(e, pagination.current_page - 1)}>
                    <span aria-hidden="true">&laquo;</span>
                </a>
                </li>
                {/* Array.from() 讀取 length 屬性
                    這裡的 _ 代表陣列元素（不使用它) */}
                {
                    Array.from({length: pagination.total_pages}, (_, index) => (
                        <li key={`${index}_page`} className={`page_item ${pagination.current_page === index + 1 ? 'active' : ''}`}>
                            <a className="page-link" href="#" onClick={(e) => handleClick(e, index + 1)}>{index + 1}</a>
                        </li>
                    ))
                }
                <li className={`page-item ${pagination.has_next ? '' : 'disabled'}`}> {/* 如沒有下一頁就不能點擊按鈕 */}
                <a className="page-link" href="#" aria-label="Next" onClick={(e) => handleClick(e, pagination.current_page + 1)}>
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
        </nav>
    </>)
}

export default Pagination