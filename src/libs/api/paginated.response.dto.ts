export class PaginatedResponseDto {
    items: any[];
    page: number;
    limit: number;
    totalItems: number;
    maxItems: number;

    constructor(data: {
        items: any[];
        page: number;
        limit: number;
        totalItems: number;
        maxItems: number;
    }) {
        Object.assign(this, data);
    }
}
