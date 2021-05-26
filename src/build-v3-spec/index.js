var R = require('ramda'),
    _ = require('lodash');

function spectacleTopics(json) {
    console.log('Adding Spectacle topics...');
    var errorCodeHtml = getErrorCodeHtml();

    var topics = {
        "Change Log": {
            "description": "__05/26/2021__ \n- All non-corporate users are now required to provide basic source of funds information. If you have not provided this information, you will be prompted to do so when logging into the website or mobile app. Operations related to trading or moving funds will fail with error code SOURCE_OF_FUNDS_REQUIRED if this information has not been provided. This will also be reflected in [GET /account](#operation--account-get) with an entry in the (new) actionsNeeded array and in the actions indicated as allowed by the permissions API.\n- You can now get your current trading fees using [GET /account/fees/trading](#operation--account-fees-trading-get)\n\n__04/09/2021__ \n- You can now get an [execution by id](#operation--executions--executionId--get)\n- Miscellaneous clarifications and additional error codes documented\n- Updated known issues list\n\n__02/18/2021__ \n- The marketSybol included in the execution socket updates was changed to Base-Quote format to match the rest of the API. \n\n__02/16/2021__ \n- Updated known issues and upcoming breaking changes to reflect executions socket stream marketSymbol issue\n- Added more codes to the error code documentation\n\n__12/02/2020__ \n- There is now a socket stream for [executions](#method-Execution)! As well as a corresponding set of REST endpoints for retrieving [historical executions](#operation--executions-get) and [synchronizing](#operation--executions-last-id-get).\n- You can now place or cancel multiple orders with a single request using the [/batch](#operation--batch-post) endpoint\n- Determining which markets and currencies you have access to can now be done more easily and explicitly via the [market permissions](#operation--account-permissions-markets-get) and [currency permissions](#operation--account-permissions-currencies-get) endpoints\n- It is now possible to retrieve market candles based on the midpoint between best bid ad ask in addition to candles based on trade prices (note that midpoint candles from prior to 12/2 are not available)\n- The /withdrawals/whitelistAddresses endpoint has been renamed to /withdrawals/allowed-addresses for clarity. The old name will continue to work.\n\nTo see older changes, please visit the [history page](../../history/v3)."
        },
        "Upcoming Breaking Changes": {
            "description": "No further breaking changes are planned"
        },
        "Known Issues": {
            "description": "Refer to the [GitHub issues page](https://github.com/Bittrex/bittrex.github.io/issues)"
        },
        "REST API Overview": {
            "description": "This section provides an overview of key concepts to understand when working with the Bittrex v3 REST API. \nKeep in mind the following: \n - Enable 2FA on your account. API Keys cannot be generated unless 2FA is enabled and extended verification is done on the account.\n - All REST requests must be sent to `https://api.bittrex.com/v3` using the `application/json` content type. Non-HTTPS requests will be redirected to HTTPS, possibly causing functional or performance issues with your application."
        },
        "Best Practices": {
            "description": "### Call Limits\nThe Bittrex API employs call limits on all REST endpoints to ensure the efficiency and availability of the platform for all customers. Limits are set such that they should not interfere with legitimate usage patterns. Frequent polling for updates on market data, order status, history, etc. is discouraged and will likely result in your requests failing with a 429 status code. If you need frequent updates, subscribe to the websocket instead of polling. Frivolous order placement and cancellation in a tight loop with low fill rates is also discouraged.\n\nThrottling is tracked on a minute by minute basis with the limit resetting at the start of the next minute. In general, making a maximum of 60 API calls per minute should be safe, but higher request rates are allowed depending on the usage pattern. If you receive a throttling error, back off for the remainder of the minute and reduce the rate of subsequent requests.\n\nAdditional information and help on this topic are available for corporate and high-volume customers via their account managers.",
            "childOf": "REST API Overview"
        },
        "Authentication": {
            "description": "### Overview\n In order to properly sign an authenticated request for the Bittrex v3 API, the following headers must be included:\n\n- `Api-Key`\n\n- `Api-Timestamp`\n\n- `Api-Content-Hash`\n\n- `Api-Signature`\n\n- `Api-Subaccount-Id (optional)`\n\n\nThe following sections are instructions for properly populating these headers.\n\n---\n #### Api-Key\nPopulate this header with your API key.\n\nExample Value:\n\n`4894xxxxxxxx407e827d05xxxxxxxxxx`\n\n---\n #### Api-Timestamp\nPopulate this header with the current time as a UNIX timestamp, in epoch-millisecond format.\n\nSample JS Code Snippet:\n\n``` javascript\nvar timestamp = new Date().getTime();\n```\n\nExample Value:\n\n`1542323450016`\n\n---\n #### Api-Content-Hash\nPopulate this header with a SHA512 hash of the request body, Hex-encoded. If there is no request body, populate this header with a SHA512 hash of an empty string.\n\nSample JS Code Snippet:\n\n``` javascript\nvar contentHash = CryptoJS.SHA512(JSON.stringify(requestBody)).toString(CryptoJS.enc.Hex);\n```\n\nExample Value:\n\n``` markdown\ncf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e\n```\nThis is the correct value of the content hash for any request with no body.\n\n---\n #### Api-Subaccount-Id (Only for subaccount feature) \n(NOTE: This functionality is limited to partners and unavailable to general traders.)\n\nIf you wish to make a request on behalf of a subaccount, you will need to:\n\n1. Authenticate using all 4 of the headers above referring to your master account.\n2. Populate the Api-Subaccount-Id header with the UUID of the subaccount you wish to impersonate for this request. The specified subaccount *must* be a subaccount of the master account used to authenticate the request.\n3. Include the Api-Subaccount-Id header at the end of the pre-signed signature, as indicated in the next section.\n\nExample Value:\n\n`x111x11x-8968-48ac-b956-x1x11x111111`\n\n---\n #### Api-Signature\nCreate a pre-sign string formed from the following items and concatenating them together:\n1. Contents of your `Api-Timestamp` header\n2. The full URI you are using to make the request (including query string)\n3. The HTTP method of the request, in all caps (GET, POST, DELETE, etc.)  \n4. Contents of your `Api-Content-Hash` header \n5. Content of your `Api-Subaccount-Id` header (or an empty string if not present) \n\n\nOnce you have created this pre-sign string, sign it via HmacSHA512, using your API secret as the signing secret. Hex-encode the result of this operation and populate the `Api-Signature` header with it.\n\n\nSample JS Code Snippet:\n\n``` javascript\nvar uri = 'https://api.bittrex.com/v3/balances';\nvar preSign = [timestamp, uri, method, contentHash, subaccountId].join('');\nvar signature = CryptoJS.HmacSHA512(preSign, apiSecret).toString(CryptoJS.enc.Hex);\n```\n\nExample Pre-Signed Value (no subaccount)\n\n``` markdown\n1542323450016https://api.bittrex.com/v3/balancesGETcf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e\n```\n\nExample Pre-Signed Value (with subaccount)\n\n``` markdown\n1542323450016https://api.bittrex.com/v3/balancesGETcf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3ex111x11x-8968-48ac-b956-x1x11x111111\n```\n\nExample Post-Signed Value:\n\n``` markdown\n939047623f0efbe10bfbb32f18e5d8885b2a91be3c3cea82adf0dd2d20892b20bcb6a10a91fec3afcedcc009f2b2a86c5366974cfadcf671fe0490582568f51f\n```\n\n\n",
            "childOf": "REST API Overview"
        },
        "Pagination": {
            "description": "### Overview\n Several Bittrex API resources support bulk fetches via 'list' API methods. For example, you can list deposits, list closed orders, and list withdrawals. These list API methods share a common structure, using at least these three parameters: `pageSize, nextPageToken and previousPageToken.` These parameters, if necessary are specified as query parameters on the HTTP request.\n\n ### Arguments:\n\n\n\n - __pageSize(optional)__: A limit on the number of objects to be returned between 1 and 200, defaults to 100\n - __nextPageToken(optional)__: The id of the last item on the current page. This is used for defining the starting point of the next page. For instance, if you make a list request and receive 100 objects ending with objFoo, your subsequent call can include `nextPageToken=objFoo's id` in order to fetch the next page of the list starting after objFoo.\n\n - __previousPageToken(optional)__: The id of the first item on the current page. This is used for defining the ending point of the previous page. For instance, if you make a list request and receive 100 objects starting with objBar, your subsequent call can include `previousPageToken=objBar's id` in order to fetch the previous page of the list.\n\n\n ### Examples:\n\nList withdrawals, in reverse chronological order, up to maximum of 20 withdrawals, starting at the most recent withdrawal created:\n\n`https://api.bittrex.com/v3/withdrawals?pageSize=20`\n\nList withdrawals, in reverse chronological order, up to maximum of 10 withdrawals, starting after the withdrawal with ID of `940af3c3-665d-4432-a12e-cdf8fd99ab3b`\n\n`https://api.bittrex.com/v3/withdrawals?pageSize=10&nextPageToken=940af3c3-665d-4432-a12e-cdf8fd99ab3b`\n\n List withdrawals, in reverse chronological order, up to a maximum of 10 withdrawals, ending before the withdrawal with ID of `0d990dd2-4103-4d57-8e80-047e886537db`: \n\n`https://api.bittrex.com/v3/withdrawals?pageSize=10&previousPageToken=0d990dd2-4103-4d57-8e80-047e886537db`\n\n",
            "childOf": "REST API Overview"
        },
        "Placing Orders": {
            "description": "Orders are placed using the [POST /orders](#operation--orders-post) operation. You can find sample request bodies for different types of orders in the examples in this section.\n\n### __Order Types__\n\n - __Market Order__ : An order to buy or sell a specified quantity of an asset immediately at the best available price. The market order will consume available orders on the book as it executes. Consequently, especially for large orders, the average price at which the order is filled will deviate from the last-traded price or current quote.\n\n - __Limit Order__ : An order to trade a specified quantity of an asset at a specified price. A buy order will only be filled at or below the limit price and a sell order will only be filled at or above the limit price.\n\n - __Ceiling Order__ : A market or limit order that allows you to specify the amount of quote currency you want to spend (or receive, if selling) instead of the quantity of the market currency (e.g. buy $100 USD of BTC at the current market BTC price)\n\n - __Good-Til-Cancelled Order__ : The order remains in force until it is explicitly cancelled either by the user or by Bittrex \n\n - __Immediate-Or-Cancel Order__ : The order will be filled immediately as much as possible and then cancelled.\n\n - __Fill-or-Kill__ : The order will be filled immediately and completely, or it is cancelled without being filled at all.\n\n - __Post Only__ : This option allows market makers to ensure that their orders are making it to the order book instead of matching with a pre-existing order. Note: If the order is not a maker order, you will return an error and the order will be cancelled\n\n - __Conditional Order__ : A directive for the system to place an order on your behalf when the price on the market moves past a given threshold. These are treated separately from orders. Refer to the Placing Conditional Orders section for more information. \n\n\n ### __Order types and time in force__ \n\n The following table shows which time in force options apply to which order types.\n\n\n<div style='overflow-x:auto;'><table><tbody><tr><th>timeInForce</th><th>LIMIT</th><th>MARKET</th><th>CEILING_LIMIT</th><th>CEILING_MARKET</th></tr><tr><td>GOOD_TIL_CANCELLED</td><td>BUY OR SELL</td><td>NOT ALLOWED</td><td>NOT ALLOWED</td><td>NOT ALLOWED</td></tr><tr><td>IMMEDIATE_OR_CANCEL</td><td>BUY OR SELL</td><td>BUY OR SELL</td><td>BUY OR SELL</td><td>BUY OR SELL</td></tr><tr><td>FILL_OR_KILL</td><td>BUY OR SELL</td><td>BUY OR SELL</td><td>BUY OR SELL</td><td>BUY OR SELL</td></tr><tr><td>POST_ONLY_GOOD_TIL_CANCELLED</td><td>BUY OR SELL</td><td>NOT ALLOWED</td><td>NOT ALLOWED</td><td>NOT ALLOWED</td></tr></tbody></table></div> \n\n\n ### __clientOrderId__ \n\nAn optional UUID which is generated by the user to to keep a track of the order. If the outcome of placing an order is not known (for example due to a client-side crash that occurred while placing the order), the same order can be safely placed again using the same UUID as the clientOrderId. If the order was received and processed the first time, the API will return an error that includes the existing order's id instead of creating a second order. This protection is in place for 24 hours after an order is placed. Although clientOrderIds which are more than 24 hours old are no longer checked against new orders, they remain associated with their orders as metadata and may be retrieved by clients.\n\n",
            "childOf": "REST API Overview",
            "example": "<h5>Request Body Example For Limit Order</h5><br><!-- < div class=\"hljs\" > --> <pre><code class=\"hljs lang-json\">{<br>    <span class=\"hljs-attr\">&quot;marketSymbol&quot;</span>: <span class=\"hljs-string\">&quot;string&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;direction&quot;</span>: <span class=\"hljs-string\">&quot;string&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;type&quot;</span>: <span class=\"hljs-string\">&quot;LIMIT&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;quantity&quot;</span>: <span class=\"hljs-string\">&quot;number (double)&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;limit&quot;</span>: <span class=\"hljs-string\">&quot;number (double)&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;timeInForce&quot;</span>: <span class=\"hljs-string\">&quot;GOOD_TIL_CANCELLED || IMMEDIATE_OR_CANCEL || FILL_OR_KILL || POST_ONLY_GOOD_TIL_CANCELLED&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;clientOrderId&quot;</span>: <span class=\"hljs-string\">&quot;string (uuid)&quot;</span><br>}<br></code></pre><br><h5>Request Body Example For Market Order</h5><br><!-- <div class=\"hljs\"> --><pre><code class=\"hljs lang-json\">{<br>    <span class=\"hljs-attr\">&quot;marketSymbol&quot;</span>: <span class=\"hljs-string\">&quot;string&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;direction&quot;</span>: <span class=\"hljs-string\">&quot;string&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;type&quot;</span>: <span class=\"hljs-string\">&quot;MARKET&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;quantity&quot;</span>: <span class=\"hljs-string\">&quot;number (double)&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;timeInForce&quot;</span>: <span class=\"hljs-string\">&quot;IMMEDIATE_OR_CANCEL || FILL_OR_KILL&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;clientOrderId&quot;</span>: <span class=\"hljs-string\">&quot;string (uuid)&quot;</span><br>}<br></code></pre><br><h5>Request Body Example For Ceiling limit Order</h5><br><!-- <div class=\"hljs\"> --><pre><code class=\"hljs lang-json\">{<br>    <span class=\"hljs-attr\">&quot;marketSymbol&quot;</span>: <span class=\"hljs-string\">&quot;string&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;direction&quot;</span>: <span class=\"hljs-string\">&quot;string&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;type&quot;</span>: <span class=\"hljs-string\">&quot;CEILING_LIMIT&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;limit&quot;</span>: <span class=\"hljs-string\">&quot;number (double)&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;ceiling&quot;</span>: <span class=\"hljs-string\">&quot;number (double)&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;timeInForce&quot;</span>: <span class=\"hljs-string\">&quot;IMMEDIATE_OR_CANCEL || FILL_OR_KILL&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;clientOrderId&quot;</span>: <span class=\"hljs-string\">&quot;string (uuid)&quot;</span><br>}<br></code></pre><br><h5>Request Body Example For Ceiling Market Order</h5><br><!-- <div class=\"hljs\"> --><pre><code class=\"hljs lang-json\">{<br>    <span class=\"hljs-attr\">&quot;marketSymbol&quot;</span>: <span class=\"hljs-string\">&quot;string&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;direction&quot;</span>: <span class=\"hljs-string\">&quot;string&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;type&quot;</span>: <span class=\"hljs-string\">&quot;CEILING_MARKET&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;ceiling&quot;</span>: <span class=\"hljs-string\">&quot;number (double)&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;timeInForce&quot;</span>: <span class=\"hljs-string\">&quot;IMMEDIATE_OR_CANCEL||FILL_OR_KILL&quot;</span>,<br>    <span class=\"hljs-attr\">&quot;clientOrderId&quot;</span>: <span class=\"hljs-string\">&quot;string (uuid)&quot;</span><br>}<br></code></pre>"
        },
        "Placing Conditional Orders": {
            "description": "### Placing Conditional Orders\n\nConditional orders are placed using this API by specifying the market price trigger conditions and what action to take when the trigger is reached. When a trade occurs on the market that matches the trigger conditions, the actions are triggered such as placing an order. Conditional orders are not the same as orders. They are stored separately from normal orders and do not appear on the order book. As such, there is a small delay between trading occurring on the market and corresponding conditional orders being triggered.\n\nCare must also be taken when working with conditional orders because balance is not reserved. If you create a conditional order costing an amount in excess of your account balance for a currency or if your account balance drops due to other trades subsequent to you placing a conditional order there is a risk that you will not have enough balance available to place the order when the conditional order’s condition is met. If this occurs, placement of the order will fail.\n\n#### Trigger conditions\n\nThe trigger for a conditional order is made up of two parts: the operand and the trigger price or percentage. Operand may be either less than or equal to (LTE) or greater than or equal to (GTE). triggerPrice will be compared to the price of the last trade on the market to determine if the action(s) specified in the conditional order should be executed. Alternately, a trailingStopPercent may be specified. This will cause the triggerPrice to float a fixed percent off from the smallest or largest price seen since the conditional order was placed. The below table summarizes these options:\n\n\n<div style='overflow-x:auto;'><table><tbody><tr><th>Parameter provided</th><th>Operand</th><th>Trigger Price</th><th>Triggers when</th></tr><tr><td>triggerPrice</td><td>LTE</td><td>Constant</td><td>A trade occurs at a price LTE the provided trigger price</td></tr><tr><td>triggerPrice</td><td>GTE</td><td>Constant</td><td>A trade occurs at a price GTE the provided trigger price</td></tr><tr><td>trailingStopPercent</td><td>LTE</td><td>Calculated to be trailingStopPercent less than the maximum trade price on the market since the conditional order was placed</td><td>A trade occurs at a price LTE the calculated trigger price</td></tr><tr><td>trailingStopPercent</td><td>GTE</td><td>Calculated to be trailingStopPercent more than the minimum trade price on the market since the conditional order was placed</td><td>A trade occurs at a price GTE the calculated trigger price</td></tr></tbody></table></div> \n\n\n#### Actions\n\nWhen the trigger condition is met, this will result in a new order being placed and, optionally, another order or conditional order being cancelled. The order to place is configured by populating orderToCreate with the same object you would post to create an order. There are some limitations: post only orders, awards, and clientOrderId are not supported. For idempotency, instead specify a clientConditionalOrderId as a peer of orderToCreate in the request body.\n\nIf canceling an order is desired, provide the id of the order to cancel and the type of order (ORDER for an order on the book or CONDITIONAL_ORDER) in the orderToCancel object. This will pair the newly placed or with its target. If either conditional order triggers, the other will be cancelled. If both are trigger simultaneously, only the first conditional order place will trigger and the other will be cancelled. Note that there is not currently a way to break up two conditional orders paired in the fashion. To change the cancellation relationship, both conditional orders must be cancelled and placed again. You cannot link more than two orders in the fashion. Also note that if the orderToCancel is an order on the book and the conditional order triggers, the order on the book will be cancelled to free up funds prior to attempting to place the ordered triggered by the condition.\n\n#### Common Use Cases\n\nThis section describes some common use cases and provides instruction for how to meet them using the API:\n\n- __Stop Order__: A market order triggered by price moving past a given threshold. Specify operand and triggerPrice as desired and define a market buy or sell order in orderToCreate.\n\n- __Stop Limit Order__: A limit order triggered by price moving past a given threshold. Specify operand and triggerPrice as desired and define a limit buy or sell order in orderToCreate.\n\n- __Stop Loss Order__: A market sell order triggered by price falling to a given threshold. Specify LTE as the operand and triggerPrice as desired and define a market sell order in orderToCreate.\n\n- __Take Profit Order__: A limit sell order triggered by price rising to a given threshold. Specify GTE as the operand and triggerPrice as desired and define a limit sell order in orderToCreate.\n\n- __Trailing Stop Loss Order__: A market sell order triggered when price falls more than a given amount below the highest price seen since the order was created. Specify LTE as the operand, set trailingStopPercent as desired, and define a market sell order in orderToCreate.\n\n- __One Cancels the Other Order (OCO)__: A pair of orders where if one is triggered (for a conditional order) or executed (for an order on book) the other is automatically cancelled. When creating the second order in the pair, specify the id of the first order in orderToCancel. Note that currently one member of the OCO pair must be a conditional order.\n\nNote that more combinations are possible. These examples are intended as a guide to some common use cases, not an exhaustive list of supported scenarios.",
            "childOf": "REST API Overview"
        },
        "Error Codes": {
            "description": "### __Overview__:\n\n If an error occurs during the processing of an API request, the Bittrex API will return an error to the caller. The general flow of information to check is:\n\n - status code of the response.\n\n - error code and other information in the response body (JSON)\n\n### __HTTP Status Codes__\n\n<div style='overflow-x:auto;'><table><tbody><tr><th>Status Code</th><th>Description</th></tr><tr><td>400 - Bad Request</td><td>The request was malformed, often due to a missing or invalid parameter. See the error code and response data for more details.</td></tr><tr><td>401 - Unauthorized</td><td>The request failed to authenticate (example: a valid api key was not included in your request header)</td></tr><tr><td>403 - Forbidden</td><td> The provided api key is not authorized to perform the requested operation (example: attempting to trade with an api key not authorized to make trades)</td></tr><tr><td>404 - Not Found</td><td>The requested resource does not exist.</td></tr><tr><td>409 - Conflict</td><td>The request parameters were valid but the request failed due to an operational error. (example: INSUFFICIENT_FUNDS) </td><tr><td>429 - Too Many Requests</td><td>Too many requests hit the API too quickly. Please make sure to implement exponential backoff with your requests.</td></tr><tr><td>501 - Not Implemented</td><td>The service requested has not yet been implemented.</td></tr><tr><td>503 - Service Unavailable</td><td>The request parameters were valid but the request failed because the resource is temporarily unavailable (example: CURRENCY_OFFLINE)</td></tr></tbody></table></div>\n\n### __Error Codes__\nThis section lists some common error codes that are returned by the API, but is not an exhaustive list. If you have questions about an error code you are receiving, feel free to post an issue on GitHub.\n<table><tbody><tr><th>Error Code</th><th>Description</th></tr>" + errorCodeHtml + "</tbody></table>",
            "childOf": "REST API Overview"
        },
        "Websocket Overview": {
            "description": "The v3 websocket is intended to allow a client to subscribe to a live stream of updates about things that are changing in the system instead of needing to poll the REST API looking for updates. It is designed to complement and be used in conjunction with the v3 REST API. As such the messages sent from the socket include payloads that are formatted to match the corresponding data models from the v3 REST API.\n\nLike the existing v1 socket, the v3 socket is based on [Microsoft ASP.net’s SignalR](https://docs.microsoft.com/en-us/aspnet/signalr/overview/getting-started/tutorial-getting-started-with-signalr). We are not using ASP.net Core’s SignalR implementation at this time. As such, any existing SignalR client implementation working with the v1 socket should be able to be modified to work with the new v3 socket. If working in the .Net environment, the Microsoft.AspNet.SignalR.Client NuGet package is the recommended basis for a client implementation. The code snippets in the remainder of this section assume you are working in C# using that library. Refer to the [Example Socket Clients](#topic-Example-Socket-Clients) section for examples in other languages.",
        },
        "Example Socket Clients": {
            "description": "This section includes simple examples of how to subscribe and receive messages in a few popular languages. All of these examples follow the same basic pattern. They will connect to the socket server, authenticate if an API key and secret are provided, attempt to subscribe to a few streams, and finally print messages received on those streams to console.\n\n- C#: [V3WebsocketExample.cs](../../samples/V3WebsocketExample.cs)\n- Java: [V3WebsocketExample.java](../../samples/V3WebsocketExample.java)\n- Node.js: [V3WebsocketExample.js](../../samples/V3WebsocketExample.js)\n-Python: [V3WebsocketExample.py](../../samples/V3WebsocketExample.py)",
            "childOf": "Websocket Overview"
        },
        "Connecting": {
            "description": "To connect to the v3 socket, create a HubConnection to the socket URL (https://socket-v3.bittrex.com/signalr) and create a hub proxy. The hub name to use when creating the proxy is \"c3\". Once these objects are created, you can start the HubConnection to connect to the socket. There are no streams of data sent automatically based solely on being connected. To get data, you must [subscribe](#topic-Subscribing) to one or more streams. The available streams are discussed in the Websocket Streams section of this site.",
            "childOf": "Websocket Overview",
            "example": "<pre><code class=\"hljs language-c#\"><span class=\"hljs-keyword\">public</span> <span class=\"hljs-keyword\">class</span> <span class=\"hljs-title\">SocketClient</span><br>{<br>    <span class=\"hljs-keyword\">private</span> <span class=\"hljs-keyword\">string</span> _url;<br>    <span class=\"hljs-keyword\">private</span> HubConnection _hubConnection;<br>    <span class=\"hljs-keyword\">private</span> IHubProxy _hubProxy;<br><br>    <span class=\"hljs-function\"><span class=\"hljs-keyword\">public</span> <span class=\"hljs-title\">SocketClient</span>(<span class=\"hljs-params\"><span class=\"hljs-keyword\">string</span> url</span>)</span><br>    {<br>        _url = url;<br>        _hubConnection = <span class=\"hljs-keyword\">new</span> HubConnection(_url);<br>        _hubProxy = _hubConnection.CreateHubProxy(<span class=\"hljs-string\">\"c3\"</span>);<br>    }<br><br>    <span class=\"hljs-function\"><span class=\"hljs-keyword\">public</span> <span class=\"hljs-keyword\">async</span> Task&lt;<span class=\"hljs-keyword\">bool</span>&gt; <span class=\"hljs-title\">Connect</span>(<span class=\"hljs-params\"></span>)</span> {<br>        <span class=\"hljs-keyword\">await</span> _hubConnection.Start();<br>        <span class=\"hljs-keyword\">return</span> _hubConnection.State == ConnectionState.Connected;<br>    }<br>}<br></code></pre>"
        },
        "Authenticating": {
            "description": "Some streams contain private data and require that you be authenticated prior to subscribing. In order to authenticate, invoke the Authenticate method on the hub as shown in the example. The authentication will need to be renewed periodically. Currently authentication lasts for 10 minutes. When authentication expires subscriptions to any private streams will be cancelled. One minute prior to authentication expiring, a reminder message will be sent notifying the client that it is time to reauthenticate.",
            "childOf": "Websocket Overview",
            "example": "<pre><code class=\"hljs language-c#\"><span class=\"hljs-function\"><span class=\"hljs-keyword\">public</span> <span class=\"hljs-keyword\">async</span> Task&lt;SocketResponse&gt; <span class=\"hljs-title\">Authenticate</span>(<span class=\"hljs-params\"><span class=\"hljs-keyword\">string</span> apiKey, <span class=\"hljs-keyword\">string</span> apiKeySecret</span>)</span><br>{<br>    <span class=\"hljs-keyword\">var</span> timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();<br>    <span class=\"hljs-keyword\">var</span> randomContent = <span class=\"hljs-string\">$\"<span class=\"hljs-subst\">{ Guid.NewGuid() }</span>\"</span>;<br>    <span class=\"hljs-keyword\">var</span> content = <span class=\"hljs-keyword\">string</span>.Join(<span class=\"hljs-string\">\"\"</span>, timestamp, randomContent);<br>    <span class=\"hljs-keyword\">var</span> signedContent = CreateSignature(apiKeySecret, content);<br>    <span class=\"hljs-keyword\">var</span> result = <span class=\"hljs-keyword\">await</span> _hubProxy.Invoke&lt;SocketResponse&gt;(<br>        <span class=\"hljs-string\">\"Authenticate\"</span>, <br>        apiKey, <br>        timestamp, <br>        randomContent, <br>        signedContent);<br>    <span class=\"hljs-keyword\">return</span> result;<br>} <br>        <br><span class=\"hljs-function\"><span class=\"hljs-keyword\">public</span> <span class=\"hljs-keyword\">void</span> <span class=\"hljs-title\">SetAuthExpiringHandler</span>(<span class=\"hljs-params\"><span class=\"hljs-keyword\">string</span> apiKey, <span class=\"hljs-keyword\">string</span> apiKeySecret</span>)</span><br>{<br>    _hubProxy.On(<span class=\"hljs-string\">\"authenticationExpiring\"</span>, <span class=\"hljs-keyword\">async</span> () =&gt;<br>    {<br>        <span class=\"hljs-keyword\">await</span> Authenticate(apiKey, apiKeySecret);<br>    });<br>} <br>        <br><span class=\"hljs-function\"><span class=\"hljs-keyword\">private</span> <span class=\"hljs-keyword\">static</span> <span class=\"hljs-keyword\">string</span> <span class=\"hljs-title\">CreateSignature</span>(<span class=\"hljs-params\"><span class=\"hljs-keyword\">string</span> apiSecret, <span class=\"hljs-keyword\">string</span> data</span>)</span><br>{<br>    <span class=\"hljs-keyword\">var</span> hmacSha512 = <span class=\"hljs-keyword\">new</span> HMACSHA512(Encoding.ASCII.GetBytes(apiSecret));<br>    <span class=\"hljs-keyword\">var</span> hash = hmacSha512.ComputeHash(Encoding.ASCII.GetBytes(data));<br>    <span class=\"hljs-keyword\">return</span> BitConverter.ToString(hash).Replace(<span class=\"hljs-string\">\"-\"</span>, <span class=\"hljs-keyword\">string</span>.Empty);<br>}<br></code></pre>"
        },
        "Subscribing": {
            "description": "To subscribe to one or more streams, simply invoke the Subscribe method with an array of streams to which you wish to subscribe. For a list of stream names, refer to the Websocket Streams section. The Subscribe method may be invoked as many times as desired if not all desired streams are known initially.\n\nThe result of invoking the Subscribe method is a list of [SocketResponse](#definition-SocketResponse) objects containing a Boolean value indicating if the subscription was successful and, in the case of failure, an error code.",
            "childOf": "Websocket Overview",
            "example": "``` c#\npublic async Task<List<SocketResponse>> Subscribe(string[] channels)\n{\n    return await _hubProxy.Invoke<List<SocketResponse>>(\"Subscribe\", (object)channels);\n}\n```"
        },
        "Handling Messages": {
            "description": "Once you have subscribed to a stream, you will begin receiving messages as relevant activity occures in the system. The incoming messages must be decoded to do something with them. A basic example of this is shown below. The \"balance\" specified as a parameter is the name of the message to handle. This corresponds to the name of the stream. For a list of possible values and how they map to streams, refer to the Websocket Streams section.\nMessages sent on the v3 socket are gzipped and must be decompressed prior to being used. The DataConverter.Decode method shown in the example is doing this decompression and then parsing the resulting json into an object.\n\n``` c#\n_hubProxy.On(\"balance\", message =>\n{\n    var decoded = DataConverter.Decode<BalanceDelta>(message);\n    // Do stuff with the decoded BalanceDelta object\n});\n```\n\nThe schema for the BalanceDelta type can be found in the documentation for the [Balance stream](#method-Balance). It consists of an accountId field for identifying the account (or subaccount) the message relates to, the sequence number of the message used for synchronization, and the actualy delta which is an updated [Balance object](#definition-Balance). The schema of the object deltas sent by the websock are the same as those retrived from the equivalent REST API. For details about individual streams, refer to the Websocket Streams section of this page.",
            "childOf": "Websocket Overview",
            "example": "<pre><code class=\"hljs language-c#\"><span class=\"hljs-keyword\">public</span> <span class=\"hljs-keyword\">static</span> <span class=\"hljs-keyword\">class</span> <span class=\"hljs-title\">DataConverter</span><br>{<br>    <span class=\"hljs-keyword\">private</span> <span class=\"hljs-keyword\">static</span> JsonSerializerSettings _jsonSerializerSettings = <span class=\"hljs-keyword\">new</span> JsonSerializerSettings<br>    {<br>        ContractResolver = <span class=\"hljs-keyword\">new</span> CamelCasePropertyNamesContractResolver(),<br>        DateFormatHandling = DateFormatHandling.IsoDateFormat,<br>        DateTimeZoneHandling = DateTimeZoneHandling.Utc,<br>        FloatParseHandling = FloatParseHandling.Decimal,<br>        MissingMemberHandling = MissingMemberHandling.Ignore,<br>        NullValueHandling = NullValueHandling.Ignore,<br>        Converters = <span class=\"hljs-keyword\">new</span> List&lt;JsonConverter&gt;<br>        {<br>            <span class=\"hljs-keyword\">new</span> StringEnumConverter(),<br>        }<br>    };<br><br>    <span class=\"hljs-keyword\">public</span> <span class=\"hljs-keyword\">static</span> T Decode&lt;T&gt;(<span class=\"hljs-keyword\">string</span> wireData)<br>    {<br>        <span class=\"hljs-comment\">// Step 1: Base64 decode the wire data into a gzip blob</span><br>        <span class=\"hljs-keyword\">byte</span>[] gzipData = Convert.FromBase64String(wireData);<br><br>        <span class=\"hljs-comment\">// Step 2: Decompress gzip blob into JSON</span><br>        <span class=\"hljs-keyword\">string</span> json = <span class=\"hljs-literal\">null</span>;<br><br>        <span class=\"hljs-keyword\">using</span> (<span class=\"hljs-keyword\">var</span> decompressedStream = <span class=\"hljs-keyword\">new</span> MemoryStream())<br>        <span class=\"hljs-keyword\">using</span> (<span class=\"hljs-keyword\">var</span> compressedStream = <span class=\"hljs-keyword\">new</span> MemoryStream(gzipData))<br>        <span class=\"hljs-keyword\">using</span> (<span class=\"hljs-keyword\">var</span> deflateStream = <span class=\"hljs-keyword\">new</span> DeflateStream(compressedStream, CompressionMode.Decompress))<br>        {<br>            deflateStream.CopyTo(decompressedStream);<br>            decompressedStream.Position = <span class=\"hljs-number\">0</span>;<br>            <span class=\"hljs-keyword\">using</span> (<span class=\"hljs-keyword\">var</span> streamReader = <span class=\"hljs-keyword\">new</span> StreamReader(decompressedStream))<br>            {<br>                json = streamReader.ReadToEnd();<br>            }<br>        }<br><br>        <span class=\"hljs-comment\">// Step 3: Deserialize the JSON string into a strongly-typed object</span><br>        <span class=\"hljs-keyword\">return</span> JsonConvert.DeserializeObject&lt;T&gt;(json, _jsonSerializerSettings);<br>    }<br>}<br></code></pre><br>"
        },
        "Synchronizing": {
            "description": "To ensure you have the most recent data, and have not missed anything, the recommended sequence of steps is to:\n\n1. Subscribe to the relevant socket streams\n2. Begin to queue up messages without processing them\n3. Call the equivalent v3 REST API and record both the results and the value of the returned `Sequence` header. Refer to the descriptions of individual streams to find the corresponding REST API. Note that you must call the REST API with the same parameters as you used to subscribed to the stream to get the right snapshot. For example, orderbook snapshots of different depths will have different sequence numbers.\n4. If the `Sequence` header is less than the sequence number of the first queued socket message received (unlikely), discard the results of step 3 and then repeat step 3 until this check passes.\n5. Discard all socket messages where the sequence number is less than or equal to the `Sequence` header retrieved from the REST call\n6. Apply the remaining socket messages in order on top of the results of the REST call. The objects received in the socket deltas have the same schemas as the objects returned by the REST API. Each socket delta is a snapshot of an object. The identity of the object is defined by a unique key made up of one or more fields in the message (see documentation of individual streams for details). To apply socket deltas to a local cache of data, simply replace the objects in the cache with those coming from the socket where the keys match.\n7. Continue to apply messages as they are received from the socket as long as sequence number on the stream is always increasing by 1 each message (Note: for private streams, the sequence number is scoped to a single account or subaccount).\n8. If a message is received that is not the next in order, return to step 2 in this process\n\nFor applications that depend on keeping the stream of data as reliable as possible, creating multiple socket connections for redundancy is recommended. The sequence numbers published across all of the connections will be consistent with each other and can be used to determine which messages have been received.",
            "childOf": "Websocket Overview"
        },
        "Unsubscribing": {
            "description": "Unsubscribing from streams follows the same pattern as subscribing to streams. Simply invoke the Unsubscribe method on the hub and provide the list of streams you wish to unsubscribe from.",
            "childOf": "Websocket Overview",
            "example": "``` c#\npublic async Task<List<SocketResponse>> Unsubscribe(string[] channels)\n{\n    return await _hubProxy.Invoke<List<SocketResponse>>(\"Unsubscribe\", (object)channels);\n}\n```"
        },
        "Subaccounts": {
            "description": "(NOTE: This functionality is limited to partners and unavailable to general traders.)\n\nSubaccounts provide a way for partners to model their users without needing to create individual user accounts. Each subaccount has its own deposit addresses, balances, desposits and withdrawals, orders, etc. Partners control all actions of their subaccounts via the v3 REST API and may use the v3 websocket to be notified of any updates to their balances, deposits, and orders.\n\nIn order to work with subaccounts, you must be using an API key that has subaccount permissions. Partners who are part of this program can work with their Bittrex representative to get their API key enabled.\n\nTo create a subaccount, POST to the [subaccounts](#operation--subaccounts-post) endpoint. This will create a new subaccount and return its id. Once you have a subaccount id, you can transfer funds between it and your main (master) account using the [transfers](#operation--transfers-post) endpoint. In order to place orders, view history, or take other actions in the context of a subaccount using the REST API, add the `Api-subaccount-ID` header to the request and adjust your [request signature](#topic-Authentication) as needed.\n\nTo be notified of updates to subaccount data, use a websocket connection authenticated with a subaccount enabled API key and subscribe to the subaccount streams for the types of data you care about. A single subscription will receive data from all subaccounts the API key is authorized to manage. Messaages will include an accountId field which can be used to associate them with the correct subaccount. For subaccount streams that include a sequence number for synchronizing with the server, the sequence number is independent for each subaccount."
        }
    };

    // Looks for topics claiming to be children of other topics and then marks them as such on that topic
    Object.keys(topics).forEach(function (key) {
        if (topics[key].childOf) {
            if (topics[topics[key].childOf].children) {
                topics[topics[key].childOf].children.push(key);
            }
            else {
                topics[topics[key].childOf].children = [key];
            }
        }
    });

    return _.assign({}, json, {
        'x-spectacle-topics': topics
    });
}

