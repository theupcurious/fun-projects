import { lookup } from "dns/promises";

// SSRF protection: block private/reserved IP ranges
const PRIVATE_IPV4_RANGES = [
  /^127\./,                          // loopback
  /^10\./,                           // class A private
  /^192\.168\./,                     // class C private
  /^172\.(1[6-9]|2\d|3[01])\./,    // class B private
  /^169\.254\./,                     // link-local
  /^0\./,                            // this network
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // shared address
  /^198\.(1[89])\./,                 // IETF protocol
  /^198\.51\.100\./,                 // documentation
  /^203\.0\.113\./,                  // documentation
  /^192\.0\.2\./,                    // documentation
  /^192\.0\.0\./,                    // IANA special
  /^240\./,                          // reserved
  /^255\.255\.255\.255$/,            // broadcast
];

const PRIVATE_IPV6_RANGES = [
  /^::1$/,                           // loopback
  /^::/,                             // unspecified
  /^fc[0-9a-f]{2}:/i,               // unique local
  /^fd[0-9a-f]{2}:/i,               // unique local
  /^fe[89ab][0-9a-f]:/i,            // link-local
  /^2001:db8:/i,                     // documentation
  /^64:ff9b:/i,                      // NAT64
  /^::ffff:/i,                       // IPv4-mapped
];

function isPrivateIpv4(ip: string): boolean {
  return PRIVATE_IPV4_RANGES.some((r) => r.test(ip));
}

function isPrivateIpv6(ip: string): boolean {
  return PRIVATE_IPV6_RANGES.some((r) => r.test(ip));
}

export async function validateUrl(rawUrl: string): Promise<{ url: URL; error?: never } | { url?: never; error: string }> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { error: "Invalid URL format." };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { error: "Only http and https URLs are allowed." };
  }

  const hostname = parsed.hostname;

  // Reject raw IP addresses directly
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^\[?[0-9a-f:]+\]?$/i;

  if (ipv4Regex.test(hostname)) {
    if (isPrivateIpv4(hostname)) {
      return { error: "Requests to private or reserved IP addresses are not allowed." };
    }
  } else if (ipv6Regex.test(hostname.replace(/^\[|\]$/g, ""))) {
    const bare = hostname.replace(/^\[|\]$/g, "");
    if (isPrivateIpv6(bare)) {
      return { error: "Requests to private or reserved IPv6 addresses are not allowed." };
    }
  }

  // DNS resolution check
  try {
    const addresses = await lookup(hostname, { all: true });
    for (const addr of addresses) {
      if (addr.family === 4 && isPrivateIpv4(addr.address)) {
        return { error: "Requests to private or reserved IP addresses are not allowed." };
      }
      if (addr.family === 6 && isPrivateIpv6(addr.address)) {
        return { error: "Requests to private or reserved IPv6 addresses are not allowed." };
      }
    }
  } catch {
    return { error: "Unable to resolve hostname." };
  }

  return { url: parsed };
}

/**
 * Validate a redirect URL mid-hop. Same rules, but synchronous IP check only
 * (DNS was already resolved for the original request; redirect targets are validated
 * structurally to prevent open-redirect SSRF).
 */
export function validateRedirectUrl(redirectUrl: string, originalHostname: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(redirectUrl);
  } catch {
    return "Invalid redirect URL.";
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return "Redirect to non-http(s) scheme blocked.";
  }

  const hostname = parsed.hostname;
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(hostname) && isPrivateIpv4(hostname)) {
    return "Redirect to private IP blocked.";
  }

  const bareIpv6 = hostname.replace(/^\[|\]$/g, "");
  if (/^[0-9a-f:]+$/i.test(bareIpv6) && isPrivateIpv6(bareIpv6)) {
    return "Redirect to private IPv6 blocked.";
  }

  void originalHostname; // future: optionally reject cross-host redirects
  return null;
}
