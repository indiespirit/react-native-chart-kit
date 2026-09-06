export function createOpenApi(version) {
  const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
  const response = (description, schema) => ({
    description,
    content: { "application/json": { schema } }
  });
  const errors = {
    404: response(
      "The resource does not exist. Follow the resolution hint.",
      ref("Error")
    ),
    405: {
      ...response("Only GET and HEAD are supported.", ref("Error")),
      headers: {
        Allow: {
          description: "Supported HTTP methods.",
          schema: { type: "string" }
        }
      }
    }
  };
  const metadata = {
    path: {
      type: "string",
      description: "Canonical site path.",
      example: "/docs/react-native/charts/line"
    },
    title: { type: "string", description: "Page title." },
    url: {
      type: "string",
      format: "uri",
      description: "Public HTML page URL."
    },
    markdownUrl: {
      type: "string",
      format: "uri",
      description: "Public Markdown page URL."
    }
  };
  return {
    openapi: "3.1.1",
    info: {
      title: "Chart Kit Documentation API",
      version,
      description:
        "Read Chart Kit product and React Native library documentation. No authentication or API key is required. Charts render locally in your app; this API does not render charts, store data, or manage licenses.",
      contact: {
        name: "Chart Kit support",
        url: "https://chartkit.io/contact",
        email: "support@chartkit.io"
      },
      license: {
        name: "MIT (public library)",
        url: "https://github.com/chart-kit/react-native-chart-kit/blob/main/LICENSE"
      }
    },
    servers: [{ url: "https://chartkit.io" }],
    security: [],
    paths: {
      "/api/v1/docs": {
        get: {
          operationId: "listChartKitDocs",
          summary: "List Chart Kit documentation",
          description:
            "List the available public pages and their HTML and Markdown URLs. Use a returned path with getChartKitDoc.",
          responses: {
            200: response("The public page index.", {
              type: "object",
              required: ["pages"],
              additionalProperties: false,
              properties: {
                pages: { type: "array", items: ref("PageSummary") }
              }
            }),
            ...errors
          }
        }
      },
      "/api/v1/docs/page": {
        get: {
          operationId: "getChartKitDoc",
          summary: "Read a Chart Kit page",
          description:
            "Read one public page as Markdown inside a JSON response. First use listChartKitDocs to select an exact path.",
          parameters: [
            {
              name: "path",
              in: "query",
              required: true,
              description: "One canonical path returned by listChartKitDocs.",
              schema: {
                type: "string",
                minLength: 1,
                maxLength: 300,
                pattern: "^/"
              },
              example: "/docs/react-native/charts/line"
            }
          ],
          responses: {
            200: response("The page content and links.", ref("Page")),
            400: response(
              "The path parameter is missing or invalid.",
              ref("Error")
            ),
            ...errors
          }
        }
      }
    },
    components: {
      schemas: {
        PageSummary: {
          type: "object",
          additionalProperties: false,
          required: Object.keys(metadata),
          properties: metadata
        },
        Page: {
          type: "object",
          additionalProperties: false,
          required: [...Object.keys(metadata), "markdown"],
          properties: {
            ...metadata,
            markdown: {
              type: "string",
              description: "Full page content in Markdown."
            }
          }
        },
        Error: {
          type: "object",
          additionalProperties: false,
          required: ["error"],
          properties: {
            error: {
              type: "object",
              additionalProperties: false,
              required: ["code", "message", "hint"],
              properties: {
                code: {
                  type: "string",
                  enum: ["NOT_FOUND", "INVALID_PATH", "METHOD_NOT_ALLOWED"]
                },
                message: { type: "string", description: "What failed." },
                hint: {
                  type: "string",
                  description: "How to resolve the error."
                }
              }
            }
          }
        }
      }
    }
  };
}