function getErrorCodeHtml() {
    var codes = {
        "ACCOUNT_DISABLED": "This account is disabled",
        "APIKEY_INVALID": "The Api-Key request header is missing or invalid",
        "CLIENTORDERID_ALREADY_EXISTS": "The value specified for clientOrderId has already been used. The corresponding Bittrex id for the order will be included in the response.",
        "CLIENTWITHDRAWALID_ALREADY_EXISTS": "The value specified for clientWithdrawalId has already been used. The corresponding Bittrex id for the withdrawal will be included in the response.",
        "CRYPTO_ADDRESS_ALREADY_EXISTS": "A deposit address already exists for the currency which the user is attempting to create an address",
        "CURRENCY_DOES_NOT_EXIST": "The currency symbol provided does not correspond to a currency",
        "CURRENCY_OFFLINE": "The currency is offline",
        "DUST_TRADE_DISALLOWED_MIN_VALUE": "The amount of quote currency involved in a transaction would be less than the minimum limit of 10K satoshis",
        "FILL_OR_KILL": "The order was submitted with the fill_or_kill time in force and could not be filled completely so it was cancelled",
        "INSUFFICIENT_AWARDS": "The order was placed with useAwards: true but the user did not have sufficient balance of BTXCRD to cover commission",
        "INSUFFICIENT_FUNDS": "The user is trying to buy or sell more currency than they can afford or currently hold, respectively",
        "INVALID_MARKET_ORDER": "A market order was requested in the order type, but other options selected which conflict with that (e.g. GOOD_TIL_CANCELLED time in force)",
        "INVALID_NEXT_PAGE_TOKEN": "The specified value for nextPageToken doesn't correspond to an item in the list",
        "INVALID_ORDER_TYPE": "The selected order type conflicts with other options specified on the order (e.g. setting a limit price for a market order)",
        "INVALID_PREVIOUS_PAGE_TOKEN": "The specified value for previousPageToken doesn't correspond to an item in the list",
        "INVALID_RESTRICTED_ACCOUNT": "The user is a Bittrex US user attempting an action on a Bittrex Global only currency or market",
        "INVALID_SIGNATURE": "The Api-Signature request header is missing or invalid",
        "MARKET_DOES_NOT_EXIST": "The market symbol provided does not correspond to a market",
        "MARKET_NAME_REVERSED": "Market symbols in v3 are in base-quote order whereas in v1 it was the reverse. This error occures when we think a market symbol was sent to v3 in quote-base order.",
        "MARKET_OFFLINE": "Te market is offline",
        "MAX_ORDERS_ALLOWED": "The user already has the maximum allowed open orders and cannot open another until one is closed",
        "MIN_TRADE_REQUIREMENT_NOT_MET": "The trade was smaller than the min trade size quantity for the market",
        "NOT_ALLOWED": "This account is not allowed to perform this action",
        "ORDER_DOES_NOT_EXIST": "The specified orderId does not correspond to an order, or corresponds to an order that is no longer available in the API such as an order that was cancelled with no fills",
        "ORDER_ERROR_CONTACT_SUPPORT": "Operation could not be completed due to an internal error",
        "ORDER_NOT_OPEN": "Tried to cancel an order that was not open",
        "ORDER_TYPE_INVALID": "The order creation request is malformed in some way",
        "ORDERBOOK_DEPTH": "If allowed to execute, the order would have been executed at least in part at a price in excess of what is allowed by the price slippage limit on the market",
        "POST_ONLY": "The order was submitted as 'post only' but matched with an order already on the book and thus was cancelled",
        "RATE_PRECISION_NOT_ALLOWED": "The limit price specified includes more precision than is allowed on this market",
        "REQUESTID_ALREADY_EXISTS": "The value specified for requestId has already been used. The corresponding Bittrx id for the request will be included in the response.",
        "SELF_TRADE": "The order matched with an order on the book placed by the same user",
        "SOURCE_OF_FUNDS_REQUIRED": "The user has not yet provided the required basic source of funds information. May be resolved by logging into the website and filling out the form when prompted.",
        "SUBACCOUNT_OF_SUBACCOUNT_NOT_ALLOWED": "Attempted to create a subaccout of a subaccount",
        "THROTTLED": "Too many requests have been made",
        "WITHDRAWAL_TOO_SMALL": "The size of the requested withdrawal is not large enough. Withdrawals must be greater than three times the size of the currency's txFee. ",
        "WHITELIST_VIOLATION_WITHDRAWAL_ADDRESS": "Attempting to withdrawal to an address that is either not on the users list of allowed withdrawal address or which is still within the wait period"
    };

    var html = "";
    _.forEach(codes, function (value, key) {
        html += "<tr><td>" + key + "</td><td>" + value + "</td></tr>";
    });

    return html;
}

