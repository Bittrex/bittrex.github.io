var R = require('ramda'),
    _ = require('lodash');

function spectacleTopics(json) {
    console.log('Adding Spectacle topics...');
    return _.assign({}, json, {
        'x-spectacle-topics': {
            "Availability": {
                "description": "The V3-Alpha API is available on an invite-only basis at this time. Later releases will be made publicly available to the community."
            },
            "Pre-Release Warning": {
                "description": "> **Warning**: The V3-Alpha or other pre-release API versions are not for production use.\n\n The V3-Alpha release will be subject to breaking changes, potentially without notice, until the final API is released. Pre-release APIs should only be used for testing and review.\n\nThe V3-Alpha API will operate against production (live-site) data and accounts and we recommend using test accounts and small-value transactions to validate your implementation.\n\nBy using the V3-Alpha API you understand and agree that issues may be encountered without warning, affecting your use of the website and API. Bittrex provides no warranties, either express or implied, as to the suitability or usability of pre-release APIs. Bittrex will not be liable for any loss, whether such loss is direct, indirect, special or consequential, suffered by any party as a result of their use of the V3-Alpha API or other pre-release APIs. "
            },
            "Getting Started": {
                "description": "Keep the following in mind when developing against the Bittrex API: \n - Enable 2FA on your account. API Keys cannot be generated unless 2FA is enabled.\n - All REST requests must be sent to `https://api.bittrex.com/v3` using the `application/json` content type. Non-HTTPS requests will be redirected to HTTPS, possibly causing functional or performance issues with your application."
            },
            "Best Practices": {
                "description": "### Call Limits\n The Bittrex API employs call limits on all endpoints to ensure the efficiency and availability of the platform for all customers. In general, API users are permitted to make a maximum of 60 API calls per minute. Calls after the limit will fail, with the limit resetting at the start of the next minute.\n\n __Note: Corporate and high-volume accounts may contact customer support for additional information to ensure that they may continue operating at an optimal level.__"
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
            "description": "Bittrex provides a simple and powerful API consisting of REST endpoints for transactional operations and a complementary Websocket service providing streaming market, order, and balance updates.\n\n Access to and use of the API is governed by our Terms of Service.\n If you are a user of Bittrex.com, the applicable Terms of Service are available [here](https://support.bittrex.com/hc/en-us/articles/360000560871).\n If you are a user of Bittrex International, the applicable Terms of Service are available [here](https://support.bittrex.com/hc/en-us/articles/360001411486).\n\n If you have any API questions, feedback, or recommendations please post a question via our [support center](https://support.bittrex.com)."
        }
    });
}

function securityDefinitions(json) {
    console.log('Adding security definition section...');
    return _.assign({}, json, {
        "securityDefinitions": {
            "api_key": {
                "description": "### Overview\n In order to properly sign an authenticated request for the Bittrex v3 API, the following headers must be included:\n\n- `Api-Key`\n\n- `Api-Timestamp`\n\n- `Api-Content-Hash`\n\n- `Api-Signature`\n\n\nThe following sections are instructions for properly populating these headers.\n\n---\n #### Api-Key\nPopulate this header with your API key.\n\nExample Value:\n\n`4894xxxxxxxx407e827d05xxxxxxxxxx`\n\n---\n #### Api-Timestamp\nPopulate this header with the current time as a UNIX timestamp, in epoch-millisecond format.\n\nSample JS Code Snippet:\n\n``` javascript\nvar timestamp = new Date().getTime();\n```\n\nExample Value:\n\n`1542323450016`\n\n---\n #### Api-Content-Hash\nPopulate this header with a SHA512 hash of the request contents, ASCII-encoded. If there are no request contents, populate this header with a SHA512 hash of an empty string.\n\nSample JS Code Snippet:\n\n``` javascript\nvar contentHash = CryptoJS.SHA512(content).toString(CryptoJS.enc.ASCII);\n```\n\nExample Value:\n\n``` markdown\ncf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e\n```\n\n---\n#### Api-Signature\nCreate a pre-sign string formed from the following items and concatenating them together:\n1. contents of your `Api-Timestamp` header\n2. the full URI you are using to make the request (including query string)\n3. contents of your `Api-Content-Hash` header\n\n\nOnce you have created this pre-sign string, sign it via HMACSHA512, using your API secret as the signing secret. ASCII-encode the result of this operation and populate the `Api-Signature` header with it.\n\n\nSample JS Code Snippet:\n\n``` javascript\nvar uri = 'https://api.bittrex.com/v3/balances';\nvar preSign = [timestamp, uri, contentHash].join('');\nvar signature = CryptoJS.HmacSHA512(preSign, apiSecret).toString(CryptoJS.enc.ASCII);\n```\n\nExample Pre-Signed Value:\n\n``` markdown\n1542323450016https://api.bittrex.com/v3/balancescf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e\n```\n\nExample Post-Signed Value:\n\n``` markdown\n939047623f0efbe10bfbb32f18e5d8885b2a91be3c3cea82adf0dd2d20892b20bcb6a10a91fec3afcedcc009f2b2a86c5366974cfadcf671fe0490582568f51f\n```\n\n---\n #### Api-Subaccount-Id\n_(NOTE: This functionality is limited to partners and unavailable to general traders.)_\n\nIf you wish to make a request on behalf of a subaccount, you will need to:\n\n1. Authenticate using all 4 of the headers above referring to your master account.\n1. Populate the `Api-Subaccount-Id` header with the Guid of the subaccount you wish to impersonate for this request. The specified subaccount *must* be a subaccount of the master account used to authenticate the request.\n\nExample Value:\n\n``` markdown\n x111x11x-8968-48ac-b956-x1x11x111111\n```\n\n---\n"
            }
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
            "/deposits": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/deposits?status=COMPLETED"
                }
            },
            "/deposits/pending": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/deposits/pending"
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
            "/markets/{marketName}": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketName}"
                }
            },
            "/markets/{marketName}/orderbook": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketName}/orderbook"
                }
            },
            "/markets/{marketName}/history": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketName}/history"
                }
            },
            "/markets/{marketName}/ticks": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/markets/{marketName}/ticks"
                }
            },
            "/orders": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/orders"
                },
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
            "/status": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/status"
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
            "/withdrawals": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals"
                },
                "post": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals"
                }
            },
            "/withdrawals/pending": {
                "get": {
                    "x-btx-request-example": "https://api.bittrex.com/v3/withdrawals/pending"

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
                        // console.log('Removing example from', defKey + '.' + propKey);
                        return _.omit(property, 'example');
                    } else {
                        return property;
                    }
                })
            });
        })
    });
}


module.exports = R.pipe(
    spectacleTopics,
    siteDescription,
    securityDefinitions,
    requestExamples,
    removeUuidExamples
);