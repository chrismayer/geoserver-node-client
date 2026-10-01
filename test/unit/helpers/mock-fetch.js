// test/unit/helpers/mock-fetch.js
export function mockFetch(handler) {
  const original = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (input, init = {}) => {
    const call = {
      url: String(input),
      method: init.method ?? 'GET',
      headers: init.headers ?? {},
      body: init.body
    };
    calls.push(call);

    const { status = 200, body = {}, headers = {} } = handler(call);
    const text = typeof body === 'string' ? body : JSON.stringify(body);

    return new Response(status === 204 ? null : text, {
      status,
      headers: { 'content-type': 'application/json', ...headers }
    });
  };

  return {
    calls,
    restore: () => {
      globalThis.fetch = original;
    }
  };
}