function websocketApi(json) {
    console.log('Adding websocket api documentation...');

    return _.assign({}, json, {
        "x-btx-methods": {
            "Authenticate": {
                "operationId": "ws-authenticate",
                "summary": "",
                "description": "Authenticates the current connection using an API key. Note that after authenticating, the client must periodically renew its authentication. Refer to the [websocket authentication](#topic-Authenticating) topic for additional information. In the example, the API key used was \"your_api_key_goes_here\" and the secret was \"secret\". The example response shows this request failing because \"your_api_key_goes_here\" is not a valid value for an API key.",
                "deprecated": false,
                "parameters": [
                    {
                        "name": "apiKey",
                        "type": "string",
                        "in": "",
                        "description": "a valid API key for your account",
                        "required": true
                    },
                    {
                        "name": "timestamp",
                        "type": "string",
                        "in": "",
                        "description": "the current UNIX-style time in epoch millisecond format",
                        "required": true
                    },
                    {
                        "name": "randomContent",
                        "type": "string",
                        "in": "",
                        "description": "a random uuid",
                        "required": true
                    },
                    {
                        "name": "signature",
                        "type": "string",
                        "in": "",
                        "description": "randomContent and timestamp signed by the apiKey's secret. Refer to the [websocket authentication](#topic-Authenticating) topic for an example.",
                        "required": true
                    }
                ],
                "responses": {
                    "Response": {
                        "description": "[SocketResponse](#definition-SocketResponse)",
                    }
                },
                "x-btx-request-payload-example": "{\"H\":\"c3\",\"M\":\"Authenticate\",\"A\":[\"your_api_key_goes_here\",1592524115500,\"e758c9d0-7603-4c8d-9ad3-3ce0141c576b\",\"BFBD98224D5720C4F51DC30BF6B5035800A92B3B5E3124D8E2A69F6299A49D3C6AA428947693B470851AB736996A57C6A11FB60517AB24B5E3379C386688C973\"],\"I\":1}",
                "x-btx-response-payload-example": "{\"R\":{\"Success\":false,\"ErrorCode\":\"INVALID_APIKEY\"},\"I\":1}",
            },
            "IsAuthenticated": {
                "operationId": "ws-isauthenticated",
                "summary": "",
                "description": "Determines if the current connection is authenticated. In the example, the client is not currently authenticated.",
                "deprecated": false,
                "responses": {
                    "Response": {
                        "description": "True if the connection is authenticated, false otherwise"
                    }
                },
                "x-btx-request-payload-example": "{\"H\":\"c3\",\"M\":\"IsAuthenticated\",\"A\":[],\"I\":1}",
                "x-btx-response-payload-example": "{\"R\":false,\"I\":1}"
            },
            "Subscribe": {
                "operationId": "ws-subscribe",
                "summary": "",
                "description": "Subscribes to one or more data streams. In the example, the client successfully subscribes from the heartbeat stream and the ticker stream for BTC/USD.",
                "deprecated": false,
                "parameters": [{
                    "name": "channels",
                    "type": "Array<string>",
                    "in": "",
                    "description": "list of streams to subscribe to",
                    "required": true
                }],
                "responses": {
                    "Response": {
                        "description": "Array<[SocketResponse](#definition-SocketResponse)>",
                    }
                },
                "x-btx-request-payload-example": "{\"H\":\"c3\",\"M\":\"Subscribe\",\"A\":[[\"heartbeat\",\"ticker_BTC-USD\"]],\"I\":1}",
                "x-btx-response-payload-example": "{\"R\":[{\"Success\":true,\"ErrorCode\":null},{\"Success\":true,\"ErrorCode\":null}],\"I\":1}"
            },
            "Unsubscribe": {
                "operationId": "ws-unsubscribe",
                "summary": "",
                "description": "Unsubscribes from one or more data streams. In the example, the client successfully unsubscribes from the ticker stream for BTC/USD.",
                "deprecated": false,
                "parameters": [{
                    "name": "channels",
                    "type": "Array<string>",
                    "in": "",
                    "description": "list of streams to unsubscribe from",
                    "required": true
                }],
                "responses": {
                    "Response": {
                        "description": "Array<[SocketResponse](#definition-SocketResponse)>",
                    }
                },
                "x-btx-request-payload-example": "{\"H\":\"c3\",\"M\":\"Unsubscribe\",\"A\":[[\"ticker_BTC-USD\"]],\"I\":1}",
                "x-btx-response-payload-example": "{\"R\":[{\"Success\":true,\"ErrorCode\":null}],\"I\":1}"
            },
        }
    });
}

