---
title: "Reverse on zeroshell authentication"
date: 2015-06-13T23:42:00+02:00
draft: false
---

For my studies, I’m living in a student residence in Paris. The residence provides a free ethernet connection for each student. However, in order to gain access to it, you must fill some credentials into a login screen each time you want to access the Internet.

<!--more-->

# The context

This dumb system is powered by Zeroshell, a Linux distribution for servers which aims to provide network services. Besides the fact that it keeps logs of all your activities, it also requires keeping a browser window opened to maintain the access: a captive portal.

Nevertheless, keeping this captive portal opened is quite annoying and on top of that, even if the captive portal is still active, the network disconnect automatically after a few hours.

# Whoa, wait. Doc!

In order to fix that, I decided to create a script which will automatically renew the connection every minute. So I began to study the login operation of the Zeroshell portal. I used an extension under Firefox called Firebug which allows to record all the network operations and requests on a web browser. Thus, I discovered that the authentication process follows three steps:

## Authentication

An authentication process when the user valid his credentials. The POST request is like that

`http://192.168.0.1/U=username&P=password&Realm=realm&Action=Authenticate&Section=CPAuth&ZSCPRedirect=_:::_`

There is three parameters: username, password and realm (which is the domain name provided on the login page). Look at this awesome security: passwords and usernames are not even hashed in md5 and sent in clear in a simple http request.. Sounds great! However, there is still a unique token provided by the captive portal once logged which will be used for the next two steps. I’ve extracted it with the Jsoup library in Java.

## Connection

The connection process. Once you’ve extracted the authentication key in the last step, you are able to login to your account thought another POST request.

As you can see, there is a new parameter which is « Authenticator ». It’s the token previously extracted. However, the token must be encoded under a special way. You must separate every 64 char by a \r\n carriage return (CRLF, represented by `%0A%0D` in hexadecimal).

## Renewal

The renew process, every minute, to renew the connection to the server by using the same token.

`http://192.168.0.1/U=username&Section=CPGW&Realm=realm&Action=Renew&Authenticator=encodedAuthKey`

# Done ?

So my script authenticate and connect to the Zeroshell by sending POST requests in background. If the renew attempt fails, the program reconnects to the network by itself to get a new token. So it avoids keeping this annoying captive portal and moreover, it renews the connection automatically! If you feel interested, the source code is available here, enjoy!