const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function simulateNetwork(data, ms = 700) {
  await wait(ms);
  return data;
}

export async function simulateError(message = 'Something went wrong', ms = 1000) {
  await wait(ms);
  throw new Error(message);
}

export function paginate(items, page = 1, size = 4) {
  const start = (page - 1) * size;
  return {
    items: items.slice(start, start + size),
    hasMore: start + size < items.length,
  };
}
