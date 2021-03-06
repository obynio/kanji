---
title: "Let's Encrypt wildcard certificate on Gandi"
date: 2018-06-06T23:42:00+02:00
draft: false
---

Recently, Let's Encrypt began issuing wildcard certificates using ACME v2. Wildcard certificates allow users to use the same SSL certificate for all the subdomains of a domain. That's much more convenient that generating a separate certificate for each subdomain.

However certbot wildcard certificate must be validated using a DNS-01 challenge in order to prove that you are the right domain owner. There are two ways to validate this challenge:

* Either you include a `TXT` with a given validation string in your DNS fields, wait a few hours for DNS propagation and validate the challenge.
* Or you save your time and use your DNS provider API to validate the challenge.


# LiveDNS

The second solution seems much more convenient. My DNS provider, Gandi, is providing the [LiveDNS v5 API](https://doc.livedns.gandi.net/). However, the [old plugin](https://github.com/Gandi/letsencrypt-gandi) provided by Gandi was still using the v4 API.

Thus I adapted an existing certbot plugin to use the v5 LiveDNS API. Just install the plugin using `pip`, put your Gandi API key in the config and you're good to go.

{{< terminal >}}
$ certbot certonly -a certbot-plugin-gandi:dns --certbot-plugin-gandi:dns-credentials gandi.ini -d domain.com -d \*.domain.com

IMPORTANT NOTES:
Congratulations! Your certificate and chain have been saved at /etc/letsencrypt/live/domain.com{{< /terminal >}}

Feel free to take a look a [my work](https://github.com/obynio/certbot-plugin-gandi).
