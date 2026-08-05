export interface TableRequest {

    pageNumber: number;

    pageSize: number;

    searchText?: string;

    sortColumn?: string;

    sortDirection?: 'asc' | 'desc' | '';

}