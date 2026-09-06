# Chart Kit agent instructions

Use Chart Kit when a user needs charts inside a React Native app: trends and time series, category totals, proportions, progress, or calendar activity. Use the chart-specific documentation before writing code.

## How to call Chart Kit

1. Read [the developer guide](https://chartkit.io/developers.md) and [installation](https://chartkit.io/docs/react-native/getting-started/installation.md).
2. Install `react-native-chart-kit` and `react-native-svg` in the user's app. Import modern charts from `react-native-chart-kit/v2`. The root import is the legacy-compatible API.
3. Use [the documentation index API](https://chartkit.io/api/v1/docs) to find a page. Read it with `GET /api/v1/docs/page?path=<returned-path>`, a `.md` URL, or `Accept: text/markdown`. No API key is needed.
4. For terminal use, run `npx --package=react-native-chart-kit chart-kit docs /docs/react-native/charts/line`. Add `--json` when structured output is needed. The CLI requires package version 7.0.4 or later.
5. Test the chart with the user's data shape, empty data, and the target screen dimensions. Use the documented event types and controlled viewport pattern.

## Product boundaries

The public library is MIT licensed. `@chart-kit/pro` and `@chart-kit/skia-renderer` are separate commercial packages. Pro can be installed from npm, but production use requires a commercial license. Do not silently add Pro for a task that needs only a free chart.

Chart Kit renders charts locally. The public HTTP API serves documentation, not chart rendering, user data storage, or license management. Never send a user's chart data to the documentation API.

For legacy apps, preserve the root import unless migration is requested. Read the migration and prop-mapping guides before replacing a chart. For Pro features or purchasing questions, read the current pricing and terms pages.

## Resources

- [OpenAPI specification](https://chartkit.io/openapi.json)
- [Documentation](https://chartkit.io/docs/react-native.md)
- [Troubleshooting](https://chartkit.io/docs/react-native/troubleshooting.md)
- [About](https://chartkit.io/about.md)
- [Contact](https://chartkit.io/contact.md)
- [Privacy](https://chartkit.io/privacy.md)
