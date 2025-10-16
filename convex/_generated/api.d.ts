/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as checkout from "../checkout.js";
import type * as orders from "../orders.js";
import type * as orders_node_actions from "../orders_node_actions.js";
import type * as utils_generateAccessToken from "../utils/generateAccessToken.js";
import type * as utils_signing from "../utils/signing.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  checkout: typeof checkout;
  orders: typeof orders;
  orders_node_actions: typeof orders_node_actions;
  "utils/generateAccessToken": typeof utils_generateAccessToken;
  "utils/signing": typeof utils_signing;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