function websocketStreams(json) {
    console.log('Adding websocket streams documentation...');
    return _.assign({}, json, {
        "x-btx-wsstreams": {
            "Balance": {
                "operationId": "balance",
                "summary": "",
                "description": "Sends a message when the authenticated user’s total or available balance of a currency changes.",
                "deprecated": false,
                "x-btx-wsauthenticated": true,
                "stream-details": {
                    "subscription": "balance",
                    "message-name": "balance",
                    "unique-key": "accountId, currencySymbol",
                    "restApi": "[GET /balances](#operation--balances-get)",
                    "subaccountStream": "subaccounts_balance"
                },
                "message-schema": {
                    "balance": {
                        "description": "balance",
                        "schema": {
                            "type": "BalanceUpdate",
                            "properties": {
                                "accountId": {
                                    "type": "string",
                                    "example": "string (uuid)"
                                },
                                "sequence": {
                                    "type": "int",
                                    "example": "int"
                                },
                                "delta": {
                                    "$ref": "#/definitions/Balance"
                                }
                            }
                        }
                    }
                }
            },
            "Candle": {
                "operationId": "candle",
                "summary": "",
                "description": "Sends a message at the start of each candle (based on the subscribed interval) and when trades have occurred on the market. Note that this means on an active market you will receive many updates over the course of each candle interval as trades occur. You will always recieve an update at the start of each interval. If no trades occurred yet, this update will be a 0-volume placeholder that carries forward the Close of the previous interval as the current interval's OHLC values.",
                "stream-details": {
                    "subscription": "candle_{marketSymbol}_{candleInterval}",
                    "message-name": "candle",
                    "unique-key": "marketSymbol, interval, startsAt",
                    "restApi": "[GET /markets/{marketSymbol}/candles /{candleInterval}/recent](#operation--markets--marketSymbol--candles--candleInterval--recent-get)"
                },
                "deprecated": false,
                "parameters": [{
                        "name": "marketSymbol",
                        "in": "",
                        "description": "symbol of market to retrieve candles for",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "candleInterval",
                        "in": "",
                        "description": "desired time interval between candles",
                        "required": true,
                        "enum": ["MINUTE_1", "MINUTE_5", "HOUR_1", "DAY_1"],
                        "type": "string"
                    }
                ],
                "message-schema": {
                    "candle": {
                        "description": "candle",
                        "schema": {
                            "type": "CandleUpdate",
                            "properties": {
                                "sequence": {
                                    "type": "int",
                                    "example": "int"
                                },
                                "marketSymbol": {
                                    "type": "string",
                                    "example": "string"
                                },
                                "interval": {
                                    "type": "string",
                                    "example": "string"
                                },
                                "delta": {
                                    "$ref": "#/definitions/Candle"
                                }
                            }
                        }
                    }
                }
            },
            "Conditional Order": {
                "operationId": "conditionalOrder",
                "summary": "",
                "description": "Sends a message when one of your conditional orders is created, modified, or triggered",
                "stream-details": {
                    "subscription": "conditional_order",
                    "message-name": "conditionalOrder",
                    "unique-key": "id",
                    "restApi": "[GET /conditional-orders/open](#operation--conditional-orders-open-get)",
                    "subaccountStream": "subaccounts_conditional_order"
                },
                "deprecated": false,
                "parameters": [],
                "message-schema": {
                    "conditionalOrder": {
                        "description": "conditionalOrder",
                        "schema": {
                            "type": "ConditionalOrderUpdate",
                            "properties": {
                                "accountId": {
                                    "type": "string",
                                    "example": "string (uuid)"
                                },
                                "sequence": {
                                    "type": "int",
                                    "example": "int"
                                },
                                "delta": {
                                    "$ref": "#/definitions/ConditionalOrder"
                                }
                            }
                        }
                    }
                }
            },
            "Deposit": {
                "operationId": "deposit",
                "summary": "",
                "description": "Sends a message when a new deposit is detected or its status changes.",
                "deprecated": false,
                "x-btx-wsauthenticated": true,
                "stream-details": {
                    "subscription": "deposit",
                    "message-name": "deposit",
                    "unique-key": "id",
                    "restApi": "[GET /deposits/open](#operation--deposits-open-get)",
                    "subaccountStream": "subaccounts_deposit"
                },
                "message-schema": {
                    "deposit": {
                        "description": "deposit",
                        "schema": {
                            "type": "DepositUpdate",
                            "properties": {
                                "accountId": {
                                    "type": "string",
                                    "example": "string (uuid)"
                                },
                                "sequence": {
                                    "type": "int",
                                    "example": "int"
                                },
                                "delta": {
                                    "$ref": "#/definitions/Deposit"
                                }
                            }
                        }
                    }
                }
            },
            "Execution": {
                "operationId": "execution",
                "summary": "",
                "description": "Sends a message when one of the user's orders is completely or partially filled by a trade",
                "stream-details": {
                    "subscription": "execution",
                    "message-name": "execution",
                    "unique-key": "id",
                    "restApi": "[GET /executions/last-id](#operation--executions-last-id-get)",
                    "subaccountStream": "subaccounts_execution",
                    "notes": "The [GET /executions/last-id](#operation--executions-last-id-get) request returns the current sequence number and the id of the most recent execution. If that id is not in your local cache, then use [GET /executions](#operation--executions-get) to fill in any executions that you missed. Executions are immutable so any information received about a given execution from REST or the socket will be its final state."
                },
                "deprecated": false,
                "message-schema": {
                    "execution": {
                        "description": "execution",
                        "schema": {
                            "type": "ExecutionUpdate",
                            "properties": {
                                "accountId": {
                                    "type": "string",
                                    "example": "string (uuid)"
                                },
                                "sequence": {
                                    "type": "int",
                                    "example": "int"
                                },
                                "deltas": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/Execution"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "Heartbeat": {
                "operationId": "heartbeat",
                "summary": "",
                "description": "Sends an empty message on an interval (currently 5 seconds). If you stop getting a heartbeat that means your connection is dead. If you are still getting a heartbeat but are not getting updates on active markets then that means your connection is alive but something else is wrong.",
                "deprecated": false,
                "stream-details": {
                    "subscription": "heartbeat",
                    "message-name": "heartbeat",
                    "unique-key": "n/a",
                    "restApi": "n/a"
                },
                "message-schema": {
                    "heartbeat": {
                        "description": "heartbeat",
                        "schema": {
                            "type": "Heartbeat messages contain no payload"
                        }
                    }
                }
            },
            "Market Summaries": {
                "operationId": "marketSummaries",
                "summary": "",
                "description": "Provides regular updates of the current market summary data for all markets. Market summary data is different from candles in that it is a rolling 24-hour number as opposed to data for a fixed interval like candles.",
                "deprecated": false,
                "stream-details": {
                    "subscription": "market_summaries",
                    "message-name": "marketSummaries",
                    "unique-key": "symbol",
                    "restApi": "[GET /markets/summaries](#operation--markets-summaries-get)"
                },
                "message-schema": {
                    "marketsummaries": {
                        "description": "marketsummaries",
                        "schema": {
                            "type": "MarketSummaryUpdate",
                            "properties": {
                                "sequence": {
                                    "type": "int",
                                    "example": "int"
                                },
                                "deltas": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/MarketSummary"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "Market Summary": {
                "operationId": "marketSummary",
                "summary": "",
                "description": "Provides regular updates of the current market summary data for a given market. Market summary data is different from candles in that it is a rolling 24-hour number as opposed to data for a fixed interval like candles.",
                "deprecated": false,
                "stream-details": {
                    "subscription": "market_summary_{marketSymbol}",
                    "message-name": "marketSummary",
                    "unique-key": "symbol",
                    "restApi": "[GET /markets/{marketSymbol}/summary](#operation--markets--marketSymbol--summary-get)",
                    "notes": "This stream does not include a sequence number because each message received is a full snapshot of the current state."
                },
                "parameters": [{
                    "name": "marketSymbol",
                    "in": "",
                    "description": "symbol of market to retrieve the summary for",
                    "required": true,
                    "type": "string"
                }],
                "message-schema": {
                    "marketsummary": {
                        "description": "marketsummary",
                        "schema": {
                            "$ref": "#/definitions/MarketSummary"
                        }
                    }
                }
            },
            "Order": {
                "operationId": "order",
                "summary": "",
                "description": "Sends messages when there are changes to the user’s open orders.",
                "deprecated": false,
                "x-btx-wsauthenticated": true,
                "stream-details": {
                    "subscription": "order",
                    "message-name": "order",
                    "unique-key": "id",
                    "restApi": "[GET /orders/open](#operation--orders-open-get)",
                    "subaccountStream": "subaccounts_order"
                },
                "message-schema": {
                    "order": {
                        "description": "order",
                        "schema": {
                            "type": "OrderUpdate",
                            "properties": {
                                "accountId": {
                                    "type": "string",
                                    "example": "string (uuid)"
                                },
                                "sequence": {
                                    "type": "int",
                                    "example": "int"
                                },
                                "delta": {
                                    "$ref": "#/definitions/Order"
                                }
                            }
                        }
                    }
                }
            },
            "Orderbook": {
                "operationId": "orderbook",
                "summary": "",
                "description": "Sends a message when there are changes to the order book within the subscribed depth.",
                "stream-details": {
                    "subscription": "orderbook_{marketSymbol}_{depth}",
                    "message-name": "orderBook",
                    "unique-key": "marketSymbol, depth, \"bid\" | \"ask\", rate",
                    "restApi": "[GET /markets/{marketSymbol}/orderbook?depth={depth}](#operation--markets--marketSymbol--orderbook-get)",
                    "notes": "An update with quantity 0 means that there is no longer any liquidity available at that rate or that this rate is no longer within the subscribed depth. For example, if subscribed to a depth of 25, if an order is placed at a new rate somewhere in the middle of the top 25, the entry that was formerly the 25th, and is now 26th, will get an update with quantity 0.\n\nFor this reason, depth is included as part of the key defined above. The first 25 levels of the depth 25 and depth 500 orderbooks will be identical, but updates for level 26 of the depth 25 order book (always 0) must be kept separate from updates for the depth 500 orderbook if you are subscribed to both.\n\n__Note:__ You must get the orderbook snapshot from the same depth as you are subscribed to on the websocket. Sequence numbers are not the same for different depths."
                },
                "deprecated": false,
                "tags": [],
                "parameters": [{
                        "name": "marketSymbol",
                        "in": "",
                        "description": "symbol of market to monitor order book for",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "depth",
                        "in": "",
                        "description": "depth of order book to monitor",
                        "required": true,
                        "enum": ["1", "25", "500"],
                        "type": "string"
                    }
                ],
                "message-schema": {
                    "orderbook": {
                        "description": "orderbook",
                        "schema": {
                            "type": "OrderBookUpdate",
                            "properties": {
                                "marketSymbol": {
                                    "type": "string",
                                    "example": "string"
                                },
                                "depth": {
                                    "type": "int",
                                    "example": "int"
                                },
                                "sequence": {
                                    "type": "int",
                                    "example": "int"
                                },
                                "bidDeltas": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/OrderBookEntry"
                                    }
                                },
                                "askDeltas": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/OrderBookEntry"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "Tickers": {
                "operationId": "tickers",
                "summary": "",
                "description": "Sends a message with the best bid price, best ask price, and last trade price for all markets as there are changes to the order book or trades.",
                "stream-details": {
                    "subscription": "tickers",
                    "message-name": "tickers",
                    "unique-key": "symbol",
                    "restApi": "[GET /markets/tickers](#operation--markets-tickers-get)"
                },
                "deprecated": false,
                "tags": [],
                "parameters": [],
                "message-schema": {
                    "tickers": {
                        "description": "tickers",
                        "schema": {
                            "type": "TickerUpdate",
                            "properties": {
                                "sequence": {
                                    "type": "int",
                                    "example": "int"
                                },
                                "deltas": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/Ticker"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "Ticker": {
                "operationId": "ticker",
                "summary": "",
                "description": "Sends a message with the best bid and ask price for the given market as well as the last trade price whenever there is a relevant change to the order book or a trade.",
                "stream-details": {
                    "subscription": "ticker_{marketSymbol}",
                    "message-name": "ticker",
                    "unique-key": "symbol",
                    "restApi": "[GET /markets/{marketSymbol}/ticker](#operation--markets--marketSymbol--ticker-get)",
                    "notes": "This stream does not include a sequence number because each message received is a full snapshot of the current state."
                },
                "deprecated": false,
                "tags": [],
                "parameters": [{
                    "name": "marketSymbol",
                    "in": "",
                    "description": "symbol of market to monitor for ticker updates",
                    "required": true,
                    "type": "string"
                }],
                "message-schema": {
                    "ticker": {
                        "description": "ticker",
                        "schema": {
                            "$ref": "#/definitions/Ticker"
                        }
                    }
                }
            },
            "Trade": {
                "operationId": "trade",
                "summary": "",
                "description": "Sends a message with the quantity and rate of trades on a market as they occur.",
                "stream-details": {
                    "subscription": "trade_{marketSymbol}",
                    "message-name": "trade",
                    "unique-key": "id",
                    "restApi": "[GET /markets/{marketSymbol}/trades](#operation--markets--marketSymbol--trades-get)"
                },
                "deprecated": false,
                "tags": [],
                "parameters": [{
                    "name": "marketSymbol",
                    "in": "",
                    "description": "symbol of market to monitor for trades",
                    "required": true,
                    "type": "string"
                }],
                "message-schema": {
                    "trades": {
                        "description": "trades",
                        "schema": {
                            "type": "TradeUpdate",
                            "properties": {
                                "sequence": {
                                    "type": "int",
                                    "example": "int"
                                },
                                "marketSymbol": {
                                    "type": "string",
                                    "example": "string"
                                },
                                "deltas": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/Trade"
                                    }
                                }
                            }
                        }
                    }
                }
            },
        }
    });
}

function customSchemaDefinitions(json) {
    console.log('Adding custom schema definitions...');
    return _.set(json, 'definitions.SocketResponse', {
        "required": ["Success"],
        "type": "object",
        "properties": {
            "Success": {
                "description": "true if the operation was successful, false otherwise",
                "type": "boolean"
            },
            "ErrorCode": {
                "description": "failure reason",
                "type": "string"
            }
        }
    });
}

function siteDescription(json) {
    console.log('Adding site description...');
    return _.assign({}, json, {
        "info": {
            "version": "v3",
            "title": "Bittrex API",
            "description": "Bittrex provides a simple and powerful API consisting of REST endpoints for transactional operations and a complementary Websocket service providing streaming market and user data updates.\n\n Access to and use of the API is governed by our Terms of Service.\n If you are a user of Bittrex.com, the applicable Terms of Service are available [here](https://bittrex.com/home/terms).\n If you are a user of Bittrex Global, the applicable Terms of Service are available [here](https://global.bittrex.com/home/terms).\n\n If you have any API questions, feedback, or recommendations please post a question via our [Github page](https://github.com/Bittrex/bittrex.github.io/issues)."
        }
    });
}

function requestExamples(json) {
    console.log('Adding request URL examples...');
    return _.merge({}, json, {
        "paths": {
            "/account": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/account"
                }
            },
            "/addresses": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/addresses"
                },
                "post": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/addresses"
                }
            },
            "/addresses/{currencySymbol}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/addresses/{currencySymbol}"
                }
            },
            "/balances": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/balances"
                }
            },
            "/balances/{currencySymbol}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/balances/{currencySymbol}"
                }
            },
            "/batch": {
                "post": {
                    "x-btx-request-body-example": '\n[\n  {\n    "resource": "order",\n    "operation": "post",\n    "payload": { \n      "marketSymbol": "BTC-USD", \n      "direction": "BUY", \n      "type": "LIMIT", \n      "quantity": 1, \n      "limit": 20000, \n      "timeInForce": "GOOD_TIL_CANCELLED" \n    }\n  },\n  {\n    "resource": "order",\n    "operation": "post",\n    "payload": {\n      "marketSymbol": "BTC-USD",\n      "direction": "BUY",\n      "type": "LIMIT",\n      "quantity": 1,\n      "limit": 20050,\n      "timeInForce": "GOOD_TIL_CANCELLED"\n    }\n  },\n  {\n    "resource": "order",\n    "operation": "delete",\n    "payload": {\n      "id": "83d4dd58-cba5-4fb4-881c-f77fc43009d9"\n    }\n  }\n]',
                    "responses": {
                        "200": {
                            "x-btx-response-body-example": '[\n  {\n    "status": 200,\n    "payload": {\n      "id": "21b580eb-8d5d-4855-aa11-2013e3884dce",\n      "marketSymbol": "BTC-USD",\n      "direction": "BUY",\n      "type": "LIMIT",\n      "quantity": "1",\n      "limit": "20000",\n      "timeInForce": "GOOD_TIL_CANCELLED",\n      "fillQuantity": "0.00000000",\n      "commission": "0.00000000",\n      "proceeds": "0.00000000",\n      "status": "OPEN",\n      "createdAt": "2020-12-02T07:19:48.75Z",\n      "updatedAt": "2020-12-02T07:19:48.75Z"\n    }\n  },\n  {\n    "status": 409,\n    "payload": {\n      "code": "INSUFFICIENT_FUNDS"\n    }\n  },\n  {\n    "status": 200,\n    "payload": {\n      "id": "83d4dd58-cba5-4fb4-881c-f77fc43009d9",\n      "marketSymbol": "BTC-USD",\n      "direction": "BUY",\n      "type": "LIMIT",\n      "quantity": "1.00000000",\n      "limit": "19950.00000000",\n      "timeInForce": "GOOD_TIL_CANCELLED",\n      "fillQuantity": "0.00000000",\n      "commission": "0.00000000",\n      "proceeds": "0.00000000",\n      "status": "CLOSED",\n      "createdAt": "2020-12-02T07:19:34.27Z",\n      "updatedAt": "2020-12-02T07:19:48.85Z",\n      "closedAt": "2020-12-02T07:19:48.85Z"\n    }\n  }\n]\n'
                        }
                    }
                }
            },
            "/currencies": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/currencies"
                }
            },
            "/currencies/{symbol}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/currencies/{symbol}"
                }
            },
            "/deposits/closed": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/deposits/closed"
                }
            },
            "/deposits/open": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/deposits/open"
                }
            },
            "/deposits/ByTxId/{txId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/deposits/ByTxId/{txId}"
                }
            },
            "/deposits/{depositId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/deposits/{depositId}"
                }
            },
            "/markets": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets"
                }
            },
            "/markets/summaries": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/summaries"
                }
            },
            "/markets/{marketSymbol}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketSymbol}"
                }
            },
            "/markets/{marketSymbol}/summary": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketSymbol}/summary"
                }
            },
            "/markets/{marketSymbol}/orderbook": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketSymbol}/orderbook"
                }
            },
            "/markets/{marketSymbol}/trades": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketSymbol}/trades"
                }
            },
            "/markets/tickers": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/tickers"
                }
            },
            "/markets/{marketSymbol}/ticker": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketSymbol}/ticker"
                }
            },
            "/orders/closed": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/orders/closed"
                }
            },
            "/orders": {
                "post": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/orders"
                }
            },
            "/orders/open": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/orders/open"
                }
            },
            "/orders/{orderId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/orders/{orderId}"
                },
                "delete": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/orders/{orderId}"
                }
            },
            "/subaccounts": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/subaccounts"
                },
                "post": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/subaccounts"
                }
            },
            "/subaccounts/{subaccountId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/subaccounts/{subaccountId}"
                }
            },
            "/transfers/sent": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/transfers/sent"
                }
            },
            "/transfers/received": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/transfers/received"
                }
            },
            "/transfers/{transferId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/transfers/{transferId}"
                }
            },
            "/transfers": {
                "post": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/transfers"
                }
            },
            "/ping": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/ping"
                }
            },
            "/withdrawals": {
                "post": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals"
                }
            },
            "/withdrawals/open": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals/open"
                }
            },
            "/withdrawals/closed": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals/closed"
                }
            },
            "/withdrawals/ByTxId/{txId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals/ByTxId/{txId}"
                }
            },
            "/withdrawals/{withdrawalId}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals/{withdrawalId}"
                },
                "delete": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals/{withdrawalId}"
                }
            }
        }
    });
}

