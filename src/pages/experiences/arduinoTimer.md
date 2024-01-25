---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Competition Arduino Stopwatch'
pubDate: '2024-01-25'
description: 'Arduino Project - A pedal activated stopwatch'
image:
    url: '/assets/super480.png'
    alt: 'Image of the arduino timer.'
tags: ["Arduino", "development", "electronics", "experience"]
---
My roommates and I came up with a speed shooting game using dollar store Nerf guns and would time each other as we attempted to better our time.

I started work on creating an pedal activated Arduino stopwatch with the goal of the being able to time yourself in a practical way, with both hands free to get the best time possible.

This [video](https://youtu.be/C7FN6su1e9I) demonstrates how the game works and how the Arduino is used.

The stopwatch consists of the Eelegoo Mega 2560 Arduino board, a text display to show the time, a buzzer to indicate when the time starts and stops, and the pedal.
![stopwatch](/assets/stopwatch.png)
The pedal itself is simply made out of a small breadboard, a simple button, and some cardboard to act as the top of the pedal.
![pedal](/assets/pedal.png)

The logic of the code involves a boolean variable keeping state whether the timer should be running or not, which is activated by the button input. For a more detailed look at the code, check out the [GitHub project link](https://github.com/AntoineDujar/super-480a).