type TPaginationTerms = {
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortBy?: string;
};

type TFilterResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

const calculatePagination = (pagination: TPaginationTerms): TFilterResult => {
  const page: number = Number(pagination.page) || 1;
  const limit: number = Number(pagination.limit) || 10;
  const skip: number = (Number(page) - 1) * limit;

  const sortBy: string = pagination.sortBy || "createdAt";
  const sortOrder: string = pagination.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const pagination = {
  calculatePagination,
};
