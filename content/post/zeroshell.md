---
title: "Zeroshell authentication"
date: 2015-06-13T23:42:00+02:00
draft: false
---

For my studies, I’m living in a student residence in Paris. The residence provides a free internet connection for each resident. However, in order to gain access to it, you must login each time you want to access Internet.

<!--more-->

# The context

This system is powered by Zeroshell, a Linux distribution for servers which aims to provide network services. Besides the fact that it keeps logs of all your activities, it also requires keeping a popup opened to maintain the access.

Nevertheless, keeping this popup opened is quite annoying and on top of that, even if this popup is still there, the network disconnect automatically after a few hours.

In order to fix that, I decided to create a script which will automatically renew the connection every minute. So I began to study the authentication process of Zeroshell.

## Authentication

Zeroshell use the following POST request for authentication.

`http://192.168.0.1/U=username&P=password&Realm=realm&Action=Authenticate&Section=CPAuth&ZSCPRedirect=_:::_`

There is three parameters: username, password and realm. Sadly, passwords and usernames are sent in clear in a simple http request... Once authenticated, a unique token is provided which will be used for the next two steps.

## Connection

Once you’ve extracted the authentication key in the last step, you can login to your account throught another POST request.

`http://192.168.0.1/U=username&Section=CPGW&Realm=realm&Action=Connect&ZSCPRedirect=_:::_&Authenticator=encodedAuthKey`

Use this new token with `Authenticator`. However, the token must be encoded under a special way. You must separate every 64 bytes by a `\r\n` carriage return, `%0A%0D` url-encoded.

## Renewal

Every minute you need to renew the connection to the server by using the same token.

`http://192.168.0.1/U=username&Section=CPGW&Realm=realm&Action=Renew&Authenticator=encodedAuthKey`

# Conclusion

So my script authenticate and connect to the Zeroshell by sending POST requests in background. If the renew attempt fails, the program reconnects to the network by itself to get a new token. It avoids keeping the popup and renews the connection automatically. Take a look at the PoC [right here](https://github.com/obynio/az0t).