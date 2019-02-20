## Custom Swagger/OpenAPI Implementations
The API reference pages use a modified version of the OpenAPI (aka Swagger) API specification version 2. Documentation for the specification can be found [here](https://swagger.io/specification/v2/). Over time, we should keep the API spec JSON files as close to the spec as we can, any custom properties (prefixed with `x-`) and their use cases should be documented here.

### `x-btx-methods`
A section of the JSON API spec that accommodates Websocket methods. A sibling of the [Paths Object](https://swagger.io/specification/v2/#pathsObject), though each property key maps to 
an `x-btx-method`

### `x-btx-method`
An individual Websocket method, similar in shape to an [Operation object](https://swagger.io/specification/v2/#operationObject)

### `x-btx-authenticated`
An additional property (type: `boolean`) allowed in the [Operation object](https://swagger.io/specification/v2/#operationObject). Used to denote an operation that can only be called after properly authenticating.

### `x-btx-request-example`
An additional property (type: `string`) allowed in the [Operation object](https://swagger.io/specification/v2/#operationObject). Used to show an example request url.

### Parameters object
Base definition can be found here: [Parameter object](https://swagger.io/specification/v2/#parameterObject)
- `in` is no longer required
