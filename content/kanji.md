---
title: "Well, that escalated quickly"
date: 2018-06-07T23:42:00+02:00
draft: false
description: 'As soon as Winston had dealt with each of the messages, he clipped his speakwritten corrections to the appropriate copy of the Times and pushed them into the pneumatic tube. Then, with a movement which was as nearly as possible unconscious, he crumpled up the original message and any notes that he himself had made, and dropped them into the memory hole to be devoured by the flames.'
---

Lastly I remembered that I own a blog and figured out that writing new articles on it was not a trivial job. Thus began my journey on how to smooth and simplify the process to make it simplier for me to write new blog posts. 

# Back in old days...

> We build our computer systems the way we build our cities: without a plan, on top of ruins.
> -- *Ellen Ullman*

My old blog was a so painful to update and maintain that I realized I needed to throw it away and migrate to a decent thing.

![Old blog preview](/blog/kanji/old.jpg)

The codebase was mostly vanilla PHP written during my early days of development. Moreover, redacting a new blog post was quite a challenge as they were redacted in plain HTML. You may agree that's not very convenient...

## What's the alternative ?

As static website generator are trendy these days, I looked after [Jekyll](https://jekyllrb.com/) for my blog. It seemed quite nice to use as you could write your blog posts in markdown and Jekyll was generating the whole blog for you. However, I did not liked the architecture and coming from a Python background, using Ruby can be pretty harsh. And then I discovered [Hugo](https://gohugo.io/).

# Hugo 101

Hugo is *a fast and modern static website engine*. Just like Jekyll, it carries the job for you and generate your blog based on your posts in markdown. It's easy to install, fast, light, open-source and written in Go. Here is a quick Hugo overview.

* You can create a new projects using `hugo new site kanji` hugo will generate the whole website architecture for you.
* Creating new posts has never been so simple. Just use `hugo new posts/welcome` to create a new article.
* Need a developement server ? Just use `hugo serve` and you're all set !
* There is plenty of available themes. Just head over [here](https://themes.gohugo.io/) to give it a try or feel free to create your own.

# CI/CD

The CI/CD setup is the final touch to all this setup. Luckily, Hugo made the deployment process painless. As all my projects are hosted on Github, I needed a CI/CD pipeline to deploy my blog automatically. There are plenty of them like Travis or CircleCI, however they are not open-source and can not be self-hosted.

![Old blog preview](/blog/kanji/drone.jpg)

Finally, I opted for [Drone CI](https://drone.io/), written in Go, open-source and self-hosted. Pipelines can be configured using a simple `.drone.yml` file and they are executed inside containers and isolated from the host machine. On top of that, it supports popular Git platforms such as Github or Bibucket. On the down side, this platform lacks of fonctionnalies compared to popular alternatives such as Jenkins but does the job quite well for personnal projects. And there is a Hugo plugin !

# Final words

If you wish to just host a basic blog on your server, just head over static website generators. They are faster than regular dynamically rendered websites and much easier to install and deploy. Feel free to take a look at [the sources](https://github.com/obynio/kanji).