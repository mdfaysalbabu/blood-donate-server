"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const calculatePagination = (pagination) => {
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const skip = (Number(page) - 1) * limit;
    const sortBy = pagination.sortBy || "createdAt";
    const sortOrder = pagination.sortOrder || "desc";
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};
exports.pagination = {
    calculatePagination,
};
