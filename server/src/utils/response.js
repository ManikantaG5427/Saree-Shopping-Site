export function successResponse(data, message, meta) {
  return {
    success: true,
    message,
    data,
    meta,
  };
}

export function errorResponse(message, code = 'ERROR', details) {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}

export function paginatedResponse(data, page, limit, total, message, extraMeta) {
  return {
    success: true,
    message,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      ...extraMeta,
    },
  };
}
