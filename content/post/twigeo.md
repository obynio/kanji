---
title: "Live tweet map in France"
date: 2017-01-23T23:42:00+02:00
draft: false
---

Last week, I discovered the Twitter streaming API and was quite amazed by all the possible applications of this tool, such as in text mining or neural networks. 
This API allows developpers to access the real-time feeds of Twitter and even to filter them by keywords or locations, pretty much like in Person of Interest...

<!--more-->

As I had some free time, I decided to code a funny tool in Python to plot the location of french tweets on a map. I must confess that I was a bit curious about the result ! 
I let my program run during 24 hours, gather a bunch of 19 805 tweets and compiled the results on a heat map. It’s not perfect, but it’s worth a look ^^ 

![Live tweet map](/img/twigeo/twigeo.jpg)

As usual, you can find the sources [on my github](https://github.com/obynio/twigeo). To map another country, change the bouding box coordinates to match the one you want.



