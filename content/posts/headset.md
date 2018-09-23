---
title: "Reverse engineer a bluetooth headset"
date: 2016-06-29T23:42:00+02:00
draft: false
---

I recently had a discussion with a friend, and we talked about bluetooth headsets and he told me that on iOS devices, the remaining battery of the headset is shown as an icon in the notification bar.

This feature seemed quite useful and I was a bit jealous not having the same on Android. So I decided to do some reverse engineering of my bluetooth headset, the [Bose Soundlink II](https://www.bose.com/en_us/products/headphones/over_ear_headphones/soundlink-around-ear-wireless-headphones-ii.html), to create a sort of battery notifier for my Android.

# Analysis

First of all, a wireshark analysis of a bluetooth trame from the heaset seems perfect to discover how the headset interacts with my Android phone. I used the headset Android app to simulate traffic for efficient analysis. 

I kept the interesting part on the screenshot bellow.

```nohighlight
SPP 18 Sent "\000\001\001\000"
SPP 22 Rcvd "\000\001\003\0051.0.0"
SPP 18 Sent "\000\005\001\000"
SPP 22 Rcvd “\000\005\003\0052.0.0"
SPP 18 Sent "\001\001\005\000"
SPP 17 Sent "\002\002\001\000"
SPP 17 Sent “\000\a\001\000"
SPP 18 Rcvd “\002\002\003\001d"
SPP 18 Sent "\004\004\001\000"
SPP 18 Sent "\001\001\005\000"
SPP 18 Sent “\001\003\002\001!
SPP 23 Sent "\001\002\002\005hello"
SPP 23 Rcvd "\001\002\003\006\000hello“
SPP 23 Sent "\001\002\002\005kirby"
SPP 23 Rcvd "\001\002\003\006\000kirby“
SPP 19 Sent "\001\004\002\001("
SPP 18 Rcvd "\001\004\003\001("
SPP 19 Sent "\001\004\002\001\024"
SPP 18 Rcvd “\001\004\003\001\024"
SPP 19 Sent "\001\003\002\001\001"
```

It seems that the headset interacts with my Android via serial port commands. These device-specific codes aren't very helpful, so I took a closer look by decompiling the official Android app provided by the manufacturer which is, of course, obfuscated by proguard. 

However, I managed to extract useful informations and to group them in the following image. After a few attempts, I managed to successfully communicate with my headset. 

![Reverse diagram](/img/headset/reverse.jpg)

Every first connection to the headset must be initiated by sending the bytes **0x00, 0x01, 0x01, 0x00**. Then you have a full access to the headset parameters.

* **0x02, 0x02, 0x01, 0x00** to obtain the current battery level
* **0x00, 0x05, 0x01, 0x00** to obtain the firmware version
* **0x00, 0x05, 0x01, 0x00** to obtain the firmware version
* **0x01, 0x06, 0x01, 0x00** to obtain the mac adress
* ...and funny stuff like firmware update, global reset, debug mode

So you have a big bunch of features hidden in the headset firmware. Once you know all these informations, you can easily code an Android app which notify you the battery level of your headset like on iOS :)

![Headset battery app](/img/headset/android.jpg)
