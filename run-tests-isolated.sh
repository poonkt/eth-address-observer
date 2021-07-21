#!/bin/bash

jest --ci --runInBand --verbose --forceExit  ./src/lib/__test__/erc20.test.ts &&
jest --ci --runInBand --verbose --forceExit  ./src/lib/__test__/transactions.test.ts &&
jest --ci --runInBand --verbose --forceExit  ./src/lib/__test__/watch-list.test.ts