// removes the Uuid examples from specified definitions
function removeUuidExamples(json) {
    console.log('Removing examples from uuid-formatted properties in "definitions"...');
    var definitions = json['definitions'];
    return _.assign({}, json, {
        definitions: _.mapValues(definitions, function (definition, defKey) {
            var properties = definition['properties'];
            return _.assign(definition, {
                properties: _.mapValues(properties, function (property, propKey) {
                    var format = property['format'],
                        example = property['example'];
                    if (format && format === 'uuid' && example) {
                        console.log('Removing example', example, 'from', defKey + '.' + propKey);
                        return _.omit(property, 'example');
                    } else {
                        return property;
                    }
                })
            });
        })
    });
}


function transformPathParameters(json) {
    console.log('Transforming Path Parameters');
    var paths = json['paths'];

    var transformUuidParameter = function (param) {
        return _.assign({}, param, {
            description: '_(uuid-formatted string)_ - ' + param.description
        });
    }

    var transformParameters = function (parameters) {
        if (!parameters) return;
        return _.map(parameters, function(parameter, index, arr) {
            if (parameter['format'] === 'uuid') {
                return transformUuidParameter(parameter);
            } else {
                return parameter;
            }
        });
    };

    var transformOperation = function (operation, opKey) {
        return _.assign({}, operation, {
            parameters: transformParameters(operation['parameters'])
        });
    };

    var transformPaths = function (path, pathKey) {
        var transformed = _.mapValues(path, transformOperation);
        return _.assign({}, path, transformed);
    };

    return _.assign({}, json, {
        paths: _.mapValues(paths, transformPaths)
    });
}


module.exports = R.pipe(
    spectacleTopics,
    siteDescription,
    requestExamples,
    removeUuidExamples,
    transformPathParameters,
    websocketApi,
    websocketStreams,
    customSchemaDefinitions,
);